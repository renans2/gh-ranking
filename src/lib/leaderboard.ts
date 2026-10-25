import { RANKING_TABLES } from '../constants/rankings';
import { supabase } from './supabase';

/** Fields every leaderboard view has. */
interface RankedRow {
	rank: number;
	id: number;
	snapshot_date: string;
	previous_date: string | null;
	rank_change: number | null;
}

export interface LeaderboardRow extends RankedRow {
	full_name: string;
	html_url: string;
	description: string | null;
	language: string | null;
	owner_avatar_url: string | null;
	stars: number;
	forks: number;
	stars_change: number | null;
}

export interface UserLeaderboardRow extends RankedRow {
	login: string;
	name: string | null;
	html_url: string;
	avatar_url: string | null;
	location: string | null;
	followers: number;
	followers_change: number | null;
}

async function getView<Row>(view: string): Promise<Row[]> {
	const { data, error } = await supabase.from(view).select('*').order('rank');
	if (error) throw new Error(`Failed to load ${view}: ${error.message}`);
	return data;
}

/** The most-starred repos, from the latest snapshot. */
export const getLeaderboard = () => getView<LeaderboardRow>(RANKING_TABLES.repos.view);

/** The most-followed users, from the latest snapshot. */
export const getUserLeaderboard = () => getView<UserLeaderboardRow>(RANKING_TABLES.users.view);
