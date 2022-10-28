import { describe, it } from 'mocha';
import { expect } from 'chai';
import { parseStream, parseText } from '../src/parse';
import { stringAsReadable } from '../src/utilities/stream';

describe('parse', () => {
    describe('parseStream', () => {
        it('should be an function', () => {
            expect(parseStream).to.be.a('function');
        });
        it('should parse empty script', async () => {
            const promise = parseStream(stringAsReadable(''));
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({
                parsed: [
                ],
            });
        });
    });
    describe('parseText', () => {
        it('should be an function', () => {
            expect(parseText).to.be.a('function');
        });
        it('should parse empty script', async () => {
            const promise = parseText('');
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({
                parsed: [
                ],
            });
        });
        it('should handle noop and blank lines', async () => {
            const noopText = `[]

                [ ]
                []`;
            const promise = parseText(noopText);
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({
                parsed: [
                    { type: '@noop', content: '[]' },
                    { type: '@noop', content: '' },
                    { type: '@noop', content: '                [ ]' },
                    { type: '@noop', content: '                []' },
                ],
            });
        });
        it('should handle single line comments', async () => {
            const noopText = `#[]
                []
                # Hello World!`;
            const promise = parseText(noopText);
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect({ ...result }).to.eql({
                parsed: [
                    { type: '@noop', comment: '[]', content: '#[]' },
                    { type: '@noop', content: '                []' },
                    { type: '@noop', comment: 'Hello World!', content: '                # Hello World!' },
                ],
            });
        });
        it('should handle trailing commas', async () => {
            const trailingCommas = `[],
                []
                [],`;
            const promise = parseText(trailingCommas);
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({
                parsed: [
                    { type: '@noop', content: '[],' },
                    { type: '@noop', content: '                []' },
                    { type: '@noop', content: '                [],' },
                ],
            });
        });
        it('should handle unknown commands', async () => {
            const trailingCommas = `["print", "Hello World!"]
                [ "sleep", 50 ]
                [ "check", { "gt": 32, "lt": 293} ]
                ["exit"]`;
            const promise = parseText(trailingCommas);
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({
                parsed: [
                    { type: 'print', args: ['Hello World!'], content: '["print", "Hello World!"]' },
                    { type: 'sleep', args: [50], content: '                [ "sleep", 50 ]' },
                    { type: 'check', args: [{ 'gt': 32, 'lt': 293 }], content: '                [ "check", { "gt": 32, "lt": 293} ]' },
                    { type: 'exit', content: '                ["exit"]' },
                ],
            });
        });
    });
});

// describe('should handle malformed commands', () => {
//     it('with unmatched quotes', async () => {
//         const trailingCommas = `["print", "Hello World!"]
//         [ "sleep", "this-string-has-no-end-quote ]
//         ["exit"]`;
//         const promise = parseText(trailingCommas);
//         expect(promise).to.be.a('promise');
//         const result = await promise;
//         expect(result).to.eql({
//             parsed: [
//                 { type: 'print', args: ['Hello World!'], content: '["print", "Hello World!"]' },
//                 {
//                     type: '@error',
//                     error: 'parse',
//                     message: 'Unexpected end of input',
//                     line: 2,
//                     content: '                [ "sleep", "this-string-has-no-end-quote ]',
//                 },
//                 { type: 'exit', content: '                ["exit"]' },
//             ],
//         });
//     });
//     it('with unmatched brackets resulting in positional messages', async () => {
//         const trailingCommas = '[ "sleep", ] ]';
//         const promise = parseText(trailingCommas);
//         expect(promise).to.be.a('promise');
//         const result = await promise;
//         expect(result).to.eql({
//             parsed: [
//                 {
//                     type: '@error',
//                     error: 'parse',
//                     message: 'Unexpected token ] in at position 11',
//                     line: 1,
//                     content: '[ "sleep", ] ]',
//                 },
//             ],
//         });
//     });
// });
// it.skip('should parse metadata', async () => {
//     const metadataScript = `
//         ["@meta", "author", "John Doe"]
//         ["@meta", "author", "John Doe"]
//     `;
//     const promise = parseText(metadataScript);
//     expect(promise).to.be.a('promise');
//     const result = await promise;
//     expect(result).to.eql({
//         parsed: [],
//     });
// });
