/** Endless ticker of brand signals between the hero and the rest of the page. */
const ITEMS = [
  'Awaken the Frequency',
  'Nairobi',
  'Kilifi',
  'Web3',
  'Music',
  'Culture',
  'Unplugged',
  'Builders',
  'DJs',
  'ETHSafari 2026',
];

export default function MarqueeStrip() {
  const row = [...ITEMS, ...ITEMS];

  return (
    <section
      aria-hidden="true"
      className="overflow-hidden border-y border-white/10 bg-[#040B24] py-3"
    >
      <div className="marquee-track gap-10 px-6">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-10 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/55"
          >
            {item}
            <span className="inline-block h-1 w-1 rounded-full bg-cyan" />
          </span>
        ))}
      </div>
    </section>
  );
}
