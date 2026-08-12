import { desc } from 'drizzle-orm';
import { db, subscribers } from '@/lib/db';
import { deleteSubscriber } from '@/app/admin/actions';
import ConfirmButton from '@/components/admin/ConfirmButton';
import CopyEmailsButton from '@/components/admin/CopyEmailsButton';
import { cardCls, dangerBtnCls } from '@/components/admin/ui';
import { fmtDate } from '@/components/admin/format';

export default async function SubscribersPage() {
  const rows = await db
    .select()
    .from(subscribers)
    .orderBy(desc(subscribers.createdAt));

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Subscribers</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold">
            Waitlist <span className="font-mono text-lg text-white/40">({rows.length})</span>
          </h1>
        </div>
        <CopyEmailsButton emails={rows.map((r) => r.email)} />
      </header>

      <div className={cardCls + ' overflow-x-auto'}>
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-widest text-white/40">
              <th className="px-5 py-3.5">Email</th>
              <th className="px-3 py-3.5">Joined (EAT)</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-white/50">
                  No subscribers yet. The signal is still spreading.
                </td>
              </tr>
            )}
            {rows.map((sub) => (
              <tr key={sub.id} className="transition-colors hover:bg-white/[0.03]">
                <td className="px-5 py-3.5 font-mono text-xs text-white/85">{sub.email}</td>
                <td className="whitespace-nowrap px-3 py-3.5 font-mono text-xs text-white/50">
                  {fmtDate(sub.createdAt)}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <form action={deleteSubscriber} className="inline">
                    <input type="hidden" name="id" value={sub.id} />
                    <ConfirmButton
                      className={dangerBtnCls}
                      message={`Remove ${sub.email} from the list?`}
                    >
                      Delete
                    </ConfirmButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
