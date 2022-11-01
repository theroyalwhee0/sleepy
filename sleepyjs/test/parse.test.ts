import { describe, it } from 'mocha';
import { expect } from 'chai';
import { parseIterable, parseText } from '../src/parse';
import { asyncIterabletoArray, mockAsyncIterable } from './mock';


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
                const trailingCommas = `["print", "Hello World!"]
                    [ "sleep", "this-string-has-no-end-quote ]
                    ["exit"]`;
                const result = parseText(trailingCommas);
                const rows = await asyncIterabletoArray(result.rows());
                expect(rows).to.eql([
                    { type: 'print', args: ['Hello World!'], content: '["print", "Hello World!"]' },
                    {
                        type: '@error',
                        error: 'parse',
                        message: 'Unexpected end of input',
                        line: 2,
                        content: '                    [ "sleep", "this-string-has-no-end-quote ]',
                    },
                    { type: 'exit', content: '                    ["exit"]' },
                ]);
            });
            it('with unmatched brackets resulting in positional messages', async () => {
                const trailingCommas = '[ "sleep", ] ]';
                const result = parseText(trailingCommas);
                const rows = await asyncIterabletoArray(result.rows());
                expect(rows).to.eql([
                    {
                        type: '@error',
                        error: 'parse',
                        message: 'Unexpected token ] in at position 11',
                        line: 1,
                        content: '[ "sleep", ] ]',
                    },
                ]);
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