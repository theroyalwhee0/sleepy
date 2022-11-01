import { isArray, isString } from '@theroyalwhee0/istype';
import {
    Command, BlankCommand, CommentCommand, SyntaxErrorCommand,
    UserCommand, NoopCommand, ParseErrorCommand,
} from './commands';
import { AwatedIterable, iterateLines } from './utilities/iter';

export interface Parsed {
    rows: () => AsyncIterable<Command>,
}

export function parseText(input: string): Parsed {
    return parseIterable(iterateLines(input));
}

export function parseIterable(input: AwatedIterable<string>): Parsed {
    return {
        async *rows(): AsyncIterable<Command> {
            let idx = 0;
            for await (const item of input) {
                yield parseSingleCommand(item, idx);
                idx++;
            }
        },
    };
}

function parseSingleCommand(item: string, lineNum = 0) {
    let cmd: Command | undefined = undefined;
    if (BlankCommand.is(item)) {
        cmd = new BlankCommand();
    } else if (CommentCommand.is(item)) {
        cmd = new CommentCommand();
    } else if (Command.is(item)) {
        const text = item.replace(/,$/, '');
        let data: unknown;
        try {
            data = JSON.parse(text);
        } catch (err) {
            if (err instanceof Error && err.name === 'SyntaxError') {
                // If JSON Parse Syntax Error...
                cmd = new ParseErrorCommand(err, lineNum);
            } else {
                // Else rethrow...
                throw err;
            }
        }
        if (!cmd) {
            if (isArray(data)) {
                if (data.length === 0) {
                    cmd = new NoopCommand();
                } else if (isString(data[0])) {
                    cmd = UserCommand.create(data as unknown[]);
                } else {
                    cmd = new SyntaxErrorCommand('Expected command name to be a string.');
                }
            } else {
                cmd = new SyntaxErrorCommand('Expected command.');
            }
        }
    } else {
        cmd = new SyntaxErrorCommand('Syntax error.');
    }
    if (!cmd) {
        throw new Error('Expected command to be populated.');
    }
    cmd.content = item;
    return cmd;
}
