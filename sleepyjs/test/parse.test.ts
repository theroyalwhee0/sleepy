import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe, it } from 'mocha';
import { ParseError } from '../src/errors/parseerror';
import { parseIterable, parseText } from '../src/parse';
import { asyncIterabletoArray, mockAsyncIterable } from './mock';

chai.use(chaiAsPromised);

describe('parse', () => {
    describe('parseIterable', () => {
        it('should be an function', () => {
            expect(parseIterable).to.be.a('function');
        });
        it('should parse empty script', async () => {
            const result = parseIterable([]);
            expect(result).to.be.an('object');
            expect(result.rows).to.be.a('function');
            const rows = await asyncIterabletoArray(result.rows());
            expect(rows).to.eql([
            ]);
        });
        it('should support async iterables', async () => {
            const noopData = [
                '["@noop"]',
                ' ["@noop"]',
                '  ["@noop"]',
            ];
            const iter = mockAsyncIterable(noopData);
            const result = parseIterable(iter);
            expect(result).to.be.an('object');
            const rows = await asyncIterabletoArray(result.rows());
            expect(rows).to.eql([
                { type: '@noop', content: '["@noop"]' },
                { type: '@noop', content: ' ["@noop"]' },
                { type: '@noop', content: '  ["@noop"]' },
            ]);
        });
    });
    describe('parseText', () => {
        it('should be an function', () => {
            expect(parseText).to.be.a('function');
        });
        it('should parse empty script', async () => {
            const result = parseText('');
            expect(result).to.be.an('object');
            const rows = await asyncIterabletoArray(result.rows());
            expect(rows).to.eql([
            ]);
        });
        it('should handle noop and blank lines', async () => {
            const noopText = `[]

                [ ]
                []`;
            const result = parseText(noopText);
            expect(result).to.be.an('object');
            const rows = await asyncIterabletoArray(result.rows());
            expect(rows).to.eql([
                { type: '@noop', content: '[]' },
                { type: '@noop', content: '' },
                { type: '@noop', content: '                [ ]' },
                { type: '@noop', content: '                []' },
            ]);
        });
        it('should handle single line comments', async () => {
            const noopText = `#[]
                []
                # Hello World!`;
            const result = parseText(noopText);
            const rows = await asyncIterabletoArray(result.rows());
            expect([...rows]).to.eql([
                { type: '@noop', comment: '[]', content: '#[]' },
                { type: '@noop', content: '                []' },
                { type: '@noop', comment: 'Hello World!', content: '                # Hello World!' },
            ]);
        });
        it('should handle trailing commas', async () => {
            const trailingCommas = `[],
                []
                [],`;
            const result = parseText(trailingCommas);
            const rows = await asyncIterabletoArray(result.rows());
            expect(rows).to.eql([
                { type: '@noop', content: '[],' },
                { type: '@noop', content: '                []' },
                { type: '@noop', content: '                [],' },
            ]);
        });
        it('should handle unknown commands', async () => {
            const trailingCommas = `["print", "Hello World!"]
                [ "sleep", 50 ]
                [ "check", { "gt": 32, "lt": 293} ]
                ["exit"]`;
            const result = parseText(trailingCommas);
            const rows = await asyncIterabletoArray(result.rows());
            expect(rows).to.eql([
                { type: 'print', args: ['Hello World!'], content: '["print", "Hello World!"]' },
                { type: 'sleep', args: [50], content: '                [ "sleep", 50 ]' },
                { type: 'check', args: [{ 'gt': 32, 'lt': 293 }], content: '                [ "check", { "gt": 32, "lt": 293} ]' },
                { type: 'exit', content: '                ["exit"]' },
            ]);
        });
        describe('should handle malformed commands', () => {
            it('with unmatched quotes', async () => {
                const unmatchedQuote = `["print", "Hello World!"]
                    # There is an unmatched quote in the next line
                    [ "sleep", "this-string-has-no-end-quote ]
                    ["exit"]`;
                const parsed = parseText(unmatchedQuote);
                try {
                    await asyncIterabletoArray(parsed.rows());
                    expect.fail('Should reject with parse error.');
                } catch (err) {
                    expect(err.message).to.equal('Error parsing line');
                    if (err instanceof ParseError) {
                        expect(err.lineNum).to.equal(3);
                        expect(err.parent?.name).to.equal('SyntaxError');
                        expect(err.details).to.equal('Unexpected end of input');
                    } else {
                        err.fail('Should be instance of ParseError');
                    }
                }
            });
            it('with unmatched brackets resulting in positional messages', async () => {
                const extraClosingBracket = '[ "sleep" ] ]';
                const parsed = parseText(extraClosingBracket);
                try {
                    await asyncIterabletoArray(parsed.rows());
                    expect.fail('Should reject with parse error.');
                } catch (err) {
                    expect(err.message).to.equal('Error parsing line');
                    if (err instanceof ParseError) {
                        expect(err.lineNum).to.equal(1);
                        expect(err.parent?.name).to.equal('SyntaxError');
                        expect(err.details).to.equal('Unexpected token ] in at position 12');
                    } else {
                        err.fail('Should be instance of ParseError');
                    }
                }
            });
        });
        it('should handle Windows newlines', async () => {
            const noopText = '[]\r\n' +
                '   [ ],\r\n' +
                ' [    ]\r\n';
            const result = parseText(noopText);
            const rows = await asyncIterabletoArray(result.rows());
            expect(rows).to.eql([
                { type: '@noop', content: '[]' },
                { type: '@noop', content: '   [ ],' },
                { type: '@noop', content: ' [    ]' },
            ]);
        });
    });
});