import { isArray, isString } from '@theroyalwhee0/istype';
import { BlankCommand, Command, CommentCommand, NoopCommand, UserCommand } from './commands';
import { ParseError } from './errors/parseerror';
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
            throw new ParseError('Error parsing line', lineNum, err);
        }
        if (!cmd) {
            if (isArray(data)) {
                if (data.length === 0) {
                    cmd = new NoopCommand();
                } else if (isString(data[0])) {
                    cmd = UserCommand.create(data as unknown[]);
                } else {
                    throw new ParseError('Expected command name to be a string', lineNum);
                }
            } else {
                throw new ParseError('Expected command', lineNum);
            }
        }
    } else {
        throw new ParseError('Syntax error', lineNum);
    }
    if (!cmd) {
        throw new ParseError('Expected command to be populated', lineNum);
    }
    cmd.content = item;
    return cmd;
}
