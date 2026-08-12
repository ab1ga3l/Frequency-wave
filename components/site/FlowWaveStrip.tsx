/** Looping cyan→violet sine strip used in the AI header and under flowy titles. */

export default function FlowWaveStrip({
  className,
  gid = 'fw-flow',
}: {
  className?: string;
  gid?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00F8FF" />
          <stop offset="45%" stopColor="#265BFF" />
          <stop offset="100%" stopColor="#6B00F5" />
        </linearGradient>
      </defs>
      <g className="flow-wave-track">
        <path
          d="M0 22 C37.5 6 112.5 38 150 22 C187.5 6 262.5 38 300 22 C337.5 6 412.5 38 450 22 C487.5 6 562.5 38 600 22 C637.5 6 712.5 38 750 22 C787.5 6 862.5 38 900 22 C937.5 6 1012.5 38 1050 22 C1087.5 6 1162.5 38 1200 22"
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M0 26 C37.5 40 112.5 12 150 26 C187.5 40 262.5 12 300 26 C337.5 40 412.5 12 450 26 C487.5 40 562.5 12 600 26 C637.5 40 712.5 12 750 26 C787.5 40 862.5 12 900 26 C937.5 40 1012.5 12 1050 26 C1087.5 40 1162.5 12 1200 26"
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth="1.15"
          strokeLinecap="round"
          opacity="0.45"
        />
      </g>
    </svg>
  );
}

function FlowyLetters({
  text,
  className,
  delay = 0,
  gradient = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  gradient?: boolean;
}) {
  return (
    <span className={className}>
      {text.split('').map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="flow-letter"
          style={{ animationDelay: `${delay + i * 0.07}s` }}
        >
          <span className={gradient ? 'g-text-anim' : undefined}>
            {ch === ' ' ? '\u00a0' : ch}
          </span>
        </span>
      ))}
    </span>
  );
}

export { FlowyLetters };
