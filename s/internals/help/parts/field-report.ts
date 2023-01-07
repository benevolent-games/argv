
import {val} from "./val.js"
import {mode} from "./mode.js"
import {stype} from "./stype.js"
import {wblock} from "./wblock.js"
import {palette} from "./palette.js"
import {Type} from "../../../types/type.js"
import {ZField} from "../../../types/field.js"
import {defaultValue} from "./default-value.js"

export function fieldReport({
		name,
		columns,
		field,
		value,
		col,
	}: {
		name: string
		columns: number
		field: ZField.Any<Type>
		value: undefined | {v: any}
		col: (s: string) => string
	}) {

	let report = ""

	report += "\n"
	report += wblock({
		columns,
		indent: [1, " "],
		text: `${col(name)}`
			+ ` ${mode(field.mode)}`
			+ ` ${stype(field.type)}`
			+ `${defaultValue(<any>field)}`
			+ (value
				? " " + palette.detected("got ") + palette.value(val(value.v))
				: "")
			,
	})

	if (field.help)
		report += "\n" + wblock({
			columns,
			indent: [3, " "],
			text: field.help,
		})

	return report
}
