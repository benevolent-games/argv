
import {Spec} from "../types/spec.js"
import {Field} from "../types/field.js"
import {stdcolumns} from "./constants.js"
import {Values} from "../types/values.js"
import {palette} from "./helping/palette.js"
import {textblock} from "./helping/textblock.js"
import {fieldReport} from "./helping/field-report.js"
import {retrieveValue} from "./helping/retrieve-value.js"

export function *helper<FA extends Field.Group, FP extends Field.Group>({
		spec,
		args = {},
		params = {},
	}: {
		spec: Spec<FA, FP>,
		args?: Values
		params?: Values
	}) {

	const tips = spec.tips ?? true
	const columns = (spec.columns ?? stdcolumns) - 4
	const argorder = <string[]>spec.argorder

	yield palette.binary(spec.program) + " " + (
		argorder
			.map(a => palette.arg(`<${a}>`))
			.join(" ")
	) + palette.param(" {parameters}")

	if (spec.readme)
		yield palette.readme("  readme ") + palette.link(spec.readme)
	
	if (spec.help)
		yield textblock({
			columns,
			indent: [2, " "],
			text: spec.help,
		})

	for (const name of argorder)
		yield fieldReport({
			name,
			columns,
			field: spec.args[name],
			value: retrieveValue(args, name),
			color: palette.arg,
		})

	for (const [name, field] of Object.entries(spec.params))
		yield fieldReport({
			name,
			columns,
			field,
			value: retrieveValue(params, name),
			color: palette.param,
		})

	if (tips) {
		yield ""
		yield palette.tip("tips")
		yield textblock({
			columns,
			indent: [2, " "],
			text:
				[
					`"${palette.param("+param")}" is short for "${palette.param("--param=true")}"`,
				]
				.map(s => palette.tip("~ ") + s)
				.join("\n"),
		})
	}
}
