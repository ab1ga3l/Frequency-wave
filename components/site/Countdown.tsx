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

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Live inline countdown to `targetISO`, rendered as "22D : 08H : 45M : 12S".
 * Shows "--" placeholders until mounted to avoid a hydration mismatch.
 */
export default function Countdown({
  targetISO,
  className = '',
}: {
  targetISO: string;
  className?: string;
}) {
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

  const text = parts
    ? `${pad(parts.days)}D : ${pad(parts.hours)}H : ${pad(parts.minutes)}M : ${pad(parts.seconds)}S`
    : '--D : --H : --M : --S';

  return (
    <span
      role="timer"
      aria-label="Countdown to event start"
      className={`font-mono text-lg font-bold tabular-nums ${className}`}
    >
      {text}
    </span>
  );
}
