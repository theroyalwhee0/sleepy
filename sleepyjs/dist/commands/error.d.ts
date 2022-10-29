import { Command, CommandType } from '.';
import { JsonValue } from '../utilities/json';
export declare class ErrorCommand extends Command {
    error: string;
    message: string;
    type: CommandType;
    line: number;
    constructor(error: string, message?: string, line?: number);
    toJSON(): JsonValue[];
}
export declare class SyntaxErrorCommand extends ErrorCommand {
    constructor(message?: string, line?: number);
}
export declare class ParseErrorCommand extends ErrorCommand {
    constructor(err?: Error, line?: number);
}
