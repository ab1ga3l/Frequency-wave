import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import WaveBand from './WaveBand';

export type UpcomingEventData = {
  slug: string;
  title: string;
  description: string;
  dateRange: string;
  venueLine: string;
  registerUrl: string | null;
  coverImage: string | null;
};

export type PastWave = {
  slug: string;
  title: string;
  dateLabel: string;
};

/** Featured-event glass card: photo fills the left pane, copy on the right. */
export default function UpcomingEvent({
  event,
  past,
}: {
  event: UpcomingEventData | null;
  past: PastWave[];
}) {
  return (
    <section id="events" aria-label="Events" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <WaveBand wash variant="wash" flip />
      <div className="relative z-10 mx-auto max-w-5xl px-3 sm:px-6">
        <Reveal>
          <SectionHeading
            accent="Upcoming"
            rest="Event"
            subtitle="The Wave Social — 10 October 2026, Jenga Jungle"
          />
        </Reveal>

        {event ? (
          <Reveal className="mt-10 sm:mt-14">
            <article className="grid overflow-hidden rounded-[28px] border border-cyan/30 bg-white/[0.06] backdrop-blur-md sm:rounded-[40px] lg:grid-cols-2">
              <div className="relative flex min-h-[220px] items-center justify-center bg-[#040B24] p-3 sm:min-h-[280px] sm:p-5 lg:min-h-[420px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.coverImage ?? '/images/homepage.jpeg'}
                  alt={event.title}
                  className="max-h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col justify-center p-5 sm:p-8">
                <h3 className="font-display text-2xl font-bold italic text-white sm:text-3xl">
                  {event.title}
                </h3>
                <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-widest text-cyan sm:text-xs">
                  {event.dateRange} · {event.venueLine}
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {event.description
                    .split(/\n+/)
                    .filter(Boolean)
                    .map((para, i) => (
                      <p
                        key={i}
                        className="text-sm leading-relaxed text-white/60"
                      >
                        {para}
                      </p>
                    ))}
                </div>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                  {event.registerUrl && (
                    <a
                      href={event.registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Event details
                    </a>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ) : (
          <p className="mt-14 text-center text-sm text-white/60">
            New events announcing soon — join the list above.
          </p>
        )}

        {past.length > 0 && (
          <Reveal className="mt-16">
            <div className="border-t border-white/10 pt-8">
              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-white/40">
                Past Waves
              </p>
              <ul className="mt-4">
                {past.map((p) => (
                  <li
                    key={p.slug}
                    className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-white/5 py-3 last:border-b-0"
                  >
                    <span className="font-mono text-xs uppercase tracking-widest text-cyan">
                      {p.dateLabel}
                    </span>
                    <span className="text-sm font-semibold uppercase text-white">
                      {p.title}
                    </span>
                    <a
                      href={`/events/${p.slug}`}
                      className="ml-auto text-xs font-semibold uppercase tracking-widest text-white/50 transition-colors hover:text-cyan"
                    >
                      View Recap &rarr;
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
