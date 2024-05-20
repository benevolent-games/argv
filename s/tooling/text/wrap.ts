
import {uncolor} from "./coloring.js"

export function wrap(columns: number, text: string) {
	return text
		.split("\n")
		.flatMap(breakLinesBasedOnLength(columns))
		.join("\n")
}

function breakLinesBasedOnLength(columns: number) {
	return (line: string) => {
		const [whitespace, content] = extractLeadingWhitespace(line)
		const words = content.split(/\s+/)
		const sublines: string[] = []
		let current = whitespace

		for (const word of words) {
			const proposedLength = uncolor(current).length + uncolor(word).length + 1
			if (proposedLength > columns) {
				sublines.push(current)
				current = whitespace + word
			}
			else {
				current += (current.length > whitespace.length)
					? " " + word
					: word
			}
		}

		sublines.push(current)
		return sublines
	}
}

function extractLeadingWhitespace(s: string) {
	const match = s.match(/^\s*/)
	const whitespace = match ? match[0] : ""
	const following = s.slice(whitespace.length).trim()
	return [whitespace, following]
}

