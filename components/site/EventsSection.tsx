'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { EventCardData } from './format';

function EventCard({ event }: { event: EventCardData }) {
  return (
    <article className="neon-card flex flex-col gap-5 overflow-hidden p-6 sm:p-8">
      {event.coverImage && (
        <div className="relative -mx-6 -mt-6 h-44 sm:-mx-8 sm:-mt-8 sm:h-52">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.coverImage}
            alt=""
            className="h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(4,11,36,0.15) 0%, rgba(8,16,44,0.95) 100%)',
            }}
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        {/* Date badge */}
        <div
          className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full p-[2px]"
          style={{
            background:
              'linear-gradient(135deg, #6b00f5, #265bff 55%, #00f8ff)',
          }}
        >
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-navy">
            <span className="font-display text-2xl font-black leading-none text-white">
              {event.day}
            </span>
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-cyan">
              {event.month}
            </span>
          </div>
        </div>
        {event.isPast ? (
          <span className="rounded-full border border-white/20 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/50">
            Past
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-cyan">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-dot"
            />
            Upcoming
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-display text-xl font-black uppercase leading-tight text-white sm:text-2xl">
          {event.title}
        </h3>
        <p className="font-mono text-xs uppercase tracking-widest text-white/60">
          {event.dateLine}
        </p>
        <p className="text-sm text-white/60">
          <span aria-hidden="true">📍</span> {event.venue}
          {event.venue && event.city ? ', ' : ''}
          {event.city}
        </p>
      </div>

      {event.description && (
        <p className="line-clamp-3 text-sm leading-relaxed text-white/70">
          {event.description}
        </p>
      )}

      {event.tags.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Event tags">
          {event.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-blue/40 bg-blue/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-widest text-white/70"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-4 pt-2">
        {event.isPast ? (
          <Link
            href={`/events/${event.slug}`}
            className="btn-outline !px-6 !py-2.5 text-sm"
          >
            View Recap →
          </Link>
        ) : (
          <>
            {event.registerUrl && (
              <a
                href={event.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !px-6 !py-2.5 text-sm"
              >
                Register Now →
              </a>
            )}
            <Link
              href={`/events/${event.slug}`}
              className="text-sm font-semibold text-cyan underline-offset-4 hover:underline"
            >
              Details
            </Link>
          </>
        )}
      </div>
    </article>
  );
}

function UpcomingEmptyState() {
  return (
    <div className="neon-card mx-auto flex max-w-2xl flex-col items-center gap-4 px-8 py-14 text-center">
      <span aria-hidden="true" className="text-4xl">
        🔮
      </span>
      <h3 className="font-display text-2xl font-black uppercase tracking-tight">
        Next Wave <span className="g-text">Loading</span>
      </h3>
      <p className="max-w-md text-sm leading-relaxed text-white/60">
        New events are being crafted. Subscribe below to be first to know when
        the next frequency drops.
      </p>
      <Link href="/#newsletter" className="btn-primary mt-2">
        Get Notified →
      </Link>
    </div>
  );
}

export default function EventsSection({
  upcoming,
  past,
}: {
  upcoming: EventCardData[];
  past: EventCardData[];
}) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const active = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="flex flex-col gap-10">
      <div
        role="tablist"
        aria-label="Event categories"
        className="flex w-fit gap-1 rounded-full border border-white/10 bg-navy-mid/70 p-1"
      >
        {(
          [
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'past', label: 'Past' },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-6 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors ${
              tab === t.key
                ? 'bg-gradient-to-r from-violet to-blue text-white'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active.length === 0 ? (
        tab === 'upcoming' ? (
          <UpcomingEmptyState />
        ) : (
          <p className="py-10 text-center font-mono text-sm uppercase tracking-widest text-white/40">
            No past events yet — the story starts soon.
          </p>
        )
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {active.map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
