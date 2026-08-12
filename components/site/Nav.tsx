'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Events', href: '/#events' },
  { label: 'Program', href: '/#program' },
  { label: 'Sponsorship', href: '/#sponsorship' },
  { label: 'Contact', href: '/#contact' },
];

const SOCIALS = [
  { label: 'X / Twitter', href: 'https://x.com/frequencywave' },
  { label: 'Instagram', href: 'https://instagram.com/frequencywave' },
  { label: 'Linktree', href: 'https://linktr.ee/frequencywave101' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-navy/80 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[72px] sm:px-6"
      >
        <Link
          href="/"
          className="font-display text-sm font-black tracking-wide sm:text-base"
          onClick={() => setOpen(false)}
        >
          <span aria-hidden="true">⚡</span> FREQUENCY{' '}
          <span className="g-text">WAVE</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-cyan focus-visible:text-cyan"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/#events" className="btn-primary !px-6 !py-2.5 text-sm">
            Get Tickets →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-transform ${
              open ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-opacity ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-transform ${
              open ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile full-screen overlay */}
      {open && (
        <div className="fixed inset-0 top-16 z-40 flex flex-col justify-between overflow-y-auto bg-navy/98 px-6 pb-10 pt-10 backdrop-blur-2xl md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
            {LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-4 font-display text-3xl font-black uppercase tracking-tight text-white transition-colors hover:text-cyan"
              >
                <span className="mr-3 font-mono text-sm text-cyan">
                  0{i + 1}
                </span>
                {l.label}
              </Link>
            ))}
            <Link
              href="/#events"
              onClick={() => setOpen(false)}
              className="btn-primary mt-6 self-start"
            >
              Get Tickets →
            </Link>
          </nav>
          <div className="mt-10 flex flex-wrap gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-cyan"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
