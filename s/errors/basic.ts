
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
export class MistakeError extends ArgvError {
	constructor(message: string) {
		super(`${message}, ${pleaseSeekHelp()}`)
	}
}

/** cli is expeceted to throw this during testing scenarios. */
export class FakeExit extends ArgvError {}

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

