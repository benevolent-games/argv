
import {wblock} from "./parts/wblock.js"
import {Spec5} from "../../types/spec.js"
import {palette} from "./parts/palette.js"
import {ZField} from "../../types/field.js"
import {Values} from "../../types/values.js"
import {fieldReport} from "./parts/field-report.js"
import {retrieveValue} from "./parts/retrieve-value.js"

export function *helper<FA extends ZField.Group, FP extends ZField.Group>({
		spec,
		args = {},
		params = {},
		tips = true,
	}: {
		spec: Spec5<FA, FP>,
		args?: Values
		params?: Values
		tips?: boolean,
	}) {

	const columns = (spec.columns ?? 72) - 4
	const argorder = <string[]>spec.argorder

	yield palette.bin(spec.bin) + " " + (
		argorder
			.map(a => palette.arg(`<${a}>`))
			.join(" ")
	) + palette.param(" {parameters}")

	if (spec.readme)
		yield palette.readme("  readme ") + palette.link(spec.readme)
	
	if (spec.help)
		yield wblock({
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
			col: palette.arg,
		})

	for (const [name, field] of Object.entries(spec.params))
		yield fieldReport({
			name,
			columns,
			field,
			value: retrieveValue(params, name),
			col: palette.param,
		})

	if (tips) {
		yield ""
		yield palette.tip("tips")
		yield wblock({
			columns,
			indent: [2, " "],
			text: `
				${palette.tip("~")} "${palette.param("+param")}" is short for "${palette.param("--param=true")}"
			`,
		})
	}
}
