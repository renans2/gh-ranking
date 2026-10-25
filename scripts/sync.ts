// Saves today's snapshot of every ranking in Supabase. Run with `npm run sync`.
// Needs SUPABASE_URL, SUPABASE_SECRET_KEY and GITHUB_TOKEN (the users ranking uses
// GitHub's GraphQL API, which requires a token; the repos ranking works without one).
import { createClient } from '@supabase/supabase-js';
import { syncRepos } from './sync/repos.ts';
import { syncUsers } from './sync/users.ts';

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
	throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY must be set');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
	auth: { persistSession: false },
});

// Each ranking syncs on its own, so one failing doesn't stop the others.
const rankings = { repos: syncRepos, users: syncUsers };
for (const [name, sync] of Object.entries(rankings)) {
	try {
		await sync(supabase);
	} catch (error) {
		console.error(`Failed to sync ${name}:`, error);
		process.exitCode = 1;
	}
}
