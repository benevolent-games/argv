
import {uncolor} from "./coloring.js"

export function normalize(text: string) {
	return trimNewlines(undent(text))
}

export function undent(code: string) {
	const lines = code.split(/\r|\n/)

	let baseTabLevel: number | undefined

	for (const line of lines) {
		if (!isAllWhitespace(line)) {
			const tabMatch = line.match(/^(\t+).+/)
			if (tabMatch) {
				const tabCount = tabMatch[1].length
				baseTabLevel = baseTabLevel === undefined
					? tabCount
					: tabCount < baseTabLevel
						? tabCount
						: baseTabLevel
				if (baseTabLevel === 0)
					break
			}
		}
	}

	const rebaseTabRegex = new RegExp(`^\\t{${baseTabLevel}}`)

	return lines
		.map(line => /^\s+$/.test(line) ? "" : line)
		.map(line => line.replace(rebaseTabRegex, ""))
		.join("\n")
}

function isAllWhitespace(s: string) {
	return /^\s+$/.test(s)
}

export function repeat(n: number, s: string) {
	let result = ""
	for (let i = 0; i < n; i++)
		result += s
	return result
}


export function trimNewlines(s: string) {
	s = trimLeadingNewlines(s)
	s = trimTrailingNewlines(s)
	return s
}

export function trimLeadingNewlines(s: string) {
	const leading = /^\n*([\s\S]*)$/g.exec(s)
	if (leading) s = leading[1]
	return s
}

export function trimTrailingNewlines(s: string) {
	const trailing = /([\s\S*]*?)\n*$/g.exec(s)
	if (trailing) s = trailing[1]
	return s
}

export function replaceTabs(text: string, glyph: string) {
	return text.replaceAll(/\t/gim, glyph)
}

export function indent(depth: number, text: string) {
	return text
		.split("\n")
		.map(line => line.length > 0
			? repeat(depth, "\t") + line
			: line)
		.join("\n")
}

export function wrap(columns: number, text: string) {
	return text
		.split("\n")
		.flatMap(breakLinesBasedOnLength(columns))
		.join("\n")
}

export function isString(x: any): x is string {
	return typeof x === "string"
}

export function pipe(text: string, fns: ((s: string) => string)[]) {
	for (const fn of fns)
		text = fn(text)
	return text
}

/////////////////////////////////
/////////////////////////////////
/////////////////////////////////
/////////////////////////////////

function breakLinesBasedOnLength(columns: number) {
	return (line: string) => {
		const [whitespace, content] = extractLeadingWhitespace(line)
		const sublines: string[] = []
		let current = whitespace
		let word = ''

		for (const char of content) {
			if (/\s/.test(char) || /[.,!?;:()\-]/.test(char)) {
				if (word.length > 0) {
					const proposedLength = uncolor(current).length + uncolor(word).length
					if (proposedLength > columns) {
						sublines.push(current)
						current = whitespace + word
					} else {
						current += word
					}
					word = ''
				}
				const proposedLength = uncolor(current).length + uncolor(char).length
				if (proposedLength > columns) {
					sublines.push(current)
					current = whitespace + char
				} else {
					current += char
				}
			} else {
				word += char
			}
		}
		if (word.length > 0) {

			const proposedLength = uncolor(current).length + uncolor(word).length
			if (proposedLength > columns) {
				sublines.push(current)
				current = whitespace + word
			} else {
				current += word
			}
		}

		sublines.push(current)
		return sublines
	}
}

// function breakLinesBasedOnLength(columns: number) {
// 	return (line: string) => {
// 		const [whitespace, content] = extractLeadingWhitespace(line)
// 		const words = content.split(/[\s.,!?;:()-]+/)
// 		const sublines: string[] = []
// 		let current = whitespace

// 		for (const word of words) {
// 			const proposedLength = uncolor(current).length + uncolor(word).length + 1
// 			if (proposedLength > columns) {
// 				sublines.push(current)
// 				current = whitespace + word
// 			}
// 			else {
// 				current += (current.length > whitespace.length)
// 					? " " + word
// 					: word
// 			}
// 		}

// 		sublines.push(current)
// 		return sublines
// 	}
// }

function extractLeadingWhitespace(s: string) {
	const match = s.match(/^\s*/)
	const whitespace = match ? match[0] : ""
	const following = s.slice(whitespace.length).trim()
	return [whitespace, following]
}

