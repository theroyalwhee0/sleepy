import { Compiled } from '@theroyalwhee0/sleepyjs';
import fs from 'node:fs';
import { serializeCompiled } from '@theroyalwhee0/sleepyjs';

export type OutputOptions = {
    overwrite?: boolean
};

export async function outputCompiled(target: string, compiled: Compiled, options?: OutputOptions) {
    const flags = options?.overwrite === true ? 'w' : 'wx';
    const stream = fs.createWriteStream(target, {
        flags,
        encoding: 'utf8',
    });
    for await (const item of serializeCompiled(compiled)) {
        stream.write(item);
        stream.write('\n');
    }
}
