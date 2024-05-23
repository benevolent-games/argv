
### v0.3.0
- (breaking) custom types!
    - import the types `import {string, number, boolean} from "@benev/argv"`
    - `String` becomes `string`
    - `Number` becomes `number`
    - `Boolean` becomes `boolean`
- (breaking) default fallback is no longer in the options
    ```ts
    // old
    param.default(string, {fallback: "hello"})

    // new
    param.default(string, "hello")
    ```
- new helpers, `asType`, `asTypes`, `list`

### v0.2.0
- (breaking) massive nuclear rewrite

### v0.1.0
- (breaking) redesign param parsing to remove dashes
    - `params["--flavor"]` becomes `params.flavor`
    - this change requires downstream change in Params type signatures
    - remove the "--" double dashes that prefix your params
    - the parser now delivers params without the "--" for you

### v0.0.0
- initial release

