
import {expect} from "./utils/expect.js"
import {runTests} from "./utils/run-tests.js"
import {dummyCommands, dummyProgram, exampleProgram} from "./specs/dummy-command.js"
import {icecreamProgram} from "./icecream-command.js"

runTests({

	async "basic parsing doesn't throw any errors"() {
		const {simple, nested} = dummyCommands
		dummyProgram(simple, [])
		dummyProgram(nested, ["alpha"])
		dummyProgram(nested, ["bravo", "charlie"])
		dummyProgram(nested, ["delta", "echo", "foxtrot"])
	},

	async "icecream parsing works"() {
		const program = icecreamProgram()

		expect("picks up 'vessel' arg")
			.that(program("cone", "--scoops", "5").args.vessel)
			.is("cone")

		expect("picks up 'scoops' param")
			.that(program("cone", "--scoops", "5").params.scoops)
			.is(5)
	},

	async "icecream parsing validation"() {
		const program = icecreamProgram()

		expect("throws error when scoops is omitted")
			.that(() => program("cone"))
			.throws()
	},
})
