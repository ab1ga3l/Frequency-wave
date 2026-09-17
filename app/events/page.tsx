import Link from 'next/link';
import Footer from '@/components/site/Footer';
import Nav from '@/components/site/Nav';
import SectionHeading from '@/components/site/SectionHeading';
import { getUpcomingEvents, getPastEvents } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);

  return (
    <>
      <Nav />
      <main className="relative z-10 min-h-screen bg-[#040B24] pb-20">
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
          <SectionHeading
            accent="All"
            rest="Events"
            subtitle="Explore the Frequency Wave experiences happening across Nairobi and beyond."
          />

          <div className="mt-12 space-y-8">
            <div>
              <p className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.28em] text-cyan">
                Upcoming
              </p>
              {upcoming.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {upcoming.map((event) => (
                    <article
                      key={event.id}
                      className="overflow-hidden rounded-[28px] border border-cyan/30 bg-white/[0.04]"
                    >
                      <img
                        src={event.coverImage ?? '/images/homepage.jpeg'}
                        alt={event.title}
                        className="h-56 w-full object-cover"
                      />
                      <div className="p-6">
                        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-cyan">
                          {new Date(event.startAt).toLocaleDateString('en-KE', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            timeZone: 'Africa/Nairobi',
                          })}
                        </p>
                        <h2 className="mt-3 font-display text-2xl italic text-white">
                          {event.title}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-white/70">
                          {event.tagline ?? event.description}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <Link href={`/events/${event.slug}`} className="btn-outline">
                            View event
                          </Link>
                          {event.registerUrl && (
                            <a
                              href={event.registerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary"
                            >
                              RSVP
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/60">No upcoming events announced yet.</p>
              )}
            </div>

            <div className="pt-10">
              <p className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.28em] text-white/50">
                Past Waves
              </p>
              {past.length > 0 ? (
                <ul className="space-y-3">
                  {past.map((event) => (
                    <li
                      key={event.id}
                      className="flex flex-col gap-2 border-b border-white/10 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-cyan">
                        {new Date(event.startAt).toLocaleDateString('en-KE', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          timeZone: 'Africa/Nairobi',
                        })}
                      </span>
                      <span className="text-base font-semibold uppercase text-white">
                        {event.title}
                      </span>
                      <Link
                        href={`/events/${event.slug}`}
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-cyan"
                      >
                        View recap →
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-white/60">No past waves yet.</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
