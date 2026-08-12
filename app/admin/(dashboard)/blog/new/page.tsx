import Link from 'next/link';
import { createPost } from '@/app/admin/actions';
import PostForm from '@/components/admin/PostForm';
import { cardCls, microLabelCls } from '@/components/admin/ui';

export default function NewPostPage() {
  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/admin/blog"
          className="font-mono text-xs uppercase tracking-widest text-white/45 hover:text-cyan"
        >
          Back to Blog
        </Link>
        <p className={`${microLabelCls} mt-4`}>New Post</p>
        <h1 className="mt-2 font-display text-2xl uppercase tracking-wide sm:text-3xl">
          <span className="font-extrabold text-cyan">New</span>{' '}
          <span className="font-light text-white">Transmission</span>
        </h1>
      </header>

      <div className={`${cardCls} p-6 sm:p-8`}>
        <PostForm action={createPost} submitLabel="Create Post" />
      </div>
    </div>
  );
}
