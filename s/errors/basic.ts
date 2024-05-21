
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

