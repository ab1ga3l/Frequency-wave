import { asc } from 'drizzle-orm';
import { db, sponsors } from '@/lib/db';
import { deleteSponsor, toggleSponsorActive, updateSponsor } from '@/app/admin/actions';
import ConfirmButton from '@/components/admin/ConfirmButton';
import SponsorCreateForm from '@/components/admin/SponsorCreateForm';
import { cardCls, dangerBtnCls, inputCls, labelCls, selectCls, smallBtnCls } from '@/components/admin/ui';

const TIERS = ['platinum', 'gold', 'silver', 'bronze', 'partner'] as const;

const TIER_PILL: Record<(typeof TIERS)[number], string> = {
  platinum: 'border-white/50 text-white',
  gold: 'border-gold/60 text-gold',
  silver: 'border-white/30 text-white/60',
  bronze: 'border-[#cd7f32]/60 text-[#cd7f32]',
  partner: 'border-cyan/50 text-cyan',
};

export default async function SponsorsPage() {
  const rows = await db
    .select()
    .from(sponsors)
    .orderBy(asc(sponsors.sort), asc(sponsors.name));

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Sponsors</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold">
          Sponsors <span className="font-mono text-lg text-white/40">({rows.length})</span>
        </h1>
      </header>

      <section className={cardCls + ' p-6 sm:p-8'}>
        <h2 className="eyebrow mb-6">Add Sponsor</h2>
        <SponsorCreateForm />
      </section>

      {rows.length === 0 ? (
        <p className="text-sm text-white/50">No sponsors yet — the grid above is waiting.</p>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {rows.map((s) => (
            <li key={s.id} className={cardCls + ' p-5'}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${TIER_PILL[s.tier]}`}
                >
                  {s.tier}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-wider ${
                    s.active ? 'text-cyan' : 'text-white/35'
                  }`}
                >
                  {s.active ? '● active' : '○ hidden'}
                </span>
              </div>

              <form action={updateSponsor} className="space-y-3">
                <input type="hidden" name="id" value={s.id} />
                <div className="grid gap-3 sm:grid-cols-[1fr_130px_60px]">
                  <div>
                    <label className={labelCls}>Name</label>
                    <input name="name" required defaultValue={s.name} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Tier</label>
                    <select name="tier" defaultValue={s.tier} className={selectCls + ' font-mono'}>
                      {TIERS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Sort</label>
                    <input name="sort" type="number" defaultValue={s.sort} className={inputCls + ' font-mono'} />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Logo URL</label>
                    <input name="logoUrl" defaultValue={s.logoUrl ?? ''} className={inputCls + ' font-mono'} />
                  </div>
                  <div>
                    <label className={labelCls}>Website</label>
                    <input name="website" defaultValue={s.website ?? ''} className={inputCls + ' font-mono'} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Blurb</label>
                  <input name="blurb" defaultValue={s.blurb ?? ''} className={inputCls} />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button type="submit" className={smallBtnCls}>Save</button>
                  <button
                    type="submit"
                    formAction={toggleSponsorActive}
                    name="active"
                    value={String(!s.active)}
                    className={smallBtnCls}
                  >
                    {s.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <ConfirmButton
                    formAction={deleteSponsor}
                    className={dangerBtnCls}
                    message={`Delete sponsor "${s.name}"?`}
                  >
                    Delete
                  </ConfirmButton>
                </div>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
