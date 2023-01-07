
# 🎛️ `@benev/argv`

***command line argument parser***

🤖 for making node cli programs  
🕵️‍♂️ designed for proper typescript typings  
🏗️ experimental design, breaking changes likely  
🧼 zero dependencies  
💖 made free and open source, just for you  

<br/>

## argv instructions

1. install via npm
    ```sh
    npm install @benev/argv
    ```
1. import the cli function
    ```ts
    import {cli} from "@benev/argv"
    ```
1. formalize types for your arguments and parameters
    ```ts
    export type Args = {
      environment: string
      suite: string
    }

    export type Params = {
      "--label": string
      "--verbose": boolean
      "--port": number
    }
    ```
1. specify your cli, and perform the parsing
    ```ts
    const {args, params} = cli<Args, Params>()({

      // your program's name
      bin: "myprogram",

      // process.argv is a nodejs builtin
      argv: process.argv,

      // terminal width, used for text-wrapping
      columns: process.stdout.columns,

      // link to your readme, for +help
      readme: "https://github.com/@benev/argv",

      // explainer for your menu, for +help
      help: "my first command line program!",

      // positional arguments your program will accept
      argorder: ["currency", "amount"],

      // arguments your program will accept
      args: {
        currency: {
          type: String,
          mode: "requirement",
          help: "currency, like 'usd' or 'cad'",
        },
        amount: {
          type: Number,
          mode: "default",
          default: 123,
          help: "amount of money",
        },
      },

      // parameters your program will accept
      params: {
        "--label": {
          type: String,
          mode: "option",
          help: "a cool title",
        },
        "--verbose": {
          type: Boolean,
          mode: "option",
          help: "display additional information",
        },
        "--port": {
          type: Number,
          mode: "default",
          default: 8021,
          help: "tcp port server will listen on",
        },
      },
    })
    ```
1. now you can access your args and params
    ```js
    // example command:
    //   main.js usd +verbose --port 8021

    args.currency
      // "usd"

    args.amount
      // 123

    params["--label"]
      // undefined

    params["--verbose"]
      // true

    params["--port"]
      // 8021
    ```

<br/>

## notes

- argv uses exact names, like `--param`, so the typescript typings work.
- typings work best if you declare `Args` and `Params` types, but it can infer some of it if you omit them.
- these are equivalent ways to pass a param:
  - `--param true`
  - `--param "true"`
  - `--param=true`
  - `--param="true"`
  - `+param` *(sets to boolean true)*
- boolean parsing regards these as `true` (case-insensitive):
  - `"true"`
  - `"yes"`
  - `"y"`
  - `"on"`
  - `"ok"`
  - `"enabled"`
