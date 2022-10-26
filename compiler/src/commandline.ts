import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export function getCommandLine() {
    const argv = yargs(hideBin(process.argv))
        .options({
        })
        .parseSync();
    return argv;
}
