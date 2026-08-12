import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db, posts } from '@/lib/db';
import { updatePost } from '@/app/admin/actions';
import PostForm from '@/components/admin/PostForm';
import { cardCls, headingCls, microLabelCls, okBannerCls } from '@/components/admin/ui';

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;

  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!post) notFound();

  const update = updatePost.bind(null, post.id);

  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/admin/blog"
          className="font-mono text-xs uppercase tracking-widest text-white/45 hover:text-cyan"
        >
          Back to Blog
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={microLabelCls}>Edit Post</p>
            <h1 className={headingCls}>{post.title}</h1>
            <p className="mt-1 font-mono text-xs text-white/40">/blog/{post.slug}</p>
          </div>
          {post.status === 'published' && (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="rounded-full border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-widest text-white/70 transition-colors hover:border-cyan/50 hover:text-cyan"
            >
              View Live
            </Link>
          )}
        </div>
      </header>

      {created && <div className={okBannerCls}>Post created — keep editing below.</div>}

      <section className={`${cardCls} p-6 sm:p-8`}>
        <PostForm action={update} post={post} submitLabel="Save Changes" />
      </section>
    </div>
  );
}
