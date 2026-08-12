/** Public homepage: Frequency Wave hero, featured event, DJs, sponsors, contact, subscribe. */
import type { Metadata } from 'next';
import { getFeaturedEvent, getPastEvents } from '@/lib/queries';
import ContactSection from '@/components/site/ContactSection';
import CountdownStrip from '@/components/site/CountdownStrip';
import DjProfiles from '@/components/site/DjProfiles';
import Footer from '@/components/site/Footer';
import FounderQuote from '@/components/site/FounderQuote';
import HeroBand from '@/components/site/HeroBand';
import JsonLd from '@/components/site/JsonLd';
import MarqueeStrip from '@/components/site/MarqueeStrip';
import Nav from '@/components/site/Nav';
import PageBackdrop from '@/components/site/PageBackdrop';
import Sponsorship from '@/components/site/Sponsorship';
import SubscribeCard from '@/components/site/SubscribeCard';
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

  const featuredData = featured
    ? {
        slug: featured.slug,
        title: featured.title,
        description: featured.description,
        dateRange: fmtRange(featured.startAt, featured.endAt),
        venue: featured.venue,
        venueLine: [...new Set([featured.venue, featured.city].filter(Boolean))].join(', '),
        startAtISO: featured.startAt.toISOString(),
        registerUrl: eventRsvpUrl(featured),
        coverImage: featured.coverImage || '/images/unplugged-poster.jpg',
      }
    : null;

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
        {featuredData && (
          <CountdownStrip
            event={{
              title: featuredData.title,
              dateRange: featuredData.dateRange,
              venue: featuredData.venue,
              startAtISO: featuredData.startAtISO,
              registerUrl: featuredData.registerUrl,
            }}
          />
        )}
        <MarqueeStrip />
        <WhoWeAre />
        <UpcomingEvent
          event={
            featuredData
              ? {
                  slug: featuredData.slug,
                  title: featuredData.title,
                  description: featuredData.description,
                  dateRange: featuredData.dateRange,
                  venueLine: featuredData.venueLine,
                  registerUrl: featuredData.registerUrl,
                  coverImage: featuredData.coverImage,
                }
              : null
          }
          past={pastWaves}
        />
        <DjProfiles />
        <Sponsorship />
        <FounderQuote />
        <ContactSection />
        <SubscribeCard />
      </main>
      <Footer />
    </>
  );
}
