// Fetches the most-starred GitHub repos and stores today's snapshot in Supabase.
// Run with `npm run sync`. Needs SUPABASE_URL and SUPABASE_SECRET_KEY;
// GITHUB_TOKEN is optional but raises the search rate limit.
import { createClient } from '@supabase/supabase-js';
import { RANKING_SIZE, RANKING_TABLES } from '../src/constants/rankings.ts';

const PER_PAGE = 100; // RANKING_SIZE can go up to 1,000, the most GitHub search returns
const { items, snapshots, foreignKey } = RANKING_TABLES.repos;

interface SearchRepo {
	id: number;
	full_name: string;
	html_url: string;
	description: string | null;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	owner: { avatar_url: string };
}

const { GITHUB_TOKEN, SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
	throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY must be set');
}

async function fetchTopRepos(): Promise<SearchRepo[]> {
	const repos: SearchRepo[] = [];
	for (let page = 1; repos.length < RANKING_SIZE; page++) {
		const params = new URLSearchParams({
			q: 'stars:>10000',
			sort: 'stars',
			order: 'desc',
			per_page: String(PER_PAGE),
			page: String(page),
		});
		const res = await fetch(`https://api.github.com/search/repositories?${params}`, {
			headers: {
				Accept: 'application/vnd.github+json',
				'X-GitHub-Api-Version': '2026-03-10',
				...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
			},
		});
		if (!res.ok) {
			throw new Error(`GitHub search failed (${res.status}): ${await res.text()}`);
		}
		const body = await res.json();
		// GitHub sets this when the search timed out; a partial ranking would be wrong.
		if (body.incomplete_results) {
			throw new Error('GitHub returned incomplete search results, try again later');
		}
		repos.push(...body.items);
		if (body.items.length < PER_PAGE) break;
	}
	return repos.slice(0, RANKING_SIZE);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
	auth: { persistSession: false },
});

const repos = await fetchTopRepos();
const today = new Date().toISOString().slice(0, 10); // UTC date

const { error: reposError } = await supabase.from(items).upsert(
	repos.map((repo) => ({
		id: repo.id,
		full_name: repo.full_name,
		html_url: repo.html_url,
		description: repo.description,
		language: repo.language,
		owner_avatar_url: repo.owner.avatar_url,
		updated_at: new Date().toISOString(),
	})),
);
if (reposError) throw reposError;

const { error: snapshotsError } = await supabase.from(snapshots).upsert(
	repos.map((repo, i) => ({
		[foreignKey]: repo.id,
		snapshot_date: today,
		rank: i + 1,
		stars: repo.stargazers_count,
		forks: repo.forks_count,
	})),
);
if (snapshotsError) throw snapshotsError;

// If the job runs twice in a day, drop repos that fell out of the ranking since
// the first run so today's ranks stay unique.
const { error: cleanupError } = await supabase
	.from(snapshots)
	.delete()
	.eq('snapshot_date', today)
	.not(foreignKey, 'in', `(${repos.map((repo) => repo.id).join(',')})`);
if (cleanupError) throw cleanupError;

console.log(`Saved ${repos.length} repos for ${today}`);
