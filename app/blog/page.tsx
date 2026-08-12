import type { Metadata } from 'next';
import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { db, posts } from '@/lib/db';
import Nav from '@/components/site/Nav';
import Footer from '@/components/site/Footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The Frequency — Frequency Wave Blog',
  description:
    "Stories from Africa's tech × culture frontier — announcements, recaps and signals from the Frequency Wave crew.",
};

const dateFmt = new Intl.DateTimeFormat('en-KE', {
  timeZone: 'Africa/Nairobi',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export default async function BlogPage() {
  let rows: (typeof posts.$inferSelect)[] = [];
  try {
    rows = await db
      .select()
      .from(posts)
      .where(eq(posts.status, 'published'))
      .orderBy(desc(posts.publishedAt));
  } catch {
    rows = [];
  }

  return (
    <div className="bg-[#040B24] text-white">
      <Nav />

      {/* Heading band */}
      <section className="relative overflow-hidden bg-[#040B24] px-5 pb-16 pt-20 text-center sm:px-6 sm:pt-24">
        <div className="relative z-10">
        <h1 className="font-display text-5xl font-bold italic sm:text-6xl">
          <span className="text-cyan">The</span>{' '}
          <span className="text-white">Frequency</span>
        </h1>
        <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.25em] text-white/40 sm:text-xs">
          Stories from Africa&apos;s tech &times; culture frontier
        </p>
        </div>
      </section>

      {/* Post grid */}
      <section className="bg-[#10062e] px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          {rows.length === 0 ? (
            <p className="py-16 text-center text-sm text-white/60">
              First transmission loading — check back soon.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rows.map((post) => (
                <article key={post.id} className="flex flex-col border border-white/10 bg-[#040B24]">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div
                      className="aspect-video w-full border-b border-white/10 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${post.coverImage || '/images/crowd.jpg'})`,
                      }}
                      role="img"
                      aria-label={post.title}
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    {post.publishedAt && (
                      <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">
                        {dateFmt.format(post.publishedAt)}
                      </p>
                    )}
                    <h2 className="mt-3 font-display text-2xl italic font-semibold leading-snug text-white">
                      <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-cyan">
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && (
                      <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-white/50">
                        {post.excerpt}
                      </p>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-auto pt-5 font-mono text-xs uppercase tracking-[0.25em] text-cyan transition-colors hover:text-white"
                    >
                      Read &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
