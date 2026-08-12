import type { Event } from '@/lib/db/schema';

/** Server-side date formatting helpers — always Africa/Nairobi time. */

const TZ = 'Africa/Nairobi';

export function fmtDay(date: Date): string {
  return new Intl.DateTimeFormat('en-KE', { timeZone: TZ, day: '2-digit' }).format(
    date,
  );
}

export function fmtMonth(date: Date): string {
  return new Intl.DateTimeFormat('en-KE', { timeZone: TZ, month: 'short' })
    .format(date)
    .toUpperCase();
}

export function fmtDateLine(date: Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    timeZone: TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function fmtDateTimeLine(date: Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    timeZone: TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

/** Whether an event start time is still in the future. */
export function isUpcomingDate(date: Date): boolean {
  return date.getTime() > Date.now();
}

/** Serializable shape passed to client components (no Date objects). */
export type EventCardData = {
  slug: string;
  title: string;
  tagline: string | null;
  description: string;
  startAtISO: string;
  day: string;
  month: string;
  dateLine: string;
  venue: string;
  city: string;
  registerUrl: string | null;
  coverImage: string | null;
  tags: string[];
  isPast: boolean;
};

export function toEventCardData(event: Event, isPast: boolean): EventCardData {
  return {
    slug: event.slug,
    title: event.title,
    tagline: event.tagline,
    description: event.description,
    startAtISO: event.startAt.toISOString(),
    day: fmtDay(event.startAt),
    month: fmtMonth(event.startAt),
    dateLine: fmtDateLine(event.startAt),
    venue: event.venue,
    city: event.city,
    registerUrl: event.registerUrl,
    coverImage: event.coverImage,
    tags: event.tags,
    isPast,
  };
}
