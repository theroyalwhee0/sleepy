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