
import {processFlag} from "./utils/utils.js"
import {Command, CommandOptions} from "./types/commands.js"
import {Primitive, Typify, Validator} from "./types/primitives.js"
import {Arg, ArgDefault, ArgOptional, ArgRequired} from "./types/args.js"
import {Param, ParamDefault, ParamFlag, ParamOptional, ParamRequired} from "./types/params.js"
import { ValidationError } from "../errors.js"
import { undent } from "../tooling/text/undent.js"

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

export const arg = {
	required: <N extends string, P extends Primitive>(
			name: N,
			primitive: P,
			o: BaseOptions<P> = {},
		): ArgRequired<N, P> => ({
		mode: "required",
		name,
		primitive,
		help: o.help,
		validate: o.validate ?? passValidator,
	}),

	optional: <N extends string, P extends Primitive>(
			name: N,
			primitive: P,
			o: BaseOptions<P> = {},
		): ArgOptional<N, P> => ({
		mode: "optional",
		name,
		primitive,
		help: o.help,
		validate: o.validate ?? passValidator,
	}),

	default: <N extends string, P extends Primitive>(
			name: N,
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
}

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

export function chooser({name, choices, help}: {
		name: string
		choices: string[]
		help?: string
	}): BaseOptions<typeof String> {
	return {
		validate(input: string) {
			if (!choices.includes(input))
				throw new ValidationError(`invalid choice for "${name}"`)
			return input
		},
		help: [
			`choose ${choices.map(c => `"${c}"`).join(", ")}.`,
			help,
		].filter(s => !!s).map(t => undent(t!)).join("\n"),
	}
}

