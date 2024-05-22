
import {processFlag} from "./utils/utils.js"
import {Command, CommandOptions} from "./types/commands.js"
import {Primitive, Typify, Validator} from "./types/primitives.js"
import {Arg, ArgDefault, ArgOptional, ArgRequired} from "./types/args.js"
import {Param, ParamDefault, ParamFlag, ParamOptional, ParamRequired} from "./types/params.js"
import { undent } from "../../tooling/text/formatting.js"
import { tnConnect, tnString } from "../../tooling/text/tn.js"
import { ConfigError } from "../../errors/basic.js"

export function command<
		A extends Arg<string, Primitive>[],
		P extends Record<string, Param<Primitive>>,
	>(o: CommandOptions<A, P>): Command<A, P> {
	return new Command<A, P>(o)
}

const passValidator: Validator<any> = (x: any) => x

type BaseOptions<P extends Primitive> = {
	help?: string
	validate?: Validator<P>
}

export const arg = <N extends string>(name: N) => ({
	required: <P extends Primitive>(
			primitive: P,
			o: BaseOptions<P> = {},
		): ArgRequired<N, P> => ({
		mode: "required",
		name,
		primitive,
		help: o.help,
		validate: o.validate ?? passValidator,
	}),

	optional: <P extends Primitive>(
			primitive: P,
			o: BaseOptions<P> = {},
		): ArgOptional<N, P> => ({
		mode: "optional",
		name,
		primitive,
		help: o.help,
		validate: o.validate ?? passValidator,
	}),

	default: <P extends Primitive>(
			primitive: P,
			o: {fallback: Typify<P>} & BaseOptions<P>,
		): ArgDefault<N, P> => ({
		mode: "default",
		name,
		primitive,
		help: o.help,
		fallback: o.fallback,
		validate: o.validate ?? passValidator,
	}),
})

export const param = {
	required: <P extends Primitive>(
			primitive: P,
			o: BaseOptions<P> = {},
		): ParamRequired<P> => ({
		mode: "required",
		primitive,
		help: o.help,
		validate: o.validate ?? passValidator,
	}),

	optional: <P extends Primitive>(
			primitive: P,
			o: BaseOptions<P> = {},
		): ParamOptional<P> => ({
		mode: "optional",
		primitive,
		help: o.help,
		validate: o.validate ?? passValidator,
	}),

	default: <P extends Primitive>(
			primitive: P,
			o: {fallback: Typify<P>} & BaseOptions<P>,
		): ParamDefault<P> => ({
		mode: "default",
		primitive,
		help: o.help,
		fallback: o.fallback,
		validate: o.validate ?? passValidator,
	}),

	flag: (
			flag: string,
			o: {help?: string} = {},
		): ParamFlag => ({
		mode: "flag",
		primitive: Boolean,
		help: o.help,
		flag: processFlag(flag),
		validate: passValidator,
	}),
}

export function choice(
		choices: string[],
		help?: string,
	): BaseOptions<typeof String> {

	let message: string

	if (choices.length === 0)
		throw new ConfigError(`zero choices doesn't make sense`)

	else if (choices.length === 1)
		message = `must be "${choices[0]}"`

	else
		message = choices.join(", ")

	return {
		validate(input: string) {
			if (!choices.includes(input))
				throw new Error(`invalid choice, got "${input}", but it needs to be one of: ${choices.map(c => `"${c}"`).join(", ")}`)
			return input
		},
		help: tnString(tnConnect("\n", [
			message,
			help,
		])),
	}
}

