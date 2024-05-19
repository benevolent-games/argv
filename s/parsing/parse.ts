
import {ParseOptions, Parsed} from "./types.js"

export function parse(
		argx: string[],
		options?: ParseOptions,
	): Parsed {

	const args: string[] = []
	const params = new Map<string, string>()
	const flags = new Set<string>()

	const booleanParams = options?.booleanParams ?? []
	let openParam: string | null = null

	for (const string of argx) {
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

	return {args, flags, params}
}

