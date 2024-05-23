
export type Coerce<In, Out> = (input: In) => Out

export type Unit<T> = {
	help?: string
	coerce: Coerce<string|undefined, T>
}

export type Arg<N extends string = string, T = any> = {name: N} & Unit<T>
export type Param<T = any> = {flag?: string} & Unit<T>
export type Args = Arg[]
export type Params = Record<string, Param>

export type DistillInput<I extends Unit<any>> = I extends Unit<infer T> ? T : never

export type Opts<T> = {
	help?: string
	coerce?: Coerce<T, T>
}

export type ArchetypeFn<T> = (...z: any[]) => Unit<T>
export const archetypeFn = <Fn extends ArchetypeFn<any>>(fn: Fn) => fn

export type TypeFn<T> = Coerce<string, T>

