import { getArgv } from './argv';
import { compileFile } from './compile';
import { outputCompiled } from './output';

export async function main() {
    const argv = getArgv();
    const compiled = await compileFile(argv.source);
    console.log('@@ compiled: ', compiled);
    await outputCompiled(argv.target, compiled);
}
