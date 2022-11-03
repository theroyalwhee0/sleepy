export async function asyncIterabletoArray<T>(iter: AsyncIterable<T>): Promise<Array<T>> {
    const array: T[] = [];
    for await (const item of iter) {
        array.push(item);
    }
    return array;
}
