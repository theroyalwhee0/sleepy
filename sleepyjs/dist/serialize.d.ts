import { Compiled } from './compile';
export declare type SerializeOptions = {
    pretty?: boolean;
};
export declare function serializeCompiled(compiled: Compiled, options?: SerializeOptions): AsyncGenerator<string>;
