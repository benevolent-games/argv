
import {ConfigError} from "../basic.js"

export class InvalidFlagError extends ConfigError {
	constructor(public invalidFlag: string) {
		super(`flag must be 1 character, and "${invalidFlag}" was not`)
	}
}

export class DuplicateArgError extends ConfigError {
	constructor(public arg: string) {
		super(`duplicate arg "${arg}" not allowed`)
	}
}

export class DuplicateFlagError extends ConfigError {
	constructor(public flag: string) {
		super(`duplicate flag "-${flag}" not allowed`)
	}
}

export class UnknownModeError extends ConfigError {
	constructor() {
		super(`unknown mode for arg or param`)
	}
}

export class UnknownPrimitiveError extends ConfigError {
	constructor(public name: string) {
		super(`unknown primitive for "${name}"`)
	}
}

