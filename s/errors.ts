
/**
 * base class for all known argv errors.
 *  - ideally, argv will only throw errors that are subclasses of this.
 */
export class ArgvError extends Error {
	constructor(message: string) {
		super(message)
		this.name = this.constructor.name
	}
}

/** developer error configuring argv. */
export class ConfigError extends ArgvError {}

/** user error in supplying command line inputs. */
export class MistakeError extends ArgvError {}

/** cli is expeceted to throw this during testing scenarios. */
export class FakeExit extends ArgvError {}

//
// ANALYSIS ERRORS
// ===============
// errors that might happen during `analyze`
//

/** user input has failed validation. */
export class ValidationError extends MistakeError {}

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

export class CommandNotFoundError extends MistakeError {
	constructor() {
		super(`ask for --help to see available commands.`)
	}
}

export class RequiredArgError extends MistakeError {
	constructor(public argName: string) {
		super(`required argument "${argName}" is missing`)
	}
}

export class RequiredParamError extends MistakeError {
	constructor(public paramName: string) {
		super(`required param "--${paramName}" is missing`)
	}
}

export class UnknownParamError extends MistakeError {
	constructor(public paramName: string) {
		super(`unknown param "--${paramName}" is unwanted`)
	}
}

export class UnknownFlagError extends MistakeError {
	constructor(public flag: string) {
		super(`unknown flag "-${flag}" is unwanted`)
	}
}

export class InvalidNumberError extends MistakeError {}

//
// PARSING ERRORS
// ==============
// errors that might happen during `parse`
//

export class OpenParamError extends MistakeError {
	constructor(public paramName: string) {
		super(`no value was provided for "--${paramName}"`)
	}
}

