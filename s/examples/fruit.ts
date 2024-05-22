#!/usr/bin/env node

import {cli} from "../areas/cli/cli.js"
import {command, choice, arg, param} from "../areas/analysis/helpers.js"

const {args, params} = cli(process.argv, {
	name: "fruit",
	commands: command({
		args: [
			arg("kind").required(String, choice(["apple", "orange", "banana"])),
		],
		params: {
			count: param.default(Number, {fallback: 1}),
			peeled: param.flag("p"),
		},
	}),
}).tree

args.kind // "apple"
params.count // 1
params.peeled // false

console.log({args, params})
