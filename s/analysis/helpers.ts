
import {processFlag} from "./utils/utils.js"
import {Primitive, Typify} from "./types/primitives.js"
import {Command, CommandOptions} from "./types/commands.js"
import {Arg, ArgDefault, ArgOptional, ArgRequired} from "./types/args.js"
import {Param, ParamDefault, ParamFlag, ParamOptional, ParamRequired} from "./types/params.js"

export function command<
		A extends Arg<string, Primitive>[],
		P extends Record<string, Param<Primitive>>,
	>(o: CommandOptions<A, P>): Command<A, P> {
	return new Command<A, P>(o)
}

export const arg = {
	required: <N extends string, P extends Primitive>(
			name: N,
			primitive: P,
			o: {help?: string} = {},
		): ArgRequired<N, P> => ({
		mode: "required",
		name,
		primitive,
		help: o.help,
	}),

	optional: <N extends string, P extends Primitive>(
			name: N,
			primitive: P,
			o: {help?: string} = {},
		): ArgOptional<N, P> => ({
		mode: "optional",
		name,
		primitive,
		help: o.help,
	}),

	default: <N extends string, P extends Primitive>(
			name: N,
			primitive: P,
			o: {fallback: Typify<P>, help?: string},
		): ArgDefault<N, P> => ({
		mode: "default",
		name,
		primitive,
		help: o.help,
		fallback: o.fallback,
	}),
}

export const param = {
	required: <P extends Primitive>(
			primitive: P,
			o: {help?: string} = {},
		): ParamRequired<P> => ({
		mode: "required",
		primitive,
		help: o.help,
	}),

	optional: <P extends Primitive>(
			primitive: P,
			o: {help?: string} = {},
		): ParamOptional<P> => ({
		mode: "optional",
		primitive,
		help: o.help,
	}),

	default: <P extends Primitive>(
			primitive: P,
			o: {fallback: Typify<P>, help?: string},
		): ParamDefault<P> => ({
		mode: "default",
		primitive,
		help: o.help,
		fallback: o.fallback,
	}),

	flag: (
			flag: string,
			o: {help?: string} = {},
		): ParamFlag => ({
		mode: "flag",
		primitive: Boolean,
		help: o.help,
		flag: processFlag(flag),
	}),
}

