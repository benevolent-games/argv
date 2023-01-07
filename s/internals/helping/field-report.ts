
import {val} from "./val.js"
import {mode} from "./mode.js"
import {stype} from "./stype.js"
import {palette} from "./palette.js"
import {textblock} from "./textblock.js"
import {Type} from "../../types/type.js"
import {Field} from "../../types/field.js"
import {defaultValue} from "./default-value.js"

export function fieldReport({
		name,
		columns,
		field,
		value,
		color,
	}: {
		name: string
		columns: number
		field: Field.Any<Type>
		value: undefined | {v: any}
		color: (s: string) => string
	}) {

	let report = ""

	report += "\n"
	report += textblock({
		columns,
		indent: [1, " "],
		text: `${color(name)}`
			+ ` ${mode(field.mode)}`
			+ ` ${stype(field.type)}`
			+ `${defaultValue(<any>field)}`
			+ (value
				? " " + palette.detected("got ") + palette.value(val(value.v))
				: "")
			,
	})

	if (field.help)
		report += "\n" + textblock({
			columns,
			indent: [3, " "],
			text: field.help,
		})

	return report
}
