'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { ComponentType } from 'react';
import { signOut } from '@/app/admin/actions';
import LogoMark from '@/components/site/LogoMark';
import {
  IconCalendar,
  IconChat,
  IconCpu,
  IconFile,
  IconGlobe,
  IconMail,
  IconMenu,
  IconPower,
  IconRadar,
  IconUsers,
  IconX,
} from '@/components/admin/icons';

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

type NavSection = { label: string | null; items: NavItem[] };

const SECTIONS: NavSection[] = [
  {
    label: null,
    items: [{ href: '/admin', label: 'Overview', icon: IconRadar }],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/events', label: 'Events', icon: IconCalendar },
      { href: '/admin/blog', label: 'Blog', icon: IconFile },
      { href: '/admin/sponsors', label: 'Sponsors', icon: IconUsers },
    ],
  },
  {
    label: 'Audience',
    items: [
      { href: '/admin/subscribers', label: 'Subscribers', icon: IconMail },
      { href: '/admin/messages', label: 'Messages', icon: IconChat },
    ],
  },
  {
    label: 'System',
    items: [{ href: '/admin/ai', label: 'AI Console', icon: IconCpu }],
  },
];

export default function Sidebar({ unread }: { unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const nav = (
    <nav className="flex flex-col px-3">
      {SECTIONS.map((section, i) => (
        <div key={section.label ?? i} className="mb-1">
          {section.label && (
            <p className="mb-1 mt-4 px-3 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-white/25">
              {section.label}
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`relative flex items-center gap-3 rounded-full px-3 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors ${
                    active
                      ? 'bg-cyan/10 text-cyan'
                      : 'text-white/55 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {active && (
                    <span className="absolute inset-y-1.5 left-1 w-[3px] rounded-full bg-cyan" />
                  )}
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                  {item.href === '/admin/messages' && unread > 0 && (
                    <span className="ml-auto rounded-full border border-cyan/50 px-1.5 py-0.5 font-mono text-[10px] leading-none text-cyan">
                      {unread}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="mt-auto flex flex-col gap-0.5 border-t border-white/5 px-3 pb-5 pt-3">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-full px-3 py-2.5 font-mono text-xs uppercase tracking-widest text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
      >
        <IconGlobe className="h-4 w-4 shrink-0" /> View Site
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-left font-mono text-xs uppercase tracking-widest text-white/55 transition-colors hover:bg-[#e93cac]/10 hover:text-[#e93cac]"
        >
          <IconPower className="h-4 w-4 shrink-0" /> Sign Out
        </button>
      </form>
    </div>
  );

  const brand = (
    <div className="border-b border-white/5 px-6 pb-5 pt-6">
      <Link href="/admin" className="flex items-center gap-2">
        <LogoMark className="h-7 w-auto" />
        <span className="font-display text-xl italic tracking-wide">
          Frequency Wave
        </span>
      </Link>
      <p className="mt-1.5 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-cyan/70">
        Mission Control
      </p>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#040B24]/70 px-4 py-3 backdrop-blur-md md:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-display text-xl italic tracking-wide">
          <LogoMark className="h-6 w-auto" /> Frequency Wave
        </Link>
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-white/70"
        >
          {open ? (
            <>
              Close <IconX className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Menu <IconMenu className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </header>
      {open && (
        <div className="fixed inset-x-0 top-[53px] z-40 flex max-h-[calc(100vh-53px)] flex-col overflow-y-auto border-b border-white/10 bg-[#040B24]/90 pb-2 pt-2 backdrop-blur-md md:hidden">
          {nav}
          {footer}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col overflow-y-auto border-r border-white/10 bg-[#040B24]/70 backdrop-blur-md md:flex">
        {brand}
        {nav}
        {footer}
      </aside>
    </>
  );
}
