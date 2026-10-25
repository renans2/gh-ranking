import { icons } from '@iconify-json/devicon';
import { getIconData, iconToHTML, iconToSVG, replaceIDs } from '@iconify/utils';

// GitHub language names whose devicon icon isn't just the lowercased name.
const ICON_ALIASES: Record<string, string> = {
	'C++': 'cplusplus',
	'C#': 'csharp',
	CSS: 'css3',
	Batchfile: 'windows8',
	Dockerfile: 'docker',
	'Emacs Lisp': 'emacs',
	HTML: 'html5',
	'Jupyter Notebook': 'jupyter',
	MDX: 'markdown',
	Nix: 'nixos',
	'Objective-C': 'objectivec',
	Shell: 'bash',
	TeX: 'latex',
	'Vim Script': 'vim',
	Vue: 'vuejs',
};

/**
 * The language's devicon as SVG markup, or null when devicon has no icon for it.
 * Pass a label for an icon shown on its own; without one, screen readers skip it.
 */
export function languageIconSvg(language: string, height: number, label?: string) {
	const icon = getIconData(icons, ICON_ALIASES[language] ?? language.toLowerCase());
	if (!icon) return null;

	const { attributes, body } = iconToSVG(icon, { height });
	// Black and near-black parts (Rust, Markdown, Shell, ...) would vanish in dark mode,
	// so draw them in the text color.
	const themedBody = replaceIDs(body).replace(/#000(000)?\b|#293138\b/gi, 'currentColor');
	const a11y: Record<string, string> = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' };
	return iconToHTML(themedBody, { ...attributes, fill: 'currentColor', ...a11y });
}
