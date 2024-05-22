
import {Primitive, Typify, Validator} from "./primitives.js"

export type Args = Arg<string, Primitive>[]

export type Arg<
		N extends string = string,
		P extends Primitive = Primitive,
	> = (
	ArgRequired<N, P> | ArgOptional<N, P> | ArgDefault<N, P>
)

export type ArgBase<N extends string, P extends Primitive> = {
	name: N
	primitive: P
	help: string | undefined
	validate: Validator<P>
}

export type ArgRequired<N extends string, P extends Primitive> = {
	mode: "required"
} & ArgBase<N, P>

export type ArgOptional<N extends string, P extends Primitive> = {
	mode: "optional"
} & ArgBase<N, P>

export type ArgDefault<N extends string, P extends Primitive> = {
	mode: "default"
	fallback: Typify<P>
} & ArgBase<N, P>

