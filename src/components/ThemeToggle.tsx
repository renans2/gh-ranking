import { useEffect, useState } from 'react';
import { MOON, SUN } from '../constants/sprites';
import { THEME_STORAGE_KEY } from '../constants/theme';
import PixelIcon from './PixelIcon';

type Theme = 'light' | 'dark';

function savedTheme() {
	try {
		return localStorage.getItem(THEME_STORAGE_KEY);
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
			localStorage.setItem(THEME_STORAGE_KEY, next);
		} catch {}
	}

	return (
		<button
			type="button"
			aria-label="Dark theme"
			aria-pressed={theme === 'dark'}
			onClick={toggle}
			className="pixel-frame pixel-press grid size-11 shrink-0 place-items-center bg-surface text-fg [--px:3px] hover:bg-hover"
		>
			<PixelIcon art={MOON} className="size-[18px] dark:hidden" />
			<PixelIcon art={SUN} className="hidden size-[18px] text-star dark:block" />
		</button>
	);
}
