import Link from 'next/link';
import { desc } from 'drizzle-orm';
import { db, events } from '@/lib/db';
import type { Event } from '@/lib/db/schema';
import { deleteEvent, setEventFeatured, setEventStatus } from '@/app/admin/actions';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { cardCls, dangerBtnCls, smallBtnCls } from '@/components/admin/ui';
import { fmtDateTime, isUpcoming } from '@/components/admin/format';

const STATUS_PILL: Record<Event['status'], string> = {
  draft: 'border-gold/50 bg-gold/10 text-gold',
  published: 'border-cyan/50 bg-cyan/10 text-cyan',
  cancelled: 'border-magenta/50 bg-magenta/10 text-magenta',
};

export default async function EventsPage() {
  const rows = await db.select().from(events).orderBy(desc(events.startAt));
  const now = new Date();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Events</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold">
            All Events <span className="font-mono text-lg text-white/40">({rows.length})</span>
          </h1>
        </div>
        <Link href="/admin/events/new" className="btn-primary text-sm">
          + New Event
        </Link>
      </header>

      <div className={cardCls + ' overflow-x-auto'}>
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-widest text-white/40">
              <th className="px-5 py-3.5">Event</th>
              <th className="px-3 py-3.5">Date (EAT)</th>
              <th className="px-3 py-3.5">Location</th>
              <th className="px-3 py-3.5">Status</th>
              <th className="px-3 py-3.5">When</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-white/50">
                  No events yet. <Link href="/admin/events/new" className="text-cyan underline">Create the first one</Link>.
                </td>
              </tr>
            )}
            {rows.map((ev) => {
              const upcoming = isUpcoming(ev.startAt, now);
              return (
                <tr key={ev.id} className="transition-colors hover:bg-white/[0.03]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {ev.featured && <span title="Featured" className="text-gold">★</span>}
                      <Link
                        href={`/admin/events/${ev.id}`}
                        className="font-semibold text-white hover:text-cyan"
                      >
                        {ev.title}
                      </Link>
                    </div>
                    <p className="mt-0.5 font-mono text-[11px] text-white/35">/{ev.slug}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 font-mono text-xs text-white/70">
                    {fmtDateTime(ev.startAt)}
                  </td>
                  <td className="px-3 py-4 text-xs text-white/60">
                    {[ev.venue, ev.city].filter(Boolean).join(', ')}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${STATUS_PILL[ev.status]}`}
                    >
                      {ev.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 font-mono text-[11px]">
                    {upcoming ? (
                      <span className="text-cyan">● upcoming</span>
                    ) : (
                      <span className="text-white/35">○ past</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/events/${ev.id}`} className={smallBtnCls}>
                        Edit
                      </Link>
                      <form action={setEventStatus}>
                        <input type="hidden" name="id" value={ev.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={ev.status === 'published' ? 'draft' : 'published'}
                        />
                        <button type="submit" className={smallBtnCls}>
                          {ev.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                      </form>
                      <form action={setEventFeatured}>
                        <input type="hidden" name="id" value={ev.id} />
                        <input type="hidden" name="featured" value={String(!ev.featured)} />
                        <button
                          type="submit"
                          className={smallBtnCls}
                          title={ev.featured ? 'Unfeature' : 'Feature'}
                        >
                          {ev.featured ? '★' : '☆'}
                        </button>
                      </form>
                      <form action={deleteEvent}>
                        <input type="hidden" name="id" value={ev.id} />
                        <ConfirmButton
                          className={dangerBtnCls}
                          message={`Delete "${ev.title}"? Its agenda and ticket tiers will be deleted too.`}
                        >
                          Delete
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
