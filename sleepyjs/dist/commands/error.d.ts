import { Command, CommandType } from '.';
import { JsonValue } from '../utilities/json';
export declare class ErrorCommand extends Command {
    error: string;
    message: string;
    type: CommandType;
    line: number;
    toJSON(): JsonValue[];
}
export declare class SyntaxErrorCommand extends ErrorCommand {
    error: string;
}
export declare class ParseErrorCommand extends ErrorCommand {
    error: string;
    message: string;
    constructor(err: Error, content: string, line: number);
}
