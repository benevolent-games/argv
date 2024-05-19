
import {analyze} from "./analyze.js"
import {CommandTree} from "./types/commands.js"
import {arg, command, param} from "./helpers.js"
import {expect} from "../testing/framework/expect.js"
import {testSuite} from "../testing/framework/test-suite.js"

function testing<C extends CommandTree>(commands: C) {
	return (input: string) => {
		const analysis = analyze({
			commands,
			argw: input
				.split(/\s+/gim)
				.filter(s => s.length > 0),
		})
		if (!analysis)
			throw new Error("null analysis")
		return analysis
	}
}

export default testSuite({

	//
	// basics
	//

	async "no inputs, no problem"() {
		const commands = command({args: [], params: {}, help: `help`})
		analyze({argw: [], commands})
		analyze({argw: ["extra"], commands})
		expect().that(!!analyze({argw: [], commands})?.command).is(true)
		expect().that(analyze({argw: ["extra"], commands})?.argx[0]).is("extra")
	},

	...(function args() {
		const test = testing(command({
			help: ``,
			args: [
				arg.required("alpha", String),
				arg.optional("bravo", Number),
				arg.default("charlie", Number, {fallback: 1}),
			],
			params: {},
		}))
		return {
			async "args, all modes"() {
				const a = test(`arcturus 420 123`)
				expect().that(a.tree.args.alpha).is("arcturus")
				expect().that(a.tree.args.bravo).is(420)
				expect().that(a.tree.args.charlie).is(123)
			},
			async "args, use default fallback"() {
				const a = test(`arcturus 420`)
				expect().that(a.tree.args.alpha).is("arcturus")
				expect().that(a.tree.args.bravo).is(420)
				expect().that(a.tree.args.charlie).is(1)
			},
			async "args, missing required"() {
				expect().that(() => test(``)).throws()
			},
			async "args, wrong number type"() {
				expect().that(() => test(`arcturus WRONG`)).throws()
			},
		}
	}()),

	...(function params() {
		const test = testing(command({
			help: ``,
			args: [],
			params: {
				delta: param.required(String),
				echo: param.optional(Number),
				foxtrot: param.default(Number, {fallback: 2}),
				golf: param.flag("g"),
			},
		}))
		return {
			async "params, all modes"() {
				const a = test(`--delta=a --echo=1 --foxtrot=22 --golf=yes`)
				expect().that(a.tree.params.delta).is("a")
				expect().that(a.tree.params.echo).is(1)
				expect().that(a.tree.params.foxtrot).is(22)
				expect().that(a.tree.params.golf).is(true)
			},
			async "params, optional and default"() {
				const a = test(`--delta=a`)
				expect().that(a.tree.params.delta).is("a")
				expect().that(a.tree.params.echo).is(undefined)
				expect().that(a.tree.params.foxtrot).is(2)
				expect().that(a.tree.params.golf).is(false)
			},
			async "params, required"() {
				expect().that(() => test(``)).throws()
			},
			async "unknown param throws error"() {
				expect().that(() => test(`--delta=a --wut=123`)).throws()
			},
			async "params, flag"() {
				expect()
					.that(test(`--delta=a --golf=yes`).tree.params.golf)
					.is(true)
				expect()
					.that(test(`--delta=a --golf=no`).tree.params.golf)
					.is(false)
				expect()
					.that(test(`--delta=a`).tree.params.golf)
					.is(false)
				expect()
					.that(test(`--delta=a -g`).tree.params.golf)
					.is(true)
				expect()
					.that(test(`--delta=a -agb`).tree.params.golf)
					.is(true)
			},
		}
	}()),

	...(function multiple_commands() {
		const test = testing({
			alpha: command({args: [arg.required("a", String)], params: {}}),
			bravo: {
				charlie: command({args: [arg.required("a", String)], params: {}}),
				delta: command({args: [arg.required("a", String)], params: {}}),
			},
		})
		return {
			async "multiple commands"() {
				expect()
					.that(() => test(``))
					.throws()
				expect()
					.that(test(`alpha a`).tree.alpha?.args.a)
					.is("a")
				expect()
					.that(test(`bravo charlie a`).tree.bravo.charlie?.args.a)
					.is("a")
				expect()
					.that(test(`bravo delta a`).tree.bravo.delta?.args.a)
					.is("a")
			},
		}
	}()),
})

