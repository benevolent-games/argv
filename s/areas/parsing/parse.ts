
import {cleave} from "./utils/cleave.js"
import {ParseOptions, Parsed} from "./types.js"
import {OpenParamError} from "../../errors/kinds/mistakes.js"

/**
 * dumb command line parsing.
 *  - accepts 'argx' which are the argv strings after the bin and script.
 *  - no validation or anything like that, it has no expectations.
 *  - doesn't know about commands.
 *  - separates args into an array for you.
 *  - separates params into a map for you.
 *  - separates flags into a set for you.
 *  - you can provide `booleanParams` which are parameters that don't accept values.
 */
export function parse(
		argx: string[],
		{booleanParams = []}: ParseOptions = {},
	): Parsed {

	const {before, after} = cleave(argx, "--")
	const args: string[] = []
	const params = new Map<string, string>()
	const flags = new Set<string>()

	let openParam: string | null = null

	for (const string of before) {
		if (openParam) {
			params.set(openParam, string)
			openParam = null
		}
		else if (string.startsWith("--")) {
			const cut = string.slice(2)
			if (string.includes("=")) {
				const [name, ...parts] = cut.split("=")
				params.set(name, parts.join("="))
			}
			else {
				if (booleanParams.includes(cut))
					params.set(cut, "true")
				else
					openParam = cut
			}
		}
		else if (string.startsWith("-")) {
			const chars = string.slice(1).trim()
			for (const char of chars)
				flags.add(char)
		}
		else {
			args.push(string)
		}
	}

	for (const string of after)
		args.push(string)

	if (openParam !== null)
		throw new OpenParamError(openParam)

	return {args, flags, params}
}

