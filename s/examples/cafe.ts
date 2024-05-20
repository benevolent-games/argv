#!/usr/bin/env node

import {cli} from "../cli/cli.js"
import {themes} from "../cli/themes.js"
import {arg, command, param} from "../analysis/helpers.js"

const input = cli(process.argv, {
	name: "cafe",
	// theme: themes.dracula,
	columns: process.stdout.columns,
	help: `
		a vibrant italian café that tantalizes taste buds with its perfect combination of artisanal pizzas and creamy, homemade gelato.
	`,
	commands: {
		pizza: command({
			help: `made with the finest mozza, mama mia!`,
			args: [
				arg.required("size", String, {help: `small, medium, or large?`}),
				arg.default("crust", String, {fallback: "thick", help: `thick or thin`}),
			],
			params: {
				slices: param.required(Number, {help: `we serve it by the slice`}),
				pepperoni: param.flag("p", {help: `
					we go heavy on the meaty pepperoni
				`}),
				mushrooms: param.flag("m", {help: `fresh fungi`}),
			},
		}),
		icecream: command({
			help: `it's actually gelatto!`,
			args: [
				arg.default("vessel", String, {fallback: "cone", help: `cone, waffle, or bowl?`}),
			],
			params: {
				scoops: param.required(Number, {help: `how many scoops do you want?`}),
				flavor: param.default(String, {fallback: "vanilla", help: `pick your favorite`}),
				"choco-dipped": param.flag("d", {help: `dunked for a chocolate coating`}),
			},
		}),
	},
})

console.log("pizza", input.tree.pizza)
console.log("icecream", input.tree.icecream)

