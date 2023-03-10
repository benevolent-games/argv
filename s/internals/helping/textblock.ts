
import {untab} from "./untab.js"
import {indent} from "./indent.js"
import {wrappist} from "./wrappist.js"
import {trimLinefeeds} from "./trim-line-feeds.js"

export function textblock({
		text,
		columns,
		indent: [indents, indenter],
	}: {
		text: string
		columns: number
		indent: [number, string]
	}) {

	return indent(
		indenter,
		indents,
		wrappist(columns - (indents * indenter.length), trimLinefeeds(untab(text))),
	)
}
