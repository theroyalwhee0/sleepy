import { describe, it } from 'mocha';
import { expect } from 'chai';
import { compileText } from '../src/compile';
import { serializeCompiled } from '../src/serialize';

describe('serialize', () => {
    describe('serializeCompiled', () => {
        it('should be an function', () => {
            expect(serializeCompiled).to.be.a('function');
        });
        it('should serialize an empty script', async () => {
            const compiled = await compileText('');
            const result = serializeCompiled(compiled);
            expect(result).to.equal(
                '["@begin",[0,0,1]]\n' +
                '["@end"]'
            );
        });
        it('should serialize unknown commands', async () => {
            const unknownCommands = `["print", "Hello World!"]
                [ "sleep", 50 ]
                [ "check", { "gt": 32, "lt": 293} ]
                ["exit"]`;
            const compiled = await compileText(unknownCommands);
            const result = serializeCompiled(compiled);
            expect(result).to.equal(
                '["@begin",[0,0,1]]\n' +
                '["print","Hello World!"]\n' +
                '["sleep",50]\n' +
                '["check",{"gt":32,"lt":293}]\n' +
                '["exit"]\n' +
                '["@end"]'
            );
        });
        it('should serialize with pretty option', async () => {
            const compiled = await compileText('');
            const result = serializeCompiled(compiled, { pretty: true });
            expect(result).to.equal(
                '[ "@begin", [ 0, 0, 1 ] ]\n' +
                '[ "@end" ]'
            );
        });
    });

});
