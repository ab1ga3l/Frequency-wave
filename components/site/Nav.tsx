'use client';

/** Sticky public nav with the cropped FW wave mark. */
import Link from 'next/link';
import { useState } from 'react';
import LogoMark from './LogoMark';

const LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Events', href: '/#events' },
  { label: 'DJs', href: '/#djs' },
  { label: 'Blog', href: '/blog' },
  { label: 'Sponsorship', href: '/#sponsorship' },
  { label: 'Contact', href: '/#contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-white/10 bg-[#040B24]/70 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-full max-w-6xl items-center justify-between px-5 sm:px-6"
      >
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 sm:gap-2.5"
          onClick={() => setOpen(false)}
        >
          <LogoMark className="h-7 w-auto shrink-0 sm:h-8" />
          <span className="truncate font-display text-lg font-bold italic tracking-wide sm:text-2xl">
            <span className="text-white">Frequency</span>{' '}
            <span className="text-cyan">Wave</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-cyan focus-visible:text-cyan"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-white"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-white"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="border-b border-white/10 bg-[#040B24]/90 backdrop-blur-md md:hidden">
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-6xl flex-col px-5 py-4 sm:px-6"
          >
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/60 transition-colors last:border-b-0 hover:text-cyan"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
