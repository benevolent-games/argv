
import {Spec} from "../types/spec.js"
import {Field} from "../types/field.js"
import {Values} from "../types/values.js"
import {stdtheme, Theme} from "../theme.js"
import {textblock} from "./helping/textblock.js"
import {makeTips, stdcolumns} from "./constants.js"
import {fieldReport} from "./helping/field-report.js"
import {Command, Commands, NuSpec} from "../program.js"
import {retrieveValue} from "./helping/retrieve-value.js"

export function *helper3<C extends Commands = Commands>({
		spec,
		validCommand,
	}: {
		spec: NuSpec<C>
		validCommand?: undefined | {
			command: Command
			tuple: string[]
			args: Values
			params: Values
		}
	}) {

	const theme = spec.theme ?? stdtheme

	const tips = spec.tips ?? true
	const columns = (spec.columns ?? stdcolumns) - 4

	yield (
		theme.binary(spec.name)
		// + " "
		// + (
		// 	argorder
		// 		.map(a => theme.arg(`<${a}>`))
		// 		.join(" ")
		// )
		// + (argnum === 0 ?"" : " ")
		// + theme.param("{parameters}")
	)

	if (spec.readme)
		yield theme.readme("  readme ") + theme.link(spec.readme)
	
	if (spec.help)
		yield textblock({
			columns,
			indent: [2, " "],
			text: spec.help,
		})

	if (validCommand) {
		const {command, tuple, args, params} = validCommand
		const argorder = <string[]>command.argorder
		const argnum = argorder.length

		for (const name of argorder)
			yield fieldReport({
				name,
				columns,
				theme,
				field: command.args[name],
				value: retrieveValue(args, name),
				color: theme.arg,
			})

		for (const [name, field] of Object.entries(command.params))
			yield fieldReport({
				name: "--" + name,
				field,
				columns,
				theme,
				value: retrieveValue(params, name),
				color: theme.param,
			})
	}

	if (tips) {
		yield ""
		yield theme.tip("tips")
		yield textblock({
			columns,
			indent: [2, " "],
			text: makeTips(theme),
		})
	}
}

export function *helper2({
		name: programName,
		fields,
		args = {},
		params = {},
		argorder,
		theme,
		tips,
		columns,
		readme,
		help,
	}: {
		name: string
		argorder: string[]
		fields: {
			args: Field.Group
			params: Field.Group
		}
		args?: Values
		params?: Values
		theme: Theme
		tips: boolean
		columns: number
		readme: string
		help: string
	}) {

	columns -= 4
	const argnum = argorder.length

	yield (
		theme.binary(programName)
		+ " "
		+ (
			argorder
				.map(a => theme.arg(`<${a}>`))
				.join(" ")
		)
		+ (argnum === 0 ?"" : " ")
		+ theme.param("{parameters}")
	)

	if (readme)
		yield theme.readme("  readme ") + theme.link(readme)
	
	if (help)
		yield textblock({
			columns,
			indent: [2, " "],
			text: help,
		})

	for (const name of argorder)
		yield fieldReport({
			name,
			columns,
			theme,
			field: fields.args[name],
			value: retrieveValue(args, name),
			color: theme.arg,
		})

	for (const [name, field] of Object.entries(fields.params))
		yield fieldReport({
			name: "--" + name,
			field,
			columns,
			theme,
			value: retrieveValue(params, name),
			color: theme.param,
		})

	if (tips) {
		yield ""
		yield theme.tip("tips")
		yield textblock({
			columns,
			indent: [2, " "],
			text: makeTips(theme),
		})
	}
}

export function *helper<FA extends Field.Group, FP extends Field.Group>({
		spec,
		args = {},
		params = {},
	}: {
		spec: Spec<FA, FP>,
		args?: Values
		params?: Values
	}) {

	const theme = spec.theme ?? stdtheme

	const tips = spec.tips ?? true
	const columns = (spec.columns ?? stdcolumns) - 4
	const argorder = <string[]>spec.argorder
	const argnum = argorder.length

	yield (
		theme.binary(spec.program)
		+ " "
		+ (
			argorder
				.map(a => theme.arg(`<${a}>`))
				.join(" ")
		)
		+ (argnum === 0 ?"" : " ")
		+ theme.param("{parameters}")
	)

	if (spec.readme)
		yield theme.readme("  readme ") + theme.link(spec.readme)
	
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
			theme,
			field: spec.args[name],
			value: retrieveValue(args, name),
			color: theme.arg,
		})

	for (const [name, field] of Object.entries(spec.params))
		yield fieldReport({
			name: "--" + name,
			field,
			columns,
			theme,
			value: retrieveValue(params, name),
			color: theme.param,
		})

	if (tips) {
		yield ""
		yield theme.tip("tips")
		yield textblock({
			columns,
			indent: [2, " "],
			text: makeTips(theme),
		})
	}
}
