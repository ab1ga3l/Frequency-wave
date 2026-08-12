import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/queries';
import Countdown from '@/components/site/Countdown';
import Footer from '@/components/site/Footer';
import IcsButton from '@/components/site/IcsButton';
import Nav from '@/components/site/Nav';
import Reveal from '@/components/site/Reveal';
import {
  fmtDateTimeLine,
  fmtDay,
  fmtMonth,
  isUpcomingDate,
} from '@/components/site/format';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event || event.status !== 'published') {
    return { title: 'Event Not Found — Frequency Wave' };
  }
  return {
    title: `${event.title} — Frequency Wave`,
    description:
      event.tagline ??
      event.description.slice(0, 160) ??
      'A Frequency Wave experience.',
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event || event.status !== 'published') notFound();

  const isUpcoming = isUpcomingDate(event.startAt);
  const dateLine = fmtDateTimeLine(event.startAt);
  const location = [event.venue, event.city, event.country]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      <Nav />
      <main>
        {/* Hero band */}
        <section
          aria-label="Event overview"
          className="relative overflow-hidden pb-16 pt-32 sm:pt-40"
        >
          {event.coverImage && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.coverImage}
                alt=""
                className="h-full w-full object-cover object-center opacity-40"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(4,11,36,0.9) 0%, rgba(4,11,36,0.6) 45%, #040b24 100%)',
                }}
              />
            </div>
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(38,91,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(38,91,255,0.06) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage:
                'radial-gradient(ellipse 70% 80% at 50% 0%, black 30%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 70% 80% at 50% 0%, black 30%, transparent 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(107,0,245,0.35) 0%, transparent 70%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(38,91,255,0.3) 0%, transparent 70%)',
            }}
          />

          <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
            <Link
              href="/#events"
              className="font-mono text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-cyan"
            >
              ← Back to All Events
            </Link>

            <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-start">
              {/* Date badge */}
              <div
                className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full p-[2px]"
                style={{
                  background:
                    'linear-gradient(135deg, #6b00f5, #265bff 55%, #00f8ff)',
                }}
              >
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-navy">
                  <span className="font-display text-3xl font-black leading-none text-white">
                    {fmtDay(event.startAt)}
                  </span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-widest text-cyan">
                    {fmtMonth(event.startAt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-3">
                  {isUpcoming ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-cyan">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-dot"
                      />
                      Upcoming Event
                    </span>
                  ) : (
                    <span className="rounded-full border border-white/20 px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/50">
                      Past Event
                    </span>
                  )}
                  {event.capacity && (
                    <span className="rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-gold">
                      {event.capacity}
                    </span>
                  )}
                </div>

                <h1 className="font-display text-3xl font-black uppercase leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="g-text">{event.title}</span>
                </h1>
                {event.tagline && (
                  <p className="max-w-2xl text-lg text-white/70">
                    {event.tagline}
                  </p>
                )}
                <p className="font-mono text-sm uppercase tracking-widest text-white/60">
                  {dateLine} <span className="text-cyan">·</span>{' '}
                  <span aria-hidden="true">📍</span> {location}
                </p>

                {event.tags.length > 0 && (
                  <ul className="flex flex-wrap gap-2" aria-label="Event tags">
                    {event.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-blue/40 bg-blue/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-widest text-white/70"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}

                {isUpcoming && (
                  <div className="mt-2 max-w-xl">
                    <Countdown targetISO={event.startAt.toISOString()} />
                  </div>
                )}

                <div className="mt-2 flex flex-wrap gap-4">
                  {isUpcoming && event.registerUrl && (
                    <a
                      href={event.registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Register Now →
                    </a>
                  )}
                  {isUpcoming && (
                    <IcsButton
                      event={{
                        title: event.title,
                        description: event.tagline ?? event.description,
                        location,
                        startISO: event.startAt.toISOString(),
                        endISO: event.endAt?.toISOString() ?? null,
                        url: event.registerUrl,
                        slug: event.slug,
                      }}
                    />
                  )}
                  {!isUpcoming && event.registerUrl && (
                    <a
                      href={event.registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-sm"
                    >
                      View Event Page →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        {event.description && (
          <section
            aria-label="About this event"
            className="mx-auto max-w-6xl px-5 py-12 sm:px-6"
          >
            <Reveal>
              <div className="neon-card max-w-3xl p-8">
                <span className="eyebrow">
                  {isUpcoming ? 'About This Event' : 'The Recap'}
                </span>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-white/75">
                  {event.description}
                </p>
              </div>
            </Reveal>
          </section>
        )}

        {/* Agenda timeline */}
        {event.agenda.length > 0 && (
          <section
            aria-label="Agenda"
            className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24"
          >
            <Reveal>
              <span className="eyebrow">The Program</span>
              <h2 className="mt-4 font-display text-2xl font-black uppercase tracking-tight sm:text-4xl">
                Run Of <span className="g-text">Show</span>
              </h2>
            </Reveal>
            <ol className="relative mt-12 flex flex-col gap-10 border-l border-white/15 pl-8 sm:pl-12">
              {event.agenda.map((item, i) => (
                <li key={item.id} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-2 border-cyan bg-navy sm:-left-[57px]"
                  />
                  <Reveal delay={i * 60}>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
                      {item.timeLabel}
                    </p>
                    <h3 className="mt-1.5 font-display text-lg font-extrabold text-white sm:text-xl">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-white/60">
                        {item.description}
                      </p>
                    )}
                    {item.host && (
                      <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-widest text-gold">
                        {item.host}
                      </p>
                    )}
                  </Reveal>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Ticket tiers */}
        {event.tiers.length > 0 && (
          <section
            aria-label="Tickets"
            className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24"
          >
            <Reveal>
              <span className="eyebrow">Tickets</span>
              <h2 className="mt-4 font-display text-2xl font-black uppercase tracking-tight sm:text-4xl">
                Catch The <span className="g-text">Frequency</span>
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {event.tiers.map((tier, i) => (
                <Reveal key={tier.id} delay={i * 80} className="h-full">
                  <article className="neon-card flex h-full flex-col gap-5 p-7">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-xl font-black uppercase tracking-tight text-white">
                        {tier.name}
                      </h3>
                      {tier.soldOut && (
                        <span className="rounded-full border border-magenta/50 bg-magenta/10 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-magenta">
                          Sold Out
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-2xl font-bold text-cyan">
                      {tier.priceLabel}
                    </p>
                    {tier.description && (
                      <p className="text-sm leading-relaxed text-white/60">
                        {tier.description}
                      </p>
                    )}
                    {tier.perks.length > 0 && (
                      <ul className="flex flex-col gap-2.5">
                        {tier.perks.map((perk) => (
                          <li
                            key={perk}
                            className="flex items-start gap-2.5 text-sm text-white/70"
                          >
                            <span aria-hidden="true" className="mt-0.5 text-cyan">
                              ⚡
                            </span>
                            {perk}
                          </li>
                        ))}
                      </ul>
                    )}
                    {tier.url && !tier.soldOut && (
                      <a
                        href={tier.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary mt-auto !px-5 !py-2.5 text-sm"
                      >
                        Get Tickets →
                      </a>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Back to home */}
        <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-6">
          <Link href="/" className="btn-outline text-sm">
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
