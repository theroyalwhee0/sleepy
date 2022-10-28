import { Readable } from 'node:stream';

export function stringAsReadable(value: string): Readable {
    const readable = new Readable();
    readable.push(value);
    readable.push(null);
    readable.toString = () => {
        return value;
    };
    return readable;
}