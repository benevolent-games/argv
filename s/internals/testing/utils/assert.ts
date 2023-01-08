
import {AssertionError} from "./assertion-error.js"

export function assert(message: string, x: boolean) {
	if (!x)
		throw new AssertionError(message)
}
