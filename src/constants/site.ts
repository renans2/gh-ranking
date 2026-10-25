import { STAR, USER } from './sprites';

export const SITE_NAME = 'gh-ranking';

export const REPO_URL = 'https://github.com/renans2/gh-ranking';

export const AUTHOR = {
	login: 'renans2',
	url: 'https://github.com/renans2',
};

/** The ranking pages: listed in the site header's menu and as cards on the home page. */
export const RANKING_PAGES = {
	repos: {
		href: '/repos',
		label: 'Repos',
		title: 'GitHub Star Ranking',
		description: 'The 100 most-starred repositories, with daily rank and star changes. Filter them by language.',
		icon: STAR,
		iconColor: 'text-star',
	},
	users: {
		href: '/users',
		label: 'Users',
		title: 'GitHub Follower Ranking',
		description: 'The 100 most-followed GitHub users, with daily rank and follower changes.',
		icon: USER,
		iconColor: 'text-accent',
	},
};
