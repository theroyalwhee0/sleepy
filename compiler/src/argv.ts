import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export interface ArgvShape {
    [key: string]: unknown;
    _: (string | number)[];
    $0: string;
    source: string;
    target: string;
}

export function getArgv(value?:string[], exit:boolean=true): ArgvShape {
    value = value ?? process.argv;
    return yargs(hideBin(value))
        .scriptName('zzzc')
        .command(
            '$0 <source> <target> [args]',
            'Compile the source to the target location.'
        )
        .demandCommand(1)
        .help()
        .alias('h', 'help')
        .exitProcess(exit)
        .strict()
        .parseSync() as ArgvShape;
}
