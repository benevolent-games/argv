
export const isDefined = <X>(x: X) => ({
	otherwiseThrow: (E: new(message: string) => Error) => ({
		withMessage: (message: string): NonNullable<X> => {
			if (x)
				return x
			else
				throw new E(message)
		}
	})
})
