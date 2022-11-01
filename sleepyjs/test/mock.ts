import { Command } from '../src/commands';
import { Compiled, CompiledRow } from '../src/compile';
import { Parsed } from '../src/parse';

export function mockAsyncIterable<T>(data: T[]) {
    async function* mockAsyncIterable(): AsyncGenerator<Awaited<T>, void, unknown> {
        for (let idx = 0; idx < data.length; idx++) {
            const delay = 5 + Math.floor(Math.random() * 5);
            await new Promise(resolve => setTimeout(resolve, delay));
            yield data[idx];
        }
    }
    return mockAsyncIterable();
}


export async function asyncIterabletoArray<T>(iter: AsyncIterable<T>): Promise<Array<T>> {
    const array: T[] = [];
    for await (const item of iter) {
        array.push(item);
    }
    return array;
}


export function mockParsed(commands: Command[] = []): Parsed {
    return {
        async *rows(): AsyncIterable<Command> {
            for (const item of commands) {
                yield item;
            }
        },
    };
}

export function mockCompiled(rows: CompiledRow[] = []): Compiled {
    return {
        async *rows(): AsyncIterable<CompiledRow> {
            for (const item of rows) {
                yield item;
            }
        },
    };
}
