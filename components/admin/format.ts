/** Date helpers for the admin dashboard. All display formatting is Africa/Nairobi. */

const TZ = 'Africa/Nairobi';

const dateFmt = new Intl.DateTimeFormat('en-KE', {
  timeZone: TZ,
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const dateTimeFmt = new Intl.DateTimeFormat('en-KE', {
  timeZone: TZ,
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const shortFmt = new Intl.DateTimeFormat('en-KE', {
  timeZone: TZ,
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function fmtDate(d: Date): string {
  return dateFmt.format(d);
}

export function fmtDateTime(d: Date): string {
  return dateTimeFmt.format(d);
}

export function fmtShort(d: Date): string {
  return shortFmt.format(d);
}

/** Format a Date as a `datetime-local` input value (YYYY-MM-DDTHH:mm, server-local time). */
export function toInputValue(d: Date | null | undefined): string {
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

/** Human countdown text, e.g. "in 12 days", "today", "3 days ago". */
export function countdown(d: Date, now: Date = new Date()): string {
  const dayMs = 86_400_000;
  const days = Math.round((d.getTime() - now.getTime()) / dayMs);
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days === -1) return 'yesterday';
  if (days > 0) return `in ${days} days`;
  return `${Math.abs(days)} days ago`;
}

/** HUD countdown label, e.g. "T-22 DAYS", "T-0 TODAY", "T+3 DAYS". */
export function tMinus(d: Date, now: Date = new Date()): string {
  const dayMs = 86_400_000;
  const days = Math.round((d.getTime() - now.getTime()) / dayMs);
  if (days === 0) return 'T-0 TODAY';
  if (days > 0) return `T-${days} ${days === 1 ? 'DAY' : 'DAYS'}`;
  const past = Math.abs(days);
  return `T+${past} ${past === 1 ? 'DAY' : 'DAYS'}`;
}

export function isUpcoming(d: Date, now: Date = new Date()): boolean {
  return d.getTime() >= now.getTime();
}

/** Kebab-case slug from a title. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
