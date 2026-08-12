import Reveal from './Reveal';

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

/** Three circular photos with two-line titles, like the reference trio row. */
export default function WhoWeAre() {
  return (
    <section
      id="about"
      aria-label="Who we are"
      className="relative overflow-hidden py-24"
    >
      <div className="relative z-10 mx-auto grid max-w-5xl gap-10 px-5 sm:px-6 md:grid-cols-3">
        {AUDIENCES.map((a, i) => (
          <Reveal key={a.accent} delay={i * 90}>
            <div className="text-center">
              <div
                className="img-zoom anim-float mx-auto h-[130px] w-[130px] overflow-hidden rounded-full ring-1 ring-white/20"
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
    </section>
  );
}
