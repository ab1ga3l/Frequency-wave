'use client';

import { useActionState, useState } from 'react';
import type { Event } from '@/lib/db/schema';
import type { ActionState } from '@/app/admin/actions';
import { slugify, toInputValue } from '@/components/admin/format';
import {
  errorBannerCls,
  inputCls,
  labelCls,
  okBannerCls,
  selectCls,
} from '@/components/admin/ui';

export default function EventForm({
  action,
  event,
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  event?: Event;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const [title, setTitle] = useState(event?.title ?? '');
  const [slug, setSlug] = useState(event?.slug ?? '');
  // Once the admin edits the slug by hand (or the event already exists), stop auto-suggesting.
  const [slugTouched, setSlugTouched] = useState(Boolean(event));

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && <div className={errorBannerCls}>{state.error}</div>}
      {state?.ok && <div className={okBannerCls}>Saved</div>}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ev-title" className={labelCls}>Title *</label>
          <input
            id="ev-title"
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={inputCls}
            placeholder="Wave One: Genesis Night"
          />
        </div>
        <div>
          <label htmlFor="ev-slug" className={labelCls}>Slug *</label>
          <input
            id="ev-slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputCls + ' font-mono'}
            placeholder="wave-one-genesis-night"
          />
        </div>
      </div>

      <div>
        <label htmlFor="ev-tagline" className={labelCls}>Tagline</label>
        <input
          id="ev-tagline"
          name="tagline"
          defaultValue={event?.tagline ?? ''}
          className={inputCls}
          placeholder="Where the culture meets the chain"
        />
      </div>

      <div>
        <label htmlFor="ev-description" className={labelCls}>Description</label>
        <textarea
          id="ev-description"
          name="description"
          rows={5}
          defaultValue={event?.description ?? ''}
          className={inputCls}
          placeholder="What goes down at this event…"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ev-start" className={labelCls}>Starts *</label>
          <input
            id="ev-start"
            name="startAt"
            type="datetime-local"
            required
            defaultValue={toInputValue(event?.startAt)}
            className={inputCls + ' font-mono [color-scheme:dark]'}
          />
        </div>
        <div>
          <label htmlFor="ev-end" className={labelCls}>Ends</label>
          <input
            id="ev-end"
            name="endAt"
            type="datetime-local"
            defaultValue={toInputValue(event?.endAt)}
            className={inputCls + ' font-mono [color-scheme:dark]'}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="ev-venue" className={labelCls}>Venue</label>
          <input
            id="ev-venue"
            name="venue"
            defaultValue={event?.venue ?? ''}
            className={inputCls}
            placeholder="Uhuru Gardens Amphitheatre"
          />
        </div>
        <div>
          <label htmlFor="ev-city" className={labelCls}>City</label>
          <input
            id="ev-city"
            name="city"
            defaultValue={event?.city ?? 'Nairobi'}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="ev-country" className={labelCls}>Country</label>
          <input
            id="ev-country"
            name="country"
            defaultValue={event?.country ?? 'Kenya'}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ev-capacity" className={labelCls}>Capacity</label>
          <input
            id="ev-capacity"
            name="capacity"
            defaultValue={event?.capacity ?? ''}
            className={inputCls}
            placeholder="500 · invite only"
          />
        </div>
        <div>
          <label htmlFor="ev-register" className={labelCls}>Register URL</label>
          <input
            id="ev-register"
            name="registerUrl"
            type="url"
            defaultValue={event?.registerUrl ?? ''}
            className={inputCls + ' font-mono'}
            placeholder="https://lu.ma/…"
          />
        </div>
      </div>

      <div>
        <label htmlFor="ev-cover" className={labelCls}>Cover image URL</label>
        <input
          id="ev-cover"
          name="coverImage"
          type="url"
          defaultValue={event?.coverImage ?? ''}
          className={inputCls + ' font-mono'}
          placeholder="https://…/cover.jpg"
        />
      </div>

      <div>
        <label htmlFor="ev-tags" className={labelCls}>Tags (comma-separated)</label>
        <input
          id="ev-tags"
          name="tags"
          defaultValue={event?.tags.join(', ') ?? ''}
          className={inputCls + ' font-mono'}
          placeholder="web3, music, nairobi"
        />
      </div>

      <div className="flex flex-wrap items-end gap-6">
        <div className="w-44">
          <label htmlFor="ev-status" className={labelCls}>Status</label>
          <select
            id="ev-status"
            name="status"
            defaultValue={event?.status ?? 'draft'}
            className={selectCls + ' font-mono'}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 pb-2.5 font-mono text-xs uppercase tracking-widest text-white/60">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={event?.featured ?? false}
            className="h-4 w-4 accent-[#00f8ff]"
          />
          Featured
        </label>
      </div>

      <div className="pt-2">
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
          {pending ? 'Saving' : submitLabel}
        </button>
      </div>
    </form>
  );
}
