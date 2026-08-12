'use client';

type IcsEvent = {
  title: string;
  description: string;
  location: string;
  startISO: string;
  endISO: string | null;
  url: string | null;
  slug: string;
};

function icsDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function esc(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** Generates and downloads an .ics calendar file for the event. */
export default function IcsButton({ event }: { event: IcsEvent }) {
  const download = () => {
    const start = icsDate(event.startISO);
    const end = event.endISO
      ? icsDate(event.endISO)
      : icsDate(
          new Date(
            new Date(event.startISO).getTime() + 3 * 3_600_000,
          ).toISOString(),
        );
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Frequency Wave//Events//EN',
      'BEGIN:VEVENT',
      `UID:${event.slug}@frequencywave`,
      `DTSTAMP:${icsDate(new Date().toISOString())}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${esc(event.title)}`,
      `DESCRIPTION:${esc(event.description)}`,
      `LOCATION:${esc(event.location)}`,
      ...(event.url ? [`URL:${event.url}`] : []),
      'END:VEVENT',
      'END:VCALENDAR',
    ];
    const blob = new Blob([lines.join('\r\n')], {
      type: 'text/calendar;charset=utf-8',
    });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = `${event.slug}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  };

  return (
    <button type="button" onClick={download} className="btn-outline text-sm">
      📅 Add to Calendar
    </button>
  );
}
