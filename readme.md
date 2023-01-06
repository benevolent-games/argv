
# 🎛️ `@benev/argv` *command line argument parser*

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
2. import the cli function
    ```js
    import {parse} from "@benev/argv"
    ```
3. specify your params and options fields for parsing
    ```js
    const {args, params} = parse({

      // process.argv is a nodejs builtin
      argv: process.argv,

      // positional arguments your program will accept
      argorder: ["mode", "amount"],

      // define which type of parsing to use for each argument
      args: {
        mode: String,
        amount: Number,
      },

      // options your program will accept
      params: {
        "--label": String,
        "--port": Number,
        "--importmap": String,
        "--verbose": Boolean,
      },
    })
    ```
4. now you can access your args and params
    ```js
    // example command:
    //   main.js coolmode --verbose true --port 8021

    args.mode
      // "coolmode"

    params["--verbose"]
      // true

    params["--port"]
      // 8021
    ```

<br/>

## notes

- argv is very simple. it just parses the args and params.
- it uses exact names like `--verbose`, so the typescript typings work.
- it treats everything like it's optional.
- it doesn't provide a `--help` guide.
- maybe one day i'll add that stuff, but you can do that stuff in your own second pass.
