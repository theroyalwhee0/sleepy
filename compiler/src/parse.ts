import { Readable } from 'node:stream';
import * as readline from 'node:readline';
import { Command, BlankCommand, CommentCommand, SyntaxErrorCommand, NoopCommand, ParseErrorCommand } from './commands/all';
import { isArray } from '@theroyalwhee0/istype';
import { UserCommand } from './commands';
import { stringAsReadable } from '../src/utilities/stream';

export interface Parsed {
    rows: Command[],
}

export async function parseText(input: string): Promise<Parsed> {
    return parseStream(stringAsReadable(input));
}

export async function parseStream(input: Readable): Promise<Parsed> {
    const rl = readline.createInterface({ input });
    const result: Parsed = {
        rows: [],
    };
    let count = 0;
    for await (const content of rl) {
        let cmd: Command | undefined = undefined;
        if (BlankCommand.is(content)) {
            cmd = new BlankCommand();
        } else if (CommentCommand.is(content)) {
            cmd = new CommentCommand();
        } else if (Command.is(content)) {
            const text = content.replace(/,$/, '');
            let data: unknown;
            try {
                data = JSON.parse(text);
            } catch (err) {
                if (err instanceof Error && err.name === 'SyntaxError') {
                    // If JSON Parse Syntax Error...
                    cmd = new ParseErrorCommand(err, content, count);
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
        cmd.content = content;
        result.rows.push(cmd);
    }
    return result;
}
