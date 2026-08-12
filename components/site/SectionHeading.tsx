/**
 * Centered two-tone section heading: flowy italic display,
 * accent in cyan, rest in white, with a small uppercase subtitle below.
 */
export default function SectionHeading({
  accent,
  rest,
  subtitle,
}: {
  accent: string;
  rest: string;
  subtitle: string;
}) {
  return (
    <div className="text-center">
      <h2 className="font-display text-4xl font-bold italic leading-tight sm:text-5xl">
        <span className="text-cyan">{accent}</span>{' '}
        <span className="text-white">{rest}</span>
      </h2>
      <svg
        aria-hidden="true"
        viewBox="0 0 220 16"
        className="mx-auto mt-4 h-4 w-44 text-cyan"
      >
        <path
          d="M0 8 Q 18 2 36 8 T 72 8 T 108 8 T 144 8 T 180 8 T 216 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          className="opacity-80"
        />
        <path
          d="M0 8 Q 18 13 36 8 T 72 8 T 108 8 T 144 8 T 180 8 T 216 8"
          fill="none"
          stroke="#6b00f5"
          strokeWidth="1.1"
          className="opacity-70"
        />
      </svg>
      <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-white/60">
        {subtitle}
      </p>
    </div>
  );
}
