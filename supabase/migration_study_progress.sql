-- Run this once in the Supabase SQL editor.
-- Lets each user set their own program length, instead of the app guessing
-- graduation progress from assignment completion.
alter table profiles add column if not exists study_total_semesters int default 0;
alter table profiles add column if not exists study_completed_semesters int default 0;
