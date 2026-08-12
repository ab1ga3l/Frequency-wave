import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const eventStatusEnum = pgEnum('event_status', [
  'draft',
  'published',
  'cancelled',
]);

export const sponsorTierEnum = pgEnum('sponsor_tier', [
  'platinum',
  'gold',
  'silver',
  'bronze',
  'partner',
]);

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  tagline: text('tagline'),
  description: text('description').notNull().default(''),
  startAt: timestamp('start_at', { withTimezone: true }).notNull(),
  endAt: timestamp('end_at', { withTimezone: true }),
  venue: text('venue').notNull().default(''),
  city: text('city').notNull().default('Nairobi'),
  country: text('country').notNull().default('Kenya'),
  capacity: text('capacity'),
  registerUrl: text('register_url'),
  coverImage: text('cover_image'),
  tags: text('tags').array().notNull().default([]),
  status: eventStatusEnum('status').notNull().default('draft'),
  featured: boolean('featured').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const agendaItems = pgTable('agenda_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  timeLabel: text('time_label').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  host: text('host'),
  sort: integer('sort').notNull().default(0),
});

export const ticketTiers = pgTable('ticket_tiers', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  priceLabel: text('price_label').notNull().default('Free'),
  description: text('description'),
  perks: text('perks').array().notNull().default([]),
  url: text('url'),
  soldOut: boolean('sold_out').notNull().default(false),
  sort: integer('sort').notNull().default(0),
});

export const sponsors = pgTable('sponsors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  tier: sponsorTierEnum('tier').notNull().default('partner'),
  logoUrl: text('logo_url'),
  website: text('website'),
  blurb: text('blurb'),
  active: boolean('active').notNull().default(true),
  sort: integer('sort').notNull().default(0),
});

export const subscribers = pgTable('subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull().default('Other'),
  body: text('body').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type AiTranscriptMessage = {
  role: 'user' | 'agent';
  text: string;
  timestamp: string;
};

export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  visitorId: text('visitor_id').notNull().unique(),
  externalId: text('external_id'),
  mode: text('mode').notNull().default('text'),
  status: text('status').notNull().default('active'),
  messages: jsonb('messages')
    .$type<AiTranscriptMessage[]>()
    .notNull()
    .default([]),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type AiConversation = typeof aiConversations.$inferSelect;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type AgendaItem = typeof agendaItems.$inferSelect;
export type TicketTier = typeof ticketTiers.$inferSelect;
export type Sponsor = typeof sponsors.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
export type Message = typeof messages.$inferSelect;
