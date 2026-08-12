import Link from 'next/link';
import { and, asc, count, desc, eq, gte } from 'drizzle-orm';
import { db, events, messages, posts, subscribers } from '@/lib/db';
import { cardCls, microLabelCls } from '@/components/admin/ui';
import { fmtDateTime, fmtShort, tMinus } from '@/components/admin/format';
import {
  IconCalendar,
  IconChat,
  IconCheck,
  IconClock,
  IconFile,
  IconMail,
  IconMapPin,
} from '@/components/admin/icons';

export default async function OverviewPage() {
  const now = new Date();

  const [
    [{ total }],
    [{ published }],
    [{ upcoming }],
    [{ subs }],
    [{ unread }],
    [{ postCount }],
    nextEvents,
    latestMessages,
  ] = await Promise.all([
    db.select({ total: count() }).from(events),
    db.select({ published: count() }).from(events).where(eq(events.status, 'published')),
    db.select({ upcoming: count() }).from(events).where(gte(events.startAt, now)),
    db.select({ subs: count() }).from(subscribers),
    db.select({ unread: count() }).from(messages).where(eq(messages.read, false)),
    db.select({ postCount: count() }).from(posts),
    db
      .select()
      .from(events)
      .where(and(eq(events.status, 'published'), gte(events.startAt, now)))
      .orderBy(asc(events.startAt))
      .limit(1),
    db.select().from(messages).orderBy(desc(messages.createdAt)).limit(5),
  ]);

  const nextEvent = nextEvents[0];

  const stats = [
    { label: 'Events', value: total, accent: 'text-white', icon: IconCalendar },
    { label: 'Published', value: published, accent: 'text-cyan', icon: IconCheck },
    { label: 'Upcoming', value: upcoming, accent: 'text-blue', icon: IconClock },
    { label: 'Subscribers', value: subs, accent: 'text-gold', icon: IconMail },
    {
      label: 'Unread',
      value: unread,
      accent: unread > 0 ? 'text-[#e93cac]' : 'text-white/60',
      icon: IconChat,
    },
    { label: 'Posts', value: postCount, accent: 'text-white', icon: IconFile },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={microLabelCls}>Overview</p>
          <h1 className="mt-2 font-display text-2xl uppercase tracking-wide sm:text-3xl">
            <span className="font-extrabold text-cyan">Mission</span>{' '}
            <span className="font-light text-white">Control</span>
          </h1>
        </div>
        <Link href="/admin/events/new" className="btn-primary text-sm">
          New Event
        </Link>
      </header>

      {/* HUD stat tiles */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${cardCls} p-4`}>
              <div className="flex items-start justify-between">
                <p className={`font-mono text-3xl font-bold ${s.accent}`}>{s.value}</p>
                <Icon className="h-4 w-4 text-white/25" />
              </div>
              <p className={`${microLabelCls} mt-2`}>{s.label}</p>
            </div>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Next event */}
        <section className={`${cardCls} p-6`}>
          <p className={microLabelCls}>Next Event</p>
          {nextEvent ? (
            <div className="mt-4">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-xl font-bold uppercase">{nextEvent.title}</h2>
                <span className="shrink-0 rounded-none border border-cyan/50 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-cyan">
                  {tMinus(nextEvent.startAt, now)}
                </span>
              </div>
              {nextEvent.tagline && (
                <p className="mt-1 text-sm text-white/60">{nextEvent.tagline}</p>
              )}
              <dl className="mt-4 space-y-2 font-mono text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <IconCalendar className="h-3.5 w-3.5 text-cyan/60" />
                  {fmtDateTime(nextEvent.startAt)} EAT
                </div>
                <div className="flex items-center gap-2">
                  <IconMapPin className="h-3.5 w-3.5 text-cyan/60" />
                  {[nextEvent.venue, nextEvent.city, nextEvent.country]
                    .filter(Boolean)
                    .join(', ')}
                </div>
              </dl>
              <Link
                href={`/admin/events/${nextEvent.id}`}
                className="mt-5 inline-block rounded-none border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-widest text-white/70 transition-colors hover:border-cyan/50 hover:text-cyan"
              >
                Edit Event
              </Link>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-white/55">
                No upcoming published events on the board.
              </p>
              <Link
                href="/admin/events/new"
                className="mt-4 inline-block rounded-none border border-cyan/40 px-4 py-2 font-mono text-xs uppercase tracking-widest text-cyan transition-colors hover:bg-cyan/10"
              >
                Create Event
              </Link>
            </div>
          )}
        </section>

        {/* Latest signals */}
        <section className={`${cardCls} p-6`}>
          <div className="flex items-center justify-between">
            <p className={microLabelCls}>Latest Signals</p>
            <Link
              href="/admin/messages"
              className="font-mono text-xs uppercase tracking-widest text-white/50 hover:text-cyan"
            >
              View all
            </Link>
          </div>
          {latestMessages.length === 0 ? (
            <p className="mt-4 text-sm text-white/55">No signals on the wire.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/5">
              {latestMessages.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-2.5">
                  {!m.read && (
                    <span className="h-1.5 w-1.5 shrink-0 animate-pulse bg-cyan" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm ${
                        m.read ? 'text-white/60' : 'font-semibold text-white'
                      }`}
                    >
                      {m.name} — {m.subject}
                    </p>
                    <p className="truncate font-mono text-[11px] text-white/40">{m.email}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] text-white/40">
                    {fmtShort(m.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Quick actions */}
      <section className={`${cardCls} p-6`}>
        <p className={microLabelCls}>Quick Actions</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/events/new" className="btn-primary text-sm">New Event</Link>
          <Link href="/admin/blog/new" className="btn-outline text-sm">New Post</Link>
          <Link href="/admin/events" className="btn-outline text-sm">Manage Events</Link>
          <Link href="/admin/sponsors" className="btn-outline text-sm">Sponsors</Link>
          <Link href="/admin/subscribers" className="btn-outline text-sm">Subscribers</Link>
        </div>
      </section>
    </div>
  );
}
