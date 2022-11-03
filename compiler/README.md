# @theroyalwhee0/zzzc
Sleepy Script Compiler (zzzc)


## What is this?
This is a compiler for [Sleep Script](https://github.com/theroyalwhee0/sleepy) in TypeScript/JavaScript.

Sleepy Script is a simple scripting system meant to be used when building lists of actions with parameters and a single shared state. It does not support basic language features like functions, branches, or loops.


## Usage
`mkdir -p out; ./zzzc ./cases/print.zzz ./out/print.zzzc`


## Examples
```rb
# Single line comments are supported.
# They may not be mixed with content.

# The first string in a brackset is the command name. 
# Here 'print' would be supplied by the caller.
[ "print", "Hello World!" ]

# Commands starting with '$' are set commands.
# The next line sets 'John Doe' with the key 'name' in the global state.
[ "$name", "John Doe" ]

# Commands starting with '@' are language commands.
# This is a noop.
[ "@noop" ]

# Empty lines and empty bracket sets are noops.
[]

# Tabs and spaces are ignored outside of strings.
      [   ]

# Trailling commas are allowed.
[ "$counter", 1 ],

# Values may be any valid JSON type, without newlines.
[ "print", { "this-is-an-object": true } ]
```


## Links
- Sleep Script: https://github.com/theroyalwhee0/sleepy
- GitHub: https://github.com/theroyalwhee0/sleepy/tree/main/zzzc
- NPM: https://www.npmjs.com/package/@theroyalwhee0/zzzc
- Changelog: https://github.com/theroyalwhee0/sleepy/blob/main/zzzc/changelog.md


## Legal & License
Copyright 2022 Adam Mill

This library is released under Apache 2 license. See [LICENSE](https://github.com/theroyalwhee0/sleepyjs/blob/master/LICENSE) for more details.
