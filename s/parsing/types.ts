
export type Parsed = {
	bin: string
	script: string
	args: string[]
	flags: Set<string>
	params: Map<string, string>
}

