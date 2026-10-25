const { GITHUB_TOKEN } = process.env;

const authorization: Record<string, string> = GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {};

/** GET a REST API path such as `/search/repositories?q=...`. Works without a token, at lower rate limits. */
export async function githubRest<T>(path: string): Promise<T> {
	const res = await fetch(`https://api.github.com${path}`, {
		headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2026-03-10', ...authorization },
	});
	if (!res.ok) throw new Error(`GitHub request failed (${res.status}): ${await res.text()}`);
	return res.json();
}

/** Run a GraphQL query. GitHub's GraphQL API always requires a token. */
export async function githubGraphql<T>(query: string): Promise<T> {
	if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN must be set to use the GitHub GraphQL API');
	const res = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...authorization },
		body: JSON.stringify({ query }),
	});
	if (!res.ok) throw new Error(`GitHub GraphQL request failed (${res.status}): ${await res.text()}`);
	const body = await res.json();
	if (body.errors) throw new Error(`GitHub GraphQL errors: ${JSON.stringify(body.errors)}`);
	return body.data;
}
