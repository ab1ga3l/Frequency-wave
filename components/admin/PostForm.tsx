'use client';

import { useActionState, useState } from 'react';
import type { Post } from '@/lib/db/schema';
import type { ActionState } from '@/app/admin/actions';
import { slugify, toInputValue } from '@/components/admin/format';
import {
  errorBannerCls,
  inputCls,
  labelCls,
  okBannerCls,
  selectCls,
} from '@/components/admin/ui';

const IMAGE_HINTS = [
  '/images/baobab.jpg',
  '/images/builders.jpg',
  '/images/crowd.jpg',
  '/images/dj.jpg',
  '/images/dj2.jpg',
  '/images/train.jpg',
];

export default function PostForm({
  action,
  post,
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  post?: Post;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  // Once the admin edits the slug by hand (or the post already exists), stop auto-suggesting.
  const [slugTouched, setSlugTouched] = useState(Boolean(post));

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && <div className={errorBannerCls}>{state.error}</div>}
      {state?.ok && <div className={okBannerCls}>Saved</div>}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="post-title" className={labelCls}>Title *</label>
          <input
            id="post-title"
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={inputCls}
            placeholder="Frequency Wave Rides ETHSafari 2026"
          />
        </div>
        <div>
          <label htmlFor="post-slug" className={labelCls}>Slug *</label>
          <input
            id="post-slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputCls + ' font-mono'}
            placeholder="frequency-wave-rides-ethsafari-2026"
          />
        </div>
      </div>

      <div>
        <label htmlFor="post-excerpt" className={labelCls}>Excerpt</label>
        <textarea
          id="post-excerpt"
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt ?? ''}
          className={inputCls}
          placeholder="One or two sentences shown on the blog grid and in metadata."
        />
      </div>

      <div>
        <label htmlFor="post-body" className={labelCls}>Body (Markdown)</label>
        <textarea
          id="post-body"
          name="body"
          rows={18}
          defaultValue={post?.body ?? ''}
          className={inputCls + ' min-h-[400px] font-mono text-xs leading-relaxed'}
          placeholder={'## Heading\n\nParagraph text with **bold**, *italic* and [links](https://example.com).\n\n- List item'}
        />
      </div>

      <div>
        <label htmlFor="post-cover" className={labelCls}>Cover image URL</label>
        <input
          id="post-cover"
          name="coverImage"
          defaultValue={post?.coverImage ?? ''}
          className={inputCls + ' font-mono'}
          placeholder="/images/baobab.jpg"
        />
        <p className="mt-1.5 font-mono text-[10px] tracking-wide text-white/30">
          On-site images: {IMAGE_HINTS.join(' ')}
        </p>
      </div>

      <div>
        <label htmlFor="post-tags" className={labelCls}>Tags (comma-separated)</label>
        <input
          id="post-tags"
          name="tags"
          defaultValue={post?.tags.join(', ') ?? ''}
          className={inputCls + ' font-mono'}
          placeholder="ETHSafari, Web3, Announcement"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="post-status" className={labelCls}>Status</label>
          <select
            id="post-status"
            name="status"
            defaultValue={post?.status ?? 'draft'}
            className={selectCls + ' font-mono'}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </div>
        <div>
          <label htmlFor="post-published-at" className={labelCls}>
            Published at (defaults to now on first publish)
          </label>
          <input
            id="post-published-at"
            name="publishedAt"
            type="datetime-local"
            defaultValue={toInputValue(post?.publishedAt)}
            className={inputCls + ' font-mono [color-scheme:dark]'}
          />
        </div>
      </div>

      <div className="pt-2">
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
          {pending ? 'Saving' : submitLabel}
        </button>
      </div>
    </form>
  );
}
