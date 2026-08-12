const WORDS = [
  'WEB3',
  'CULTURE',
  'MUSIC',
  'BLOCKCHAIN',
  'ART',
  'COMMUNITY',
  'INNOVATION',
  'NAIROBI',
];

function Run() {
  return (
    <span className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center">
          <span className="px-6 font-mono text-sm uppercase tracking-[0.3em] text-white/70">
            {w}
          </span>
          <span aria-hidden="true" className="text-gold">
            ⚡
          </span>
        </span>
      ))}
    </span>
  );
}

export default function Marquee() {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-white/10 bg-navy-mid/60 py-4"
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        <Run />
        <Run />
      </div>
    </div>
  );
}
