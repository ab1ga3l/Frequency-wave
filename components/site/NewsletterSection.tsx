'use client';

import { useActionState } from 'react';
import { subscribe, type ActionResult } from '@/app/actions/public';

const SOCIALS = [
  {
    icon: '𝕏',
    name: 'X / Twitter',
    handle: '@frequencywave',
    href: 'https://x.com/frequencywave',
  },
  {
    icon: '📸',
    name: 'Instagram',
    handle: '@frequencywave',
    href: 'https://instagram.com/frequencywave',
  },
  {
    icon: '🌳',
    name: 'Linktree',
    handle: 'frequencywave101',
    href: 'https://linktr.ee/frequencywave101',
  },
  {
    icon: '▶️',
    name: 'YouTube',
    handle: 'Launching Soon',
    href: null,
  },
];

export default function NewsletterSection() {
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(async (_prev, formData) => subscribe(formData), null);

  return (
    <section
      id="newsletter"
      aria-label="Newsletter"
      className="relative mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32"
    >
      <div className="neon-card relative overflow-hidden px-6 py-14 sm:px-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(0,248,255,0.3) 0%, transparent 70%)',
          }}
        />
        <div className="relative flex flex-col items-center gap-4 text-center">
          <span className="eyebrow">Newsletter</span>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
            Stay In The <span className="g-text">Frequency</span>
          </h2>
          <p className="max-w-xl text-sm text-white/60 sm:text-base">
            Event drops, lineup reveals, and community news — straight to your
            inbox. No noise, just signal.
          </p>

          {state?.ok ? (
            <p
              role="status"
              className="mt-4 rounded-full border border-cyan/40 bg-cyan/10 px-6 py-3 font-mono text-sm text-cyan"
            >
              ⚡ You&apos;re on the wave. Welcome.
            </p>
          ) : (
            <form
              action={formAction}
              className="mt-4 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-full border border-white/15 bg-navy/70 px-5 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus-visible:border-cyan"
              />
              <button
                type="submit"
                disabled={pending}
                className="btn-primary shrink-0 disabled:opacity-60"
              >
                {pending ? 'Joining…' : 'Get Notified →'}
              </button>
            </form>
          )}
          {state && !state.ok && (
            <p role="alert" className="text-sm text-magenta">
              {state.error}
            </p>
          )}
        </div>

        {/* Social cards */}
        <div className="relative mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {SOCIALS.map((s) => {
            const body = (
              <>
                <span aria-hidden="true" className="text-2xl">
                  {s.icon}
                </span>
                <span className="font-display text-sm font-extrabold uppercase tracking-wide text-white">
                  {s.name}
                </span>
                <span className="font-mono text-[0.65rem] tracking-wider text-white/50">
                  {s.handle}
                </span>
              </>
            );
            return s.href ? (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-navy/60 px-4 py-6 text-center transition-colors hover:border-cyan/40"
              >
                {body}
              </a>
            ) : (
              <div
                key={s.name}
                aria-disabled="true"
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/5 bg-navy/40 px-4 py-6 text-center opacity-50"
              >
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
