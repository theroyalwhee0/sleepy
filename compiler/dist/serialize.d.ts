import { Compiled } from '@theroyalwhee0/sleepyjs';
export declare type OutputOptions = {
    overwrite?: boolean;
};
export declare function outputCompiled(target: string, compiled: Compiled, options?: OutputOptions): Promise<void>;
