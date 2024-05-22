
export function splitty(input: string) {
	return input
		.split(/\s+/gim)
		.filter(s => !!s)
}

export function argv(input: string = "") {
	const parts = splitty(input)
	return ["/usr/bin/node", "/work/example.js", ...parts]
}

