
import * as fmt from "./formatting.js"

export type Tn = string | null | undefined | false

export function indent(depth: number, tn: Tn) {
	return fmt.isString(tn) && fmt.indent(depth, tn)
}

export function connect(glue: string, tns: Tn[]) {
	const processed = tns.flat(Infinity).filter(fmt.isString)
	return processed.length
		? processed.join(glue)
		: null
}

export function str(tn: Tn) {
	return tn || ""
}

export function final(columns: number, indent: string, tn: Tn) {
	return fmt.isString(tn)
		? fmt.wrap(columns, fmt.replaceTabs(tn, indent))
		: ""
}

