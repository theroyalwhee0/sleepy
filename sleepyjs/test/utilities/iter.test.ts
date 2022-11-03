import { expect } from 'chai';
import { describe, it } from 'mocha';
import { iterateLines, bufferIterable } from '../../src/utilities/iter';
import { asyncIterabletoArray } from '../mock';

describe('utilities', () => {
    describe('iter', () => {
        describe('iterateLines', () => {
            it('should be an function', () => {
                expect(iterateLines).to.be.a('function');
            });
            it('should iterate over string', () => {
                const text = '1\n' +
                    '2\n' +
                    '3\n' +
                    '4\n' +
                    '5\n'
                    ;
                const iter = iterateLines(text);
                let idx = 1;
                for (const item of iter) {
                    expect(item).to.equal('' + idx);
                    idx++;
                }
            });
            it('should iterate over empty string', () => {
                const text = '';
                const iter = iterateLines(text);
                for (const _item of iter) {
                    expect.fail('Should not have any rows.');
                }
            });
        });
        describe('bufferIterable', () => {
            it('should be an function', () => {
                expect(bufferIterable).to.be.a('function');
            });
            it('should buffer all rows', async () => {
                const bufferedIdx: number[] = [];
                async function* iterable() {
                    for (let idx = 0; idx < 10; idx++) {
                        bufferedIdx.push(idx);
                        yield Promise.resolve(1 + idx * 2);
                    }
                }
                const rows = iterable();
                expect(bufferedIdx).to.eql([]);
                const buffered = await bufferIterable(rows);
                expect(bufferedIdx).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
                const final = await asyncIterabletoArray(buffered);
                expect(final).to.eql([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
            });
            it('should buffer some rows', async () => {
                const bufferedIdx: number[] = [];
                async function* iterable() {
                    for (let idx = 0; idx < 10; idx++) {
                        bufferedIdx.push(idx);
                        yield Promise.resolve(1 + idx * 2);
                    }
                }
                const rows = iterable();
                expect(bufferedIdx).to.eql([]);
                const buffered = await bufferIterable(rows, 5);
                expect(bufferedIdx).to.eql([0, 1, 2, 3, 4]);
                const final = await asyncIterabletoArray(buffered);
                expect(final).to.eql([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
                expect(bufferedIdx).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            });
        });
    });
});
