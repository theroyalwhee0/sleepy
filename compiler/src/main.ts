import { getCommandLine } from './commandline';
import { compileFile } from './compile';

export async function main() {
    const argv = getCommandLine();
    console.log('@@ argv', argv);
    const result = await compileFile('' + argv._[0]);
    console.log('@@ result', result);
}
