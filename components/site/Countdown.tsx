'use client';

import { useEffect, useState } from 'react';

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function partsUntil(targetMs: number): Parts {
  const diff = Math.max(0, targetMs - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

/**
 * Live countdown to `targetISO`. Renders "--" placeholders until mounted
 * to avoid a hydration mismatch.
 */
export default function Countdown({ targetISO }: { targetISO: string }) {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const targetMs = new Date(targetISO).getTime();
    const update = () => setParts(partsUntil(targetMs));
    const raf = requestAnimationFrame(update);
    const id = setInterval(update, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [targetISO]);

  const cells: { label: string; value: string }[] = [
    { label: 'Days', value: parts ? String(parts.days).padStart(2, '0') : '--' },
    { label: 'Hours', value: parts ? String(parts.hours).padStart(2, '0') : '--' },
    { label: 'Minutes', value: parts ? String(parts.minutes).padStart(2, '0') : '--' },
    { label: 'Seconds', value: parts ? String(parts.seconds).padStart(2, '0') : '--' },
  ];

  return (
    <div
      role="timer"
      aria-label="Countdown to event start"
      className="grid grid-cols-4 gap-3 sm:gap-4"
    >
      {cells.map((c) => (
        <div
          key={c.label}
          className="neon-card flex flex-col items-center gap-1 px-3 py-4 sm:px-6 sm:py-5"
        >
          <span className="font-mono text-3xl font-bold text-cyan tabular-nums sm:text-5xl">
            {c.value}
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/50 sm:text-xs">
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}
