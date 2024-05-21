
export function cleave(argx: string[], cleaver: string) {
	let cleaved = false
	const before: string[] = []
	const after: string[] = []

	for (const string of argx) {
		if (string === cleaver)
			cleaved = true
		else {
			if (cleaved)
				after.push(string)
			else
				before.push(string)
		}
	}

	return {before, after, cleaved}
}

