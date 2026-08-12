import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db, posts } from '@/lib/db';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';
import SubscribeCard from '@/components/site/SubscribeCard';
import { renderMarkdown } from '../render-md';

export const dynamic = 'force-dynamic';

const dateFmt = new Intl.DateTimeFormat('en-KE', {
  timeZone: 'Africa/Nairobi',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

async function getPublishedPost(slug: string) {
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, 'published')))
    .limit(1);
  return post;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: 'Post not found — Frequency Wave' };
  return {
    title: `${post.title} — Frequency Wave`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const cover = post.coverImage || '/images/crowd.jpg';

  return (
    <div className="bg-[#040B24] text-white">
      <Nav />

      {/* Hero band */}
      <section
        className="bg-cover bg-center px-5 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-32"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(4,11,36,0.85), #040b24), url(${cover})`,
        }}
      >
        <div className="mx-auto max-w-3xl">
          {post.publishedAt && (
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">
              {dateFmt.format(post.publishedAt)}
            </p>
          )}
          <h1 className="mt-4 font-display text-4xl italic font-semibold leading-tight sm:text-5xl">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="bg-[#040B24] px-5 pb-16 sm:px-6">
        <article className="mx-auto max-w-3xl">
          {renderMarkdown(post.body)}
          <div className="mt-12 border-t border-white/10 pt-8">
            <Link
              href="/blog"
              className="font-mono text-xs uppercase tracking-[0.25em] text-cyan transition-colors hover:text-white"
            >
              &larr; All Posts
            </Link>
          </div>
        </article>
      </section>

      {/* CTA band */}
      <section className="bg-[#10062e] px-5 py-16 text-center sm:px-6 sm:py-20">
        <h2 className="font-display text-4xl font-bold italic sm:text-5xl">
          <span className="text-cyan">Partner</span>{' '}
          <span className="text-white">with the wave</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-white/60">
          Put your brand in front of Africa&apos;s builders, creators and culture
          movers at the next Frequency Wave experience.
        </p>
        <Link
          href="/#contact"
          className="btn-primary mt-8"
        >
          Get in touch
        </Link>
      </section>

      <SubscribeCard />
      <Footer />
    </div>
  );
}
