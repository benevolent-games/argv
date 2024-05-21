
import {Primitive, Typify, Validator} from "./primitives.js"

export type Params = Record<string, Param<Primitive>>

export type Param<P extends Primitive = Primitive> = (
	ParamRequired<P> | ParamOptional<P> | ParamDefault<P> | ParamFlag
)

export type ParamBase<P extends Primitive> = {
	primitive: P
	help: string | undefined
	validate: Validator<P>
}

export type ParamRequired<P extends Primitive> = {
	mode: "required"
} & ParamBase<P>

export type ParamOptional<P extends Primitive> = {
	mode: "optional"
} & ParamBase<P>

export type ParamDefault<P extends Primitive> = {
	mode: "default"
	fallback: Typify<P>
} & ParamBase<P>

export type ParamFlag = {
	mode: "flag"
	flag: string
} & ParamBase<typeof Boolean>

