import { RANKING_TABLES } from '../constants/rankings';
import { supabase } from './supabase';

export interface LeaderboardRow {
	rank: number;
	id: number;
	full_name: string;
	html_url: string;
	description: string | null;
	language: string | null;
	owner_avatar_url: string | null;
	stars: number;
	forks: number;
	snapshot_date: string;
	previous_date: string | null;
	stars_change: number | null;
	rank_change: number | null;
}

export async function getLeaderboard(): Promise<LeaderboardRow[]> {
	const { data, error } = await supabase.from(RANKING_TABLES.repos.view).select('*').order('rank');
	if (error) throw new Error(`Failed to load leaderboard: ${error.message}`);
	return data;
}
