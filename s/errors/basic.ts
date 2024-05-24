
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
export class ConfigError extends ArgvError {
	constructor(message: string) {
		super(`(Argv Config Error) ${message}`)
	}
}

/** user error in supplying command line inputs. */
export class MistakeError extends ArgvError {
	constructor(message: string) {
		super(`${message}, ${pleaseSeekHelp()}`)
	}
}

/** devs should throw this error in an `execute` function, if they want argv to pretty-print the error. */
export class ExecutionError extends ArgvError {}

/** happens when user-provided onExit doesn't actually end the process (also useful in testing). */
export class ExitFail extends ArgvError {}

// i just think this is fun
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
		`get --help`,
		`please get --help`,
	]
	return choices[Math.floor(Math.random() * choices.length)]
}

