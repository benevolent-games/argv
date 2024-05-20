
export function trimNewlines(s: string) {
	s = trimLeadingNewlines(s)
	s = trimTrailingNewlines(s)
	return s
}

export function trimLeadingNewlines(s: string) {
	const leading = /^\n*([\s\S]*)$/g.exec(s)
	if (leading)
		s = leading[1]
	return s
}

export function trimTrailingNewlines(s: string) {
	const trailing = /([\s\S*]*?)\n*$/g.exec(s)
	if (trailing)
		s = trailing[1]
	return s
}

