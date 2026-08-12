import { asc, desc, eq, gte, lt, and } from 'drizzle-orm';
import { db, events, agendaItems, ticketTiers, sponsors } from './db';

/** Published events that have not started yet, soonest first. */
export async function getUpcomingEvents() {
  return db
    .select()
    .from(events)
    .where(and(eq(events.status, 'published'), gte(events.startAt, new Date())))
    .orderBy(asc(events.startAt));
}

/** Published events already past, most recent first. */
export async function getPastEvents() {
  return db
    .select()
    .from(events)
    .where(and(eq(events.status, 'published'), lt(events.startAt, new Date())))
    .orderBy(desc(events.startAt));
}

/** The hero event: the featured upcoming one, else the soonest upcoming. */
export async function getFeaturedEvent() {
  const upcoming = await getUpcomingEvents();
  return upcoming.find((e) => e.featured) ?? upcoming[0] ?? null;
}

export async function getEventBySlug(slug: string) {
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug))
    .limit(1);
  if (!event) return null;
  const [agenda, tiers] = await Promise.all([
    db
      .select()
      .from(agendaItems)
      .where(eq(agendaItems.eventId, event.id))
      .orderBy(asc(agendaItems.sort)),
    db
      .select()
      .from(ticketTiers)
      .where(eq(ticketTiers.eventId, event.id))
      .orderBy(asc(ticketTiers.sort)),
  ]);
  return { ...event, agenda, tiers };
}

export async function getActiveSponsors() {
  return db
    .select()
    .from(sponsors)
    .where(eq(sponsors.active, true))
    .orderBy(asc(sponsors.sort));
}
