import { desc, eq, count } from 'drizzle-orm';
import { db, messages } from '@/lib/db';
import { deleteMessage, setMessageRead } from '@/app/admin/actions';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { cardCls, dangerBtnCls, microLabelCls, smallBtnCls } from '@/components/admin/ui';
import { fmtDateTime } from '@/components/admin/format';
import { IconChevronDown } from '@/components/admin/icons';

export default async function MessagesPage() {
  const [rows, [{ unread }]] = await Promise.all([
    db.select().from(messages).orderBy(desc(messages.createdAt)),
    db.select({ unread: count() }).from(messages).where(eq(messages.read, false)),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <p className={microLabelCls}>Messages</p>
        <h1 className="mt-2 font-display text-2xl uppercase tracking-wide sm:text-3xl">
          <span className="font-extrabold text-cyan">Incoming</span>{' '}
          <span className="font-light text-white">Signals</span>{' '}
          <span className="font-mono text-lg text-white/40">
            ({unread} unread / {rows.length})
          </span>
        </h1>
      </header>

      {rows.length === 0 ? (
        <div className={`${cardCls} p-10 text-center text-white/50`}>
          Inbox zero. Nothing on the wire.
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((m) => (
            <li key={m.id}>
              <details className={`${cardCls} group overflow-hidden`}>
                <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 ${
                      m.read ? 'bg-white/15' : 'animate-pulse bg-cyan'
                    }`}
                    title={m.read ? 'Read' : 'Unread'}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm ${
                        m.read ? 'text-white/65' : 'font-bold text-white'
                      }`}
                    >
                      {m.subject}
                    </p>
                    <p className="truncate font-mono text-[11px] text-white/40">
                      {m.name} — {m.email}
                    </p>
                  </div>
                  <span className="hidden shrink-0 font-mono text-[11px] text-white/40 sm:block">
                    {fmtDateTime(m.createdAt)} EAT
                  </span>
                  <IconChevronDown className="h-3.5 w-3.5 shrink-0 text-white/30 transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t border-white/5 px-5 py-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">
                    {m.body}
                  </p>
                  <p className="mt-3 font-mono text-[11px] text-white/35 sm:hidden">
                    {fmtDateTime(m.createdAt)} EAT
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                      className={smallBtnCls}
                    >
                      Reply
                    </a>
                    <form action={setMessageRead} className="inline">
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="read" value={String(!m.read)} />
                      <button type="submit" className={smallBtnCls}>
                        {m.read ? 'Mark unread' : 'Mark read'}
                      </button>
                    </form>
                    <form action={deleteMessage} className="inline">
                      <input type="hidden" name="id" value={m.id} />
                      <ConfirmButton
                        className={dangerBtnCls}
                        message={`Delete this message from ${m.name}?`}
                      >
                        Delete
                      </ConfirmButton>
                    </form>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
