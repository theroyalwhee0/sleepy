import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ErrorCommand, ParseErrorCommand, SyntaxErrorCommand } from '../../src/commands/error';

describe('command errors', () => {
    describe('ErrorCommand', () => {
        it('should be an function', () => {
            expect(ErrorCommand).to.be.a('function');
        });
        it('should be able to create instance', () => {
            const cmd = new ErrorCommand('test', 'message', 20);
            expect(cmd).to.be.an.instanceOf(ErrorCommand);
            expect(cmd.error).to.equal('test');
            expect(cmd.line).to.equal(21);
            expect(cmd.message).to.equal('message');
        });
    });
    describe('SyntaxErrorCommand', () => {
        it('should be an function', () => {
            expect(SyntaxErrorCommand).to.be.a('function');
        });
        it('should be able to create instance', () => {
            const cmd = new SyntaxErrorCommand('Syntax Error!', 45);
            expect(cmd).to.be.an.instanceOf(ErrorCommand);
            expect(cmd.error).to.equal('syntax');
            expect(cmd.line).to.equal(46);
            expect(cmd.message).to.equal('Syntax Error!');
        });
    });
    describe('ParseErrorCommand', () => {
        it('should be an function', () => {
            expect(ParseErrorCommand).to.be.a('function');
        });
        it('should be able to create instance', () => {
            let error:Error;
            try {
                JSON.parse(' "@noop" ]');
                expect.fail('Expected parse to fail.');
            } catch(err) {
                error = err;
            }
            const cmd = new ParseErrorCommand(error, 30);
            expect(cmd).to.be.an.instanceOf(ErrorCommand);
            expect(cmd.error).to.equal('parse');
            expect(cmd.line).to.equal(31);
            expect(cmd.message).to.equal('Unexpected token ] in at position 9');
        });
    });
});
