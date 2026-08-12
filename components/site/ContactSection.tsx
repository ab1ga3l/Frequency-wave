'use client';

/** Open contact layout: glass pill fields, no solid form blocks, sits above footer waves. */
import { useActionState, type ReactNode } from 'react';
import { sendMessage, type ActionResult } from '@/app/actions/public';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

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
  'h-12 w-full rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-sm transition-colors focus:border-cyan';

const labelClass =
  'mb-1.5 block font-mono text-[0.65rem] uppercase tracking-widest text-white/40';

export default function ContactSection() {
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(async (_prev, formData) => sendMessage(formData), null);

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative z-20 overflow-visible py-24"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-6">
        <Reveal>
          <SectionHeading
            accent="Get In"
            rest="Touch"
            subtitle="Partnerships · Sponsorship · Performances · Press"
          />
        </Reveal>

        <Reveal className="mt-14">
          <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.2fr]">
            <div className="flex flex-col gap-8">
              <p className="text-sm leading-relaxed text-white/60">
                Want to partner, sponsor, play, or just say hey? Drop a note —
                we read every message.
              </p>
              {INFO.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="mt-0.5 text-cyan">{item.icon}</span>
                  <div>
                    <p className="font-mono text-[0.65rem] uppercase tracking-widest text-white/40">
                      {item.label}
                    </p>
                    <div className="mt-1 text-sm text-white/80">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {state?.ok ? (
              <div role="status" className="flex flex-col justify-center gap-3 py-6">
                <p className="font-display text-3xl italic text-white">
                  Message received
                </p>
                <p className="text-sm text-white/60">
                  We&apos;ll be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
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
                  <p className={labelClass}>Subject</p>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map((s, i) => (
                      <label key={s} className="cursor-pointer">
                        <input
                          type="radio"
                          name="subject"
                          value={s}
                          defaultChecked={i === 0}
                          className="peer sr-only"
                        />
                        <span className="inline-flex rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs text-white/70 transition-colors peer-checked:border-cyan peer-checked:bg-cyan/15 peer-checked:text-cyan peer-focus-visible:ring-2 peer-focus-visible:ring-cyan/50">
                          {s}
                        </span>
                      </label>
                    ))}
                  </div>
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
                    className="w-full resize-y rounded-3xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-sm transition-colors focus:border-cyan"
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
                  className="btn-primary self-start disabled:opacity-60"
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
