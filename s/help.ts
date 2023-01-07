
import {Type} from "./types/type.js"
import {Spec5} from "./types/spec.js"
import {ZField} from "./types/field.js"
import {color, strip} from "./internals/text/colors.js"
import {Values} from "./types/values.js"

const c = {
	bin: color.blue,
	arg: color.green,
	param: color.yellow,
	mode: color.blue,
	required: color.red,
	value: color.cyan,
	type: color.magenta,
	readme: color.magenta,
	link: color.cyan,
	tip: color.magenta,
	detected: color.yellow,
}

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

	yield c.bin(spec.bin) + " " + (
		argorder
			.map(a => c.arg(`<${a}>`))
			.join(" ")
	) + c.param(" {parameters}")

	if (spec.readme)
		yield c.readme("  readme ") + c.link(spec.readme)
	
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
			col: c.arg,
		})

	for (const [name, field] of Object.entries(spec.params))
		yield fieldReport({
			name,
			columns,
			field,
			value: retrieveValue(params, name),
			col: c.param,
		})

	if (tips) {
		yield ""
		yield c.tip("tips")
		yield wblock({
			columns,
			indent: [2, " "],
			text: `
				${c.tip("~")} "${c.param("+param")}" is short for "${c.param("--param=true")}"
			`,
		})
	}
}

function retrieveValue(values: Values, name: string) {
	return name in values
		? {v: values[name]}
		: undefined
}

function fieldReport({
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
				? " " + c.detected("got ") + c.value(val(value.v))
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

function stype(type: Type) {
	switch (type) {

		case String:
			return c.type("string")

		case Number:
			return c.type("number")

		case Boolean:
			return c.type("boolean")
	}
}

function mode(mode: ZField.Mode) {
	switch (mode) {

		case "requirement":
			return c.required("required")

		case "option":
			return c.mode("optional")

		case "default":
			return c.mode("default")
	}
}

function defaultValue(field: ZField.Default<Type>) {
	return "default" in field
		? " " + c.value(val(field.default))
		: ""
}

function val(v: any) {
	return v === undefined
		? "undefined"
		: JSON.stringify(v)
}

function repeat(n: number, s: string) {
	let result = ""

	for (let i = 0; i < n; i++)
		result += s

	return result
}

function trimLinefeeds(s: string) {
	const leading = /^\n*([\s\S]*)$/g.exec(s)
	if (leading)
		s = leading[1]

	const trailing = /([\s\S*]*?)\n*$/g.exec(s)
	if (trailing)
		s = trailing[1]

	return s
}

function untab(code: string) {
	const lines = code.split(/\r|\n/)

	let baseTabLevel: number | undefined
	for (const line of lines) {
		const isOnlyWhitespace = /^\s+$/.test(line)
		if (!isOnlyWhitespace) {
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

function indent(indenter: string, n: number, text: string) {
	return text
		.split("\n")
		.map(
			line => line.length > 0
				? repeat(n, indenter) + line
				: line
		)
		.join("\n")
}

export function wblock({
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

const mincolumns = 10

function wrappist(columns: number, text: string) {
	columns = columns < mincolumns
		? mincolumns
		: columns

	return text
		.split("\n")
		.map(line => {
			line = line.trim()
			const colorless = strip(line)

			if (colorless.length <= columns)
				return line

			const words = line.split(/\s+/)
			let index = 0
			let length = 0
			let newline = ""

			for (let word of words) {
				word = index === 0
					? word
					: " " + word

				const wordlength = strip(word).length
				const length_if_word_added = length + wordlength

				if (length_if_word_added >= columns) {
					length = 0
					newline += "\n"
				}

				newline += word
				length += wordlength
				index += 1
			}

			return newline
		})
		.join("\n")
}
