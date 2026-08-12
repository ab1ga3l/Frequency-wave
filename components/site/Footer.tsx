import Link from 'next/link';

const NAV_COLUMNS = [
  {
    heading: 'Navigate',
    links: [
      { label: 'About', href: '/#about' },
      { label: 'Events', href: '/#events' },
      { label: 'Program', href: '/#program' },
      { label: 'Sponsorship', href: '/#sponsorship' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { label: 'Newsletter', href: '/#newsletter' },
      { label: 'Contact', href: '/#contact' },
      { label: 'Linktree', href: 'https://linktr.ee/frequencywave101' },
    ],
  },
  {
    heading: 'Events',
    links: [
      { label: 'Upcoming', href: '/#events' },
      { label: 'Past Waves', href: '/#events' },
      { label: 'Get Tickets', href: '/#events' },
    ],
  },
];

const SOCIALS = [
  { label: 'X', href: 'https://x.com/frequencywave' },
  { label: 'IG', href: 'https://instagram.com/frequencywave' },
  { label: 'LT', href: 'https://linktr.ee/frequencywave101' },
];

const HASHTAGS = [
  '#FrequencyWave',
  '#TechMeetsEntertainment',
  '#Web3Culture',
  '#BuildTheWave',
  '#AfricaRising',
];

export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="border-t border-white/10 bg-navy-mid/40"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand block */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="font-display text-lg font-black tracking-wide"
            >
              <span aria-hidden="true">⚡</span> FREQUENCY{' '}
              <span className="g-text">WAVE</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/55">
              Africa&apos;s tech-entertainment movement. Web3 meets culture —
              built in Nairobi, felt everywhere.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label === 'X' ? 'X / Twitter' : s.label === 'IG' ? 'Instagram' : 'Linktree'}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 font-mono text-xs text-white/60 transition-colors hover:border-cyan/60 hover:text-cyan"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {NAV_COLUMNS.map((col) => (
              <nav key={col.heading} aria-label={`Footer ${col.heading}`}>
                <h3 className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.25em] text-cyan">
                  {col.heading}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={`${col.heading}-${l.label}`}>
                      {l.href.startsWith('http') ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-white/60 transition-colors hover:text-white"
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          href={l.href}
                          className="text-sm text-white/60 transition-colors hover:text-white"
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Hashtags */}
        <div className="mt-12 flex flex-wrap gap-2">
          {HASHTAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-3.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-widest text-white/45"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-white/10 pt-6 text-center sm:flex-row sm:justify-between">
          <p className="font-mono text-xs text-white/40">
            © 2026 Frequency Wave. All rights reserved.
          </p>
          <p className="font-mono text-xs text-white/40">
            Made by{' '}
            <a
              href="https://arttentionmedia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 transition-colors hover:text-cyan"
            >
              arttentionmedia.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
