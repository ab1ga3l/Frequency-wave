'use client';

/** Email subscribe card that sits above the footer and writes to subscribers. */
import { useActionState } from 'react';
import { subscribeToWave, type ActionResult } from '@/app/actions/public';
import Reveal from './Reveal';

export default function SubscribeCard() {
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(async (_prev, formData) => subscribeToWave(formData), null);

  return (
    <section
      id="subscribe"
      aria-label="Subscribe"
      className="relative z-20 px-5 pb-8 pt-4 sm:px-6 sm:pb-10"
    >
      <Reveal className="mx-auto max-w-5xl">
        <div className="rounded-[28px] border border-white/15 bg-white/[0.06] px-4 py-7 backdrop-blur-md sm:rounded-[40px] sm:px-10 sm:py-10">
          {state?.ok ? (
            <div role="status" className="text-center">
              <p className="font-display text-3xl italic text-white">
                You&apos;re on the wave
              </p>
              <p className="mt-2 text-sm text-white/60">
                We&apos;ll send tickets, lineups, and invites — nothing else.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-md text-center lg:text-left">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.25em] text-cyan">
                  Stay on frequency
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold italic text-white sm:text-4xl">
                  Subscribe
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  Be first to know about tickets, lineups, and invites.
                </p>
              </div>
              <form
                action={formAction}
                className="flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:items-center"
              >
                <label htmlFor="subscribe-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="subscribe-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@email.com"
                  className="h-12 min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-sm transition-colors focus:border-cyan"
                />
                <button
                  type="submit"
                  disabled={pending}
                  className="btn-primary h-12 shrink-0 disabled:opacity-60"
                >
                  {pending ? 'Joining…' : 'Join the wave'}
                </button>
              </form>
            </div>
          )}
          {state && !state.ok && (
            <p role="alert" className="mt-4 text-center text-sm text-cyan lg:text-right">
              {state.error}
            </p>
          )}
        </div>
      </Reveal>
    </section>
  );
}
