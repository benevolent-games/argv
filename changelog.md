
### argv changelog
- 🟥 breaking change
- 🔶 deprecation or possible breaking change
- 🍏 harmless addition, fix, or enhancement

### v0.3.11
- 🍏 upgrade deathWithDignity by adding `pleaseExit` async fn to returns

### v0.3.2
- 🔶 change exports of some undocumented formatting functions
- 🍏 add command `extraArgs` option, now you can document extra arguments
- 🍏 add choice helper option `zeroAllowed`
- 🍏 add multipleChoice helper
- 🍏 enhance word wrapping behavior, more breaking characters than just whitespace

### v0.3.1
- 🍏 improved help pages structuring, can view command subtrees
- 🍏 improved custom theming facilities, added `seaside` theme
- 🔶 removed some undocumented theming types and functions

### v0.3.0
- 🟥 custom types!
    - import the types `import {string, number, boolean} from "@benev/argv"`
    - `String` becomes `string`
    - `Number` becomes `number`
    - `Boolean` becomes `boolean`
- 🟥 default fallback is no longer in the options
    ```ts
    // old
    param.default(string, {fallback: "hello"})

    // new
    param.default(string, "hello")
    ```
- 🍏 new helpers, `asType`, `asTypes`, `list`

### v0.2.0
- 🟥 massive nuclear rewrite

### v0.1.0
- redesign param parsing to remove dashes
    - `params["--flavor"]` becomes `params.flavor`
    - this change requires downstream change in Params type signatures
    - remove the "--" double dashes that prefix your params
    - the parser now delivers params without the "--" for you

### v0.0.0
- initial release

