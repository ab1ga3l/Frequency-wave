import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/queries';
import Countdown from '@/components/site/Countdown';
import Footer from '@/components/site/Footer';
import IcsButton from '@/components/site/IcsButton';
import Nav from '@/components/site/Nav';
import Reveal from '@/components/site/Reveal';
import SectionHeading from '@/components/site/SectionHeading';
import SubscribeCard from '@/components/site/SubscribeCard';
import JsonLd from '@/components/site/JsonLd';
import {
  fmtDateTimeLine,
  fmtRange,
  isUpcomingDate,
} from '@/components/site/format';
import { eventJsonLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event || event.status !== 'published') {
    return { title: 'Event Not Found' };
  }
  return {
    title: event.title,
    description:
      event.tagline ??
      event.description.slice(0, 160) ??
      'A Frequency Wave experience.',
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      title: event.title,
      description: event.tagline ?? event.description.slice(0, 160),
      type: 'website',
      url: `/events/${event.slug}`,
      images: event.coverImage
        ? [{ url: event.coverImage, alt: `${event.title} — Frequency Wave` }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.tagline ?? event.description.slice(0, 160),
      images: event.coverImage ? [event.coverImage] : undefined,
    },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event || event.status !== 'published') notFound();

  const isUpcoming = isUpcomingDate(event.startAt);
  const dateLine = fmtDateTimeLine(event.startAt);
  const dateRange = fmtRange(event.startAt, event.endAt);
  const location = [event.venue, event.city, event.country]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      <JsonLd data={eventJsonLd(event)} />
      <Nav />
      <main>
        {/* Hero photo band */}
        <section
          aria-label="Event overview"
          className="relative min-h-[420px] bg-[#040B24]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.coverImage ?? '/images/unplugged-poster.jpg'}
            alt={`${event.title} — ${dateLine}, ${location}. Where Web3 meets music and culture.`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(4,11,36,0.96) 0%, rgba(4,11,36,0.82) 48%, rgba(4,11,36,0.62) 100%)',
            }}
          />

          <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
            <Link
              href="/#events"
              className="font-mono text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-cyan"
            >
              &larr; Back to All Events
            </Link>

            <div className="mt-8 max-w-3xl">
              <span className="inline-block rounded-full border border-white/30 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                {isUpcoming ? 'Upcoming Event' : 'Past Event'}
              </span>

              <h1 className="mt-5 font-display text-4xl italic font-semibold leading-tight text-white sm:text-6xl">
                {event.title}
              </h1>
              {event.tagline && (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
                  {event.tagline}
                </p>
              )}
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-cyan">
                {dateLine} · {location}
              </p>

              {event.tags.length > 0 && (
                <ul
                  className="mt-5 flex flex-wrap gap-2"
                  aria-label="Event tags"
                >
                  {event.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-white/20 px-3 py-1 text-[0.6rem] uppercase tracking-widest text-white/60"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex flex-wrap gap-4">
                {isUpcoming && event.registerUrl && (
                  <a
                    href={event.registerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Register Now
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
                    className="btn-outline"
                  >
                    View Event Page
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Countdown strip */}
        {isUpcoming && (
          <section
            aria-label="Event countdown"
            className="anim-gradient-bar px-6 py-4"
          >
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
              <p className="font-display text-lg italic text-white sm:text-xl">
                {dateRange} · {event.venue.toUpperCase()}
              </p>
              <Countdown
                targetISO={event.startAt.toISOString()}
                className="text-white"
              />
            </div>
          </section>
        )}

        {/* Description */}
        {event.description && (
          <section
            aria-label="About this event"
            className="bg-[#040B24] py-20"
          >
            <div className="mx-auto max-w-5xl px-5 sm:px-6">
              <Reveal>
                <SectionHeading
                  accent="About"
                  rest="The Event"
                  subtitle={isUpcoming ? 'What To Expect' : 'The Recap'}
                />
                <p className="mx-auto mt-10 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-white/60">
                  {event.description}
                </p>
              </Reveal>
            </div>
          </section>
        )}

        {/* Agenda */}
        {event.agenda.length > 0 && (
          <section aria-label="Agenda" className="bg-[#10062e] py-24">
            <div className="mx-auto max-w-5xl px-5 sm:px-6">
              <Reveal>
                <SectionHeading
                  accent="The"
                  rest="Agenda"
                  subtitle="What to expect"
                />
              </Reveal>
              <ol className="mt-12">
                {event.agenda.map((item, i) => (
                  <li key={item.id} className="border-t border-white/10">
                    <Reveal delay={i * 60}>
                      <div className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-6">
                        <p className="w-28 shrink-0 font-mono text-xs uppercase tracking-widest text-cyan">
                          {item.timeLabel}
                        </p>
                        <div>
                          <h3 className="text-sm font-bold uppercase text-white">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-white/50">
                              {item.description}
                            </p>
                          )}
                          {item.host && (
                            <p className="mt-2 text-[0.68rem] uppercase tracking-widest text-white/40">
                              {item.host}
                            </p>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* Ticket tiers */}
        {event.tiers.length > 0 && (
          <section aria-label="Tickets" className="bg-[#040B24] py-24">
            <div className="mx-auto max-w-5xl px-5 sm:px-6">
              <Reveal>
                <SectionHeading
                  accent="Catch"
                  rest="The Frequency"
                  subtitle="Tickets & Passes"
                />
              </Reveal>
              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {event.tiers.map((tier, i) => (
                  <Reveal key={tier.id} delay={i * 80} className="h-full">
                    <article className="flex h-full flex-col gap-4 rounded-[40px] border border-white/10 p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-xl italic font-semibold text-cyan">
                          {tier.name}
                        </h3>
                        {tier.soldOut && (
                          <span className="rounded-full border border-white/30 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-white/60">
                            Sold Out
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xl font-bold text-white">
                        {tier.priceLabel}
                      </p>
                      {tier.description && (
                        <p className="text-xs leading-relaxed text-white/50">
                          {tier.description}
                        </p>
                      )}
                      {tier.perks.length > 0 && (
                        <ul className="flex flex-col gap-1.5">
                          {tier.perks.map((perk) => (
                            <li key={perk} className="text-[0.7rem] text-white/50">
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
                          className="btn-primary mt-auto"
                        >
                          Get Tickets
                        </a>
                      )}
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to home */}
        <div className="bg-[#040B24] pb-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <Link href="/" className="btn-outline">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>
      <SubscribeCard />
      <Footer />
    </>
  );
}
