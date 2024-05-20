
import {repeat} from "./repeat.js"

export type Indentation = {
	glyph: string
	depth: number
}

export function indent(
		{glyph, depth}: Indentation,
		text: string,
	) {

	return text
		.split("\n")
		.map(
			line => line.length > 0
				? repeat(depth, glyph) + line
				: line
		)
		.join("\n")
}

