/** Public sitemap: home, blog, and published events. */
import type { MetadataRoute } from 'next';
import { eq } from 'drizzle-orm';
import { db, events, posts } from '@/lib/db';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  try {
    const [eventRows, postRows] = await Promise.all([
      db
        .select({ slug: events.slug, updatedAt: events.updatedAt })
        .from(events)
        .where(eq(events.status, 'published')),
      db
        .select({ slug: posts.slug, updatedAt: posts.updatedAt, publishedAt: posts.publishedAt })
        .from(posts)
        .where(eq(posts.status, 'published')),
    ]);

    return [
      ...staticRoutes,
      ...eventRows.map((e) => ({
        url: `${SITE_URL}/events/${e.slug}`,
        lastModified: e.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      })),
      ...postRows.map((p) => ({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: p.updatedAt ?? p.publishedAt ?? new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
