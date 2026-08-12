/** Public homepage: Unplugged hero, featured event, program, DJs, sponsors, contact. */
import { getFeaturedEvent, getPastEvents } from '@/lib/queries';
import ContactSection from '@/components/site/ContactSection';
import CountdownStrip from '@/components/site/CountdownStrip';
import DjProfiles from '@/components/site/DjProfiles';
import Footer from '@/components/site/Footer';
import FounderQuote from '@/components/site/FounderQuote';
import HeroBand from '@/components/site/HeroBand';
import MarqueeStrip from '@/components/site/MarqueeStrip';
import Nav from '@/components/site/Nav';
import RunOfShow from '@/components/site/RunOfShow';
import Sponsorship from '@/components/site/Sponsorship';
import UpcomingEvent from '@/components/site/UpcomingEvent';
import WaveBand from '@/components/site/WaveBand';
import WhoWeAre from '@/components/site/WhoWeAre';
import { fmtDay, fmtMonth, fmtRange } from '@/components/site/format';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [featured, past] = await Promise.all([
    getFeaturedEvent(),
    getPastEvents(),
  ]);

  const featuredData = featured
    ? {
        slug: featured.slug,
        title: featured.title,
        description: featured.description,
        dateRange: fmtRange(featured.startAt, featured.endAt),
        venue: featured.venue,
        venueLine: [featured.venue, featured.city].filter(Boolean).join(', '),
        startAtISO: featured.startAt.toISOString(),
        registerUrl: featured.registerUrl,
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
      <Nav />
      <main>
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
        <WaveBand />
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
        <WaveBand flip />
        <RunOfShow />
        <WaveBand />
        <DjProfiles />
        <WaveBand flip />
        <Sponsorship />
        <WaveBand />
        <FounderQuote />
        <WaveBand flip />
        <ContactSection />
        <WaveBand />
      </main>
      <Footer />
    </>
  );
}
