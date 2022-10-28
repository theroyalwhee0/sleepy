export declare enum CommandType {
    Noop = "@noop",
    Begin = "@begin",
    End = "@end",
    Error = "@error"
}
export interface ICommand {
    type: string;
    content?: string;
    error?: string;
}
export declare class Command implements ICommand {
    #private;
    type: string;
    content?: string;
    static is(value: string): boolean;
}
export declare type UserCommandArgumentItem = string | number | boolean;
export declare type UserCommandArgs = UserCommandArgumentItem[];
export declare class UserCommand extends Command {
    args?: UserCommandArgs;
    constructor(type: string, args?: UserCommandArgs);
    static create(data: unknown[]): UserCommand;
}