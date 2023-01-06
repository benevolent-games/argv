
import {Type} from "../types/type.js"
import {Primitive} from "../types/primitive.js"

export function parseValue<T extends Type>(
		type: T,
		arg: string,
	): Primitive<T> {

	switch (type) {

		case String:
			return <any>arg

		case Number:
			return <any>Number(arg)

		case Boolean:
			return <any>(arg === "true")

		default:
			throw new Error("unknown type")
	}
}
