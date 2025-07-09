
import {Logger} from "./logger.js"

export type OnDeath = (fn: DeathListener) => () => void
export type DeathListener = (exitCode: number) => (void | Promise<void>)

/**
 * schedule your node process to die:
 *  - upon receiving sigint or sigterm (ctrl+c)
 *  - upon experiencing an uncaught exception or promise rejection
 *  - also, you can setup listeners to respond to the death
 */
export function deathWithDignity(
		logger: Logger = console,
		lastWillAndTestament?: DeathListener,
	) {

	const listeners = new Set<DeathListener>()

	if (lastWillAndTestament)
		listeners.add(lastWillAndTestament)

	async function pleaseExit(exitCode: number) {
		await Promise.all([...listeners].map(fn => fn(exitCode)))
		process.exit(exitCode)
	}

	process.on("SIGINT", () => {
		logger.log("💣 SIGINT")
		pleaseExit(0)
	})

	process.on("SIGTERM", () => {
		logger.log("🗡️ SIGTERM")
		pleaseExit(0)
	})

	process.on("uncaughtException", error => {
		logger.error("🚨 unhandled exception:", error)
		pleaseExit(1)
	})

	process.on("unhandledRejection", (reason, error) => {
		logger.error("🚨 unhandled rejection:", reason, error)
		pleaseExit(1)
	})

	const onDeath: OnDeath = listener => {
		listeners.add(listener)
		return () => listeners.delete(listener)
	}

	return {onDeath, pleaseExit}
}

