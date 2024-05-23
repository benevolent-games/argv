
export type IngestFn<T> = (input: string | undefined) => T
export type CoerceFn<T> = (input: string) => T
export type ValidateFn<T> = (input: T) => T

export type Unit<T> = {
	ingest: IngestFn<T>
	help?: string
} & UnitReflection

export type UnitReflection = {
	mode: string
	type: string
	fallback?: string
}

export type Arg<N extends string = string, T = any> = {name: N} & Unit<T>
export type Param<T = any> = {flag?: string} & Unit<T>
export type Args = Arg[]
export type Params = Record<string, Param>

export type DistillInput<I extends Unit<any>> = I extends Unit<infer T> ? T : never

export type Opts<T> = {
	help?: string
	validate?: ValidateFn<T>
}

export type ModeFn<T, Z extends any[]> = (type: Type<T>, ...z: Z) => Unit<T>

export type Type<T> = {
	name: string
	coerce: CoerceFn<T>
}

