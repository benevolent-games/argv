
import {Value} from "./value.js"

export type ValueToType<T extends Value> = (

	T extends string
		? StringConstructor

	: T extends number
		? NumberConstructor

	: T extends boolean
		? BooleanConstructor

	: never
)
