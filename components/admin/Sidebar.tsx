'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signOut } from '@/app/admin/actions';

const NAV = [
  { href: '/admin', label: 'Overview', icon: '📡' },
  { href: '/admin/events', label: 'Events', icon: '🎛️' },
  { href: '/admin/sponsors', label: 'Sponsors', icon: '🤝' },
  { href: '/admin/subscribers', label: 'Subscribers', icon: '📬' },
  { href: '/admin/messages', label: 'Messages', icon: '💬' },
] as const;

export default function Sidebar({ unread }: { unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const nav = (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors ${
              active
                ? 'bg-cyan/10 text-cyan'
                : 'text-white/55 hover:bg-white/5 hover:text-white'
            }`}
          >
            {active && (
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-cyan shadow-glow-cyan" />
            )}
            <span aria-hidden>{item.icon}</span>
            <span>{item.label}</span>
            {item.href === '/admin/messages' && unread > 0 && (
              <span className="ml-auto rounded-full bg-cyan/20 px-2 py-0.5 text-[10px] text-cyan">
                {unread}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="mt-auto flex flex-col gap-1 px-3 pb-5">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-widest text-white/55 transition-colors hover:bg-white/5 hover:text-white"
      >
        <span aria-hidden>🌍</span> View Site ↗
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-mono text-xs uppercase tracking-widest text-white/55 transition-colors hover:bg-magenta/10 hover:text-magenta"
        >
          <span aria-hidden>⏻</span> Sign Out
        </button>
      </form>
    </div>
  );

  const brand = (
    <div className="px-6 pb-6 pt-7">
      <Link href="/admin" className="font-display text-sm font-extrabold tracking-wide">
        ⚡ FREQUENCY WAVE
      </Link>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/70">
        Mission Control
      </p>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-navy-mid px-4 py-3 md:hidden">
        <Link href="/admin" className="font-display text-sm font-extrabold">
          ⚡ FREQUENCY WAVE
        </Link>
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-white/15 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-white/70"
        >
          {open ? 'Close ✕' : 'Menu ☰'}
        </button>
      </header>
      {open && (
        <div className="fixed inset-x-0 top-[53px] z-40 flex flex-col border-b border-white/10 bg-navy-mid pb-2 pt-2 md:hidden">
          {nav}
          {footer}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-white/8 bg-navy-mid md:flex">
        {brand}
        {nav}
        {footer}
      </aside>
    </>
  );
}
