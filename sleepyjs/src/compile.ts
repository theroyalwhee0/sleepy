import { Command, CommandType } from './commands';
import { Parsed, parseIterable, parseText } from './parse';
import { AwatedIterable, bufferIterable } from './utilities/iter';
import { JsonValue } from './utilities/json';

export type CompileOptions = {
    source?: string,
    optimize?: boolean, // true or undefined = optimize, false to turn off
    info?: boolean,  // true = include, false or undefined to turn off
    validateNow?: boolean // true = validate now, false or undefined validates as it streams
};

export const sleepy_version = [0, 0, 1];

export type CompiledRow = JsonValue[];

export interface Compiled {
    rows: AsyncIterable<CompiledRow>,
}

export async function compileText(input: string, options?: CompileOptions): Promise<Compiled> {
    const parsed = await parseText(input);
    return compileParsed(parsed, options);
}

export async function compileIterable(input: AwatedIterable<string>, options?: CompileOptions): Promise<Compiled> {
    const parsed = await parseIterable(input);
    return compileParsed(parsed, options);
}
export async function compileParsed(parsed: Parsed, options?: CompileOptions): Promise<Compiled> {
    const now = new Date();
    async function* generator(): AsyncIterable<CompiledRow> {
        const optimize = options?.optimize ?? true;
        const includeCompileInfo = options?.info ?? false;
        const sourceName = options?.source ?? '';
        yield ['@begin', sleepy_version];
        if (includeCompileInfo) {
            yield ['@meta', '@date', now.toISOString()];
            if (sourceName) {
                yield ['@meta', '@source', sourceName];
            }
        }
        for await (const item of parsed.rows) {
            if (includeRow(optimize, item)) {
                yield item.toJSON();
            }
        }
        yield ['@end'];
    }
    const iterable = generator();
    const rows = options?.validateNow === true ? await bufferIterable(iterable) : iterable;
    return {
        rows: rows,
    };
}

function includeRow(optimize: boolean, cmd: Command) {
    if (optimize === true) {
        return cmd.type !== CommandType.Noop;
    }
    return true;
}
