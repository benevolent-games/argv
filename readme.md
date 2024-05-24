
# 🎛️ `@benev/argv`

**the greatest command line parser for typescript, maybe**

🤖 for making node cli programs  
🕵️ incredible typescript type inference  
🧼 zero dependencies  
💖 made free and open source, just for you  

<br/>

## 💁 autogenerated `--help` pages

```sh
pizza --help
```

![](https://imgur.com/aSAP8cb.png)

```sh
pizza large --pepperoni --slices 3

# or, any way you like it
pizza --slices=9 large
pizza medium -p --slices=5
pizza small --pepperoni="no" --slices="2"
```

<br/>

## 📖 build your `cli`

1. install `@benev/argv` via npm
    ```sh
    npm i @benev/argv
    ```
1. import stuff
    ```ts
    import {cli, command, arg, param, string, number} from "@benev/argv"
    ```
1. specify your cli, and perform the parsing
    ```ts
    const {args, params} = cli(process.argv, {
      name: "pizza",
      commands: command({
        args: [
          arg("size").required(string),
        ],
        params: {
          slices: param.default(number, "1"),
          pepperoni: param.flag("p"),
        },
      }),
    }).tree
    ```
1. now you have your args and params
    ```js
    args.size // "large"
    params.slices // 5
    params.pepperoni // true
    ```
    - this is the "flat strategy" for receiving your args and params.  
      simple, easy!
1. ***all your types automagically work!***  
    it took me a long time to make it elegant and cool like this.

<br/>

## 🧑‍🔧 configuring your cli's `args` and `params`
- let's start by making a command
    ```ts
    command({
      args: [],
      params: {},
    })
    ```
- a command can optionally accept a `help` string
    ```ts
    command({
      help: "what a time to be alive!",
      args: [],
      params: {},
    })
    ```
- let's add positional args
    ```ts
    command({
      args: [
        arg("active").required(boolean),
        arg("count").default(number, "101"),
        arg("name").optional(string),
      ],
      params: {},
    })
    ```
    - args are in an array, so each needs a name, eg "active" above
    - there are three modes, `required`, `default`, and `optional`
    - `default` requires a fallback value
    - there are three basic types, `string`, `number`, and `boolean`, but you can make your own types
- now let's talk about params
    ```ts
    command({
      args: [],
      params: {
        active: param.required(boolean),
        count: param.default(number, "101"),
        name: param.optional(string),
        verbose: param.flag("-v"),
      },
    })
    ```
    - pretty similar. but see the way the names are different?
    - there's a new variety of param called `flag`, of course, it's automatically a `boolean` (how could it be otherwise?)

### validation for args and params
- you can set a `validate` function on any `arg` or `param`
    ```ts
    arg("quality").optional(number, {
      validate: n => {
        if (n > 100) throw new Error("to big")
        if (n < 0) throw new Error("to smol")
        return n
      },
    })
    ```
    - if you throw any error in a `validate`, it will be printed all nice-like to the user

### `help` literally everywhere!
- in fact, every `arg` and `param` can have its own `help`
    ```ts
    command({
      help: "it's the best command, nobody makes commands like me",

      args: [
        arg("active").required(boolean, {
          help: "all systems go?",
        }),

        arg("count").default(number, "101", {
          help: "number of dalmatians",
        }),

        arg("name").optional(string, {
          help: `
            see this multi-line string?
            it will be trimmed all nicely on the help page.
          `
        }),
      ],

      params: {
        active: param.required(boolean, {
          help: "toggle this carefully!",
        }),

        count: param.default(number, "101", {
          help: "classroom i'm late for",
        }),

        name: param.optional(string, {
          help: "pick your pseudonym",
        }),

        verbose: param.flag("-v", {
          help: "going loud",
        }),
      },
    })
    ```

### `choice` helper
- you can use the `choice` helper to set up a multiple choice string
    ```ts
    param.required(string, choice(["thick", "thin"]))
    ```
- you can add a help to it as well
    ```ts
    param.required(string, choice(["thick", "thin"], {
      help: "made with organic whole-wheat flour",
    }))
    ```

### `list` helper
- okay this is seriously crazy cool, check this out
    ```ts
    param.required(list(string))
    ```
- you can just wrap any type in the `list` helper
    - user inputs comma-separated values `mp3,wav,ogg`
    - you get an array `["mp3", "wav", "ogg"]`
- is works with *any type*, like numbers and such
    ```ts
    param.required(list(number))
    ```
    - now you get a `number[]` array (not strings)
    - yes, `list` preserves the type's validation

<br/>

## 🌳 tree of multiple `commands`
- the `commands` object is a recursive tree with `command` leaves
    ```ts
    const {tree} = cli(process.argv, {
      name: "converter",
      commands: {
        image: command({
          args: [],
          params: {
            quality: param.required(number),
          },
        }),
        media: {
          audio: command({
            args: [],
            params: {
              mono: param.required(boolean),
            },
          }),
          video: command({
            args: [],
            params: {
              codec: param.required(string),
            },
          })
        },
      },
    })
    ```

### flat strategy
- you get this `tree` object that reflects its shape
    ```ts
    tree.image?.params.quality // 9
    tree.media.audio?.mono // false
    tree.media.video?.codec // "av1"
    ```
    - all the commands are `undefined` except for the "selected" command
    - and yes, all the typings work

### command-execution strategy
- you can choose to provide each command with an async `execute` function
    ```ts
    command({
      args: [],
      params: {
        active: param.required(boolean),
        count: param.default(number, "101"),
      },
      async execute({params}) {
        params.active // true
        params.count // 101
      },
    })
    ```
    - your execute function receives fully-typed `args`, `params`, and some more stuff
- your `execute` function can opt-into pretty-printing errors (with colors) by throwing an `ExecutionError`
    ```ts
    import {ExecutionError, command} from "@benev/argv"

    async execute({params}) {
      throw new ExecutionError("scary error printed in red!")
    }
    ```
- if you choose to use this command-execution strategy, then you need to call your cli's final `execute` function
    ```ts
    // 👇 awaiting cli execution
    await cli(process.argv, {
      name: "pizza",
      commands: {
        meatlovers: command({
          args: [],
          params: {
            meatiness: param.required(number),
          },
          async execute({params}) {
            console.log(params.meatiness) // 9
          },
        }),
        hawaiian: command({
          args: [],
          params: {
            pineappleyness: param.required(number),
          },
          async execute({params}) {
            console.log(params.pineappleyness) // 8
          },
        }),
      },
    }).execute()
      // ☝️ calling cli final execute
    ```

<br/>

## 🛠️ custom types
- i can't believe i got all the types working for everything with custom types
- it's easy to make your own types
    ```ts
    const date = asType({
      name: "date",
      coerce: string => new Date(string),
    })
    ```
    - the `name` is shown in help pages
    - the `coerce` function takes a string input, and you turn it into anything you like
- then you can use 'em in your args and params like normal
    ```ts
    param.required(date)
    ```
- hey why not make a list of 'em while we're at it
    ```ts
    param.required(list(date))
    ```
- feeling spiffy? make a whole group of custom types with this one weird tip
    ```ts
    const date = asTypes({
      date: string => new Date(string),
      integer: string => Math.floor(Number(string)),
    })
    ```
    - `asTypes` will use your object's property names as the type `name`
- your custom types can throw errors and it works as validation
    ```ts
    const integer = asType({
      name: "integer",
      coerce: string => {
        const n = Number(string)

        if (isNaN(n))
          throw new Error("not a number")

        if (!Number.isSafeInteger(n))
          throw new Error("not a safe integer")

        return n
      },
    })
    ```

<br/>

## 🦚 custom themes
- you can set the theme for your --help pages
    ```ts
    import {themes} from

    await cli(process.argv, {

      // the default theme
      theme: themes.standard,

      ...otherStuff,
    }).execute()
    ```
    - maybe try `themes.seaside` for a more chill vibe
    - if you hate fun, use `themes.noColor` to disable ansi colors
- make your own theme like this
    ```ts
    import {theme, color} from

    const seaside = theme({
      plain: [color.white],
      error: [color.brightRed, color.bold],
      program: [color.brightCyan, color.bold],
      command: [color.cyan, color.bold],
      property: [color.blue],
      link: [color.brightBlue, color.underline],
      arg: [color.brightBlue, color.bold],
      param: [color.brightBlue, color.bold],
      flag: [color.brightBlue],
      required: [color.cyan],
      mode: [color.blue],
      type: [color.brightBlue],
      value: [color.cyan],
    })
    ```

<br/>

## 🌠 give me a github star!

- i worked way too hard on this
- please submit issues for any problems or questions
- maybe make a cool help theme and submit a PR for it

