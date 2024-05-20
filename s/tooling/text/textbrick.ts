
import {redent} from "./redent.js"
import {replaceTabs} from "./replace-tabs.js"
import {Indentation, indent} from "./indent.js"
import {trimNewlines} from "./trim-line-feeds.js"

export function textbrick({text, indentation}: {
		text: string
		indentation: Indentation,
	}) {
	text = redent(text)
	text = trimNewlines(text)
	text = replaceTabs(text, indentation.glyph)
	text = indent(indentation, text)
	return text
}

