
import {Typify} from "./types/advanced.js"
import {Arg, Command, Param, Primitive} from "./types/basic.js"

export const arg = {
	required: <N extends string, P extends Primitive>(
		name: N,
		primitive: P,
		help: string,
	) => new Arg<true, N, P>(name, true, primitive, help, undefined),
	optional: <N extends string, P extends Primitive>(
		name: N,
		primitive: P,
		help: string,
	) => new Arg<false, N, P>(name, false, primitive, help, undefined),
	default: <N extends string, P extends Primitive>(
		name: N,
		primitive: P,
		fallback: Typify<P>,
		help: string,
	) => new Arg<false, N, P>(name, false, primitive, help, fallback),
}

export const param = {
	required: <P extends Primitive>(
		primitive: P,
		help: string,
	) => new Param<true, P>(true, primitive, help, undefined),
	optional: <P extends Primitive>(
		primitive: P,
		help: string,
	) => new Param<false, P>(false, primitive, help, undefined),
	default: <P extends Primitive>(
		primitive: P,
		fallback: Typify<P>,
		help: string,
	) => new Param<false, P>(false, primitive, help, fallback),
}

export function args<A extends Arg<boolean, string, Primitive>[]>(...a: A): A {
	return a
}

export function params<P extends Record<string, Param<boolean, Primitive>>>(p: P): P {
	return p
}

export function command<
			A extends Arg<boolean, string, Primitive>[],
			P extends Record<string, Param<boolean, Primitive>>,
		>(
		help: string,
		args: A,
		params: P,
	): Command<A, P> {
	return new Command(help, args, params)
}

