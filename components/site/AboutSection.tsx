import Reveal from './Reveal';

const AUDIENCES = [
  {
    icon: '🔗',
    title: 'For The Builders',
    text: 'Developers, founders, and Web3 natives building the next generation of African tech.',
  },
  {
    icon: '🎵',
    title: 'For The Creators',
    text: 'Artists, DJs, designers, and storytellers shaping culture through technology.',
  },
  {
    icon: '🌍',
    title: 'For The Dreamers',
    text: 'The curious minds and visionary thinkers who refuse to choose between brilliance and fun.',
  },
];

const VALUES = [
  '⚡ Innovation',
  '🔥 Energy',
  '🤝 Community',
  '🔍 Transparency',
  '💎 Excellence',
];

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About Frequency Wave"
      className="relative mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(0,248,255,0.25) 0%, transparent 70%)',
        }}
      />
      <Reveal>
        <span className="eyebrow">Who We Are</span>
        <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
          We Are The <span className="g-text">Wave</span>{' '}
          <span aria-hidden="true">🌊</span>
        </h2>
      </Reveal>

      {/* Audience cards */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {AUDIENCES.map((a, i) => (
          <Reveal key={a.title} delay={i * 90}>
            <article className="neon-card flex h-full flex-col gap-4 p-7">
              <span aria-hidden="true" className="text-3xl">
                {a.icon}
              </span>
              <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-white">
                {a.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/60">{a.text}</p>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Mission / Vision split pane */}
      <Reveal className="mt-12">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
          <div className="flex flex-col gap-3 bg-navy-mid/90 p-8 sm:p-10">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.25em] text-cyan">
              Mission
            </span>
            <p className="text-base leading-relaxed text-white/80">
              To build events that move people — emotionally, culturally, and
              technologically. Immersive experiences that educate, inspire,
              and accelerate Africa&apos;s builders and innovators.
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-navy-mid/90 p-8 sm:p-10">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.25em] text-gold">
              Vision
            </span>
            <p className="text-base leading-relaxed text-white/80">
              To become Africa&apos;s leading tech-entertainment event
              powerhouse — where education meets elevation and creativity meets
              community.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Value pills */}
      <Reveal className="mt-10">
        <ul
          aria-label="Our values"
          className="flex flex-wrap justify-center gap-3"
        >
          {VALUES.map((v) => (
            <li
              key={v}
              className="rounded-full border border-white/15 bg-navy-mid/60 px-5 py-2.5 text-sm font-semibold text-white/80"
            >
              {v}
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Statement */}
      <Reveal className="mt-14">
        <p className="mx-auto max-w-3xl text-center font-display text-xl font-extrabold leading-relaxed text-white/85 sm:text-2xl">
          Blockchain panels beside DJ battles.{' '}
          <span className="g-text">NFTs meeting neon lights.</span> Innovation
          mixing with pure energy.
        </p>
      </Reveal>
    </section>
  );
}
