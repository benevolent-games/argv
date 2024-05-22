
import {MistakeError} from "../basic.js"

function pleaseSeekHelp() {
	const choices = [
		`seek --help`,
		`please seek --help`,
		`try seeking --help`,
		`consider seeking --help`,

		`ask for --help`,
		`please ask for --help`,
		`try asking for --help`,
		`consider asking for --help`,
		`it's okay to ask for --help`,

		`you need --help`,
		`get some --help`,
	]
	return choices[Math.floor(Math.random() * choices.length)]
}

/** user input failed custom validation. */
export class ValidationError extends MistakeError {}

export class RedundantParamError extends MistakeError {
	constructor(param: string) {
		super(`redundant param --${param} already provided, ${pleaseSeekHelp()}`)
	}
}

export class RedundantFlagError extends MistakeError {
	constructor(flag: string) {
		super(`redundant flag -${flag} already provided, ${pleaseSeekHelp()}`)
	}
}

export class CommandNotFoundError extends MistakeError {
	constructor() {
		super(`invalid command, ${pleaseSeekHelp()}`)
	}
}

export class RequiredArgError extends MistakeError {
	constructor(public arg: string) {
		super(`required argument ${arg} is missing, ${pleaseSeekHelp()}`)
	}
}

export class RequiredParamError extends MistakeError {
	constructor(public param: string) {
		super(`required param --${param} is missing, ${pleaseSeekHelp()}`)
	}
}

export class UnknownParamError extends MistakeError {
	constructor(public param: string) {
		super(`unknown param --${param} is unwanted, ${pleaseSeekHelp()}`)
	}
}

export class UnknownFlagError extends MistakeError {
	constructor(public flag: string) {
		super(`unknown flag -${flag} is unwanted, ${pleaseSeekHelp()}`)
	}
}

export class InvalidNumberError extends MistakeError {}

export class OpenParamError extends MistakeError {
	constructor(public param: string) {
		super(`no value was provided for --${param}`)
	}
}

