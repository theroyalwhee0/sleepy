export type AwatedIterable<T> = AsyncIterable<T> | Iterable<T>;


export function* iterateLines(input: string): Iterable<string> {
    if (input === '') {
        return;
    }
    for (let idx = 0; idx < input.length; idx++) {
        let found = input.indexOf('\n', idx);
        if (found === (-1)) {
            found = input.length;
        }
        let value = input.slice(idx, found);
        if (value[value.length - 1] === '\r') {
            value = value.substring(0, value.length - 1);
        }
        yield value;
        idx = found;
    }
}

export async function bufferRows<T>(iter: AsyncIterable<T>, count = Number.MAX_SAFE_INTEGER): Promise<AsyncIterable<T>> {
    const buffer: T[] = [];
    const asyncIter = iter[Symbol.asyncIterator]();
    let idx = 0;
    let next = true;
    while (next) {
        if (idx < count) {
            const { value, done } = await asyncIter.next();
            if (done === true) {
                next = false;
            } else {
                buffer.push(value);
            }
        } else {
            next = false;
        }
        idx++;
    }
    const continueIter = { [Symbol.asyncIterator]: () => asyncIter };
    async function* bufferedAsyncIterable(): AsyncIterable<T> {
        for await (const item of buffer) {
            // Yield buffered items.
            yield item;
        }
        for await (const item of continueIter) {
            // Yield any remaining items.
            yield item;
        }
    }
    return bufferedAsyncIterable();
}
