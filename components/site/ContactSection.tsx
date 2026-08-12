'use client';

import { useActionState, type ReactNode } from 'react';
import { sendMessage, type ActionResult } from '@/app/actions/public';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import WaveBand from './WaveBand';

const SUBJECTS = [
  'Partnership',
  'Sponsorship',
  'Collaboration',
  'Event Inquiry',
  'Other',
];

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const MailIcon = (
  <svg aria-hidden="true" {...iconProps}>
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const PinIcon = (
  <svg aria-hidden="true" {...iconProps}>
    <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const AtIcon = (
  <svg aria-hidden="true" {...iconProps}>
    <circle cx="12" cy="12" r="4" />
    <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" />
  </svg>
);

const INFO: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}[] = [
  {
    icon: MailIcon,
    label: 'Email',
    value: (
      <a
        href="mailto:hello@frequencywave.co.ke"
        className="transition-colors hover:text-cyan"
      >
        hello@frequencywave.co.ke
      </a>
    ),
  },
  {
    icon: PinIcon,
    label: 'Location',
    value: 'Nairobi, Kenya',
  },
  {
    icon: AtIcon,
    label: 'Socials',
    value: (
      <span className="flex flex-wrap gap-x-3 gap-y-1">
        <a
          href="https://x.com/frequencywave"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-cyan"
        >
          @frequencywave on X
        </a>
        <a
          href="https://instagram.com/frequencywave"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-cyan"
        >
          Instagram
        </a>
        <a
          href="https://linktr.ee/frequencywave101"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-cyan"
        >
          linktr.ee/frequencywave101
        </a>
      </span>
    ),
  },
];

const inputClass =
  'h-11 w-full rounded-none border border-white/15 bg-[#040B24] px-4 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-cyan';

const labelClass =
  'mb-1.5 block text-[0.65rem] uppercase tracking-widest text-white/40';

export default function ContactSection() {
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(async (_prev, formData) => sendMessage(formData), null);

  return (
    <section id="contact" aria-label="Contact" className="relative overflow-hidden bg-[#10062e] py-24">
      <WaveBand wash variant="wash" />
      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-6">
        <Reveal>
          <SectionHeading
            accent="Get In"
            rest="Touch"
            subtitle="Partnerships · Sponsorship · Performances · Press"
          />
        </Reveal>

        <Reveal className="mt-14">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            {/* Info list */}
            <div className="flex flex-col gap-7">
              {INFO.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="mt-0.5 text-cyan">{item.icon}</span>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-widest text-white/40">
                      {item.label}
                    </p>
                    <div className="mt-1 text-sm text-white/80">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            {state?.ok ? (
              <div
                role="status"
                className="flex min-h-64 flex-col items-center justify-center gap-4 border border-white/10 p-8 text-center"
              >
                <svg
                  aria-hidden="true"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-cyan"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m8 12.5 3 3 5-6" />
                </svg>
          <p className="font-display text-2xl italic text-white">
                  Message Received
                </p>
                <p className="text-sm text-white/60">
                  We&apos;ll be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
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
                    <label htmlFor="contact-email" className={labelClass}>
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
                  <label htmlFor="contact-subject" className={labelClass}>
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    defaultValue="Partnership"
                    className={inputClass}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s} className="bg-[#040B24]">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className={labelClass}>
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    maxLength={5000}
                    placeholder="Tell us what you have in mind"
                    className="w-full resize-y rounded-none border border-white/15 bg-[#040B24] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors focus:border-cyan"
                  />
                </div>
                {state && !state.ok && (
                  <p role="alert" className="text-sm text-cyan">
                    {state.error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={pending}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  {pending ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
