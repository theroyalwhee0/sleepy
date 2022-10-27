import { Command, CommandType } from '.';
export declare class NoopCommand extends Command {
    type: CommandType;
}
export declare class CommentCommand extends NoopCommand {
    #private;
    get comment(): string;
    static is(value: string): boolean;
}
export declare class BlankCommand extends NoopCommand {
    #private;
    static is(value: string): boolean;
}
