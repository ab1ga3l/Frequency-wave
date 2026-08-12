import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import WaveBand from './WaveBand';

// Placeholder lineup: replace name/photo per DJ once the client confirms.
const DJS = [
  {
    image: '/images/dj.jpg',
    alt: 'DJ silhouette behind the decks in stage light',
    text: 'Lineup reveal loading. Follow @the_wave_africa for the drop.',
  },
  {
    image: '/images/dj2.jpg',
    alt: 'DJ performing at night under stage light',
    text: 'Second selector locked in. Name drops soon.',
  },
];

/** Two DJ profile cards, names pending the client's lineup announcement. */
export default function DjProfiles() {
  return (
    <section id="djs" aria-label="DJ profiles" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <WaveBand wash variant="wash" flip />
      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-6">
        <Reveal>
          <SectionHeading
            accent="DJ"
            rest="Profiles"
            subtitle="The Selectors Shaping The Frequency"
          />
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-3xl gap-8 sm:grid-cols-2">
          {DJS.map((dj, i) => (
            <Reveal key={dj.image} delay={i * 90}>
              <article className="text-center">
                <div className="img-zoom">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dj.image}
                    alt={dj.alt}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                {/* placeholder: replace name/photo */}
                <h3 className="mt-4 font-display text-2xl font-bold italic">
                  <span className="text-cyan">DJ</span>{' '}
                  <span className="text-white">Announcing Soon</span>
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/50">
                  {dj.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
