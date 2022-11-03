import { JsonValue } from '../utilities/json';
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
    toJSON(): JsonValue[];
}
export declare class Command implements ICommand {
    #private;
    type: string;
    content?: string;
    static is(value: string): boolean;
    toJSON(): JsonValue[];
}
