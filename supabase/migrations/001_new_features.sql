-- ============================================================
-- Sportsbyttet — Migration 001: New marketplace features
-- Run this in your Supabase project SQL editor
-- ============================================================

-- ── 1. New columns on listings ───────────────────────────────
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS listing_type TEXT NOT NULL DEFAULT 'regular',
  ADD COLUMN IF NOT EXISTS members_only  BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS quantity      INTEGER,
  ADD COLUMN IF NOT EXISTS size_range    TEXT;

-- listing_type values: 'regular' | 'iso' | 'bulk'

-- ── 2. New columns on clubs ──────────────────────────────────
ALTER TABLE clubs
  ADD COLUMN IF NOT EXISTS secondary_color      TEXT,
  ADD COLUMN IF NOT EXISTS is_membership_gated  BOOLEAN NOT NULL DEFAULT false;

-- ── 3. Announcements (club bulletin board) ───────────────────
CREATE TABLE IF NOT EXISTS announcements (
  id          BIGSERIAL PRIMARY KEY,
  club_id     BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'announcement', -- announcement | event | gear
  author_name TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS announcements_club_id_idx ON announcements(club_id);

-- ── 4. Memberships (join requests + gating) ──────────────────
CREATE TABLE IF NOT EXISTS memberships (
  id         BIGSERIAL PRIMARY KEY,
  club_id    BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  profile_id BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status     TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  message    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (club_id, profile_id)
);

CREATE INDEX IF NOT EXISTS memberships_club_id_idx    ON memberships(club_id);
CREATE INDEX IF NOT EXISTS memberships_profile_id_idx ON memberships(profile_id);

-- ── 5. Saved searches / alerts ───────────────────────────────
CREATE TABLE IF NOT EXISTS saved_searches (
  id           BIGSERIAL PRIMARY KEY,
  club_id      BIGINT REFERENCES clubs(id) ON DELETE SET NULL,
  keywords     TEXT,
  category     TEXT,
  max_price    INTEGER,
  size_hint    TEXT,
  notify_email TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS saved_searches_notify_email_idx ON saved_searches(notify_email);

-- ── 6. Supabase Storage bucket for listing images ────────────
-- Run this separately in the Storage section of your Supabase dashboard,
-- or uncomment if using the CLI:
--
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('listing-images', 'listing-images', true)
-- ON CONFLICT (id) DO NOTHING;
--
-- CREATE POLICY "Anyone can upload listing images"
-- ON storage.objects FOR INSERT
-- TO public WITH CHECK (bucket_id = 'listing-images');
--
-- CREATE POLICY "Anyone can view listing images"
-- ON storage.objects FOR SELECT
-- TO public USING (bucket_id = 'listing-images');
