
import {Typify} from "./advanced.js"

export enum Mode {
	Required,
	Optional,
	Default,
}

export type Primitive = typeof Boolean | typeof Number | typeof String

export type CommandTree = Command<any, any> | Record<string, Command<any, any>>

export class Command<
		A extends Arg<Mode, string, Primitive>[],
		P extends Record<string, Param<Mode, Primitive>>
	> {
	constructor(
		public help: string | undefined,
		public args: A,
		public params: P,
	) {}
}

export class Arg<M extends Mode, N extends string, P extends Primitive> {
	constructor(
		public name: N,
		public mode: M,
		public primitive: P,
		public help: string,
		public fallback: undefined | Typify<P>,
	) {}
}

export class Param<M extends Mode, P extends Primitive> {
	constructor(
		public mode: M,
		public primitive: P,
		public help: string,
		public flag: undefined | string,
		public fallback: undefined | Typify<P>,
	) {}
}

