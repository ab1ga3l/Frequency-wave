import Link from 'next/link';
import { desc } from 'drizzle-orm';
import { db, events } from '@/lib/db';
import type { Event } from '@/lib/db/schema';
import { deleteEvent, setEventFeatured, setEventStatus } from '@/app/admin/actions';
import ConfirmButton from '@/components/admin/ConfirmButton';
import {
  cardCls,
  dangerBtnCls,
  headingCls,
  microLabelCls,
  smallBtnCls,
  tagCls,
  tagCyan,
  tagDanger,
  tagGold,
} from '@/components/admin/ui';
import { fmtDateTime, isUpcoming } from '@/components/admin/format';
import { IconStar } from '@/components/admin/icons';

const STATUS_TAG: Record<Event['status'], string> = {
  draft: tagGold,
  published: tagCyan,
  cancelled: tagDanger,
};

export default async function EventsPage() {
  const rows = await db.select().from(events).orderBy(desc(events.startAt));
  const now = new Date();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={microLabelCls}>Events</p>
          <h1 className={headingCls}>
            <span className="text-cyan">All</span>{' '}
            <span className="text-white">Events</span>{' '}
            <span className="font-mono text-lg text-white/40">({rows.length})</span>
          </h1>
        </div>
        <Link href="/admin/events/new" className="btn-primary text-sm">
          New Event
        </Link>
      </header>

      <div className={`${cardCls} overflow-x-auto`}>
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-white/40">
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
                  No events yet.{' '}
                  <Link href="/admin/events/new" className="text-cyan underline">
                    Create the first one
                  </Link>
                  .
                </td>
              </tr>
            )}
            {rows.map((ev) => {
              const upcoming = isUpcoming(ev.startAt, now);
              return (
                <tr key={ev.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {ev.featured && (
                        <IconStar filled className="h-3.5 w-3.5 shrink-0 text-gold" />
                      )}
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
                    <span className={`${tagCls} ${STATUS_TAG[ev.status]}`}>{ev.status}</span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 font-mono text-[11px] uppercase tracking-wider">
                    {upcoming ? (
                      <span className="inline-flex items-center gap-1.5 text-cyan">
                        <span className="h-1.5 w-1.5 animate-pulse bg-cyan" /> upcoming
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-white/35">
                        <span className="h-1.5 w-1.5 bg-white/20" /> past
                      </span>
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
                          <IconStar
                            filled={ev.featured}
                            className={`h-3.5 w-3.5 ${ev.featured ? 'text-gold' : ''}`}
                          />
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
