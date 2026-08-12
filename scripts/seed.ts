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
  const [meetGreet] = await db
    .insert(events)
    .values({
      slug: 'the-wave-meet-and-greet',
      title: 'The Wave Meet & Greet',
      tagline: 'Scouting. Connecting. Building.',
      description:
        'An intimate, curated gathering of Web3 projects, investors, VCs, and cultural innovators. 50–70 attendees. Scouting. Connecting. Building.',
      startAt: new Date('2025-03-28T17:00:00+03:00'),
      venue: 'Blockchain Centre',
      city: 'Nairobi',
      country: 'Kenya',
      capacity: '50–70 curated attendees',
      registerUrl: 'https://lu.ma/p03wsfdo',
      tags: ['Web3', 'Networking', 'Invite Only'],
      status: 'published',
      featured: false,
    })
    .returning();

  await db.insert(agendaItems).values([
    { eventId: meetGreet.id, timeLabel: '5:00 PM', title: 'Doors & Check-In', description: 'Arrivals, badges, and first connections.', sort: 0 },
    { eventId: meetGreet.id, timeLabel: '5:30 PM', title: 'Founder Introductions', description: 'Web3 projects and builders introduce what they are shipping.', sort: 1 },
    { eventId: meetGreet.id, timeLabel: '6:30 PM', title: 'Investor & VC Mixer', description: 'Curated networking between projects and capital.', sort: 2 },
    { eventId: meetGreet.id, timeLabel: '8:00 PM', title: 'The Wave Social', description: 'Music, culture, and conversations that outlast the agenda.', sort: 3 },
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

  console.log('Seeded: 1 published past event + 3 draft concepts.');
  await sql.end();
}

main().catch(async (err) => {
  console.error(err);
  await sql.end();
  process.exit(1);
});
