
import {Logger} from "./logger.js"

export type OnDeath = (fn: DeathListener) => () => void
export type DeathListener = (exitCode: number) => void

/**
 * schedule your node process to die:
 *  - upon receiving sigint or sigterm (ctrl+c)
 *  - upon experiencing an uncaught exception or promise rejection
 *  - also, you can setup listeners to respond to the death
 */
export function deathWithDignity(
		logger: Logger = console,
		lastWillAndTestament?: DeathListener
	) {

	const rubberneckers = new Set<DeathListener>()

	if (lastWillAndTestament)
		rubberneckers.add(lastWillAndTestament)

	function death(exitCode: number) {
		for (const notifyNextOfKin of rubberneckers)
			notifyNextOfKin(exitCode)
		process.exit(exitCode)
	}

	process.on("SIGINT", () => {
		logger.log("💣 SIGINT")
		death(0)
	})

	process.on("SIGTERM", () => {
		logger.log("🗡️ SIGTERM")
		death(0)
	})

	process.on("uncaughtException", error => {
		logger.error("🚨 unhandled exception:", error)
		death(1)
	})

	process.on("unhandledRejection", (reason, error) => {
		logger.error("🚨 unhandled rejection:", reason, error)
		death(1)
	})

	const onDeath: OnDeath = listener => {
		rubberneckers.add(listener)
		return () => rubberneckers.delete(listener)
	}

	return {onDeath}
}

