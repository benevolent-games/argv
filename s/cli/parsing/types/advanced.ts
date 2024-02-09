
import {Arg, Command, CommandTree, Mode, Param, Primitive} from "./basic.js"

export type Typify<P extends Primitive> = (
	P extends typeof Boolean ? boolean
	: P extends typeof Number ? number
	: P extends typeof String ? string
	: never
)

export type Argify<T extends Arg<Mode, string, Primitive>[]> = {
	[P in T[number]["name"]
		as Extract<T[number], {name: P}> extends {mode: (Mode.Required | Mode.Default)} ? P : never]:
			Typify<Extract<T[number], {name: P}>["primitive"]>
} & {
	[P in T[number]["name"]
		as Extract<T[number], {name: P}> extends {mode: Mode.Optional} ? P : never]?:
			Typify<Extract<T[number], {name: P}>["primitive"]>
}

export type Paramify<T extends Record<string, Param<Mode, Primitive>>> = {
	[K in keyof T
		as T[K]["mode"] extends (Mode.Required | Mode.Default) ? K : never]:
			Typify<T[K]["primitive"]>;
} & Partial<{
	[K in keyof T
		as T[K]["mode"] extends Mode.Optional ? K : never]:
			Typify<T[K]["primitive"]>;
}>

export type ParseCommand<C extends Command<any, any>> = {
	help: string
	args: Argify<C["args"]>
	params: Paramify<C["params"]>
	extras: string[]
}

export type ParseTree<C extends CommandTree> = (
	C extends Command<any, any>
		? ParseCommand<C>
		: C extends Record<string, Command<any, any>>
			? {[K in keyof C]?: ParseTree<C[K]>}
			: never
)

export type ParseResult<C extends CommandTree> = {
	help: boolean
	tree: ParseTree<C>
	command: undefined | Command<any, any>
}

