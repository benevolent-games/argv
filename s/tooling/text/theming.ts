
export type Theme = Record<string, ThemeFns>
export type ThemeFns = ((s: string) => string)[]
export type Palette<T extends Theme> = {[K in keyof T]: ((s: string) => string)}

export function makePalette<T extends Theme>(theme: T) {
	return Object.fromEntries(
		Object.entries(theme).map(([key, fns]) => [
			key,
			(s: string) => {
				for (const fn of fns)
					s = fn(s)
				return s
			},
		])
	) as Palette<T>
}

