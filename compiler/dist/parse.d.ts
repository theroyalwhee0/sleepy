/// <reference types="node" />
import { Readable } from 'node:stream';
import { Command } from './commands/all';
export interface Parsed {
    parsed: Command[];
}
export declare function parseText(input: string): Promise<Parsed>;
export declare function parseStream(input: Readable): Promise<Parsed>;
