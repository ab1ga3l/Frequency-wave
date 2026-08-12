/** Brand hero: Frequency Wave first. Unplugged lives on the poster. */
import Link from 'next/link';
import FlowWaveStrip from './FlowWaveStrip';
import WaveCanvas from './WaveCanvas';

export type HeroEventCard = {
  slug: string;
  title: string;
  dateRange: string;
  venue: string;
  registerUrl: string | null;
  coverImage: string | null;
};

export default function HeroBand({ event: _event }: { event: HeroEventCard | null }) {
  return (
    <section
      aria-label="Frequency Wave"
      className="relative min-h-[600px] overflow-hidden lg:min-h-[720px]"
    >
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-5 pb-32 pt-14 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
        <div>
          <p className="hero-in hero-in-d1 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-cyan">
            Africa&apos;s Tech-Entertainment Movement
          </p>
          <h1 className="hero-in hero-in-d2 mt-4 font-display">
            <span className="hero-freq">Frequency</span>
            <span className="hero-wave">Wave</span>
          </h1>
          <FlowWaveStrip
            gid="hero-flow"
            className="hero-in hero-in-d2 mt-1 h-8 w-full max-w-lg opacity-90 sm:h-11"
          />
          <p className="hero-in hero-in-d3 mt-4 font-display text-xl italic font-normal text-white/90 sm:text-2xl">
            Awaken the Frequency.
          </p>
          <p className="hero-in hero-in-d4 mt-4 max-w-xl text-base font-medium leading-relaxed text-white/85 sm:text-lg">
            We don&apos;t just host events — we shift the frequency. Web3,
            culture and music in the same room, from Nairobi to the world.
          </p>
          <div className="hero-in hero-in-d5 mt-8 flex flex-wrap items-center gap-4">
            <Link href="/#events" className="btn-primary">
              Explore Events
            </Link>
            <Link href="/#sponsorship" className="btn-outline">
              Partner With Us
            </Link>
          </div>
        </div>

        <aside
          aria-label="Unplugged event poster"
          className="hero-in hero-in-d6 relative w-full max-w-xl justify-self-center lg:max-w-none lg:justify-self-stretch"
        >
          <div
            aria-hidden="true"
            className="anim-glow absolute -inset-3 rounded-2xl blur-xl"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,248,255,0.4), rgba(107,0,245,0.45))',
            }}
          />
          <div className="anim-float relative overflow-hidden rounded-xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/unplugged-poster.jpg"
              alt="Frequency Wave Unplugged — September 11 2026, Kilifi, Kenya"
              className="aspect-square w-full object-cover"
            />
          </div>
        </aside>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-56 opacity-80 sm:h-64"
      >
        <WaveCanvas variant="hero" />
      </div>
    </section>
  );
}
