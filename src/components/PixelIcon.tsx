import { pixelPath } from '../utils/pixel-art';

interface Props {
	art: readonly string[];
	className?: string;
}

// Decorative pixel-art sprite in the current text color. Size it with className.
export default function PixelIcon({ art, className }: Props) {
	return (
		<svg
			viewBox={`0 0 ${art[0].length} ${art.length}`}
			fill="currentColor"
			shapeRendering="crispEdges"
			aria-hidden="true"
			className={className}
		>
			<path d={pixelPath(art)} />
		</svg>
	);
}
