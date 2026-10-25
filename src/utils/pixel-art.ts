// Turns a sprite from constants/sprites.ts into an SVG path, one rectangle per
// horizontal run of filled pixels.
export function pixelPath(art: readonly string[]) {
	return art
		.flatMap((row, y) =>
			Array.from(row.matchAll(/#+/g), (run) => `M${run.index} ${y}h${run[0].length}v1H${run.index}z`),
		)
		.join('');
}
