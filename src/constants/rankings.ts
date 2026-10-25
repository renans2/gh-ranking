// Shared by the site and the sync scripts in scripts/, so keep it free of imports.

/** How many entries each ranking keeps per day. */
export const RANKING_SIZE = 100;

/** Supabase tables and leaderboard view of each ranking (see supabase/migrations/). */
export const RANKING_TABLES = {
	repos: { items: 'repos', snapshots: 'repo_snapshots', foreignKey: 'repo_id', view: 'leaderboard' },
} as const;

/** Query param that filters the repos ranking by language, as in `/?language=Rust`. */
export const LANGUAGE_PARAM = 'language';
