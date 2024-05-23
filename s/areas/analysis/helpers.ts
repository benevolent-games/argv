
import {obmap} from "../../tooling/obmap.js"
import {ConfigError} from "../../errors/basic.js"
import {Command, CommandOptions} from "./types/commands.js"
import {tnConnect, tnString} from "../../tooling/text/tn.js"
import {InvalidFlagError} from "../../errors/kinds/config.js"
import {Arg, CoerceFn, Param, Type, Opts, Args, Params, ValidateFn} from "./types/units.js"

export function command<
		A extends Args,
		P extends Params,
	>(o: CommandOptions<A, P>): Command<A, P> {
	return new Command<A, P>(o)
}

export const asType = <T extends Type<any>>(type: T) => type

export function asTypes<C extends Record<string, CoerceFn<any>>>(coersions: C) {
	return obmap(coersions,
		(coerce, name) => ({name, coerce})
	) as {[K in keyof C]: Type<ReturnType<C[K]>>}
}

export const type = asTypes({
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

const {string, number, boolean} = type
export {string, number, boolean}

type Ingestion<T> = {
	coerce: CoerceFn<T>
	validate: ValidateFn<T>
}

export const ingestors = {
	default: <T>({validate, coerce}: Ingestion<T>, fallback: string) =>
		(value: string | undefined) =>
			validate(coerce(value ?? fallback)),
	required: <T>({validate, coerce}: Ingestion<T>) =>
		(value: string | undefined) => {
			if (value === undefined)
				throw new Error(`required, but not provided`)
			return validate(coerce(value))
		},
	optional: <T>({validate, coerce}: Ingestion<T>) =>
		(value: string | undefined) => (value === undefined)
			? undefined
			: validate(coerce(value)),
}

export const param = {
	flag(flag: string, o: {help?: string} = {}): Param<boolean> {
		flag = flag.startsWith("-")
			? flag.slice(1)
			: flag
		if (flag.length !== 1)
			throw new InvalidFlagError(flag)
		const {name, coerce} = type.boolean
		return {
			mode: "flag",
			type: name,
			flag,
			help: o.help,
			ingest: string => {
				return (string === undefined)
					? false
					: coerce(string)
			},
		}
	},
	default: <T>(
			{name: type, coerce}: Type<T>,
			fallback: string,
			{help, validate = x => x}: Opts<T> = {},
		): Param<T> => ({
		help, type,
		mode: "default",
		ingest: ingestors.default({coerce, validate}, fallback),
	}),
	required: <T>(
			{name: type, coerce}: Type<T>,
			{help, validate = x => x}: Opts<T> = {},
		): Param<T> => ({
		help, type,
		mode: "required",
		ingest: ingestors.required({coerce, validate}),
	}),
	optional: <T>(
			{name: type, coerce}: Type<T>,
			{help, validate = x => x}: Opts<T> = {},
		): Param<T | undefined> => ({
		help, type,
		mode: "optional",
		ingest: ingestors.optional({coerce, validate}),
	}),
}

export const arg = <N extends string>(name: N) => ({
	default: <T>(
			{name: type, coerce}: Type<T>,
			fallback: string,
			{help, validate = x => x}: Opts<T> = {},
		): Arg<N, T> => ({
		name, help, type,
		mode: "default",
		ingest: ingestors.default({coerce, validate}, fallback),
	}),
	required: <T>(
			{name: type, coerce}: Type<T>,
			{help, validate = x => x}: Opts<T> = {},
		): Arg<N, T> => ({
		name, help, type,
		mode: "required",
		ingest: ingestors.required({coerce, validate}),
	}),
	optional: <T>(
			{name: type, coerce}: Type<T>,
			{help, validate = x => x}: Opts<T> = {},
		): Arg<N, T | undefined> => ({
		name, help, type,
		mode: "optional",
		ingest: ingestors.optional({coerce, validate}),
	}),
})

export function choice<T>(allowable: T[], {help}: {help?: string} = {}): Opts<T> {
	let message: string

	if (allowable.length === 0)
		throw new ConfigError(`zero choices doesn't make sense`)
	else if (allowable.length === 1)
		message = `must be "${allowable[0]}"`
	else
		message = allowable.map(c => JSON.stringify(c)).join(", ")

	return {
		help: tnString(tnConnect("\n", [message, help])),
		validate: item => {
			if (!allowable.includes(item))
				throw new Error(`invalid choice`)
			return item
		},
	}
}

export function list<T>({name: type, coerce}: Type<T>): Type<T[]> {
	return {
		name: `list-${type}`,
		coerce: string => string
			.split(",")
			.map(s => s.trim())
			.map(coerce),
	}
}

