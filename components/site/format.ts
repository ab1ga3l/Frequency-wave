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

function fmtDayNumeric(date: Date): string {
  return new Intl.DateTimeFormat('en-KE', { timeZone: TZ, day: 'numeric' }).format(
    date,
  );
}

/** Compact date range, e.g. "SEP 4–12" or "SEP 28 – OCT 2" or "SEP 4". */
export function fmtRange(start: Date, end: Date | null): string {
  const m1 = fmtMonth(start);
  const d1 = fmtDayNumeric(start);
  if (!end) return `${m1} ${d1}`;
  const m2 = fmtMonth(end);
  const d2 = fmtDayNumeric(end);
  if (m1 === m2 && d1 === d2) return `${m1} ${d1}`;
  return m1 === m2 ? `${m1} ${d1}–${d2}` : `${m1} ${d1} – ${m2} ${d2}`;
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
