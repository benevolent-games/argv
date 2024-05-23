
export const obmap = <Ob extends object, Value>(
		o: Ob,
		transform: ObTransform<Ob, Value>,
	) => {

	return Object.fromEntries(
		Object.entries(o).map(
			([key, value]: any) => [key, transform(value, key)]
		)
	) as {[P in keyof Ob]: Value}
}

type ObTransform<Ob extends object, Value> = (
	(value: Ob[keyof Ob], key: keyof Ob) => Value
)

