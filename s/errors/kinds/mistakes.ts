
import {MistakeError} from "../basic.js"

/** user input failed custom validation. */
export class ValidationError extends MistakeError {}

export class RedundantParamError extends MistakeError {
	constructor(param: string) {
		super(`redundant param --${param} already provided`)
	}
}

export class RedundantFlagError extends MistakeError {
	constructor(flag: string) {
		super(`redundant flag -${flag} already provided`)
	}
}

export class CommandNotFoundError extends MistakeError {
	constructor() {
		super(`ask for --help to see available commands.`)
	}
}

export class RequiredArgError extends MistakeError {
	constructor(public arg: string) {
		super(`required argument ${arg} is missing`)
	}
}

export class RequiredParamError extends MistakeError {
	constructor(public param: string) {
		super(`required param --${param} is missing`)
	}
}

export class UnknownParamError extends MistakeError {
	constructor(public param: string) {
		super(`unknown param --${param} is unwanted`)
	}
}

export class UnknownFlagError extends MistakeError {
	constructor(public flag: string) {
		super(`unknown flag -${flag} is unwanted`)
	}
}

export class InvalidNumberError extends MistakeError {}

export class OpenParamError extends MistakeError {
	constructor(public param: string) {
		super(`no value was provided for --${param}`)
	}
}

