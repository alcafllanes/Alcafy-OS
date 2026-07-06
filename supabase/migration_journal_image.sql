-- Run this once in the Supabase SQL editor.
alter table journal_entries add column if not exists image_url text;
