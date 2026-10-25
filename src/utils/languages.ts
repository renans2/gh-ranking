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

export function languageIconName(language: string) {
	return ICON_ALIASES[language] ?? language.toLowerCase();
}
