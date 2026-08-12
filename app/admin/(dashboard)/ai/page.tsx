import { desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { aiConversations } from '@/lib/db/schema';
import {
  cardCls,
  headingCls,
  microLabelCls,
  tagCls,
  tagCyan,
  tagMuted,
} from '@/components/admin/ui';
import { fmtDateTime } from '@/components/admin/format';
import { IconChevronDown } from '@/components/admin/icons';

const timeFmt = new Intl.DateTimeFormat('en-KE', {
  timeZone: 'Africa/Nairobi',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function fmtStamp(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : timeFmt.format(d);
}

export default async function AiConversationsPage() {
  const rows = await db
    .select()
    .from(aiConversations)
    .orderBy(desc(aiConversations.updatedAt));

  return (
    <div className="space-y-8">
      <header>
        <p className={microLabelCls}>AI Console</p>
        <h1 className={headingCls}>
          <span className="text-cyan">Agent</span>{' '}
          <span className="text-white">Transmissions</span>{' '}
          <span className="font-mono text-lg text-white/40">({rows.length})</span>
        </h1>
      </header>

      {rows.length === 0 ? (
        <div className={`${cardCls} p-10 text-center text-white/50`}>
          No AI conversations recorded yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((c) => (
            <li key={c.id}>
              <details className={`${cardCls} group overflow-hidden`}>
                <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 ${
                      c.status === 'active' ? 'animate-pulse bg-cyan' : 'bg-white/20'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs text-white/85">
                      {c.visitorId}
                    </p>
                    <p className="truncate font-mono text-[11px] text-white/40">
                      {c.messages.length} messages
                      {c.externalId ? ` — ext ${c.externalId}` : ''}
                    </p>
                  </div>
                  <span className={`${tagCls} ${tagMuted} shrink-0`}>{c.mode}</span>
                  <span
                    className={`${tagCls} ${c.status === 'active' ? tagCyan : tagMuted} shrink-0`}
                  >
                    {c.status}
                  </span>
                  <span className="hidden shrink-0 font-mono text-[11px] text-white/40 sm:block">
                    {fmtDateTime(c.updatedAt)} EAT
                  </span>
                  <IconChevronDown className="h-3.5 w-3.5 shrink-0 text-white/30 transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t border-white/5 px-5 py-4">
                  {c.messages.length === 0 ? (
                    <p className="text-sm text-white/45">Empty transcript.</p>
                  ) : (
                    <ol className="space-y-3">
                      {c.messages.map((m, i) => (
                        <li key={i} className="flex gap-3">
                          <span
                            className={`${tagCls} mt-0.5 h-fit shrink-0 ${
                              m.role === 'agent' ? tagCyan : tagMuted
                            }`}
                          >
                            {m.role}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">
                              {m.text}
                            </p>
                            {m.timestamp && (
                              <p className="mt-0.5 font-mono text-[10px] text-white/30">
                                {fmtStamp(m.timestamp)}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                  <p className="mt-4 font-mono text-[10px] text-white/30 sm:hidden">
                    {fmtDateTime(c.updatedAt)} EAT
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
