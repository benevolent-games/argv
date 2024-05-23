
import {MistakeError} from "../basic.js"

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
		super(`invalid command`)
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

export class OpenParamError extends MistakeError {
	constructor(public param: string) {
		super(`no value was provided for --${param}`)
	}
}

