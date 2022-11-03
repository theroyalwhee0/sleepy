import { compileParsed } from '@theroyalwhee0/sleepyjs';
import { getArgv } from './argv';
import { parseFile } from './parse';
import { outputCompiled } from './serialize';

export async function main() {
    const argv = getArgv();
    const parsed = await parseFile(argv.source);
    const compiled = await compileParsed(parsed, {
        optimize: argv.optimize,
        info: argv.details,
        source: argv.source,
    });
    await outputCompiled(argv.target, compiled, {
        overwrite: argv.overwrite,
    });
}
