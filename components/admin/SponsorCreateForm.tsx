'use client';

import { useActionState } from 'react';
import { createSponsor, type ActionState } from '@/app/admin/actions';
import {
  errorBannerCls,
  inputCls,
  labelCls,
  okBannerCls,
  selectCls,
} from '@/components/admin/ui';

const TIERS = ['platinum', 'gold', 'silver', 'bronze', 'partner'] as const;

export default function SponsorCreateForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createSponsor,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <div className={errorBannerCls}>{state.error}</div>}
      {state?.ok && <div className={okBannerCls}>Sponsor added</div>}

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="sp-name" className={labelCls}>Name *</label>
          <input id="sp-name" name="name" required className={inputCls} placeholder="Acme Chain Labs" />
        </div>
        <div>
          <label htmlFor="sp-tier" className={labelCls}>Tier</label>
          <select id="sp-tier" name="tier" defaultValue="partner" className={selectCls + ' font-mono'}>
            {TIERS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sp-sort" className={labelCls}>Sort</label>
          <input id="sp-sort" name="sort" type="number" defaultValue={0} className={inputCls + ' font-mono'} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sp-logo" className={labelCls}>Logo URL</label>
          <input id="sp-logo" name="logoUrl" type="url" className={inputCls + ' font-mono'} placeholder="https://…/logo.svg" />
        </div>
        <div>
          <label htmlFor="sp-web" className={labelCls}>Website</label>
          <input id="sp-web" name="website" type="url" className={inputCls + ' font-mono'} placeholder="https://…" />
        </div>
      </div>

      <div>
        <label htmlFor="sp-blurb" className={labelCls}>Blurb</label>
        <input id="sp-blurb" name="blurb" className={inputCls} placeholder="One-liner about the sponsor" />
      </div>

      <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
        {pending ? 'Adding' : 'Add Sponsor'}
      </button>
    </form>
  );
}
