/**
 * Seed the frequency_wave database with real + draft events.
 * Run: pnpm db:seed
 */
import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { events, agendaItems } from '../lib/db/schema';

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(sql);

async function main() {
  const existing = await db.select({ slug: events.slug }).from(events);
  if (existing.length > 0) {
    console.log(`Database already has ${existing.length} event(s) — skipping seed.`);
    await sql.end();
    return;
  }

  // ── Real past event ──
  const [waveSocial] = await db
    .insert(events)
    .values({
      slug: 'the-wave-social',
      title: 'The Wave Social',
      tagline: 'Play. Connect. Catch the wave.',
      description:
        'An evening of board games, Jenga, darts, card games, music, culture, DJs, and community. Join Frequency Wave at Jenga Jungle Restaurant for The Wave Social.',
      startAt: new Date('2026-10-10T16:00:00+03:00'),
      venue: 'Jenga Jungle Restaurant',
      city: 'Nairobi',
      country: 'Kenya',
      capacity: 'Limited capacity',
      registerUrl: 'https://apps.little.africa/events/324',
      coverImage: '/images/homepage.jpeg',
      tags: ['Social', 'Games', 'Music', 'Culture', 'DJs'],
      status: 'published',
      featured: true,
    })
    .returning();

  await db.insert(agendaItems).values([
    { eventId: waveSocial.id, timeLabel: '4:00 PM', title: 'Doors Open', description: 'Arrive, connect, and settle into the Jenga Jungle.', sort: 0 },
    { eventId: waveSocial.id, timeLabel: '4:00 PM', title: 'Games Available', description: 'Board games, Jenga, darts, card games, and more.', sort: 1 },
    { eventId: waveSocial.id, timeLabel: 'Till late', title: 'Music, Culture & DJs', description: 'Catch the wave with music, community, and DJs.', sort: 2 },
  ]);

  // ── Draft concepts (dashboard-only until published with real dates) ──
  await db.insert(events).values([
    {
      slug: 'frequency-summit',
      title: 'Frequency Summit',
      tagline: 'Africa’s flagship Web3 × culture summit.',
      description:
        'A full-day summit where blockchain panels sit beside DJ battles — keynotes, workshops, live demos, and pure energy. Draft concept: set the date, venue and lineup, then publish.',
      startAt: new Date('2026-11-20T09:00:00+03:00'),
      venue: 'TBA',
      city: 'Nairobi',
      country: 'Kenya',
      tags: ['Summit', 'Web3', 'Music'],
      status: 'draft',
    },
    {
      slug: 'tech-x-sound',
      title: 'Tech x Sound',
      tagline: 'Where builders drop code and DJs drop beats.',
      description:
        'An evening experience blending live tech showcases with performances from African artists and DJs. Draft concept: set the date, venue and lineup, then publish.',
      startAt: new Date('2026-12-11T18:00:00+03:00'),
      venue: 'TBA',
      city: 'Nairobi',
      country: 'Kenya',
      tags: ['Music', 'Showcase', 'Nightlife'],
      status: 'draft',
    },
    {
      slug: 'africa-web3-tour',
      title: 'Africa Web3 Tour',
      tagline: 'One movement. Many cities.',
      description:
        'A multi-city tour taking the Frequency Wave experience across Africa — Nairobi, Lagos, Accra, Kigali and beyond. Draft concept: set the dates and cities, then publish.',
      startAt: new Date('2027-02-05T10:00:00+03:00'),
      venue: 'Multiple venues',
      city: 'Pan-African',
      country: '',
      tags: ['Tour', 'Community', 'Web3'],
      status: 'draft',
    },
  ]);

  console.log('Seeded: 1 published upcoming event + 3 draft concepts.');
  await sql.end();
}

main().catch(async (err) => {
  console.error(err);
  await sql.end();
  process.exit(1);
});
