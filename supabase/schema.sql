-- Alcafy database schema
-- Run this in the Supabase SQL editor (or via `supabase db push` with migrations).
-- Every table is scoped to auth.uid() via Row Level Security.

-- ─────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  title text,
  location text,
  bio text,
  avatar_url text,
  banner_url text,
  dark_mode boolean default false,
  notifications_enabled boolean default true,
  is_private boolean default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users manage own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- ─────────────────────────────────────────────
-- HOME WIDGETS (draggable "+" image cards on Home grid)
-- ─────────────────────────────────────────────
create table if not exists home_widgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_url text not null,
  pos_x int default 0,
  pos_y int default 0,
  created_at timestamptz default now()
);

alter table home_widgets enable row level security;
create policy "Users manage own home widgets" on home_widgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- GOALS
-- ─────────────────────────────────────────────
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  note text,
  image_url text,
  target_date date,
  progress int default 0,
  created_at timestamptz default now()
);

alter table goals enable row level security;
create policy "Users manage own goals" on goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- WORKSPACE (kanban tasks by client/project)
-- ─────────────────────────────────────────────
create table if not exists workspace_statuses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  position int default 0
);

create table if not exists workspace_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status_id uuid references workspace_statuses(id) on delete set null,
  title text not null,
  client text,
  due_date date,
  urgency text default 'normal', -- low | normal | high | urgent
  description text,
  position int default 0,
  created_at timestamptz default now()
);

alter table workspace_statuses enable row level security;
alter table workspace_tasks enable row level security;
create policy "Users manage own workspace statuses" on workspace_statuses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own workspace tasks" on workspace_tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- FINANCE
-- ─────────────────────────────────────────────
create table if not exists finance_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null, -- income | expense | saving | debt | tuition | bill | weekly_budget
  label text not null,
  amount numeric(12,2) not null,
  month date not null, -- first-of-month, used for month-selector grouping
  target_amount numeric(12,2), -- for savings/debt goal tracking
  created_at timestamptz default now()
);

alter table finance_entries enable row level security;
create policy "Users manage own finance entries" on finance_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- STUDY HUB
-- ─────────────────────────────────────────────
create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  semesters_remaining int,
  created_at timestamptz default now()
);

create table if not exists subject_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references subjects(id) on delete cascade,
  kind text not null, -- assignment | exam
  title text not null,
  due_date date,
  done boolean default false
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  provider text,
  status text default 'in_progress', -- not_started | in_progress | done
  progress int default 0
);

alter table subjects enable row level security;
alter table subject_items enable row level security;
alter table certifications enable row level security;
create policy "Users manage own subjects" on subjects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own subject items" on subject_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own certifications" on certifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- JOURNAL
-- ─────────────────────────────────────────────
create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mood text not null, -- e.g. great | good | okay | low | rough
  body text not null,
  entry_date date not null default current_date,
  created_at timestamptz default now()
);

alter table journal_entries enable row level security;
create policy "Users manage own journal entries" on journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- CONTENT
-- ─────────────────────────────────────────────
create table if not exists content_statuses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  position int default 0
);

create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status_id uuid references content_statuses(id) on delete set null,
  title text not null,
  platform text,
  post_date date,
  notes text,
  thumbnail_url text,
  position int default 0,
  created_at timestamptz default now()
);

alter table content_statuses enable row level security;
alter table content_items enable row level security;
create policy "Users manage own content statuses" on content_statuses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own content items" on content_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- TRAVEL
-- ─────────────────────────────────────────────
create table if not exists travel_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  image_url text,
  notes text,
  visited boolean default false,
  created_at timestamptz default now()
);

alter table travel_places enable row level security;
create policy "Users manage own travel places" on travel_places
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- STORAGE BUCKETS
-- Create these in the Supabase dashboard (Storage → New bucket), public read:
--   avatars, banners, goal-images, content-thumbnails, home-images
-- Then add policies so each user can only write to a folder under their own uid,
-- e.g. for the "avatars" bucket:
-- ─────────────────────────────────────────────
-- create policy "Users upload own avatar"
--   on storage.objects for insert
--   with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
-- create policy "Anyone can view avatars"
--   on storage.objects for select using (bucket_id = 'avatars');
