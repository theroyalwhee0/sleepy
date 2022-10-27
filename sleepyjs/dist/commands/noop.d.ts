import { Command, CommandType } from '.';
import { JsonValue } from '../utilities/json';
export declare class NoopCommand extends Command {
    type: CommandType;
}
export declare class CommentCommand extends NoopCommand {
    #private;
    get comment(): string;
    static is(value: string): boolean;
    toJSON(): JsonValue[];
}
export declare class BlankCommand extends NoopCommand {
    #private;
    static is(value: string): boolean;
}
