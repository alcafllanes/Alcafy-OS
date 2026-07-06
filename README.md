# Alcafy

Your life, organized. A personal hub for finances, goals, work, study, journaling, content, and travel ,  built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase.

## Status

This is a working scaffold: full routing, design system, auth flow, page shells, and Supabase wiring for every module are in place. Tables that have no data yet show realistic placeholder content so every page looks complete from the start ,  the moment real rows exist, the placeholders are replaced automatically.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run everything in `supabase/schema.sql`. This creates all tables and Row Level Security policies, scoped to `auth.uid()`.
3. Go to **Storage** and create these buckets (mark each **public** for read access):
   - `avatars`
   - `banners`
   - `goal-images`
   - `content-thumbnails`
   - `home-images`
4. For each bucket, add a storage policy so users can only upload into a folder named after their own user id ,  see the commented example at the bottom of `supabase/schema.sql`.
5. Copy your **Project URL** and **anon public key** from Settings → API.

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in the two Supabase values. `.env.local` is gitignored ,  never commit real keys.

## 3. Install and run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` ,  you'll land on the sign-up page first.

## 4. Deploy

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the same two environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
4. Deploy.

## Project structure

```
src/
  app/
    (auth)/auth/signin, signup     ,  centered logo + tagline shell, no sidebar
    (app)/                         ,  everything behind the sidebar, auth-gated
      home/ goals/ workspace/ finance/ study-hub/
      journal/ content/ travel/ settings/ profile/
    globals.css                    ,  glass utilities, gradient tokens, dark mode
  components/                      ,  Sidebar, MobileNav, KanbanBoard, ProgressRing, etc.
  lib/supabase/                    ,  browser + server Supabase clients
  middleware.ts                    ,  session refresh + auth route gating
supabase/schema.sql                ,  full DB schema + RLS policies
```

## Design system notes

- Palette (`tailwind.config.ts`): `#F4C5D7`, `#E981A4` (primary), `#F9ADB7`, `#FEC9C3`, `#FAF2DD`, used for text/icons/borders. Card and button fills always use the blended `bg-alc-gradient*` utilities, never a flat accent color.
- Glassmorphism lives in `.glass-card` / `.glass-panel` in `globals.css`, with soft floating shadows and decorative blurred color blobs behind the app shell.
- Buttons using `.btn-gradient` have a soft blob hover effect built in.
- Icons: [Phosphor Icons](https://phosphoricons.com), `weight="bold"` everywhere, per spec.
- `public/brand/bear-auth.png` is the mascot peeking over the Sign in / Sign up card.
- `public/moods/*.png` are the custom mood icons used in the Journal mood picker (happy, surprised, sleepy, sad, angry).
- Dark mode: toggled from Settings, persisted to `localStorage` and the user's `profiles.dark_mode` row. Per your decision, dark mode overrides the base page background too, not just cards, see the `html.dark` rules in `globals.css`.

## What's editable, addable, and removable

Goals, Travel, Workspace, Content, Study Hub certifications, Finance line items, and Journal entries all follow the same interaction pattern: click a card to open an edit popup, hover a card to reveal a small circular x for removing it, and use the "+" / "Add" buttons to create new ones. Workspace and Content columns can be renamed (pencil icon) or removed (trash icon) right from the column header, and you can add new columns from the board.

## What's next

- Swap the placeholder "A" wordmark in `Sidebar.tsx` / `(auth)/layout.tsx` for your real logo.
- Wire up the remaining "Add" buttons on Goals/Travel to real insert calls (the pattern is already established in Journal, Profile, and the Kanban boards).
- Add a month-selector on Finance once you have more than one month of real data to compare.
