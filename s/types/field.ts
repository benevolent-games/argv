
import {Type} from "./type.js"
import {Values} from "./values.js"
import {ZOption} from "../internals/option.js"
import {TypeToValue} from "./type-to-value.js"
import {ValueToType} from "./value-to-type.js"
import {ZRequirement} from "../internals/requirement.js"

export namespace ZField {
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

	export type Group = {
		[key: string]: Any<Type>
	}

	export type GroupFromValues<X extends Values> = {
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
