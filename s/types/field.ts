
import {Type} from "./type.js"
import {ZOption} from "../internals/option.js"
import {TypeToValue} from "./type-to-value.js"
import {ZRequirement} from "../internals/requirement.js"
import {Values} from "./values.js"
import {ValueToType} from "./value-to-type.js"

export namespace ZField {
	export type Mode = "required" | "optional" | "defaulting"

	export type Base<T extends Type> = {
		mode: Mode
		type: T
		help?: string
	}

	export type Requirement<T extends Type> = Base<T> & {mode: "required"}
	export type Option<T extends Type> = Base<T> & {mode: "optional"}
	export type Default<T extends Type> = Base<T> & {
		mode: "defaulting"
		default: TypeToValue<T>
	}

	export type Any<T extends Type> = (
		| Requirement<T>
		| Option<T>
		| Default<T>
	)

	export type Group<X extends Values> = {
		[key in keyof X]: Any<ValueToType<X[key]>>
	}
}

// export type Field3<T extends Type>

export type Field2<T extends Type> = (
	| ZOption<T>
	| ZRequirement<T>
)

export interface Field<T extends Type> {
	type: T
	default?: TypeToValue<T>
	help?: string
}
