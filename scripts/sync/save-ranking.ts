import type { SupabaseClient } from '@supabase/supabase-js';

export interface RankedEntry {
	/** Row for the items table (`repos`, `users`); `id` is the GitHub id. */
	item: { id: number; [column: string]: unknown };
	/** Counts stored in today's snapshot, such as stars or followers. */
	stats: Record<string, number>;
}

interface Tables {
	items: string;
	snapshots: string;
	/** Snapshot column that references the item's id, such as `repo_id`. */
	foreignKey: string;
}

/** Saves today's (UTC) snapshot of a ranking. `entries` are in rank order, best first. */
export async function saveRanking(supabase: SupabaseClient, tables: Tables, entries: RankedEntry[]) {
	const today = new Date().toISOString().slice(0, 10);
	const updatedAt = new Date().toISOString();

	const { error: itemsError } = await supabase
		.from(tables.items)
		.upsert(entries.map(({ item }) => ({ ...item, updated_at: updatedAt })));
	if (itemsError) throw itemsError;

	const { error: snapshotsError } = await supabase.from(tables.snapshots).upsert(
		entries.map(({ item, stats }, i) => ({
			[tables.foreignKey]: item.id,
			snapshot_date: today,
			rank: i + 1,
			...stats,
		})),
	);
	if (snapshotsError) throw snapshotsError;

	// If the job runs twice in a day, drop items that fell out of the ranking since
	// the first run so today's ranks stay unique.
	const { error: cleanupError } = await supabase
		.from(tables.snapshots)
		.delete()
		.eq('snapshot_date', today)
		.not(tables.foreignKey, 'in', `(${entries.map(({ item }) => item.id).join(',')})`);
	if (cleanupError) throw cleanupError;

	console.log(`Saved ${entries.length} ${tables.items} for ${today}`);
}
