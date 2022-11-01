#!/usr/bin/env python3

# Trivial implementation of Sleepy that will run in Python3
# This implementation does close-to-no error checking.
import asyncio, re, json
async def trivialSleepy(input, evaluator):
    SLEEPY_VERSION = [0, 0, 1]
    parsed = [
        json.loads(_.rstrip(',')) for _ in
        [
            _ for _ in input.split('\n') if re.search("^\s*(#|$)", _) == None
        ]
    ]
    partialCompiled = [
        _ for _ in parsed if (len(_) > 0 and _[0] != '@noop')
    ]
    compiled = [ ['@begin', SLEEPY_VERSION] ] + partialCompiled + [ ['@end'] ]
    state = { }
    for _idx, [first, *rest] in enumerate(compiled):
        ch = first[0]
        if ch == '@':
            if first == '@set':
                # Declare state variables.
                state[rest[0]] = rest[1]
        elif ch == '$':
            # Declare state variables.
            state[first[1:]] = rest[0]
        else:
            # Call evaluator.
            await evaluator(first, rest, state)
    return {
        # Return the state.
        "state": state
    }

# ---------------------------------------------------------------------

async def main():
    input = """ # This is a comment.

                [],
                ["@noop"],
                ["@set", "name", "Bob Smith"]
                ["$counter", 0]
                ["add"]
                ["print", "Hello World!"]
                ["sleep"]                
                ["print-state", "counter"]
                ["add", 2]
                ["print-state", "counter"]
                ["raise", 2]
                ["print-state", "counter"]
                ["print-state", "name"]
                ["print", "Goodbye."]
    """
    async def myEvaluator(command, args, state):
        if command == "print":
            print('>', *args)
        elif command == "sleep":
            seconds = 1
            if len(args) > 0:
                seconds = int(args[0])/1000
            await asyncio.sleep(seconds)
        elif command == 'print-state':
            key = args[0]
            print("> State '{}' = {}".format(key, state[key]))
        elif command == 'add':
            state['counter'] += args[0] if len(args) > 0 else 1
        elif command == 'raise':
            state['counter'] **= args[0] if len(args) > 0 else 1
        else:
            raise Exception("Runtime Error: Unrecognized command '{}'".format((command)))

    result = await trivialSleepy(input, myEvaluator)
    print('> State = {}'.format(result["state"]))

asyncio.run(main())
