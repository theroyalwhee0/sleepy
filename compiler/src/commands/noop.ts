import { Command, CommandType } from '.';

export class NoopCommand extends Command {
    type = CommandType.Noop;
}

export class CommentCommand extends NoopCommand {
    get comment(): string {
        let text = '';
        if (this.content) {
            text = this.content.replace(/^\s*#\s*/, '');
        }
        return text;
    }

    static #re_comment = /^\s*#/;
    static is(value: string): boolean {
        return CommentCommand.#re_comment.test(value);
    }


}
Object.defineProperty(CommentCommand.prototype, 'comment', { enumerable: true });

export class BlankCommand extends NoopCommand {
    static #re_blank = /^\s*$/;
    static is(value: string): boolean {
        return BlankCommand.#re_blank.test(value);
    }
}
