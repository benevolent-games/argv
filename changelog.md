
v0.1.0
- (breaking) redesign param parsing to remove dashes
    - `params["--flavor"]` becomes `params.flavor`
    - this change requires downstream change in Params type signatures
    - remove the "--" double dashes that prefix your params
    - the parser now delivers params without the "--" for you

v0.0.0
- initial release
