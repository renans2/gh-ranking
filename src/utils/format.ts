import type { LeaderboardRow } from '../lib/leaderboard';

const number = new Intl.NumberFormat('en-US');

export const formatNumber = (value: number) => number.format(value);

export function rankLabel(row: LeaderboardRow) {
	if (!row.previous_date) return { text: '', kind: 'none' } as const;
	if (row.rank_change === null) return { text: 'new', kind: 'new' } as const;
	if (row.rank_change > 0) return { text: `▲ ${row.rank_change}`, kind: 'up' } as const;
	if (row.rank_change < 0) return { text: `▼ ${-row.rank_change}`, kind: 'down' } as const;
	return { text: '–', kind: 'same' } as const;
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
