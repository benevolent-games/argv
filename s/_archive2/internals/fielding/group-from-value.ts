
import {Any} from "./field.js"
import {Values} from "./values.js"
import {ValueToType} from "./value-to-type.js"

export type GroupFromValues<X extends Values> = {
	[key in keyof X]: Any<ValueToType<X[key]>>
}
