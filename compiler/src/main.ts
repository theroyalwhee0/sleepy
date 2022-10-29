import { getArgv } from './argv';
import { compileFile } from './compile';

export async function main() {
    const argv = getArgv();
    const compiled = await compileFile(argv.source);
    console.log('@@ compiled: ', JSON.stringify(compiled, null, '\t'));
    // await outputCompiled(argv.target, compiled);
}
