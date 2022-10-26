#!/usr/bin/env node

// Trivial implementation of Sleepy that will run in a browser or node.
// This implementation does close-to-no error checking.
function trivialSleepy(input, evaluator) {
    const sleepy_version = [0, 0, 1];
    const parsed = input
        // Split newlines.
        .split('\n')
        // Remove blank and comment lines.
        .filter((_) => !/^\s*(#|$)/.test(_))
        // Parse each line, removing trailing commas.
        .map((_) => JSON.parse(_.replace(/,$/, '')));
    const partialCompiled = parsed
        // Remove noops.
        .filter((_) => _?.length && _[0] !== '@noop');
    const compiled = [
        ['@begin', sleepy_version],
        ...partialCompiled,
        ['@end'],
    ];
    const state = {};
    compiled
        .forEach(([first, ...rest]) => {
            const ch = first[0] || '';
            if (first === '@feature') {
                throw new Error('trivialSleepy does not support features');
            } else if (ch === '@') {
                // Ignore language commands.
                return;
            } else if (ch === '$') {
                // Declare state variables.
                state[first.replace(/^\$/, '')] = rest[0];
            } else {
                // Call evaluator.
                evaluator(first, rest, state);
            }
        });
    return {
        // Return the state.
        state,
    };
}

// ---------------------------------------------------------------------

const input = ` # This is a comment.

                [],
                ["@noop"],
                ["$name", "Bob Smith"]
                ["$counter", 0]
                ["add"]
                ["print", "Hello World!"]
                ["print-state", "counter"]
                ["add", 2]
                ["print-state", "counter"]
                ["raise", 2]
                ["print-state", "counter"]
                ["print-state", "name"]
                ["print", "Goodbye."]
`;
const { state } = trivialSleepy(input, (command, args, state) => {
    switch (command) {
        case 'print': {
            // eslint-disable-next-line no-undef
            console.log('>', ...args);
            break;
        }
        case 'print-state': {
            const key = args[0] || '';
            // eslint-disable-next-line no-undef
            console.log(`> State '${key}' = ${state[key]}`);
            break;
        }
        case 'add': {
            state.counter += args[0] || 1;
            break;
        }
        case 'raise': {
            state.counter **= args[0] || 1;
            break;
        }
        default: {
            throw new Error(`Runtime Error: Unrecognized command '${command}'`);
        }
    }
});
// eslint-disable-next-line no-undef
console.log('> State = ', state);