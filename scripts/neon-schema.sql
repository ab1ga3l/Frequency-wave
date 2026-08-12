-- Apply Frequency Wave schema to Neon. Not a migration history file.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE sponsor_tier AS ENUM ('platinum', 'gold', 'silver', 'bronze', 'partner');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE post_status AS ENUM ('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  tagline text,
  description text NOT NULL DEFAULT '',
  start_at timestamptz NOT NULL,
  end_at timestamptz,
  venue text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT 'Nairobi',
  country text NOT NULL DEFAULT 'Kenya',
  capacity text,
  register_url text,
  cover_image text,
  tags text[] NOT NULL DEFAULT '{}',
  status event_status NOT NULL DEFAULT 'draft',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agenda_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  time_label text NOT NULL,
  title text NOT NULL,
  description text,
  host text,
  sort integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ticket_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  price_label text NOT NULL DEFAULT 'Free',
  description text,
  perks text[] NOT NULL DEFAULT '{}',
  url text,
  sold_out boolean NOT NULL DEFAULT false,
  sort integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tier sponsor_tier NOT NULL DEFAULT 'partner',
  logo_url text,
  website text,
  blurb text,
  active boolean NOT NULL DEFAULT true,
  sort integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT 'Other',
  body text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  cover_image text,
  tags text[] NOT NULL DEFAULT '{}',
  status post_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL UNIQUE,
  external_id text,
  mode text NOT NULL DEFAULT 'text',
  status text NOT NULL DEFAULT 'active',
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
