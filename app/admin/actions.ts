'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { and, eq, ne } from 'drizzle-orm';
import {
  db,
  events,
  agendaItems,
  ticketTiers,
  sponsors,
  subscribers,
  messages,
} from '@/lib/db';
import { destroySession, requireAdmin } from '@/lib/auth';
import type { NewEvent } from '@/lib/db/schema';

export type ActionState = { error?: string; ok?: boolean } | null;

/* ─── helpers ─────────────────────────────────────────────── */

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

function optional(formData: FormData, key: string): string | null {
  const v = str(formData, key);
  return v === '' ? null : v;
}

function list(formData: FormData, key: string): string[] {
  return str(formData, key)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function int(formData: FormData, key: string): number {
  const n = Number.parseInt(str(formData, key), 10);
  return Number.isFinite(n) ? n : 0;
}

function refresh() {
  // Admin tree + entire public site (events appear on / and /events/**).
  revalidatePath('/admin', 'layout');
  revalidatePath('/', 'layout');
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STATUSES = ['draft', 'published', 'cancelled'] as const;
const TIERS = ['platinum', 'gold', 'silver', 'bronze', 'partner'] as const;

type EventStatus = (typeof STATUSES)[number];
type SponsorTier = (typeof TIERS)[number];

/** Parse + validate the shared event form fields. Returns values or an error string. */
function parseEventForm(
  formData: FormData
): { values: Omit<NewEvent, 'id' | 'createdAt' | 'updatedAt'> } | { error: string } {
  const title = str(formData, 'title');
  const slug = str(formData, 'slug');
  const startRaw = str(formData, 'startAt');
  const endRaw = str(formData, 'endAt');
  const statusRaw = str(formData, 'status');

  if (!title) return { error: 'Title is required.' };
  if (!slug) return { error: 'Slug is required.' };
  if (!SLUG_RE.test(slug))
    return { error: 'Slug must be kebab-case: lowercase letters, numbers and dashes (e.g. "wave-one-nairobi").' };
  if (!startRaw) return { error: 'Start date & time is required.' };

  const startAt = new Date(startRaw);
  if (Number.isNaN(startAt.getTime())) return { error: 'Start date is not a valid date.' };

  let endAt: Date | null = null;
  if (endRaw) {
    endAt = new Date(endRaw);
    if (Number.isNaN(endAt.getTime())) return { error: 'End date is not a valid date.' };
    if (endAt.getTime() < startAt.getTime())
      return { error: 'End date must be after the start date.' };
  }

  const status: EventStatus = (STATUSES as readonly string[]).includes(statusRaw)
    ? (statusRaw as EventStatus)
    : 'draft';

  return {
    values: {
      title,
      slug,
      tagline: optional(formData, 'tagline'),
      description: str(formData, 'description'),
      startAt,
      endAt,
      venue: str(formData, 'venue'),
      city: str(formData, 'city') || 'Nairobi',
      country: str(formData, 'country') || 'Kenya',
      capacity: optional(formData, 'capacity'),
      registerUrl: optional(formData, 'registerUrl'),
      coverImage: optional(formData, 'coverImage'),
      tags: list(formData, 'tags'),
      status,
      featured: formData.get('featured') === 'on',
    },
  };
}

async function slugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const rows = await db
    .select({ id: events.id })
    .from(events)
    .where(
      excludeId
        ? and(eq(events.slug, slug), ne(events.id, excludeId))
        : eq(events.slug, slug)
    )
    .limit(1);
  return rows.length > 0;
}

/* ─── auth ────────────────────────────────────────────────── */

export async function signOut(): Promise<void> {
  await destroySession();
  redirect('/admin/login');
}

/* ─── events ──────────────────────────────────────────────── */

export async function createEvent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseEventForm(formData);
  if ('error' in parsed) return { error: parsed.error };
  if (await slugTaken(parsed.values.slug))
    return { error: `An event with slug "${parsed.values.slug}" already exists — pick another.` };

  const [row] = await db.insert(events).values(parsed.values).returning({ id: events.id });
  refresh();
  redirect(`/admin/events/${row.id}?created=1`);
}

export async function updateEvent(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseEventForm(formData);
  if ('error' in parsed) return { error: parsed.error };
  if (await slugTaken(parsed.values.slug, id))
    return { error: `An event with slug "${parsed.values.slug}" already exists — pick another.` };

  await db
    .update(events)
    .set({ ...parsed.values, updatedAt: new Date() })
    .where(eq(events.id, id));
  refresh();
  return { ok: true };
}

export async function deleteEvent(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, 'id');
  if (!id) return;
  await db.delete(events).where(eq(events.id, id));
  refresh();
}

export async function setEventStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, 'id');
  const statusRaw = str(formData, 'status');
  if (!id || !(STATUSES as readonly string[]).includes(statusRaw)) return;
  await db
    .update(events)
    .set({ status: statusRaw as EventStatus, updatedAt: new Date() })
    .where(eq(events.id, id));
  refresh();
}

