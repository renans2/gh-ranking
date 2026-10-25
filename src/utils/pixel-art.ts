// Sprites drawn as ASCII art: '#' is a filled pixel, anything else is empty.
// Render them with <PixelIcon> at a whole multiple of their size to keep edges crisp.

export const STAR = [
	'....#....',
	'...###...',
	'...###...',
	'#########',
	'.#######.',
	'..#####..',
	'..#####..',
	'.###.###.',
	'.##...##.',
];

export const FORK = [
	'###...###',
	'#.#...#.#',
	'###...###',
	'.#.....#.',
	'..#####..',
	'....#....',
	'...###...',
	'...#.#...',
	'...###...',
];

export const SUN = [
	'....#....',
	'.#.....#.',
	'...###...',
	'..#####..',
	'#.#####.#',
	'..#####..',
	'...###...',
	'.#.....#.',
	'....#....',
];

export const MOON = [
	'..##.....',
	'.##......',
	'.##......',
	'###......',
	'####.....',
	'#####....',
	'.#######.',
	'.#######.',
	'...###...',
];

// The GitHub mark, traced from the official logo on an 11x11 grid.
export const GITHUB = [
	'....###....',
	'..#######..',
	'.#..###..#.',
	'.#.......#.',
	'##.......##',
	'##.......##',
	'##.......##',
	'.##.....##.',
	'.#.#...###.',
	'..#....##..',
	'...#...#...',
];

export const HEART = [
	'.##...##.',
	'####.####',
	'#########',
	'#########',
	'.#######.',
	'..#####..',
	'...###...',
	'....#....',
];

export const ARROW_UP = ['...#...', '..###..', '.#####.', '#######'];

export const ARROW_DOWN = ['#######', '.#####.', '..###..', '...#...'];

export const ARROW_RIGHT = ['#..', '##.', '###', '##.', '#..'];

// One rectangle per horizontal run of filled pixels.
export function pixelPath(art: readonly string[]) {
	return art
		.flatMap((row, y) =>
			Array.from(row.matchAll(/#+/g), (run) => `M${run.index} ${y}h${run[0].length}v1H${run.index}z`),
		)
		.join('');
}
