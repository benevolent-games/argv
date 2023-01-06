
import {Type} from "./type.js"
import {ZField} from "./field.js"
import {Values} from "./values.js"
import {Fields2} from "./fields.js"
import {TypeToValue} from "./type-to-value.js"
import {ZRequirement} from "../internals/requirement.js"

export type ZFieldsToResults<F extends ZField.Group<Values>> = {
	[key in keyof F]: F[key] extends ZField.Option<F[key]["type"]>
		? TypeToValue<F[key]["type"]> | void
		: TypeToValue<F[key]["type"]>
}

export type FieldsToResults<F extends Fields2<Values>> = {
	[key in keyof F]: F[key] extends ZRequirement<Type>
		? TypeToValue<F[key]["type"]>
		: TypeToValue<F[key]["type"]> | void
}
