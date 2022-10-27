import { Command, CommandType } from '.';
export declare class ErrorCommand extends Command {
    error: string;
    message: string;
    type: CommandType;
    line: number;
}
export declare class SyntaxErrorCommand extends ErrorCommand {
    error: string;
}
export declare class ParseErrorCommand extends ErrorCommand {
    error: string;
    message: string;
    constructor(err: Error, content: string, line: number);
}
