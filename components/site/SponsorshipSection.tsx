import Link from 'next/link';
import Reveal from './Reveal';

const VALUE_PROPS = [
  {
    icon: '🎯',
    title: 'Premium Audience',
    text: 'Founders, developers, creatives, and early adopters — Africa’s next wave in one room.',
  },
  {
    icon: '🔗',
    title: 'Web3 Association',
    text: 'Position your brand at the frontier of blockchain and digital culture.',
  },
  {
    icon: '📡',
    title: 'Digital Exposure',
    text: 'Amplification across our channels, recaps, and community networks.',
  },
  {
    icon: '🧩',
    title: 'Product Integration',
    text: 'Live demos, activations, and hands-on moments built into the experience.',
  },
];

type Tier = {
  name: string;
  nameClass: string;
  ringClass: string;
  perks: string[];
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    name: 'Platinum',
    nameClass: 'g-text',
    ringClass: 'border-cyan/40',
    featured: true,
    perks: [
      'Headline branding across the event',
      'Keynote or main-stage slot',
      'Premium activation booth',
      'All-access passes for your team',
    ],
  },
  {
    name: 'Gold',
    nameClass: 'text-gold',
    ringClass: 'border-gold/40',
    perks: [
      'Prominent stage & screen branding',
      'Panel or demo participation',
      'Activation booth',
      'VIP passes',
    ],
  },
  {
    name: 'Silver',
    nameClass: 'text-[#C0C0C0]',
    ringClass: 'border-[#C0C0C0]/30',
    perks: [
      'Logo placement on event media',
      'Shared activation space',
      'Community shout-outs',
    ],
  },
  {
    name: 'Bronze',
    nameClass: 'text-[#CD7F32]',
    ringClass: 'border-[#CD7F32]/30',
    perks: [
      'Logo on digital materials',
      'Social media mentions',
      'Event passes',
    ],
  },
];

export default function SponsorshipSection() {
  return (
    <section
      id="sponsorship"
      aria-label="Sponsorship"
      className="relative mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(38,91,255,0.4) 0%, transparent 70%)',
        }}
      />
      <Reveal>
        <span className="eyebrow">Partner With Us</span>
        <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
          Ride The <span className="g-text">Wave</span> With Us
        </h2>
        <p className="mt-4 max-w-2xl text-white/60">
          Put your brand in front of the builders, creators, and dreamers
          shaping Africa&apos;s Web3 future.
        </p>
      </Reveal>

      {/* Value props */}
      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {VALUE_PROPS.map((v, i) => (
          <Reveal key={v.title} delay={i * 70}>
            <div className="flex h-full flex-col gap-2 rounded-2xl border border-white/8 bg-navy-mid/50 p-5">
              <span aria-hidden="true" className="text-2xl">
                {v.icon}
              </span>
              <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-white">
                {v.title}
              </h3>
              <p className="text-xs leading-relaxed text-white/55">{v.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Tier cards */}
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 80} className="h-full">
            <article
              className={`neon-card relative flex h-full flex-col gap-6 border p-7 ${tier.ringClass} ${
                tier.featured ? 'shadow-glow-violet' : ''
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-violet to-blue px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white">
                  Flagship
                </span>
              )}
              <h3
                className={`font-display text-3xl font-black uppercase tracking-tight ${tier.nameClass}`}
              >
                {tier.name}
              </h3>
              <ul className="flex flex-col gap-3">
                {tier.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-start gap-2.5 text-sm text-white/70"
                  >
                    <span aria-hidden="true" className="mt-0.5 text-cyan">
                      ⚡
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
              <Link
                href="/#contact"
                className={`mt-auto ${tier.featured ? 'btn-primary' : 'btn-outline'} !px-5 !py-2.5 text-sm`}
              >
                Become a Sponsor →
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
