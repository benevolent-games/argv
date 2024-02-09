
import {TestFailure} from "./test-failure.js"

export class FailedExpectation extends TestFailure {
	name = this.constructor.name
}
