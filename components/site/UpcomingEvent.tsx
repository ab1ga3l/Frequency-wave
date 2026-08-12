import Link from 'next/link';
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

/** Featured-event split section plus a compact list of past waves. */
export default function UpcomingEvent({
  event,
  past,
}: {
  event: UpcomingEventData | null;
  past: PastWave[];
}) {
  return (
    <section id="events" aria-label="Events" className="relative overflow-hidden py-24">
      <WaveBand wash variant="wash" flip />
      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-6">
        <Reveal>
          <SectionHeading
            accent="Upcoming"
            rest="Event"
            subtitle="Awaken The Frequency — The 2026 Activation"
          />
        </Reveal>

        {event ? (
          <Reveal className="mt-14">
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
              <div className="img-zoom border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.coverImage ?? '/images/unplugged-poster.jpg'}
                  alt={event.title}
                  className="aspect-video w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-display text-3xl font-bold italic text-white">
                  {event.title}
                </h3>
                <p className="mt-3 font-mono text-xs uppercase tracking-widest text-cyan">
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
                <div className="mt-7 flex flex-wrap gap-4">
                  {event.registerUrl && (
                    <a
                      href={event.registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Register Now
                    </a>
                  )}
                  <Link href={`/events/${event.slug}`} className="btn-outline">
                    Event details
                  </Link>
                </div>
              </div>
            </div>
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
                    <Link
                      href={`/events/${p.slug}`}
                      className="ml-auto text-xs font-semibold uppercase tracking-widest text-white/50 transition-colors hover:text-cyan"
                    >
                      View Recap &rarr;
                    </Link>
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
