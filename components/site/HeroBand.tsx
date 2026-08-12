/** Brand hero: Frequency Wave first, then Unplugged. Load-in + float/glow motion. */
import Link from 'next/link';
import LogoMark from './LogoMark';
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
      className="relative min-h-[600px] overflow-hidden bg-[#040B24] lg:min-h-[680px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/crowd.jpg"
        alt=""
        className="anim-ken absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(4,11,36,0.96) 0%, rgba(4,11,36,0.82) 42%, rgba(4,11,36,0.55) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="anim-glow pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 40%, rgba(0,248,255,0.18), transparent 50%), radial-gradient(ellipse at 80% 60%, rgba(107,0,245,0.24), transparent 55%)',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-36 opacity-50"
      >
        <WaveCanvas variant="hero" flip />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 pb-32 pt-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <LogoMark className="hero-in h-14 w-auto sm:h-16" />
          <p className="hero-in hero-in-d1 mt-5 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-cyan">
            Africa&apos;s Tech-Entertainment Movement
          </p>
          <h1 className="hero-in hero-in-d2 mt-3 font-display text-5xl font-bold italic leading-[1.05] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] sm:text-6xl lg:text-7xl">
            Frequency Wave
          </h1>
          <p className="hero-in hero-in-d3 g-text-anim mt-3 font-display text-2xl font-bold italic sm:text-3xl">
            Awaken the Frequency.
          </p>
          <p className="hero-in hero-in-d4 mt-4 font-poster text-5xl leading-[0.9] tracking-wide text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)] sm:text-6xl">
            UNPLUGGED
          </p>
          <p className="hero-in hero-in-d5 mt-5 max-w-xl text-base font-medium leading-relaxed text-white/90 sm:text-lg">
            We don&apos;t just host events — we shift the frequency. Web3,
            culture and music in the same room, from Nairobi to the world.
          </p>
          <div className="hero-in hero-in-d6 mt-8 flex flex-wrap items-center gap-4">
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
          className="hero-in hero-in-d7 relative"
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
