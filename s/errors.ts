
export class ArgvError extends Error {
	constructor(message: string) {
		super(message)
		this.name = this.constructor.name
	}
}
export class ConfigError extends ArgvError {}
export class InputError extends ArgvError {}

export class ValidationError extends InputError {}

//////// analyze errors

export class NoExitError extends ArgvError {}

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

export class CommandNotFoundError extends InputError {
	constructor() {
		super(`ask for --help to see available commands.`)
	}
}

export class RequiredArgError extends InputError {
	constructor(public argName: string) {
		super(`required argument "${argName}" is missing`)
	}
}

export class RequiredParamError extends InputError {
	constructor(public paramName: string) {
		super(`required param "--${paramName}" is missing`)
	}
}

export class UnknownParamError extends InputError {
	constructor(public paramName: string) {
		super(`unknown param "--${paramName}" is unwanted`)
	}
}

export class UnknownFlagError extends InputError {
	constructor(public flag: string) {
		super(`unknown flag "-${flag}" is unwanted`)
	}
}

export class InvalidNumberError extends InputError {}

//////// parse errors

export class OpenParamError extends InputError {
	constructor(public paramName: string) {
		super(`no value was provided for "--${paramName}"`)
	}
}

