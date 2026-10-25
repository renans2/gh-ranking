# gh-ranking

Daily rankings of GitHub, with rank and count changes since the previous day:

- `/`: a menu with a card for each ranking (a static page, no database query).
- `/repos`: the 100 most-starred repos, filterable by language (`?language=`).
- `/users`: the 100 most-followed users.

How it works:

- `scripts/sync.ts` saves a daily snapshot of each ranking to Supabase. Each ranking lives in
  `scripts/sync/` (repos come from the REST search API, users from the GraphQL API).
- `.github/workflows/sync.yml` runs the sync every day at 00:17 UTC.
- The ranking pages are rendered on every request (on Vercel) from the `leaderboard` and
  `user_leaderboard` views, one Supabase query per page. Each ranking's path, title and
  description live in `RANKING_PAGES` (`src/constants/site.ts`).

## Setup

1. Create a Supabase project and run the files in `supabase/migrations/` in order in the SQL Editor
   (or `supabase db push` with the Supabase CLI).
2. Copy `.env.example` to `.env` and fill in the values from **Project Settings > API Keys**.
   The users ranking needs a `GITHUB_TOKEN` (GitHub's GraphQL API requires one).
3. Take the first snapshot and start the site:

   ```sh
   npm install
   GITHUB_TOKEN=$(gh auth token) npm run sync
   npm run dev
   ```

4. Push to GitHub and add the `SUPABASE_URL` and `SUPABASE_SECRET_KEY` repository secrets
   (**Settings > Secrets and variables > Actions**) so the daily workflow can run.
5. Import the repo in Vercel and add the `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`
   environment variables (**Project Settings > Environment Variables**). Vercel deploys on every push.

Changes appear once there are snapshots from two different days.

## Commands

| Command           | Action                                           |
| :---------------- | :----------------------------------------------- |
| `npm run dev`     | Start the dev server at `localhost:4321`         |
| `npm run sync`    | Save today's snapshots (safe to re-run same day) |
| `npm run build`   | Build for Vercel into `.vercel/output/`          |
