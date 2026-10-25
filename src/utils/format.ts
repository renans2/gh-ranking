const number = new Intl.NumberFormat('en-US');

export const formatNumber = (value: number) => number.format(value);

export type RankChangeKind = 'none' | 'new' | 'up' | 'down' | 'same';

export function rankChange(row: { previous_date: string | null; rank_change: number | null }): {
	kind: RankChangeKind;
	amount: number;
} {
	if (!row.previous_date) return { kind: 'none', amount: 0 };
	if (row.rank_change === null) return { kind: 'new', amount: 0 };
	if (row.rank_change > 0) return { kind: 'up', amount: row.rank_change };
	if (row.rank_change < 0) return { kind: 'down', amount: -row.rank_change };
	return { kind: 'same', amount: 0 };
}

/** A day-over-day change such as "+312" or "-3"; empty when there's nothing to compare with. */
export function changeLabel(change: number | null) {
	if (change === null) return '';
	return change > 0 ? `+${number.format(change)}` : number.format(change);
}

/** Text color for a day-over-day change. */
export function changeClass(change: number | null) {
	return { 'text-up': (change ?? 0) > 0, 'text-down': (change ?? 0) < 0 };
}

export function avatarUrl(url: string, size: number) {
	const avatar = new URL(url);
	avatar.searchParams.set('s', String(size));
	return avatar.href;
}
