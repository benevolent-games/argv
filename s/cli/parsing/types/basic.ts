
import {Typify} from "./advanced.js"

export type Primitive = typeof Boolean | typeof Number | typeof String

export type CommandTree = Command<any, any> | Record<string, Command<any, any>>

export class Command<
		A extends Arg<boolean, string, Primitive>[],
		P extends Record<string, Param<boolean, Primitive>>
	> {
	constructor(
		public help: string | undefined,
		public args: A,
		public params: P,
	) {}
}

export class Arg<R extends boolean, N extends string, P extends Primitive> {
	constructor(
		public name: N,
		public required: R,
		public primitive: P,
		public help: string,
		public fallback: undefined | Typify<P>,
	) {}
}

export class Param<R extends boolean, P extends Primitive> {
	constructor(
		public required: R,
		public primitive: P,
		public help: string,
		public fallback: undefined | Typify<P>,
	) {}
}

