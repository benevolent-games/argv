
export function integer_between(min: number, max: number) {
	return (n: number) => {
		const isInteger = n % 1 === 0
		const isMinOkay = n >= min
		const isMaxOkay = n <= max

		if (!isInteger)
			throw new Error(`${n} is not an integer`)

		if (!isMinOkay || !isMaxOkay)
			throw new Error(`${n} is not within range ${min} to ${max}`)

		return n
	}
}

