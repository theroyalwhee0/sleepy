import fs from 'node:fs';
import { parseIterable, Parsed } from '@theroyalwhee0/sleepyjs';

export async function parseFile(filename: string): Promise<Parsed> {
    const stream = fs.createReadStream(filename, 'utf8');
    try {
        return await parseIterable(stream);
    } finally {
        stream.close();
    }
}
