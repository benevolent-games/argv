
export type Primitive = typeof Boolean | typeof Number | typeof String

export type Typify<P extends Primitive> = (
	P extends typeof Boolean ? boolean
	: P extends typeof Number ? number
	: P extends typeof String ? string
	: never
)

