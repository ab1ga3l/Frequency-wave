'use client';

import { useActionState } from 'react';
import { sendMessage, type ActionResult } from '@/app/actions/public';

const SUBJECTS = [
  'Partnership',
  'Sponsorship',
  'Collaboration',
  'Event Inquiry',
  'Other',
];

const INFO = [
  {
    icon: '📧',
    label: 'Email',
    value: 'hello@frequencywave.co.ke',
    href: 'mailto:hello@frequencywave.co.ke',
  },
  {
    icon: '📍',
    label: 'Location',
    value: 'Nairobi, Kenya',
    href: null,
  },
];

const SOCIALS = [
  { label: 'X / Twitter', href: 'https://x.com/frequencywave' },
  { label: 'Instagram', href: 'https://instagram.com/frequencywave' },
  { label: 'Linktree', href: 'https://linktr.ee/frequencywave101' },
];

const inputClass =
  'w-full rounded-xl border border-white/15 bg-navy/70 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus-visible:border-cyan';

export default function ContactSection() {
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(async (_prev, formData) => sendMessage(formData), null);

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-32"
    >
      <span className="eyebrow">Get In Touch</span>
      <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
        Let&apos;s Make <span className="g-text">Waves</span> Together
      </h2>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        {/* Info panel */}
        <div className="flex flex-col gap-6">
          <p className="text-sm leading-relaxed text-white/60">
            Sponsorships, partnerships, collaborations, or just want to plug
            in? Drop us a line — we reply fast.
          </p>
          {INFO.map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/5 text-lg"
              >
                {item.icon}
              </span>
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/45">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm font-semibold text-white transition-colors hover:text-cyan"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-white">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div className="mt-2 flex flex-wrap gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-4 py-2 font-mono text-[0.65rem] uppercase tracking-widest text-white/60 transition-colors hover:border-cyan/50 hover:text-cyan"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="neon-card p-6 sm:p-8">
          {state?.ok ? (
            <div
              role="status"
              className="flex h-full min-h-64 flex-col items-center justify-center gap-3 text-center"
            >
              <span aria-hidden="true" className="text-4xl">
                ⚡
              </span>
              <p className="font-display text-xl font-black uppercase tracking-tight">
                Message Received!
              </p>
              <p className="text-sm text-white/60">
                We&apos;ll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form action={formAction} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/45"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    maxLength={120}
                    autoComplete="name"
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/45"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-1.5 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/45"
                >
                  Subject
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  defaultValue="Partnership"
                  className={inputClass}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s} className="bg-navy">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/45"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  maxLength={5000}
                  placeholder="Tell us what you have in mind…"
                  className={`${inputClass} resize-y`}
                />
              </div>
              {state && !state.ok && (
                <p role="alert" className="text-sm text-magenta">
                  {state.error}
                </p>
              )}
              <button
                type="submit"
                disabled={pending}
                className="btn-primary self-start disabled:opacity-60"
              >
                {pending ? 'Sending…' : 'Send Message →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
