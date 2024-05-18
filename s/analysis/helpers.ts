
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
			o: {help: string},
		): ArgRequired<N, P> => ({
		...o,
		mode: "required",
		name,
		primitive,
	}),

	optional: <N extends string, P extends Primitive>(
			name: N,
			primitive: P,
			o: {help: string, fallback: Typify<P>},
		): ArgOptional<N, P> => ({
		...o,
		mode: "optional",
		name,
		primitive,
	}),

	default: <N extends string, P extends Primitive>(
			name: N,
			primitive: P,
			o: {help: string, fallback: Typify<P>},
		): ArgDefault<N, P> => ({
		...o,
		mode: "default",
		name,
		primitive,
	}),
}

export const param = {
	required: <P extends Primitive>(
			primitive: P,
			o: {help: string},
		): ParamRequired<P> => ({
		...o,
		mode: "required",
		primitive,
	}),

	optional: <P extends Primitive>(
			primitive: P,
			o: {fallback: Typify<P>, help: string},
		): ParamOptional<P> => ({
		...o,
		mode: "optional",
		primitive,
	}),

	default: <P extends Primitive>(
			primitive: P,
			o: {fallback: Typify<P>, help: string},
		): ParamDefault<P> => ({
		...o,
		mode: "default",
		primitive,
	}),

	flag: (
			o: {flag: string, help: string},
		): ParamFlag => ({
		...o,
		mode: "flag",
		primitive: Boolean,
		fallback: false,
	}),
}

