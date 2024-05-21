
import {analyze} from "./analyze.js"
import {splitty} from "../../testing/argv.js"
import {CommandTree} from "./types/commands.js"
import {arg, command, param} from "./helpers.js"
import {expect} from "../../testing/framework/expect.js"
import {testSuite} from "../../testing/framework/test-suite.js"

function testing<C extends CommandTree>(commands: C) {
	return (input: string) => {
		const analysis = analyze(splitty(input), {commands})
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
		const o = {commands: command({args: [], params: {}})}
		analyze(splitty(""), o)
		analyze(splitty("extra"), o)
		expect().that(!!analyze(splitty(""), o)?.command).is(true)
		expect().that(analyze(splitty("extra"), o)?.extraArgs[0]).is("extra")
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
			async "extraArgs"() {
				expect().that(test(`arcturus 420 123 abc`).extraArgs[0]).is("abc")
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
				hotel: param.flag("h"),
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
					.that(test(`--delta=a -hg`).tree.params.golf)
					.is(true)
			},
		}
	}()),

	async "cannot configure duplicate args"() {
		expect().that(() => command({args: [
			arg.optional("alpha", String),
			arg.optional("alpha", String),
		], params: {}})).throws()
	},

	async "cannot configure duplicate flags"() {
		expect().that(() => command({args: [], params: {
			alpha: param.flag("-a"),
			bravo: param.flag("-a"),
		}})).throws()
	},

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

