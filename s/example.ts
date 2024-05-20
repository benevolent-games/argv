#!/usr/bin/node

import {cli} from "./cli/cli.js"
import {arg, command, param} from "./analysis/helpers.js"

const input = cli(process.argv, {
	name: "restaurant",
	help: `are you in the mood for pizza, or icecream?`,
	commands: {
		pizza: command({
			help: `made with the finest mozza!`,
			args: [
				arg.required("size", String, {help: `small, medium, or large?`}),
			],
			params: {
				slices: param.required(Number, {help: `we serve it by the slice`}),
				pepperoni: param.flag("p", {help: `we go heavy on the meaty pepperoni`}),
				mushrooms: param.flag("m", {help: `fresh fungi`}),
			},
		}),
		icecream: command({
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

