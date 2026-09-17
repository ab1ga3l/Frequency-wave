'use server';

/** Public contact + newsletter actions. */

import { db, subscribers, messages } from '@/lib/db';
import { Resend } from 'resend';

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

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    if (resendApiKey && fromEmail) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Welcome to Frequency Wave',
        text: 'Welcome to Frequency Wave. You are on the wave. We will send tickets, lineups, and invites soon.',
      });
    }

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

/** Contact form — stores the message and forwards it to the Frequency Wave inbox. */
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
    try {
      await db.insert(messages).values({ name, email, subject, body });
    } catch (error) {
      console.error('Contact message database storage failed:', error);
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const recipient = process.env.CONTACT_TO_EMAIL || 'frequencywave101@gmail.com';
    if (!resendApiKey || !fromEmail) {
      return {
        ok: false,
        error: 'Email delivery is not configured yet. Please try again later.',
      };
    }

    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: recipient,
      replyTo: email,
      subject: `${subject} from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${body}`,
    });
    if (error) {
      console.error('Contact email delivery failed:', error);
      return {
        ok: false,
        error: 'We could not send your message. Please try again later.',
      };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: 'Something went wrong — please try again.' };
  }
}
