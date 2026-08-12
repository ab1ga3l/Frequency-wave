import Link from 'next/link';
import { notFound } from 'next/navigation';
import { asc, eq } from 'drizzle-orm';
import { db, events, agendaItems, ticketTiers } from '@/lib/db';
import {
  updateEvent,
  addAgendaItem,
  updateAgendaItem,
  deleteAgendaItem,
  addTicketTier,
  updateTicketTier,
  deleteTicketTier,
} from '@/app/admin/actions';
import EventForm from '@/components/admin/EventForm';
import ConfirmButton from '@/components/admin/ConfirmButton';
import {
  cardCls,
  dangerBtnCls,
  headingCls,
  inputCls,
  labelCls,
  microLabelCls,
  okBannerCls,
  smallBtnCls,
} from '@/components/admin/ui';

export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;

  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!event) notFound();

  const [agenda, tiers] = await Promise.all([
    db
      .select()
      .from(agendaItems)
      .where(eq(agendaItems.eventId, id))
      .orderBy(asc(agendaItems.sort), asc(agendaItems.timeLabel)),
    db
      .select()
      .from(ticketTiers)
      .where(eq(ticketTiers.eventId, id))
      .orderBy(asc(ticketTiers.sort), asc(ticketTiers.name)),
  ]);

  const update = updateEvent.bind(null, event.id);

  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/admin/events"
          className="font-mono text-xs uppercase tracking-widest text-white/45 hover:text-cyan"
        >
          Back to Events
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={microLabelCls}>Edit Event</p>
            <h1 className={headingCls}>{event.title}</h1>
            <p className="mt-1 font-mono text-xs text-white/40">/{event.slug}</p>
          </div>
          {event.status === 'published' && (
            <Link
              href={`/events/${event.slug}`}
              target="_blank"
              className="rounded-full border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-widest text-white/70 transition-colors hover:border-cyan/50 hover:text-cyan"
            >
              View Live
            </Link>
          )}
        </div>
      </header>

      {created && (
        <div className={okBannerCls}>
          Event created — now add its agenda and ticket tiers below.
        </div>
      )}

      {/* ── Event fields ── */}
      <section className={cardCls + ' p-6 sm:p-8'}>
        <h2 className={`${microLabelCls} mb-6`}>Event Details</h2>
        <EventForm action={update} event={event} submitLabel="Save Changes" />
      </section>

      {/* ── Agenda ── */}
      <section className={cardCls + ' p-6 sm:p-8'}>
        <h2 className={`${microLabelCls} mb-2`}>Agenda</h2>
        <p className="mb-6 text-xs text-white/45">
          The run of show. Lower sort numbers appear first.
        </p>

        {agenda.length === 0 ? (
          <p className="mb-6 text-sm text-white/50">No agenda items yet.</p>
        ) : (
          <ul className="mb-8 space-y-3">
            {agenda.map((item) => (
              <li key={item.id}>
                <form
                  action={updateAgendaItem}
                  className="grid gap-3 rounded-2xl border border-white/10 bg-[#040B24]/60 p-4 sm:grid-cols-[90px_60px_1fr]"
                >
                  <input type="hidden" name="id" value={item.id} />
                  <div>
                    <label className={labelCls}>Time</label>
                    <input
                      name="timeLabel"
                      required
                      defaultValue={item.timeLabel}
                      className={inputCls + ' font-mono'}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Sort</label>
                    <input
                      name="sort"
                      type="number"
                      defaultValue={item.sort}
                      className={inputCls + ' font-mono'}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>Title</label>
                        <input name="title" required defaultValue={item.title} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Host</label>
                        <input name="host" defaultValue={item.host ?? ''} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <input
                        name="description"
                        defaultValue={item.description ?? ''}
                        className={inputCls}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className={smallBtnCls}>Save</button>
                      <ConfirmButton
                        formAction={deleteAgendaItem}
                        className={dangerBtnCls}
                        message={`Delete agenda item "${item.title}"?`}
                      >
                        Delete
                      </ConfirmButton>
                    </div>
                  </div>
                </form>
              </li>
            ))}
          </ul>
        )}

        <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-cyan/80">
          + Add agenda item
        </h3>
        <form action={addAgendaItem} className="grid gap-3 sm:grid-cols-[90px_60px_1fr_1fr_auto]">
          <input type="hidden" name="eventId" value={event.id} />
          <div>
            <label className={labelCls}>Time *</label>
            <input
              name="timeLabel"
              required
              placeholder="18:00"
              className={inputCls + ' font-mono'}
            />
          </div>
          <div>
            <label className={labelCls}>Sort</label>
            <input name="sort" type="number" defaultValue={agenda.length * 10} className={inputCls + ' font-mono'} />
          </div>
          <div>
            <label className={labelCls}>Title *</label>
            <input name="title" required placeholder="Doors open" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Host</label>
            <input name="host" placeholder="DJ …" className={inputCls} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary px-5 py-2.5 text-sm">Add</button>
          </div>
          <div className="sm:col-span-5">
            <label className={labelCls}>Description</label>
            <input name="description" placeholder="Optional detail" className={inputCls} />
          </div>
        </form>
      </section>

      {/* ── Ticket tiers ── */}
      <section className={cardCls + ' p-6 sm:p-8'}>
        <h2 className={`${microLabelCls} mb-2`}>Ticket Tiers</h2>
        <p className="mb-6 text-xs text-white/45">
          Perks are comma-separated. Lower sort numbers appear first.
        </p>

        {tiers.length === 0 ? (
          <p className="mb-6 text-sm text-white/50">No ticket tiers yet.</p>
        ) : (
          <ul className="mb-8 space-y-3">
            {tiers.map((tier) => (
              <li key={tier.id}>
                <form
                  action={updateTicketTier}
                  className="space-y-3 rounded-2xl border border-white/10 bg-[#040B24]/60 p-4"
                >
                  <input type="hidden" name="id" value={tier.id} />
                  <div className="grid gap-3 sm:grid-cols-[1fr_140px_60px]">
                    <div>
                      <label className={labelCls}>Name</label>
                      <input name="name" required defaultValue={tier.name} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Price label</label>
                      <input
                        name="priceLabel"
                        defaultValue={tier.priceLabel}
                        className={inputCls + ' font-mono'}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Sort</label>
                      <input
                        name="sort"
                        type="number"
                        defaultValue={tier.sort}
                        className={inputCls + ' font-mono'}
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Description</label>
                      <input
                        name="description"
                        defaultValue={tier.description ?? ''}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Ticket URL</label>
                      <input name="url" defaultValue={tier.url ?? ''} className={inputCls + ' font-mono'} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Perks (comma-separated)</label>
                    <input
                      name="perks"
                      defaultValue={tier.perks.join(', ')}
                      className={inputCls}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex cursor-pointer items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60">
                      <input
                        type="checkbox"
                        name="soldOut"
                        defaultChecked={tier.soldOut}
                        className="h-4 w-4 accent-[#e93cac]"
                      />
                      Sold out
                    </label>
                    <div className="flex gap-2">
                      <button type="submit" className={smallBtnCls}>Save</button>
                      <ConfirmButton
                        formAction={deleteTicketTier}
                        className={dangerBtnCls}
                        message={`Delete ticket tier "${tier.name}"?`}
                      >
                        Delete
                      </ConfirmButton>
                    </div>
                  </div>
                </form>
              </li>
            ))}
          </ul>
        )}

        <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-cyan/80">
          + Add ticket tier
        </h3>
        <form action={addTicketTier} className="space-y-3">
          <input type="hidden" name="eventId" value={event.id} />
          <div className="grid gap-3 sm:grid-cols-[1fr_140px_60px]">
            <div>
              <label className={labelCls}>Name *</label>
              <input name="name" required placeholder="General Admission" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Price label</label>
              <input name="priceLabel" placeholder="KES 1,500" className={inputCls + ' font-mono'} />
            </div>
            <div>
              <label className={labelCls}>Sort</label>
              <input name="sort" type="number" defaultValue={tiers.length * 10} className={inputCls + ' font-mono'} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Description</label>
              <input name="description" placeholder="Optional" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Ticket URL</label>
              <input name="url" placeholder="https://…" className={inputCls + ' font-mono'} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Perks (comma-separated)</label>
            <input name="perks" placeholder="Entry, welcome drink, POAP" className={inputCls} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60">
              <input type="checkbox" name="soldOut" className="h-4 w-4 accent-[#e93cac]" />
              Sold out
            </label>
            <button type="submit" className="btn-primary px-5 py-2.5 text-sm">Add Tier</button>
          </div>
        </form>
      </section>
    </div>
  );
}
