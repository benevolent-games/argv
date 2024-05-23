
import {obmap} from "../../../tooling/obmap.js"

export type Coerce<In, Out> = (input: In) => Out

export type Input<T> = {
	help?: string
	coerce: Coerce<string|undefined, T>
}

export type Arg<N extends string, T> = {name: N} & Input<T>
export type Param<T> = {flag?: string} & Input<T>

export function arg<N extends string, T>(name: N, input: Input<T>): Arg<N, T> {
	return {...input, name}
}

export function param<T>(input: Input<T>): Param<T> {
	return input
}

export function flag<T>(flag: string, input: Input<T>): Param<T> {
	return {...input, flag}
}

export type Opts<T> = {
	help?: string
	coerce?: Coerce<T, T>
}

export type ArchetypeFn<T> = (...z: any[]) => Input<T>
export const archetypeFn = <Fn extends ArchetypeFn<any>>(fn: Fn) => fn

export type TypeFn<T> = Coerce<string, T>
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

// export type ArchFn = <T>(type: TypeFn<T>) => ArchetypeFn<T>
export type ArchFn = <T>(type: TypeFn<T>) => (...z: any[]) => Input<T>
export const archFn = <Fn extends ArchFn>(fn: Fn) => fn

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
		list: archetype.required(types.list),
	},
	default: {
		string: archetype.default(types.string),
		number: archetype.default(types.number),
		boolean: archetype.default(types.boolean),
		list: archetype.required(types.list),
	},
} satisfies Record<string, Record<keyof typeof types, any>>

// arg("count", kind.default.number(123))
// arg("count", kind.required.string())
// arg("count", kind.optional.boolean())

// param(kind.required.number({help: ""}))
// flag("-p", kind.required.number({help: ""}))

