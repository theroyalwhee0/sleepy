import { describe, it } from 'mocha';
import { expect } from 'chai';
import { parseFile } from '../src/parse';
import { asyncIterabletoArray } from './mock';

describe('parse', () => {
    describe('parseFile', () => {
        it('should be an function', () => {
            expect(parseFile).to.be.a('function');
            expect(parseFile.length).to.equal(1);
        });
        it('should compile empty script', async () => {
            const result = parseFile('./test/files/noop.zzz');
            expect(result).to.be.a('promise');
            const parsed = await result;
            expect(typeof parsed.rows).to.equal('object');
            expect(parsed.rows[Symbol.asyncIterator]).to.be.a('function');
            const rows = await asyncIterabletoArray(parsed.rows);
            expect(rows).to.eql([
                { 'type': '@noop', 'content': '["@noop"]' },
            ]);
        });
    });
});
