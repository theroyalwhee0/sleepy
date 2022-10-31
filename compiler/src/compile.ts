import fs from 'node:fs';
import { compileIterable, Compiled, CompileOptions } from '@theroyalwhee0/sleepyjs';

export async function compileFile(filename: string, options?: CompileOptions): Promise<Compiled> {
    const stream = fs.createReadStream(filename, 'utf8');
    try {
        return await compileIterable(stream, options);
    } finally {
        stream.close();
    }
}
