import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function savedTheme() {
	try {
		return localStorage.getItem('theme');
	} catch {
		return null;
	}
}

// The initial theme is set on <html data-theme> by the inline script in Layout.astro,
// before React loads. The icons switch with CSS, so they're right even before hydration.
export default function ThemeToggle() {
	const [theme, setTheme] = useState<Theme | null>(null);

	useEffect(() => {
		setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

		// Keep following the OS setting until the visitor picks a theme.
		const systemDark = matchMedia('(prefers-color-scheme: dark)');
		const onSystemChange = (event: MediaQueryListEvent) => {
			if (!savedTheme()) setTheme(event.matches ? 'dark' : 'light');
		};
		systemDark.addEventListener('change', onSystemChange);
		return () => systemDark.removeEventListener('change', onSystemChange);
	}, []);

	useEffect(() => {
		if (theme) document.documentElement.dataset.theme = theme;
	}, [theme]);

	function toggle() {
		const next = theme === 'dark' ? 'light' : 'dark';
		setTheme(next);
		try {
			localStorage.setItem('theme', next);
		} catch {}
	}

	// Sun and moon icons from Lucide (ISC license).
	return (
		<button
			type="button"
			aria-label="Dark theme"
			aria-pressed={theme === 'dark'}
			onClick={toggle}
			className="cursor-pointer rounded-md border border-line p-2 text-muted hover:bg-hover hover:text-fg"
		>
			<svg
				className="size-5 dark:hidden"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
			</svg>
			<svg
				className="hidden size-5 dark:block"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2M12 20v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
			</svg>
		</button>
	);
}
