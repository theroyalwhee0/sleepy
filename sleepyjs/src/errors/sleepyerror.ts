export class SleepyError extends Error {
    details?: string;
    parent?: Error;
    lineNum = 0;

    constructor(message: string, lineNum = 0, cause?: Error) {
        super(message);
        this.lineNum = lineNum;
        this.parent = cause;
    }
}