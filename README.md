# Sleepy Script


## What is this?
Sleepy Script is a simple scripting system meant to be used when building lists of actions with parameters and a single shared state. Each entry is a single line and easy to parse and validate. It is untyped, but supports valid JSON types. It does not support basic language features like functions, branches, or loops.


## Implementations
- [SleepyJs](https://github.com/theroyalwhee0/sleepy/tree/main/sleepyjs)
- Trivial Examples
  - [Trivial Sleepy JS](https://github.com/theroyalwhee0/sleepy/blob/main/experimental/js/trivialsleepy.js)
  - [Trivial Sleepy Python 3](https://github.com/theroyalwhee0/sleepy/blob/main/experimental/py/trivialsleepy.py)


## Goals
- Simple to impliment parser and evaluation.
- Guarantee that script will exit.


## Details.
- There are no functions, classes, loops, or branches.
- It supports '\n' and '\r\n' newlines.


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


## Hints
- PHP, Ruby and Python syntax highlighting work reasonably well on Sleepy Script.


## Links
- GitHub: https://github.com/theroyalwhee0/sleepy


## Legal & License
Copyright 2022 Adam Mill
