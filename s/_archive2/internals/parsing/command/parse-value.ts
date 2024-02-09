
import {Type} from "../../fielding/type.js"
import {TypeToValue} from "../../fielding/type-to-value.js"
import {affirmatives} from "../program/affirmatives.js"

export function parseValue<T extends Type>(
		type: T,
		arg: string,
	): TypeToValue<T> {

	switch (type) {

		case String:
			return <any>arg

		case Number:
			return <any>Number(arg)

		case Boolean:
			return <any>affirmatives.includes(arg.toLowerCase())

		default:
			throw new Error("unknown type")
	}
}
