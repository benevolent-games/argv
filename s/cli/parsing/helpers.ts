
import {Typify} from "./types/advanced.js"
import {Arg, Command, CommandTree, Mode, Param, Primitive} from "./types/basic.js"

export const arg = {
	required: <N extends string, P extends Primitive>(
		name: N,
		primitive: P,
		help: string,
	) => new Arg<Mode.Required, N, P>(name, Mode.Required, primitive, help, undefined),

	optional: <N extends string, P extends Primitive>(
		name: N,
		primitive: P,
		help: string,
	) => new Arg<Mode.Optional, N, P>(name, Mode.Optional, primitive, help, undefined),

	default: <N extends string, P extends Primitive>(
		name: N,
		primitive: P,
		fallback: Typify<P>,
		help: string,
	) => new Arg<Mode.Default, N, P>(name, Mode.Default, primitive, help, fallback),
}

export const param = {
	required: <P extends Primitive>(
		primitive: P,
		help: string,
	) => new Param<Mode.Required, P>(Mode.Required, primitive, help, undefined),

	optional: <P extends Primitive>(
		primitive: P,
		help: string,
	) => new Param<Mode.Optional, P>(Mode.Optional, primitive, help, undefined),

	default: <P extends Primitive>(
		primitive: P,
		fallback: Typify<P>,
		help: string,
	) => new Param<Mode.Default, P>(Mode.Default, primitive, help, fallback),
}

export function args<A extends Arg<Mode, string, Primitive>[]>(...a: A): A {
	return a
}

export function params<P extends Record<string, Param<Mode, Primitive>>>(p: P): P {
	return p
}

export function command<
			A extends Arg<Mode, string, Primitive>[],
			P extends Record<string, Param<Mode, Primitive>>,
		>(
		help: string,
		args: A,
		params: P,
	): Command<A, P> {
	return new Command(help, args, params)
}

export function commandTree<C extends CommandTree>(c: C) {
	return c
}

