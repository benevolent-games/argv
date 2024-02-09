
import {Type} from "./type.js"
import {TypeToValue} from "./type-to-value.js"

export type Mode = "requirement" | "option" | "default"

export type Base<T extends Type> = {
	mode: Mode
	type: T
	help?: string
}

export type Requirement<T extends Type> = Base<T> & {mode: "requirement"}
export type Option<T extends Type> = Base<T> & {mode: "option"}
export type Default<T extends Type> = Base<T> & {
	mode: "default"
	default: TypeToValue<T>
}

export type Any<T extends Type> = (
	| Requirement<T>
	| Option<T>
	| Default<T>
)
