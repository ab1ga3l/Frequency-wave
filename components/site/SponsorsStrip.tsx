import Link from 'next/link';
import type { Sponsor } from '@/lib/db/schema';
import Reveal from './Reveal';

function SponsorTile({ sponsor }: { sponsor: Sponsor }) {
  const inner = sponsor.logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sponsor.logoUrl}
      alt={`${sponsor.name} logo`}
      className="max-h-12 max-w-[140px] object-contain opacity-80 transition-opacity group-hover:opacity-100"
    />
  ) : (
    <span className="font-display text-sm font-extrabold uppercase tracking-wide text-white/70 transition-colors group-hover:text-white">
      {sponsor.name}
    </span>
  );

  const tile = (
    <div className="group flex h-24 items-center justify-center rounded-2xl border border-white/10 bg-navy-mid/50 px-6 transition-colors hover:border-cyan/30">
      {inner}
    </div>
  );

  return sponsor.website ? (
    <a
      href={sponsor.website}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={sponsor.name}
    >
      {tile}
    </a>
  ) : (
    tile
  );
}

export default function SponsorsStrip({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <section
      aria-label="Sponsors"
      className="mx-auto max-w-6xl px-5 py-20 sm:px-6"
    >
      <Reveal>
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="eyebrow">Powered By</span>
          <h2 className="font-display text-2xl font-black uppercase tracking-tight sm:text-3xl">
            Our <span className="g-text">Sponsors</span>
          </h2>
        </div>
      </Reveal>

      {sponsors.length > 0 ? (
        <Reveal className="mt-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {sponsors.map((s) => (
              <SponsorTile key={s.id} sponsor={s} />
            ))}
          </div>
        </Reveal>
      ) : (
        <Reveal className="mt-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-white/15 px-6"
              >
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/35">
                  Your Logo Here
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-white/60">
              Partner with Africa&apos;s tech-entertainment movement.
            </p>
            <Link href="/#contact" className="btn-outline !px-6 !py-2.5 text-sm">
              Become a Sponsor →
            </Link>
          </div>
        </Reveal>
      )}
    </section>
  );
}
