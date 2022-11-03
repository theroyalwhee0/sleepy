import fs from 'node:fs';
import readline from 'node:readline';
import { parseIterable, Parsed } from '@theroyalwhee0/sleepyjs';

export async function parseFile(filename: string): Promise<Parsed> {
    const stream = fs.createReadStream(filename, 'utf8');
    const lineReader = readline.createInterface(stream);
    return await parseIterable(lineReader);
}
