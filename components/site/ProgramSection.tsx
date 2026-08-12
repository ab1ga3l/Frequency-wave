import type { AgendaItem } from '@/lib/db/schema';
import Reveal from './Reveal';

/**
 * PROGRAM grid — agenda of the featured upcoming event, or a recap of the
 * most recent past event when nothing is upcoming.
 */
export default function ProgramSection({
  agenda,
  sourceLabel,
}: {
  agenda: AgendaItem[];
  sourceLabel: string | null;
}) {
  return (
    <section
      id="program"
      aria-label="Program"
      className="relative mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(107,0,245,0.4) 0%, transparent 70%)',
        }}
      />
      <Reveal>
        <span className="eyebrow">The Program</span>
        <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
          What Goes <span className="g-text">Down</span>
        </h2>
        {sourceLabel && (
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-white/50">
            {sourceLabel}
          </p>
        )}
      </Reveal>

      {agenda.length === 0 ? (
        <Reveal className="mt-12">
          <div className="neon-card mx-auto flex max-w-2xl flex-col items-center gap-3 px-8 py-12 text-center">
            <span aria-hidden="true" className="text-3xl">
              🎛️
            </span>
            <p className="font-mono text-sm uppercase tracking-widest text-white/60">
              Program dropping with the next event announcement.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {agenda.map((item, i) => (
            <Reveal key={item.id} delay={i * 80}>
              <article className="neon-card flex h-full gap-5 p-6 sm:p-7">
                <div
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 rotate-45 items-center justify-center rounded-lg border border-cyan/40 bg-cyan/5"
                >
                  <span className="-rotate-45 text-lg">🕒</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
                    {item.timeLabel}
                  </p>
                  <h3 className="font-display text-lg font-extrabold leading-snug text-white">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm leading-relaxed text-white/60">
                      {item.description}
                    </p>
                  )}
                  {item.host && (
                    <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-widest text-gold">
                      {item.host}
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
