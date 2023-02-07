
import {FailedExpectation} from "./errors/failed-expectation.js"

export const expect = (message: string) => ({
	that: (subject: any) => ({

		is: (expected: any) => {
			if (subject !== expected)
				throw new FailedExpectation(
					`${message}, expected (${expected}), got (${subject})`
				)
		},

		throws: () => {
			let failed: string | undefined = undefined

			try {
				if (typeof subject !== "function")
					failed = "'that' must be a function to test .throws()"
				subject()
				failed = `${message} (failed to throw)`
			}
			catch (error) {}

			if (failed)
				throw new FailedExpectation(failed)
		},

	}),
})
