
import {MistakeError} from "../basic.js"

/** user input failed custom validation. */
export class ValidationError extends MistakeError {}

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

export class OpenParamError extends MistakeError {
	constructor(public paramName: string) {
		super(`no value was provided for "--${paramName}"`)
	}
}

