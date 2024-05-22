
// errors
export * from "./errors/basic.js"
export * from "./errors/kinds/config.js"
export * from "./errors/kinds/mistakes.js"

// cli
export * from "./areas/cli/cli.js"
export * from "./areas/cli/themes.js"
export {CliConfig, cliConfig} from "./areas/cli/types.js"

// analysis
export * from "./areas/analysis/analyze.js"
export {CommandTree} from "./areas/analysis/types/commands.js"
export {AnalyzeOptions, Analysis} from "./areas/analysis/types/analysis.js"
export * from "./areas/analysis/helpers.js"
export * as helpers from "./areas/analysis/helpers.js"
export * as validators from "./areas/analysis/validators.js"

// parsing
export * from "./areas/parsing/parse.js"

// text tools
export * from "./tooling/text/coloring.js"
export * from "./tooling/text/undent.js"
export * from "./tooling/text/wrap.js"
export * from "./tooling/text/textbrick.js"
export * from "./tooling/text/indent.js"

// other tools
export * from "./tooling/death-with-dignity.js"
export * from "./tooling/logger.js"

