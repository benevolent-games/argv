
import {obmap} from "../../tooling/obmap.js"
import {ConfigError} from "../../errors/basic.js"
import {tnConnect, tnString} from "../../tooling/text/tn.js"
import {InvalidFlagError} from "../../errors/kinds/config.js"
import {Arg, Coerce, Unit, Param, TypeFn, Opts, archetypeFn} from "./types/sketch.js"

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
	return {
		flag,
		help: o.help,
		coerce: string => {
			return (string === undefined)
				? false
				: types.boolean(string)
		},
	}
}

export const typeFn = <Fn extends Coerce<string, any>>(fn: Fn) => fn

export const types = {
	string: typeFn(string => string),
	list: typeFn(string => string.split(",").map(s => s.trim())),
	number: typeFn(string => {
		const number = Number(string)
		if (isNaN(number)) throw new Error(`not a number`)
		return number
	}),
	boolean: (() => {
		const pairs = [
			["1", "0"],
			["on", "off"],
			["yes", "no"],
			["true", "false"],
		]
		const truisms = pairs.map(p => p[0])
		const falsisms = pairs.map(p => p[1])
		return typeFn(string => {
			string = string.toLowerCase()
			if (truisms.includes(string)) return true
			else if (falsisms.includes(string)) return false
			else throw new Error(`invalid boolean, try "true" or "false"`)
		})
	})(),
}

const archetype = {
	default: <T>(type: TypeFn<T>) => archetypeFn(
		(fallback: T, {help, coerce = x => x}: Opts<T> = {}) => ({
			help,
			coerce: value => {
				return (value === undefined)
					? fallback
					: coerce(type(value))
			},
		})
	),
	required: <T>(type: TypeFn<T>) => archetypeFn(
		({help, coerce = x => x}: Opts<T> = {}) => ({
			help,
			coerce: value => {
				if (value === undefined)
					throw new Error(`required, but not provided`)
				return coerce(type(value))
			},
		})
	),
	optional: <T>(type: TypeFn<T>) => archetypeFn(
		({help, coerce = x => x}: Opts<T> = {}) => ({
			help,
			coerce: value => {
				return (value === undefined)
					? undefined
					: coerce(type(value))
			},
		})
	),
}

export function kindify<Types extends Record<string, TypeFn<any>>>(types: Types) {
	return obmap(archetype, arch => obmap(types, type => arch(type)))
}

export const kind = {
	required: {
		string: archetype.required(types.string),
		number: archetype.required(types.number),
		boolean: archetype.required(types.boolean),
		list: archetype.required(types.list),
	},
	optional: {
		string: archetype.optional(types.string),
		number: archetype.optional(types.number),
		boolean: archetype.optional(types.boolean),
		list: archetype.optional(types.list),
	},
	default: {
		string: archetype.default(types.string),
		number: archetype.default(types.number),
		boolean: archetype.default(types.boolean),
		list: archetype.default(types.list),
	},
} satisfies Record<string, Record<keyof typeof types, any>>

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

// //// usage examples ////

// arg("a", kind.required.number()),
// param(kind.required.number({help: ""}))
// flag("-p", kind.required.boolean({help: ""}))
// arg("a", kind.required.number(choice([1, 2, 3])))

