import { CommandType } from './commands';
import { Command } from './commands/all';
import { Parsed, parseIterable, parseText } from './parse';
import { JsonValue } from './utilities/json';

export type CompileOptions = {
    source?: string,
    optimize?: boolean, // true or undefined = optimize, false to turn off
    info?: boolean,  // true = include, false or undefined to turn off
};

export const sleepy_version = [0, 0, 1];

export type CompiledRow = JsonValue[];

export interface Compiled {
    rows: CompiledRow[]
}

export async function compileText(input: string, options?: CompileOptions): Promise<Compiled> {
    const parsed = await parseText(input);
    return compileParsed(parsed, options);
}

export async function compileIterable(input: Iterable<string>, options?: CompileOptions): Promise<Compiled> {
    const parsed = await parseIterable(input);
    return compileParsed(parsed, options);
}

function optimizeRows(optimize: boolean) {
    if (optimize === true) {
        return (_: Command) => _.type !== CommandType.Noop;
    }
    return () => true;
}

export async function compileParsed(parsed: Parsed, options?: CompileOptions): Promise<Compiled> {
    const now = new Date();
    const optimize = options?.optimize ?? true;
    const includeCompileInfo = options?.info ?? false;
    const sourceName = options?.source ?? '';
    const compileInfo = [];
    if (includeCompileInfo) {
        compileInfo.push(['@meta', '@date', now.toISOString()]);
        if (sourceName) {
            compileInfo.push(['@meta', '@source', sourceName]);
        }
    }
    const rows = ([] as CompiledRow[]).concat(
        [['@begin', sleepy_version]],
        compileInfo,
        parsed.rows
            .filter(optimizeRows(optimize))
            .map((_) => _.toJSON()),
        [['@end']],
    );
    const result: Compiled = {
        rows,
    };
    return result;
}
