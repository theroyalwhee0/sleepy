import { describe, it } from 'mocha';
import { expect } from 'chai';
import { outputCompiled } from '../src/serialize';

describe('serialize', () => {
    describe('outputCompiled', () => {
        it('should be an function', () => {
            expect(outputCompiled).to.be.a('function');
            expect(outputCompiled.length).to.equal(3);
        });
    });
});
