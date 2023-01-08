#!/usr/bin/env node

import {parse} from "../parse.js"
import {stdcolumns} from "../constants.js"
import {color} from "../../tools/colors.js"
import {stdtheme} from "../../theme.js"

const command = parse({
	program: "argv-echo",
	argv: process.argv,
	columns: process.stdout.columns ?? stdcolumns,
	argorder: ["a", "b"],
	args: {
		a: {type: String, mode: "option"},
		b: {type: String, mode: "option"},
	},
	params: {
		"--help": {
			type: Boolean,
			mode: "option",
		},
		"--label": {
			type: String,
			mode: "requirement",
			help: "title of this echo test",
		},
		"--port": {
			type: Number,
			mode: "default",
			default: 8080,
			help: "tcp port for a server or something",
		},
	},
})

console.log(color.blue("executable"), command.executable)
console.log(color.blue("module"), command.module)
console.log(stdtheme.arg("args"), command.args)
console.log(stdtheme.param("params"), command.params)
