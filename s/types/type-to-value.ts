
import {Type} from "./type.js"

export type TypeToValue<T extends Type> = (

	T extends StringConstructor
		? string

	: T extends NumberConstructor
		? number

	: T extends BooleanConstructor
		? boolean

	: never
)
