import Countdown from './Countdown';

export type CountdownStripEvent = {
  title: string;
  dateRange: string;
  venue: string;
  startAtISO: string;
  registerUrl: string | null;
};

/** Full-width gradient strip with event line, live countdown and register CTA. */
export default function CountdownStrip({
  event,
}: {
  event: CountdownStripEvent;
}) {
  return (
    <section
      aria-label="Event countdown"
      className="anim-gradient-bar px-4 py-4 sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <p className="font-display text-lg italic text-white sm:text-xl">
          {event.title} — {event.dateRange} · {event.venue.toUpperCase()}
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <Countdown targetISO={event.startAtISO} className="text-white" />
          {event.registerUrl && (
            <a
              href={event.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#040B24] px-6 py-2.5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-black"
            >
              Register
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
