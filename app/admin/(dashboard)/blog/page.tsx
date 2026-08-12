import Link from 'next/link';
import { desc } from 'drizzle-orm';
import { db, posts } from '@/lib/db';
import { deletePost, setPostStatus } from '@/app/admin/actions';
import ConfirmButton from '@/components/admin/ConfirmButton';
import {
  cardCls,
  dangerBtnCls,
  microLabelCls,
  smallBtnCls,
  tagCls,
  tagCyan,
  tagGold,
} from '@/components/admin/ui';
import { fmtDateTime, fmtShort } from '@/components/admin/format';

export default async function BlogAdminPage() {
  const rows = await db.select().from(posts).orderBy(desc(posts.updatedAt));

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={microLabelCls}>Blog</p>
          <h1 className="mt-2 font-display text-2xl uppercase tracking-wide sm:text-3xl">
            <span className="font-extrabold text-cyan">Transmission</span>{' '}
            <span className="font-light text-white">Log</span>{' '}
            <span className="font-mono text-lg text-white/40">({rows.length})</span>
          </h1>
        </div>
        <Link href="/admin/blog/new" className="btn-primary text-sm">
          New Post
        </Link>
      </header>

      <div className={`${cardCls} overflow-x-auto`}>
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-white/40">
              <th className="px-5 py-3.5">Post</th>
              <th className="px-3 py-3.5">Status</th>
              <th className="px-3 py-3.5">Published (EAT)</th>
              <th className="px-3 py-3.5">Updated</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-white/50">
                  No posts yet.{' '}
                  <Link href="/admin/blog/new" className="text-cyan underline">
                    Write the first transmission
                  </Link>
                  .
                </td>
              </tr>
            )}
            {rows.map((post) => (
              <tr key={post.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="font-semibold text-white hover:text-cyan"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-0.5 font-mono text-[11px] text-white/35">/{post.slug}</p>
                </td>
                <td className="px-3 py-4">
                  <span
                    className={`${tagCls} ${post.status === 'published' ? tagCyan : tagGold}`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 font-mono text-xs text-white/70">
                  {post.publishedAt ? fmtDateTime(post.publishedAt) : '—'}
                </td>
                <td className="whitespace-nowrap px-3 py-4 font-mono text-xs text-white/50">
                  {fmtShort(post.updatedAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/blog/${post.id}`} className={smallBtnCls}>
                      Edit
                    </Link>
                    <form action={setPostStatus}>
                      <input type="hidden" name="id" value={post.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={post.status === 'published' ? 'draft' : 'published'}
                      />
                      <button type="submit" className={smallBtnCls}>
                        {post.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                    </form>
                    <form action={deletePost}>
                      <input type="hidden" name="id" value={post.id} />
                      <ConfirmButton
                        className={dangerBtnCls}
                        message={`Delete "${post.title}"? This cannot be undone.`}
                      >
                        Delete
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
