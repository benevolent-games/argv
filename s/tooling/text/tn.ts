
import {indent, isString, replaceTabs, wrap} from "./formatting.js"

export type Tn = string | null | undefined | false

export function tnIndent(depth: number, tn: Tn) {
	return isString(tn) && indent(depth, tn)
}

export function tnConnect(glue: string, tns: Tn[]) {
	const processed = tns.flat(Infinity).filter(isString)
	return processed.length
		? processed.join(glue)
		: null
}

export function tnFinal(columns: number, indent: string, tn: Tn) {
	return isString(tn)
		? wrap(columns, replaceTabs(tn, indent))
		: ""
}

