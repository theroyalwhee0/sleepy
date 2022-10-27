import { describe, it } from 'mocha';
import { expect } from 'chai';
import { compileStream, compileText } from '../src/compile';
import { stringAsReadable } from '../src/utilities/stream';

describe('compile', () => {
    describe('compileStream', () => {
        it('should be an function', () => {
            expect(compileStream).to.be.a('function');
        });
        it('should compile empty script', async () => {
            const promise = compileStream(stringAsReadable(''));
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({
                compiled: [
                ],
            });
        });
    });
});
