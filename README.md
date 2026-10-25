# GitHub Star Ranking

A table of the most-starred GitHub repos, with rank and star changes since the previous day.

- `scripts/sync.ts` fetches the top 100 repos from the GitHub search API and saves a daily snapshot to Supabase.
- `.github/workflows/sync.yml` runs the sync every day at 00:17 UTC.
- `src/pages/index.astro` reads the `leaderboard` view and renders the table.

## Setup

1. Create a Supabase project and run `supabase/migrations/20261025000000_init.sql` in the SQL Editor
   (or `supabase db push` with the Supabase CLI).
2. Copy `.env.example` to `.env` and fill in the values from **Project Settings > API Keys**.
3. Take the first snapshot and start the site:

   ```sh
   npm install
   GITHUB_TOKEN=$(gh auth token) npm run sync
   npm run dev
   ```

4. Push to GitHub and add the `SUPABASE_URL` and `SUPABASE_SECRET_KEY` repository secrets
   (**Settings > Secrets and variables > Actions**) so the daily workflow can run.

Changes appear once there are snapshots from two different days.

## Commands

| Command           | Action                                          |
| :---------------- | :---------------------------------------------- |
| `npm run dev`     | Start the dev server at `localhost:4321`        |
| `npm run sync`    | Save today's snapshot (safe to re-run same day) |
| `npm run build`   | Build the site to `./dist/`                     |
| `npm run preview` | Preview the build locally                       |
