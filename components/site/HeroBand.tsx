/** Brand hero: Frequency Wave first. Featured Unplugged poster on the right. */
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

export default function HeroBand({ event }: { event: HeroEventCard | null }) {
  const poster = event?.coverImage || '/images/unplugged-poster.jpg';
  const posterAlt = event
    ? `${event.title} — ${event.dateRange}, ${event.venue}. Where Web3 meets music and culture.`
    : 'Frequency Wave Unplugged — 11 September 2026, Kilifi, Kenya';

  return (
    <section
      aria-label="Frequency Wave Unplugged"
      className="relative overflow-hidden lg:min-h-[720px]"
    >
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 px-4 pb-20 pt-8 sm:px-6 sm:pb-32 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <p className="hero-in hero-in-d1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-cyan sm:text-xs sm:tracking-[0.28em]">
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
          <p className="hero-in hero-in-d3 mt-4 font-display text-2xl italic font-normal text-white/90 sm:text-[1.7rem]">
            Awaken the Frequency.
          </p>
          <p className="hero-in hero-in-d4 mt-4 max-w-xl text-base font-medium leading-relaxed text-white/85 sm:text-lg">
            Where Web3 meets music and culture — from Nairobi to Kilifi.
            We don&apos;t just host events. We shift the frequency.
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
          aria-label={event?.title ?? 'Unplugged event poster'}
          className="hero-in hero-in-d6 relative order-first w-full justify-self-center lg:order-none lg:max-w-[480px] lg:justify-self-end"
        >
          <div
            aria-hidden="true"
            className="anim-glow absolute -inset-2 rounded-[28px] blur-xl sm:-inset-3 sm:rounded-[40px]"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,248,255,0.4), rgba(107,0,245,0.45))',
            }}
          />
          <div className="anim-float relative overflow-hidden rounded-[28px] border border-cyan/30 shadow-[0_0_16px_rgba(0,248,255,0.18)] sm:rounded-[40px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster}
              alt={posterAlt}
              className="aspect-square w-full object-cover"
            />
          </div>
          {event && (
            <div className="relative mt-5 text-center lg:text-left">
              <h2 className="font-display text-2xl font-bold italic text-white">
                {event.title}
              </h2>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-cyan">
                {event.dateRange} · {event.venue}
              </p>
            </div>
          )}
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
