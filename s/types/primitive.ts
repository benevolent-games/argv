
import {Type} from "./type.js"

export type Primitive<T extends Type> = (

	T extends StringConstructor
		? string

	: T extends NumberConstructor
		? number

	: T extends BooleanConstructor
		? boolean

	: never
)
