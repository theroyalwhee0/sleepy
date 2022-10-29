import { describe, it } from 'mocha';
import { expect } from 'chai';
import { compileFile } from '../src/compile';

describe('compile', () => {
    describe('compileStream', () => {
        it('should be an function', () => {
            expect(compileFile).to.be.a('function');
            expect(compileFile.length).to.equal(2);
        });
        it('should compile empty script', async () => {
            const promise = compileFile('./test/files/noop.zzz', { optimize: false });
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({
                rows: [
                    ['@begin',[0,0,1]],
                    ['@noop'],
                    ['@end']
                ],
            });
        });
    });
});
