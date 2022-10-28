import fs from 'node:fs';
import { Readable } from 'node:stream';
import { Command } from './commands/all';
import { parseStream, parseText } from './parse';
import { JsonValue } from './utilities/json';

export interface Compiled {
    rows: CompiledRow[]
}

export async function compileFile(filename: string): Promise<Compiled> {
    const stream = fs.createReadStream(filename);
    try {
        return await compileStream(stream);
    } finally {
        stream.close();
    }

}

export async function compileText(input: string): Promise<Compiled> {
    const parsed = parseText(input);
    return compileStream(parsed);
}

function optimizeRows(optimize: boolean, rows: Command[]): Command[] {
    if (!optimize) {
        return rows;
    }
    rows.filter((_) => {
        return _.length;
    });
}

export async function compileStream(input: Readable): Promise<Compiled> {
    const parsed = await parseStream(input);
    const rows: CompiledRow[] = optimizeRows(true, parsed.rows);
    const result: Compiled = {
        rows,
    };
    return result;
}
