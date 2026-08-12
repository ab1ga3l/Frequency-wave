import {
  getActiveSponsors,
  getEventBySlug,
  getFeaturedEvent,
  getPastEvents,
  getUpcomingEvents,
} from '@/lib/queries';
import AboutSection from '@/components/site/AboutSection';
import ContactSection from '@/components/site/ContactSection';
import EventsSection from '@/components/site/EventsSection';
import Footer from '@/components/site/Footer';
import Hero, { type HeroEvent } from '@/components/site/Hero';
import Marquee from '@/components/site/Marquee';
import Nav from '@/components/site/Nav';
import NewsletterSection from '@/components/site/NewsletterSection';
import ProgramSection from '@/components/site/ProgramSection';
import Reveal from '@/components/site/Reveal';
import SponsorshipSection from '@/components/site/SponsorshipSection';
import SponsorsStrip from '@/components/site/SponsorsStrip';
import Voices from '@/components/site/Voices';
import { fmtDateTimeLine, toEventCardData } from '@/components/site/format';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [upcoming, past, featured, sponsors] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
    getFeaturedEvent(),
    getActiveSponsors(),
  ]);

  const heroEvent: HeroEvent | null = featured
    ? {
        slug: featured.slug,
        title: featured.title,
        dateLine: fmtDateTimeLine(featured.startAt),
        venueLine: [featured.venue, featured.city]
          .filter(Boolean)
          .join(', '),
        startAtISO: featured.startAt.toISOString(),
        registerUrl: featured.registerUrl,
      }
    : null;

  // Program: agenda of the featured upcoming event, else the latest past one.
  const programSource = featured ?? past[0] ?? null;
  const programDetail = programSource
    ? await getEventBySlug(programSource.slug)
    : null;
  const programLabel = programSource
    ? featured
      ? `${programSource.title} — Full Program`
      : `From ${programSource.title}`
    : null;

  return (
    <>
      <Nav />
      <main>
        <Hero event={heroEvent} />
        <Marquee />
        <AboutSection />

        <section
          id="events"
          aria-label="Events"
          className="relative mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32"
        >
          <Reveal>
            <span className="eyebrow">Live Experiences</span>
            <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
              Experience The <span className="g-text">Wave</span>
            </h2>
          </Reveal>
          <div className="mt-12">
            <EventsSection
              upcoming={upcoming.map((e) => toEventCardData(e, false))}
              past={past.map((e) => toEventCardData(e, true))}
            />
          </div>
        </section>

        <ProgramSection
          agenda={programDetail?.agenda ?? []}
          sourceLabel={programLabel}
        />
        <SponsorshipSection />
        <SponsorsStrip sponsors={sponsors} />
        <Voices />
        <NewsletterSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
