import { icons } from '@iconify-json/devicon';
import { getIconData, iconToHTML, iconToSVG, replaceIDs, type IconifyIcon } from '@iconify/utils';

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
	Nix: 'nixos',
	'Objective-C': 'objectivec',
	Shell: 'bash',
	TeX: 'latex',
	'Vim Script': 'vim',
	Vue: 'vuejs',
};

// Languages devicon has no icon for.
const CUSTOM_ICONS: Record<string, IconifyIcon> = {
	// The MDX logo from SVG Logos (logos:mdx, CC0), without its white card and cropped to the
	// letters. The M and arrow follow the text color like the Markdown icon.
	MDX: {
		body: '<path fill="currentColor" d="m272.696 40.203l-.002 84.896l31.185-31.178l15.74 15.741l-57.642 57.638l-58.369-58.369l15.741-15.741l31.085 31.085l.001-84.072zM72.162 162.979V97.232l40.255 40.257l40.56-40.557v65.383h22.261V43.192l-62.82 62.816l-62.517-62.521v119.492z"/><path fill="#f9ac00" d="m447.847 36.651l15.74 15.741l-47.149 47.147l45.699 45.701l-15.741 15.741l-45.7-45.699l-45.701 45.699l-15.74-15.741l45.695-45.701l-47.146-47.147l15.74-15.741l47.152 47.146z"/>',
		left: 48,
		top: 35,
		width: 418,
		height: 134,
	},
};

/**
 * The language's icon as SVG markup, or null when there's no icon for it. Icons are `height`
 * tall, except wide logos (MDX), which are scaled down to at most twice that in width.
 * Pass a label for an icon shown on its own; without one, screen readers skip it.
 */
export function languageIconSvg(language: string, height: number, label?: string) {
	const icon = CUSTOM_ICONS[language] ?? getIconData(icons, ICON_ALIASES[language] ?? language.toLowerCase());
	if (!icon) return null;

	let svg = iconToSVG(icon, { height });
	if (Number(svg.attributes.width) > height * 2) svg = iconToSVG(icon, { width: height * 2 });

	// Black and near-black parts (Rust, Markdown, Shell, ...) would vanish in dark mode,
	// so draw them in the text color.
	const themedBody = replaceIDs(svg.body).replace(/#000(000)?\b|#293138\b/gi, 'currentColor');
	// One-color icons with no fills of their own (Rust, Markdown) take the text color too.
	// Icons with their own colors keep unset parts at the SVG default, black, so they look
	// the same in both themes (the Go gopher's outline and pupils).
	const hasOwnColors = /(fill|stop-color)="(?!none|currentColor)/i.test(svg.body);
	const a11y: Record<string, string> = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' };
	return iconToHTML(themedBody, {
		...svg.attributes,
		...(hasOwnColors ? {} : { fill: 'currentColor' }),
		...a11y,
	});
}
