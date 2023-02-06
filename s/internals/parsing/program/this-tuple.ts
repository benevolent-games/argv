
export const thisTuple = (a: string[]) => ({
	startsWith(b: string[]) {
		return a.reduce(
			(match, word, index) => (match && (word === b[index])),
			true,
		)
	}
})
