export declare type AwatedIterable<T> = AsyncIterable<T> | Iterable<T>;
export declare function iterateLines(input: string): Iterable<string>;
export declare function bufferIterable<T>(iter: AsyncIterable<T>, count?: number | boolean): Promise<AsyncIterable<T>>;
