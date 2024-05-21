
import {ConfigError} from "../../errors.js"

export type Primitive = typeof Boolean | typeof Number | typeof String
export type Validator<P extends Primitive> = (value: Typify<P>) => Typify<P>

export type Typify<P extends Primitive> = (
	P extends typeof Boolean ? boolean
	: P extends typeof Number ? number
	: P extends typeof String ? string
	: never
)

export function primitiveName(primitive: Primitive) {
	switch (primitive) {
		case Boolean: return "boolean"
		case Number: return "number"
		case String: return "string"
		default: throw new ConfigError("unknown primitive")
	}
}

