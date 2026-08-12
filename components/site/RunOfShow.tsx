import Link from 'next/link';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import WaveBand from './WaveBand';

const HIGHLIGHTS = [
  {
    image: '/images/builders.jpg',
    alt: 'Hackathon team collaborating over laptops',
    date: 'SEP 7–8',
    title: 'Hackathon',
    text: "Two days of building with Africa's best Web3 devs.",
  },
  {
    image: '/images/train.jpg',
    alt: 'Train crossing the savanna at dusk',
    date: 'SEP 9',
    title: 'The Blocktrain',
    text: 'The legendary ride from Nairobi to Kilifi. One track, one frequency.',
  },
  {
    image: '/images/baobab.jpg',
    alt: 'Night festival beneath baobab trees',
    date: 'SEP 12',
    title: 'Beneath The Baobabs',
    text: 'The closing set under the stars — DJ Grace takes the decks.',
  },
];

/** Three photo highlight cards from the program, reference DJ-profiles layout. */
export default function RunOfShow() {
  return (
    <section id="program" aria-label="Run of show" className="relative overflow-hidden bg-[#10062e] py-24">
      <WaveBand wash variant="wash" />
      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-6">
        <Reveal>
          <SectionHeading
            accent="Run Of"
            rest="Show"
            subtitle="Nine Days. One Frequency. Nairobi To Kilifi."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.title} delay={i * 90}>
              <article>
                <div className="img-zoom border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={h.image}
                    alt={h.alt}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                <p className="mt-4 font-mono text-xs uppercase tracking-widest text-cyan">
                  {h.date}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold italic text-white">
                  {h.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/50">
                  {h.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Link href="/events/ethsafari-2026" className="btn-outline">
            Full Program &rarr;
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
