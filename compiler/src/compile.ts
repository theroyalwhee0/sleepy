import { Compiled, compileIterable } from '@theroyalwhee0/sleepyjs';
import fs, { ReadStream } from 'node:fs';

export async function compileFile(filename: string): Promise<Compiled> {
    const stream = fs.createReadStream(filename);
    try {
        return await compileReadStream(stream);
    } finally {
        stream.close();
    }
}

export async function compileReadStream(input: ReadStream, close?:boolean): Promise<Compiled> {
    return compileIterable(input);
}
