import fs from 'node:fs';
import { Readable } from 'node:stream';
import { Command } from './commands/all';
import { parseStream, parseText } from './parse';

export type Compiled = {
    compile: true,
    commands: Command[]
};

export async function compileFile(filename: string): Promise<Compiled> {
    let stream;
    try {
        stream = fs.createReadStream(filename);
        return compileStream(stream);
    } finally {
        stream && stream.close();
    }

}

export async function compileText(input: string): Promise<Compiled> {
    const parsed = await parseText(input);
    const result: Compiled = {
        compile: true,
        commands: parsed.commands,
    };
    return result;
}

export async function compileStream(input: Readable): Promise<Compiled> {
    const parsed = await parseStream(input);
    const result: Compiled = {
        compile: true,
        commands: parsed.commands,
    };
    return result;
}
