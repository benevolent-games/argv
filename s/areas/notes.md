
## primary functions
- **`cli(argv, config)`**
  - you provide `argv` strings, and a `commands` outline
  - returns a `tree` object which has all the parsed args and params
  - returns `help` string output when `--help` is asked for
  - returns `error` string output when there is a validation/parsing error
- **`analyze(argw, options)`**
  - used by cli
  - parses the inputs while being aware of your commands
  - returns a `tree` which matches the shape of your `commands` outline
- **`parse(argx, options)`**
  - used by analyze
  - the dumbest low-level parse of arguments and params
  - isn't aware of high level concerns like commands or type conversions
  - merely parses the inputs into argument strings, param strings, and a set of flags

## argument strings
- **`argv`**
  - eg, `["/usr/bin/node", "/work/cli.js", "compress", "--quality=80", "./lol.png", "rofl"]`
  - strings you can get from `process.argv` in nodejs
  - this is what the `cli` function wants to work with
- **`argw`**
  - eg, `["compress", "--quality=80", "./lol.png", "rofl"]`
  - it's like argv, but with the first two elements (`bin` and `script`) chopped off
  - this is what the `analyze` function wants to operate on
- **`argx`**
  - eg, `["--quality=80", "./lol.png", "rofl"]`
  - it's argw but with the command parts chopped off
  - so if argw matches a valid command in your `commands` outline, your argx are all the strings *after* your valid command has been chopped off -- so these are the strings that are relevant to a specific command
  - this is what the `parse` function actually wants to operate on
- **`extraArgs`**
  - eg, `["rofl"]`
  - these are the excess arguments, which remain after we extract out all the valid arguments and parameters
  - returned by `analyze`

