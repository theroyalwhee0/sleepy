import { Command, BlankCommand, CommentCommand, SyntaxErrorCommand, NoopCommand, ParseErrorCommand } from './commands/all';
import { isArray } from '@theroyalwhee0/istype';
import { UserCommand } from './commands';

export interface Parsed {
    rows: Command[],
}

export async function parseText(input: string): Promise<Parsed> {
    const lines = input === '' ? [] : input.split(/\r\n|\n/);
    return parseIterable(lines);
}

export async function parseIterable(input: Iterable<string>): Promise<Parsed> {
    const result: Parsed = {
        rows: [],
    };
    let count = 0;
    for await (const item of input) {
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
                    cmd = new ParseErrorCommand(err, item, count);
                } else {
                    // Else rethrow...
                    throw err;
                }
            }
            if (!cmd) {
                if (isArray(data)) {
                    if (data.length === 0) {
                        cmd = new NoopCommand();
                    } else {
                        cmd = UserCommand.create(data as unknown[]);
                    }
                } else {
                    cmd = new SyntaxErrorCommand();
                }
            }
        } else {
            cmd = new SyntaxErrorCommand();
        }
        if (!cmd) {
            throw new Error('Expected command to be populated.');
        }
        count += 1;
        cmd.content = item;
        result.rows.push(cmd);
    }
    return result;
}
