
export type ParseOptions = {
	booleanParams?: string[]
}

export type Parsed = {
	args: string[]
	flags: Set<string>
	params: Map<string, string>
}

