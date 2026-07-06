-- Run this once in the Supabase SQL editor.
-- Tracks whether a user's starter/demo content has already been seeded,
-- so we never re-insert demo cards after you've deleted them for real.
alter table profiles add column if not exists onboarded boolean default false;
