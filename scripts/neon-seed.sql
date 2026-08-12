-- Seed Frequency Wave events. Safe to re-run (slug unique).
INSERT INTO events (
  slug, title, tagline, description, start_at, end_at, venue, city, country,
  capacity, register_url, cover_image, tags, status, featured
) VALUES
(
  'the-wave-meet-and-greet',
  'The Wave Meet & Greet',
  'Scouting. Connecting. Building.',
  'An intimate, curated gathering of Web3 projects, investors, VCs, and cultural innovators. 50–70 attendees. Scouting. Connecting. Building.',
  '2025-03-28T17:00:00+03:00',
  NULL,
  'Blockchain Centre',
  'Nairobi',
  'Kenya',
  '50–70 curated attendees',
  'https://lu.ma/p03wsfdo',
  NULL,
  ARRAY['Web3','Networking','Invite Only'],
  'published',
  false
),
(
  'ethsafari-2026',
  'Frequency Wave Unplugged',
  'Where Web3 Meets Music & Culture.',
  E'Awaken the Frequency — Frequency Wave''s ETHSafari 2026 activation.\nNairobi to Kilifi. Hackathon, The Blocktrain, and Beneath the Baobabs.',
  '2026-09-11T18:00:00+03:00',
  '2026-09-12T02:00:00+03:00',
  'Kilifi',
  'Kilifi',
  'Kenya',
  'Limited capacity / RSVP required',
  'https://luma.com/4bval6lt',
  '/images/unplugged-poster.jpg',
  ARRAY['ETHSafari','Unplugged','Music','Web3'],
  'published',
  true
),
(
  'frequency-summit',
  'Frequency Summit',
  'Africa’s flagship Web3 × culture summit.',
  'A full-day summit where blockchain panels sit beside DJ battles — keynotes, workshops, live demos, and pure energy. Draft concept: set the date, venue and lineup, then publish.',
  '2026-11-20T09:00:00+03:00',
  NULL,
  'TBA',
  'Nairobi',
  'Kenya',
  NULL,
  NULL,
  NULL,
  ARRAY['Summit','Web3','Music'],
  'draft',
  false
),
(
  'tech-x-sound',
  'Tech x Sound',
  'Where builders drop code and DJs drop beats.',
  'An evening experience blending live tech showcases with performances from African artists and DJs. Draft concept: set the date, venue and lineup, then publish.',
  '2026-12-11T18:00:00+03:00',
  NULL,
  'TBA',
  'Nairobi',
  'Kenya',
  NULL,
  NULL,
  NULL,
  ARRAY['Music','Showcase','Nightlife'],
  'draft',
  false
),
(
  'africa-web3-tour',
  'Africa Web3 Tour',
  'One movement. Many cities.',
  'A multi-city tour taking the Frequency Wave experience across Africa — Nairobi, Lagos, Accra, Kigali and beyond. Draft concept: set the dates and cities, then publish.',
  '2027-02-05T10:00:00+03:00',
  NULL,
  'Multiple venues',
  'Pan-African',
  '',
  NULL,
  NULL,
  NULL,
  ARRAY['Tour','Community','Web3'],
  'draft',
  false
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO agenda_items (event_id, time_label, title, description, sort)
SELECT e.id, a.time_label, a.title, a.description, a.sort
FROM events e
JOIN (VALUES
  ('the-wave-meet-and-greet', '5:00 PM', 'Doors & Check-In', 'Arrivals, badges, and first connections.', 0),
  ('the-wave-meet-and-greet', '5:30 PM', 'Founder Introductions', 'Web3 projects and builders introduce what they are shipping.', 1),
  ('the-wave-meet-and-greet', '6:30 PM', 'Investor & VC Mixer', 'Curated networking between projects and capital.', 2),
  ('the-wave-meet-and-greet', '8:00 PM', 'The Wave Social', 'Music, culture, and conversations that outlast the agenda.', 3),
  ('ethsafari-2026', '6:00 PM', 'Doors', 'Kilifi check-in. Limited capacity.', 0),
  ('ethsafari-2026', '7:00 PM', 'Unplugged', 'Where Web3 meets music and culture. Till late.', 1)
) AS a(slug, time_label, title, description, sort)
  ON e.slug = a.slug
WHERE NOT EXISTS (
  SELECT 1 FROM agenda_items ai WHERE ai.event_id = e.id AND ai.title = a.title
);

UPDATE events
SET register_url = 'https://luma.com/4bval6lt'
WHERE slug = 'ethsafari-2026';
