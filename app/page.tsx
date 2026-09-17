/** Public homepage: Frequency Wave hero, featured event, DJs, sponsors, contact, subscribe. */
import type { Metadata } from 'next';
import { getFeaturedEvent, getPastEvents } from '@/lib/queries';
import ContactSection from '@/components/site/ContactSection';
import DjProfiles from '@/components/site/DjProfiles';
import Footer from '@/components/site/Footer';
import FounderQuote from '@/components/site/FounderQuote';
import HeroBand from '@/components/site/HeroBand';
import JsonLd from '@/components/site/JsonLd';
import MarqueeStrip from '@/components/site/MarqueeStrip';
import Nav from '@/components/site/Nav';
import PageBackdrop from '@/components/site/PageBackdrop';
import Sponsorship from '@/components/site/Sponsorship';
import UpcomingEvent from '@/components/site/UpcomingEvent';
import WhoWeAre from '@/components/site/WhoWeAre';
import { fmtDay, fmtMonth, fmtRange } from '@/components/site/format';
import { SITE_TAGLINE, eventJsonLd, eventRsvpUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const featured = await getFeaturedEvent();
    if (!featured) return {};
    const when = featured.startAt.toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Africa/Nairobi',
    });
    const place = [featured.city, featured.country].filter(Boolean).join(', ');
    const description = [
      featured.tagline,
      `${featured.title} — ${when} in ${place}.`,
      'Where Web3 meets music and culture. Limited capacity, RSVP required.',
    ]
      .filter(Boolean)
      .join(' ');
    return {
      title: { absolute: `${featured.title} — ${SITE_TAGLINE}` },
      description,
      openGraph: {
        title: featured.title,
        description,
        url: '/',
      },
      twitter: {
        title: featured.title,
        description,
      },
    };
  } catch {
    return {};
  }
}

export default async function Home() {
  let featured = null;
  let past: Awaited<ReturnType<typeof getPastEvents>> = [];
  try {
    [featured, past] = await Promise.all([
      getFeaturedEvent(),
      getPastEvents(),
    ]);
  } catch {
    // Public pages still render when the database is unreachable (e.g. first Vercel deploy).
  }

  const featuredData = {
    slug: featured?.slug ?? 'the-wave-social',
    title: 'The Wave Social',
    description:
      'Frequency Wave presents The Wave Social — a laid-back evening designed for good people, good music, games, and genuine connection.\n\nForget the panels and pitches. This is your chance to step away from the usual event format and simply play, socialize, meet new people, and have a good time.\n\nExpect an evening filled with:\n🎲 Games & friendly competition — Jenga, Chase, cards, board games and more\n🎧 DJs & music throughout the evening\n🍹 Drinks & food available for purchase at the venue\n⚽ Fantasy Football Awards — winners announced live\n🤝 Good conversations & new connections with the Frequency Wave community',
    dateRange: '10th October 2026',
    venue: 'Jenga Jungle Restaurant',
    venueLine: 'Jenga Jungle Restaurant',
    startAtISO: '2026-10-10T16:00:00+03:00',
    registerUrl: 'https://apps.little.africa/events/324',
    coverImage: '/images/homepage.jpeg',
  };

  const pastWaves = past.map((e) => ({
    slug: e.slug,
    title: e.title,
    dateLabel: `${fmtMonth(e.startAt)} ${fmtDay(e.startAt)}`,
  }));

  return (
    <>
      {featured && <JsonLd data={eventJsonLd(featured)} />}
      <PageBackdrop />
      <Nav />
      <main className="relative z-10">
        <HeroBand event={featuredData} />
        <MarqueeStrip />
        <WhoWeAre />
        <UpcomingEvent
          event={{
            slug: featuredData.slug,
            title: featuredData.title,
            description: featuredData.description,
            dateRange: featuredData.dateRange,
            venueLine: featuredData.venueLine,
            registerUrl: featuredData.registerUrl,
            coverImage: featuredData.coverImage,
          }}
          past={pastWaves}
        />
        <DjProfiles />
        <Sponsorship />
        <FounderQuote />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
