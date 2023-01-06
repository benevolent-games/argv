
import {Values} from "./values.js"
import {Field, Field2} from "./field.js"
import {ValueToType} from "./value-to-type.js"

export type Fields2<X extends Values> = {
	[P in keyof X]: Field2<ValueToType<X[P]>>
}

export type Fields<X extends Values> = {
	[P in keyof X]: Field<ValueToType<X[P]>>
}
