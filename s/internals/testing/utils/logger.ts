
export abstract class Logger {
	abstract log(s: string): void
	abstract error(s: string): void
}

export class ConsoleLogger extends Logger {
	log(s: string) { console.log(s) }
	error(s: string) { console.error(s) }
}

export class DisabledLogger extends Logger {
	log(s: string) {}
	error(s: string) {}
}

export class MemoryLogger extends Logger {
	logs: string[] = []
	errors: string[] = []
	log(s: string) { this.logs.push(s) }
	error(s: string) { this.errors.push(s) }
}