export async function setEventFeatured(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, 'id');
  if (!id) return;
  await db
    .update(events)
    .set({ featured: formData.get('featured') === 'true', updatedAt: new Date() })
    .where(eq(events.id, id));
  refresh();
}

/* ─── agenda items ────────────────────────────────────────── */

export async function addAgendaItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const eventId = str(formData, 'eventId');
  const timeLabel = str(formData, 'timeLabel');
  const title = str(formData, 'title');
  if (!eventId || !timeLabel || !title) return;
  await db.insert(agendaItems).values({
    eventId,
    timeLabel,
    title,
    description: optional(formData, 'description'),
    host: optional(formData, 'host'),
    sort: int(formData, 'sort'),
  });
  refresh();
}

export async function updateAgendaItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, 'id');
  const timeLabel = str(formData, 'timeLabel');
  const title = str(formData, 'title');
  if (!id || !timeLabel || !title) return;
  await db
    .update(agendaItems)
    .set({
      timeLabel,
      title,
      description: optional(formData, 'description'),
      host: optional(formData, 'host'),
      sort: int(formData, 'sort'),
    })
    .where(eq(agendaItems.id, id));
  refresh();
}

export async function deleteAgendaItem(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, 'id');
  if (!id) return;
  await db.delete(agendaItems).where(eq(agendaItems.id, id));
  refresh();
}

/* ─── ticket tiers ────────────────────────────────────────── */

export async function addTicketTier(formData: FormData): Promise<void> {
  await requireAdmin();
  const eventId = str(formData, 'eventId');
  const name = str(formData, 'name');
  if (!eventId || !name) return;
  await db.insert(ticketTiers).values({
    eventId,
    name,
    priceLabel: str(formData, 'priceLabel') || 'Free',
    description: optional(formData, 'description'),
    perks: list(formData, 'perks'),
    url: optional(formData, 'url'),
    soldOut: formData.get('soldOut') === 'on',
    sort: int(formData, 'sort'),
  });
  refresh();
}

export async function updateTicketTier(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, 'id');
  const name = str(formData, 'name');
  if (!id || !name) return;
  await db
    .update(ticketTiers)
    .set({
      name,
      priceLabel: str(formData, 'priceLabel') || 'Free',
      description: optional(formData, 'description'),
      perks: list(formData, 'perks'),
      url: optional(formData, 'url'),
      soldOut: formData.get('soldOut') === 'on',
      sort: int(formData, 'sort'),
    })
    .where(eq(ticketTiers.id, id));
  refresh();
}

export async function deleteTicketTier(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, 'id');
  if (!id) return;
  await db.delete(ticketTiers).where(eq(ticketTiers.id, id));
  refresh();
}

/* ─── sponsors ────────────────────────────────────────────── */

export async function createSponsor(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const name = str(formData, 'name');
  if (!name) return { error: 'Sponsor name is required.' };
  const tierRaw = str(formData, 'tier');
  await db.insert(sponsors).values({
    name,
    tier: (TIERS as readonly string[]).includes(tierRaw)
      ? (tierRaw as SponsorTier)
      : 'partner',
    logoUrl: optional(formData, 'logoUrl'),
    website: optional(formData, 'website'),
    blurb: optional(formData, 'blurb'),
    sort: int(formData, 'sort'),
  });
  refresh();
  return { ok: true };
}

export async function updateSponsor(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, 'id');
  const name = str(formData, 'name');
  if (!id || !name) return;
  const tierRaw = str(formData, 'tier');
  await db
    .update(sponsors)
    .set({
      name,
      tier: (TIERS as readonly string[]).includes(tierRaw)
        ? (tierRaw as SponsorTier)
        : 'partner',
      logoUrl: optional(formData, 'logoUrl'),
      website: optional(formData, 'website'),
      blurb: optional(formData, 'blurb'),
      sort: int(formData, 'sort'),
    })
    .where(eq(sponsors.id, id));
  refresh();
}

export async function toggleSponsorActive(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, 'id');
  if (!id) return;
  await db
    .update(sponsors)
    .set({ active: formData.get('active') === 'true' })
    .where(eq(sponsors.id, id));
  refresh();
}

export async function deleteSponsor(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, 'id');
  if (!id) return;
  await db.delete(sponsors).where(eq(sponsors.id, id));
  refresh();
}

/* ─── subscribers ─────────────────────────────────────────── */

export async function deleteSubscriber(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, 'id');
  if (!id) return;
  await db.delete(subscribers).where(eq(subscribers.id, id));
  refresh();
}

/* ─── messages ────────────────────────────────────────────── */

export async function setMessageRead(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, 'id');
  if (!id) return;
  await db
    .update(messages)
    .set({ read: formData.get('read') === 'true' })
    .where(eq(messages.id, id));
  refresh();
}

export async function deleteMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, 'id');
  if (!id) return;
  await db.delete(messages).where(eq(messages.id, id));
  refresh();
}
