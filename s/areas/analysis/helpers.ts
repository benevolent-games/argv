
import {obmap} from "../../tooling/obmap.js"
import {ConfigError} from "../../errors/basic.js"
import {Command, CommandOptions} from "./types/commands.js"
import {tnConnect, tnString} from "../../tooling/text/tn.js"
import {InvalidFlagError} from "../../errors/kinds/config.js"
import {Arg, CoerceFn, Unit, Param, TypeSpec, Opts, Args, Params, modeFn} from "./types/sketch.js"

export function command<
		A extends Args,
		P extends Params,
	>(o: CommandOptions<A, P>): Command<A, P> {
	return new Command<A, P>(o)
}

export function arg<N extends string, T>(name: N, input: Unit<T>): Arg<N, T> {
	return {...input, name}
}

export function param<T>(input: Unit<T>): Param<T> {
	return input
}

export function flag(flag: string, o: {help?: string}): Param<boolean> {
	flag = flag.startsWith("-")
		? flag.slice(1)
		: flag
	if (flag.length !== 1)
		throw new InvalidFlagError(flag)
	const {type, coerce} = types.boolean
	return {
		mode: "flag",
		type,
		flag,
		help: o.help,
		ingest: string => {
			return (string === undefined)
				? false
				: coerce(string)
		},
	}
}

export function typify<C extends Record<string, CoerceFn<any>>>(coersions: C) {
	return obmap(coersions, (coerce, key) => ({
		type: key,
		coerce,
	})) as {[K in keyof C]: TypeSpec<ReturnType<C[K]>>}
}

export const types = typify({
	string: string => string,
	number: string => {
		const number = Number(string)
		if (isNaN(number)) throw new Error(`not a number`)
		return number
	},
	boolean: (() => {
		const pairs = [
			["1", "0"],
			["on", "off"],
			["yes", "no"],
			["true", "false"],
		]
		const truisms = pairs.map(p => p[0])
		const falsisms = pairs.map(p => p[1])
		return string => {
			string = string.toLowerCase()
			if (truisms.includes(string)) return true
			else if (falsisms.includes(string)) return false
			else throw new Error(`invalid boolean, try "true" or "false"`)
		}
	})(),
})

const modes = {
	default: <T>({type, coerce}: TypeSpec<T>) => modeFn(
		(fallback: string, {help, validate = x => x}: Opts<T> = {}) => ({
			mode: "default",
			type,
			help,
			coerce,
			validate,
			ingest: value => {
				return (value === undefined)
					? fallback
					: value
			},
		})
	),
	required: <T>({type, coerce}: TypeSpec<T>) => modeFn(
		({help, validate = x => x}: Opts<T> = {}) => ({
			mode: "required",
			type,
			help,
			ingest: value => {
				if (value === undefined)
					throw new Error(`required, but not provided`)
				return validate(coerce(value))
			},
		})
	),
	optional: <T>({type, coerce}: TypeSpec<T>) => modeFn(
		({help, validate = x => x}: Opts<T> = {}) => ({
			mode: "optional",
			type,
			help,
			ingest: value => {
				return (value === undefined)
					? undefined
					: validate(coerce(value))
			},
		})
	),
}

export function kindify<Types extends Record<string, TypeSpec<any>>>(types: Types) {
	return obmap(modes, arch => obmap(types, typeSpec => arch(typeSpec)))
}

export const kind = {
	required: {
		string: modes.required(types.string),
		number: modes.required(types.number),
		boolean: modes.required(types.boolean),
	},
	optional: {
		string: modes.optional(types.string),
		number: modes.optional(types.number),
		boolean: modes.optional(types.boolean),
	},
	default: {
		string: modes.default(types.string),
		number: modes.default(types.number),
		boolean: modes.default(types.boolean),
	},
} satisfies Record<string, Record<keyof typeof types, any>>

function list<T>(unit: Unit<T>) {
}

export function choice<T>(choices: T[], {help}: {help?: string} = {}): Opts<T> {
	let message: string

	if (choices.length === 0)
		throw new ConfigError(`zero choices doesn't make sense`)
	else if (choices.length === 1)
		message = `must be "${choices[0]}"`
	else
		message = choices.map(c => JSON.stringify(c)).join(", ")

	return {help: tnString(tnConnect("\n", [message, help]))}
}

param(kind.default.string("hello"))
param(modes.default(types.string)("hello"))
param()

