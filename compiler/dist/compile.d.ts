/// <reference types="node" />
import { Readable } from 'node:stream';
import { Command } from './commands/all';
export interface Compiled {
    compiled: Command[];
}
export declare function compileFile(filename: string): Promise<Compiled>;
export declare function compileText(input: string): Promise<Compiled>;
export declare function compileStream(input: Readable): Promise<Compiled>;
