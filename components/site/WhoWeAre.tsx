/** About: manifesto, mission/vision, who we gather, and brand values. */
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

const AUDIENCES = [
  {
    image: '/images/builders.jpg',
    alt: 'Hackathon team building together under cyan and violet light',
    accent: 'For The Builders',
    rest: 'Founders & Devs',
    text: 'Developers, founders, and Web3 natives building the next generation of African tech.',
  },
  {
    image: '/images/dj.jpg',
    alt: 'DJ silhouette behind the decks in stage light',
    accent: 'For The Creators',
    rest: 'Artists & DJs',
    text: 'Artists, DJs, designers, and storytellers shaping culture through technology.',
  },
  {
    image: '/images/train.jpg',
    alt: 'Train crossing the savanna at dusk',
    accent: 'For The Dreamers',
    rest: 'Culture & Community',
    text: 'The curious minds and visionary thinkers who refuse to choose between brilliance and fun.',
  },
];

const VALUES = [
  'Innovation',
  'Energy',
  'Community',
  'Transparency',
  'Excellence',
];

export default function WhoWeAre() {
  return (
    <section
      id="about"
      aria-label="Who we are"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-6">
        <Reveal>
          <SectionHeading
            accent="Who"
            rest="We Are"
            subtitle="Nairobi. Tech. Culture. One Frequency."
          />
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-base leading-relaxed text-white/75 sm:text-lg">
            Frequency Wave is a Nairobi-based movement at the intersection of
            culture, tech, and Web3. We create immersive experiences that
            educate, inspire, and accelerate Africa&apos;s builders and
            innovators — blockchain panels beside DJ battles, NFTs meeting neon
            lights.
          </p>
          <p className="mt-5 text-sm leading-relaxed text-white/55 sm:text-base">
            Tech is shaping the future. Entertainment is shaping culture. We
            build the room where both collide — events that move people
            emotionally, culturally, and technologically. The 2026 theme is{' '}
            <span className="italic text-white/80">Awaken the Frequency</span>.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-[40px] border border-white/10 p-6 transition-colors hover:border-cyan/30 sm:p-8">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.25em] text-cyan">
                Mission
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold italic text-white">
                Move people
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Build events that move people emotionally, culturally, and
                technologically — not just another conference, a night they
                remember.
              </p>
            </article>
          </Reveal>
          <Reveal delay={80}>
            <article className="h-full rounded-[40px] border border-white/10 p-6 transition-colors hover:border-cyan/30 sm:p-8">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.25em] text-cyan">
                Vision
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold italic text-white">
                Africa&apos;s powerhouse
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Become Africa&apos;s leading tech-entertainment event house —
                putting the continent at the centre of the global Web3
                conversation.
              </p>
            </article>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {AUDIENCES.map((a, i) => (
            <Reveal key={a.accent} delay={i * 90}>
              <div className="text-center">
                <div
                  className="img-zoom anim-float mx-auto h-[180px] w-[180px] overflow-hidden rounded-full ring-1 ring-white/20"
                  style={{ animationDelay: `${i * 0.45}s` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.image}
                    alt={a.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold italic leading-snug">
                  <span className="block text-cyan">{a.accent}</span>
                  <span className="block text-white">{a.rest}</span>
                </h3>
                <p className="mx-auto mt-3 max-w-[260px] text-sm leading-relaxed text-white/70">
                  {a.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 text-center">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.25em] text-white/40">
            How we show up
          </p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {VALUES.map((value) => (
              <li
                key={value}
                className="font-display text-lg italic text-white/85 sm:text-xl"
              >
                {value}
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-6 max-w-xl text-xs leading-relaxed text-white/45">
            Bold, futuristic, energetic, creative. Built for Gen Z and millennials
            — founders, creatives, Web3 natives, DJs, artists, and performers.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
