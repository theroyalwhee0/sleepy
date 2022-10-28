import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export interface ArgvShape {
    [x: string]: unknown;
    _: (string | number)[];
    $0: string;
    source: string;
    target: string;
}

export function getArgv(): ArgvShape {
    return yargs(hideBin(process.argv))
        .scriptName('zzzc')
        .command(
            '$0 <source> <target> [args]',
            'Compile the source to the target location.'
        )
        .demandCommand(1)
        .help()
        .alias('h', 'help')
        .strict()
        .parseSync() as ArgvShape;
}
