import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

const TIERS = [
  {
    name: 'Platinum',
    color: 'text-cyan',
    perks: ['Headline brand placement', 'Main-stage activation', 'Full digital campaign'],
  },
  {
    name: 'Gold',
    color: 'text-[#F2C166]',
    perks: ['Premium logo placement', 'On-site product showcase', 'Social media features'],
  },
  {
    name: 'Silver',
    color: 'text-[#C0C0C0]',
    perks: ['Logo on event media', 'Branded giveaways', 'Community shout-outs'],
  },
  {
    name: 'Bronze',
    color: 'text-[#CD7F32]',
    perks: ['Website listing', 'Event-day mentions', 'Newsletter feature'],
  },
];

/** Sponsorship pitch split plus four flat tier tiles. */
export default function Sponsorship() {
  return (
    <section
      id="sponsorship"
      aria-label="Sponsorship"
      className="relative overflow-hidden py-24"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-6">
        <Reveal>
          <SectionHeading
            accent="Partner"
            rest="With Us"
            subtitle="Put Your Brand Inside Africa's Web3 Culture Moment"
          />
        </Reveal>

        <Reveal className="mt-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm leading-relaxed text-white/60">
                Frequency Wave puts your brand in front of a premium audience —
                the founders, creators and investors building Africa&apos;s
                Web3 economy, gathered in one room and in one feed.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                Partners get digital exposure across our channels plus real
                product integration at the events themselves — demos,
                activations and placements people actually touch.
              </p>
              <a href="#contact" className="btn-primary mt-8">
                Become A Sponsor
              </a>
            </div>
            <div className="img-zoom mx-auto w-full max-w-[280px] border border-white/10 lg:mx-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/crowd.jpg"
                alt="Festival crowd under blue and violet light"
                className="aspect-video w-full object-cover"
              />
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-4">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 70} className="h-full">
              <div className="h-full border border-white/10 p-5 transition-transform duration-300 hover:-translate-y-1 hover:border-cyan/30">
                <h3
                  className={`font-display text-lg italic font-semibold ${tier.color}`}
                >
                  {tier.name}
                </h3>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="text-[0.7rem] text-white/50">
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
