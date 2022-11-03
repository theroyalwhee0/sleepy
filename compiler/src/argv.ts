import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export interface ArgvShape {
    [key: string]: unknown;
    _: (string | number)[];
    $0: string;
    source: string;
    target: string;
    details: boolean;
    o: boolean;
    optimize: boolean;
    overwrite: boolean;
}

export function getArgv(value?: string[], exit = true): ArgvShape {
    value = value ?? process.argv;
    return yargs(hideBin(value))
        .scriptName('zzzc')
        .command(
            '$0 <source> <target> [args]',
            'Compile the source to the target location.', (yargs) => {
                return yargs
                    // Details.
                    .boolean('details')
                    .describe('details', 'Add build details to output')
                    .default('details', true)
                    // Optimize
                    .boolean('optimize')
                    .describe('optimize', 'Optimize output')
                    .default('optimize', true)
                    // Overwrite
                    .boolean('overwrite')
                    .describe('overwrite', 'Overwrite target if it exists')
                    .alias('o', 'overwrite')
                    .default('overwrite', false)
                    ;
            })
        .demandCommand(1)
        .help()
        .alias('h', 'help')
        .exitProcess(exit)
        .strict()
        .parseSync() as ArgvShape;
}
