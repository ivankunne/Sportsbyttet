-- ============================================================
-- Migration 008: Add missing categories + standardise conditions
-- Run in Supabase SQL Editor
-- ============================================================

-- ── 1. Add missing categories ────────────────────────────────
-- Håndball was used in listing seed data but was never added to
-- the categories table, so it didn't appear in the sell/explore UI.

INSERT INTO categories (name, slug, emoji)
VALUES
  ('Håndball',  'handball',  '🤾'),
  ('Svømming',  'svomming',  '🏊'),
  ('Tennis',    'tennis',    '🎾'),
  ('Basketball','basketball','🏀')
ON CONFLICT (slug) DO NOTHING;

-- ── 2. Standardise condition values ─────────────────────────
-- Old values in seed data: 'Som ny', 'Pent brukt', 'Godt brukt', 'Mye brukt'
-- New standard set:        'Som ny', 'Pent brukt', 'Godt brukt', 'Brukt'

UPDATE listings SET condition = 'Brukt' WHERE condition = 'Mye brukt';
