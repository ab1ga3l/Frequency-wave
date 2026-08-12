'use client';

import Link from 'next/link';
import Countdown from './Countdown';
import WaveCanvas from './WaveCanvas';

export type HeroEvent = {
  slug: string;
  title: string;
  dateLine: string;
  venueLine: string;
  startAtISO: string;
  registerUrl: string | null;
};

const STATS = [
  { top: 'WEB3 × CULTURE', sub: 'One Frequency' },
  { top: 'NAIROBI, KENYA', sub: 'Home Base' },
  { top: 'BUILDERS × CREATORS', sub: 'One Room' },
];

export default function Hero({ event }: { event: HeroEvent | null }) {
  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-28 pb-16"
    >
      {/* Layered atmosphere: crowd photo, grid, orbs, soundwave */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/crowd.jpg"
          alt=""
          className="h-full w-full object-cover object-center opacity-45"
        />
        {/* Navy + violet gradient wash keeps copy readable and on-palette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(4,11,36,0.92) 0%, rgba(4,11,36,0.55) 35%, rgba(6,13,46,0.72) 70%, #040b24 100%), radial-gradient(ellipse 90% 60% at 20% 50%, rgba(107,0,245,0.28) 0%, transparent 65%)',
          }}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(38,91,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(38,91,255,0.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-16 h-[28rem] w-[28rem] rounded-full opacity-60 blur-3xl animate-float"
        style={{
          background:
            'radial-gradient(circle, rgba(107,0,245,0.35) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full opacity-50 blur-3xl animate-float"
        style={{
          background:
            'radial-gradient(circle, rgba(38,91,255,0.35) 0%, transparent 70%)',
          animationDelay: '-3s',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(0,248,255,0.25) 0%, transparent 70%)',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46vh] opacity-80">
        <WaveCanvas />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-6">
        {event ? (
          <div className="flex flex-col items-start gap-7">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-cyan">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-cyan animate-pulse-dot"
              />
              Awaken The Frequency — 2026
            </span>
            <h1 className="font-display text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="g-text">{event.title}</span>
            </h1>
            <p className="font-mono text-sm uppercase tracking-widest text-white/70 sm:text-base">
              {event.dateLine} <span className="text-cyan">·</span>{' '}
              {event.venueLine}
            </p>
            <div className="w-full max-w-xl">
              <Countdown targetISO={event.startAtISO} />
            </div>
            <div className="flex flex-wrap gap-4">
              {event.registerUrl && (
                <a
                  href={event.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Register Now →
                </a>
              )}
              <Link href="/#program" className="btn-outline">
                View Program
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-7">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-cyan">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-cyan animate-pulse-dot"
              />
              Africa&apos;s Tech-Entertainment Movement
            </span>
            <h1 className="font-display text-4xl font-black uppercase leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">
              We Don&apos;t Just Host Events.
              <br />
              <span className="g-text">We Shift The Frequency.</span>{' '}
              <span aria-hidden="true">⚡</span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Africa&apos;s tech-entertainment movement — where Web3 meets
              culture, builders meet creators, and the future gets built in
              real time.
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">
              <span aria-hidden="true">[</span> Next Wave Announcing Soon{' '}
              <span aria-hidden="true">]</span>
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/#newsletter" className="btn-primary">
                Get Notified →
              </Link>
              <Link href="/#sponsorship" className="btn-outline">
                Partner With Us →
              </Link>
            </div>
          </div>
        )}

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.top}
              className="flex flex-col items-center gap-1 bg-navy-mid/90 px-6 py-6 text-center backdrop-blur"
            >
              <span className="font-display text-lg font-black tracking-wide text-white sm:text-xl">
                {s.top}
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-cyan/80">
                {s.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
