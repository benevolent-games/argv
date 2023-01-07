
import {Type} from "./types/type.js"
import {Spec5} from "./types/spec.js"
import {ZField} from "./types/field.js"
import {Values} from "./types/values.js"
import {color} from "./internals/text/colors.js"

export function help({spec, params}: {
		spec: Spec5<any, ZField.Group<any>>
		params: Values
	}) {

	const columns = spec.columns ?? 72
	const argorder = <string[]>spec.argorder

	if ("--help" in params && params["--help"]) {
		console.log(`${color.yellow(spec.bin)} ` + argorder.map(a => color.green(`<` + a + `>`)).join(` `))

		for (const name of argorder) {
			const field = spec.args[name]
			console.log(fieldReport(columns, name, field))
		}

		for (const [name, field] of Object.entries(spec.params))
			console.log(fieldReport(columns, name, field))

		console.log(``)
		return true
	}

	return false
}

function fieldReport(columns: number, name: string, field: ZField.Any<Type>) {
	let report = ""

	report += `\n  ${color.green(name)} ${mode(field)} ${stype(field.type)}`
	if (field.help)
		report += `\n` + indent(4, " ", wrap(columns - 4, field.help))

	return report
}

function stype(type: Type) {
	switch (type) {

		case String:
			return color.magenta(`<string>`)

		case Number:
			return color.magenta(`<number>`)

		case Boolean:
			return color.magenta(`<boolean>`)
	}
}

function mode(field: ZField.Any<Type>) {
	switch (field.mode) {

		case "requirement":
			return color.yellow(`(required)`)

		case "option":
			return color.blue(`(optional)`)

		case "default":
			return color.blue(`(default `)
				+ color.cyan(val(field.default))
				+ color.blue(`)`)
	}
}

function val(v: any) {
	return v === undefined
		? "undefined"
		: JSON.stringify(v)
}

function wrap(w: number, s: string) {
	if (w < 20)
		w = 20

	return s.replace(
		new RegExp(
			`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`,
			"g"
		),
		"$1\n",
	)
}

function repeat(n: number, s: string) {
	let result = ""
	for (let i = 0; i < n; i++)
		result += s
	return result
}

function indent(n: number, space: string, text: string) {
	return text
		.split("\n")
		.map(
			line => line.length > 0
				? repeat(n, space) + line
				: line
		)
		.join("\n")
}
