export declare class SleepyError extends Error {
    details?: string;
    parent?: Error;
    lineNum: number;
    constructor(message: string, lineNum?: number, cause?: Error);
}
