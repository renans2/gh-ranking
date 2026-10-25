import type { SupabaseClient } from '@supabase/supabase-js';
import { RANKING_SIZE, RANKING_TABLES } from '../../src/constants/rankings.ts';
import { githubGraphql } from './github.ts';
import { saveRanking } from './save-ranking.ts';

// The REST user search doesn't return follower counts, so use GraphQL: one request
// gets the top users with their counts. `type:user` leaves out organizations.
// One GraphQL search page holds at most 100 results, so RANKING_SIZE can't exceed 100 here.
const QUERY = `
	query {
		search(type: USER, query: "type:user followers:>10000 sort:followers-desc", first: ${RANKING_SIZE}) {
			nodes {
				... on User {
					databaseId
					login
					name
					url
					avatarUrl
					location
					followers { totalCount }
				}
			}
		}
	}
`;

interface SearchUser {
	databaseId: number;
	login: string;
	name: string | null;
	url: string;
	avatarUrl: string;
	location: string | null;
	followers: { totalCount: number };
}

/** The most-followed users. */
export async function syncUsers(supabase: SupabaseClient) {
	const data = await githubGraphql<{ search: { nodes: SearchUser[] } }>(QUERY);
	const users = data.search.nodes;
	if (users.length < RANKING_SIZE) {
		throw new Error(`GitHub returned only ${users.length} users, expected ${RANKING_SIZE}`);
	}
	await saveRanking(
		supabase,
		RANKING_TABLES.users,
		users.map((user) => ({
			item: {
				id: user.databaseId,
				login: user.login,
				name: user.name,
				html_url: user.url,
				avatar_url: user.avatarUrl,
				// GitHub returns an empty string when the location isn't set.
				location: user.location || null,
			},
			stats: { followers: user.followers.totalCount },
		})),
	);
}
