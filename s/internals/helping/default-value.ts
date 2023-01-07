
import {val} from "./val.js"
import {palette} from "./palette.js"
import {Type} from "../../types/type.js"
import {ZField} from "../../types/field.js"

export function defaultValue(field: ZField.Default<Type>) {
	return "default" in field
		? " " + palette.value(val(field.default))
		: ""
}
