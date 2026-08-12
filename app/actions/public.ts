'use server';

/** Public contact + newsletter actions. */

import { db, subscribers, messages } from '@/lib/db';

export type ActionResult = { ok: boolean; error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function cleanEmail(raw: unknown): string | null {
  const email = String(raw ?? '')
    .trim()
    .toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}

/** Newsletter card — email only. Duplicate signups count as success. */
export async function subscribeToWave(formData: FormData): Promise<ActionResult> {
  const email = cleanEmail(formData.get('email'));
  if (!email) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }

  try {
    await db.insert(subscribers).values({ email }).onConflictDoNothing();
    return { ok: true };
  } catch {
    return { ok: false, error: 'Something went wrong — please try again.' };
  }
}

const SUBJECTS = [
  'Partnership',
  'Sponsorship',
  'Collaboration',
  'Event Inquiry',
  'Other',
] as const;

type Subject = (typeof SUBJECTS)[number];

/** Contact form — inserts into messages. */
export async function sendMessage(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get('name') ?? '').trim();
  const email = cleanEmail(formData.get('email'));
  const rawSubject = String(formData.get('subject') ?? '').trim();
  const body = String(formData.get('message') ?? '').trim();

  if (!name || name.length > 120) {
    return { ok: false, error: 'Please tell us your name.' };
  }
  if (!email) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }
  if (!body || body.length > 5000) {
    return { ok: false, error: 'Please include a message (max 5000 characters).' };
  }
  const subject: Subject = (SUBJECTS as readonly string[]).includes(rawSubject)
    ? (rawSubject as Subject)
    : 'Other';

  try {
    await db.insert(messages).values({ name, email, subject, body });
    return { ok: true };
  } catch {
    return { ok: false, error: 'Something went wrong — please try again.' };
  }
}
