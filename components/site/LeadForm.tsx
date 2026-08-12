'use client';

import { useActionState } from 'react';
import { joinWave, type ActionResult } from '@/app/actions/public';

const INTERESTS = ['Attending', 'Sponsoring', 'Performing', 'Partnering'];

const inputClass =
  'h-11 w-full rounded-none bg-white px-4 text-xs uppercase tracking-wide text-[#040B24] placeholder:text-gray-500 outline-none';

/** Hero lead-capture card, flat violet-to-blue panel like the reference form. */
export default function LeadForm() {
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(async (_prev, formData) => joinWave(formData), null);

  return (
    <div
      className="p-7"
      style={{ background: 'linear-gradient(160deg,#6B00F5,#265BFF)' }}
    >
      {state?.ok ? (
        <div
          role="status"
          className="flex min-h-72 flex-col items-center justify-center gap-4 text-center"
        >
          <svg
            aria-hidden="true"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m8 12.5 3 3 5-6" />
          </svg>
          <p className="font-display text-2xl italic text-white">
            You&apos;re On The Wave
          </p>
          <p className="text-xs text-white/80">
            We&apos;ll hit your inbox when there&apos;s something worth knowing.
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-center font-display text-2xl italic text-white">
            Get Event Updates
          </h3>
          <p className="mt-2 text-center text-xs text-white/80">
            Be first to know about tickets, lineups and invites.
          </p>
          <form action={formAction} className="mt-5 flex flex-col gap-3">
            <label htmlFor="lead-name" className="sr-only">
              First name
            </label>
            <input
              id="lead-name"
              name="name"
              type="text"
              required
              maxLength={120}
              autoComplete="given-name"
              placeholder="FIRST NAME"
              className={inputClass}
            />
            <label htmlFor="lead-email" className="sr-only">
              Email address
            </label>
            <input
              id="lead-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="EMAIL ADDRESS"
              className={inputClass}
            />
            <label htmlFor="lead-interest" className="sr-only">
              I&apos;m interested in
            </label>
            <select
              id="lead-interest"
              name="interest"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                I&apos;M INTERESTED IN
              </option>
              {INTERESTS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            {state && !state.ok && (
              <p role="alert" className="text-xs font-semibold text-white">
                {state.error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="h-12 w-full rounded-full bg-[#040B24] text-sm font-semibold tracking-wide text-white transition-colors hover:bg-black disabled:opacity-60"
            >
              {pending ? 'Joining…' : 'Join The Wave'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
