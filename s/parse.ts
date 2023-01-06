
import {Spec} from "./types/spec.js"
import {Type} from "./types/type.js"
import {Command} from "./types/command.js"
import {Argspec} from "./types/argspec.js"
import {Primitive} from "./types/primitive.js"
import {Paramspec} from "./types/paramspec.js"

export function parse<A extends Argspec, P extends Paramspec>({
		argv,
		argorder,
		args,
		params,
	}: Spec<A, P>) {

	if (argorder.length !== Object.keys(args).length)
		throw new Error("mismatch between 'params' and 'ordering'")

	const getFieldType = (name: keyof P) => params[name]
	const getParamType = (name: keyof A) => args[name]

	function parseValue<T extends Type>(type: T, arg: string): Primitive<T> {
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

	let paramIndex = 0
	let assignNextValueToField: undefined | keyof P = undefined
	const [executable, module, ...rawArgs] = argv

	const result = <Command<A, P>>{
		executable,
		module,
		args: {},
		params: {},
	}

	for (const arg of rawArgs) {
		if (assignNextValueToField) {
			const name = assignNextValueToField
			assignNextValueToField = undefined
			result.params[name] = parseValue(getFieldType(name), arg)
		}
		else {
			if (arg.startsWith("--")) {
				assignNextValueToField = arg
			}
			else {
				const index = paramIndex++
				const name = argorder[index]
				result.args[name] = parseValue(getParamType(name), arg)
			}
		}
	}

	return result
}
