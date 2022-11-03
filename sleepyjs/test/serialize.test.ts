import { expect } from 'chai';
import { describe, it } from 'mocha';
import { compileText } from '../src/compile';
import { serializeCompiled } from '../src/serialize';
import { asyncIterabletoArray } from './mock';

describe('serialize', () => {
    describe('serializeCompiled', () => {
        it('should be an function', () => {
            expect(serializeCompiled).to.be.a('function');
        });
        it('should serialize an empty script', async () => {
            const compiled = await compileText('');
            const result = serializeCompiled(compiled);
            const rows = await asyncIterabletoArray(result);
            expect(rows).to.eql([
                '["@begin",[0,0,1]]',
                '["@end"]',
            ]);
        });
        it('should serialize with pretty option', async () => {
            const compiled = await compileText('');
            const result = serializeCompiled(compiled, { pretty: true });
            const rows = await asyncIterabletoArray(result);
            expect(rows).to.eql([
                '[ "@begin", [ 0, 0, 1 ] ]',
                '[ "@end" ]',
            ]);
        });
        it('should serialize unknown commands', async () => {
            const commands = `["print", "Hello World!"]
                [ "sleep", 50 ]
                [ "check", { "gt": 32, "lt": 293} ]
                ["exit"]`;
            const compiled = await compileText(commands);
            const result = serializeCompiled(compiled);
            const rows = await asyncIterabletoArray(result);
            expect(rows).to.eql([
                '["@begin",[0,0,1]]',
                '["print","Hello World!"]',
                '["sleep",50]',
                '["check",{"gt":32,"lt":293}]',
                '["exit"]',
                '["@end"]',
            ]);
        });
    });
});
