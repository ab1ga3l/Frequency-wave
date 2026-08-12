import Reveal from './Reveal';

export default function Voices() {
  return (
    <section
      aria-label="Voices"
      className="relative mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(107,0,245,0.5) 0%, transparent 70%)',
        }}
      />
      <Reveal>
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="eyebrow">Voices</span>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
            From The <span className="g-text">Founder</span>
          </h2>
        </div>
      </Reveal>
      <Reveal className="mt-12">
        <figure className="neon-card relative mx-auto grid max-w-4xl overflow-hidden md:grid-cols-[1fr_1.6fr]">
          {/* Founder behind the decks */}
          <div className="relative h-56 md:h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/dj.jpg"
              alt="DJ silhouette behind the decks in violet and cyan stage light"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, transparent 40%, rgba(8,16,44,0.9) 100%), linear-gradient(90deg, transparent 60%, rgba(8,16,44,0.85) 100%)',
              }}
            />
          </div>
          <div className="relative px-8 py-12 text-left sm:px-12">
            <span
              aria-hidden="true"
              className="g-text absolute left-6 top-4 font-display text-7xl font-black leading-none"
            >
              &ldquo;
            </span>
            <blockquote className="relative text-lg leading-relaxed text-white/80 sm:text-xl">
              Frequency Wave was born from a simple but powerful idea — that
              tech and entertainment belong in the same room. We&apos;re not
              just hosting events. We&apos;re building a movement that puts
              Africa at the centre of the global Web3 conversation. This is
              just the beginning.
            </blockquote>
            <figcaption className="mt-8 flex flex-col gap-1">
              <span className="font-display text-base font-extrabold uppercase tracking-wide text-white">
                Grace Njura
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
                Founder, Frequency Wave · DJ Grace
              </span>
            </figcaption>
          </div>
        </figure>
      </Reveal>
    </section>
  );
}
