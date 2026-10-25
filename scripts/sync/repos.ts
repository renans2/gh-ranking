import type { SupabaseClient } from '@supabase/supabase-js';
import { RANKING_SIZE, RANKING_TABLES } from '../../src/constants/rankings.ts';
import { githubRest } from './github.ts';
import { saveRanking } from './save-ranking.ts';

const PER_PAGE = 100; // RANKING_SIZE can go up to 1,000, the most GitHub search returns

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

interface SearchResponse {
	incomplete_results: boolean;
	items: SearchRepo[];
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
		const body = await githubRest<SearchResponse>(`/search/repositories?${params}`);
		// GitHub sets this when the search timed out; a partial ranking would be wrong.
		if (body.incomplete_results) {
			throw new Error('GitHub returned incomplete search results, try again later');
		}
		repos.push(...body.items);
		if (body.items.length < PER_PAGE) break;
	}
	return repos.slice(0, RANKING_SIZE);
}

/** The most-starred repos. */
export async function syncRepos(supabase: SupabaseClient) {
	const repos = await fetchTopRepos();
	await saveRanking(
		supabase,
		RANKING_TABLES.repos,
		repos.map((repo) => ({
			item: {
				id: repo.id,
				full_name: repo.full_name,
				html_url: repo.html_url,
				description: repo.description,
				language: repo.language,
				owner_avatar_url: repo.owner.avatar_url,
			},
			stats: { stars: repo.stargazers_count, forks: repo.forks_count },
		})),
	);
}
