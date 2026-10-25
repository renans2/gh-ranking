import type { LeaderboardRow } from '../lib/leaderboard';

const number = new Intl.NumberFormat('en-US');
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

export const formatNumber = (value: number) => number.format(value);
export const formatCompact = (value: number) => compact.format(value);

export function rankLabel(row: LeaderboardRow) {
	if (!row.previous_date) return { text: '', kind: 'none' };
	if (row.rank_change === null) return { text: 'new', kind: 'new' };
	if (row.rank_change > 0) return { text: `▲ ${row.rank_change}`, kind: 'up' };
	if (row.rank_change < 0) return { text: `▼ ${-row.rank_change}`, kind: 'down' };
	return { text: '–', kind: 'same' };
}

export function starsLabel(change: number | null) {
	if (change === null) return '';
	return change > 0 ? `+${number.format(change)}` : number.format(change);
}

export function avatarUrl(url: string) {
	const avatar = new URL(url);
	avatar.searchParams.set('s', '48'); // 2x the displayed size
	return avatar.href;
}
