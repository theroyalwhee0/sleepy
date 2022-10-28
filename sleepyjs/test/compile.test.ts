import { describe, it } from 'mocha';
import { expect } from 'chai';
import { compileText, compileIterable, compileParsed } from '../src/compile';
import { variesChaiEql } from './patch-eql';
import { mockAsyncIterable } from './mock';

const varies = variesChaiEql();

const sleepy_version = [0, 0, 1];

describe('compile', () => {
    describe('compileIterable', () => {
        it('should be an function', () => {
            expect(compileIterable).to.be.a('function');
        });
        it('should compile empty script', async () => {
            const promise = compileIterable([]);
            expect(promise).to.be.a('promise');
            const result = await promise;

            expect(result.rows).to.eql([
                ['@begin', sleepy_version],
                ['@end'],
            ]);
        });
        it('should support async iterables', async () => {
            const noopData = [
                '["@noop"]',
                ' ["@noop"]',
                '  ["@noop"]',
            ];
            const iter = mockAsyncIterable(noopData);
            const promise = compileIterable(iter, { optimize: false });
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({
                rows: [
                    ['@begin', sleepy_version],
                    ['@noop'],
                    ['@noop'],
                    ['@noop'],
                    ['@end'],
                ],
            });
        });          
    });
    describe('compileParsed', () => {
        it('should be an function', () => {
            expect(compileParsed).to.be.a('function');
        });
        it('should compile empty script', async () => {
            const parsed = {
                rows: [],
            };
            const promise = compileParsed(parsed);
            expect(promise).to.be.a('promise');
            const result = await promise;

            expect(result.rows).to.eql([
                ['@begin', sleepy_version],
                ['@end'],
            ]);
        });
    });
    describe('compileText', () => {
        it('should be an function', () => {
            expect(compileText).to.be.a('function');
        });
        it('should compile empty script', async () => {
            const promise = compileText('');
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({
                rows: [
                    ['@begin', sleepy_version],
                    ['@end'],
                ],
            });
        });
        it('should handle noop and blank lines', async () => {
            const noopText = `[]

                [ ]
                []`;
            const promise = compileText(noopText, { optimize: false });
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({
                rows: [
                    ['@begin', sleepy_version],
                    ['@noop'],
                    ['@noop'],
                    ['@noop'],
                    ['@noop'],
                    ['@end'],
                ],
            });
        });
        it('should optimize script', async () => {
            const noopText = `[]

                [ ]
                []`;
            const promise = compileText(noopText, { optimize: true });
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({
                rows: [
                    ['@begin', sleepy_version],
                    ['@end'],
                ],
            });
        });
        it('should add compile info', async () => {
            const noopText = `[]

                [ ]
                []`;
            const promise = compileText(noopText, {
                source: 'noop.zzz',
                optimize: true,
                info: true,
            });
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({
                rows: [
                    ['@begin', sleepy_version],
                    ['@meta', '@date', varies.to.match(/^\d+-\d+-\d+T\d+:\d+:\d+\.\d+Z$/)],
                    ['@meta', '@source', 'noop.zzz'],
                    ['@end'],
                ],
            });
        });
        it('should handle single line comments', async () => {
            const noopText = `#[]
                []
                # Hello World!`;
            const promise = compileText(noopText, { optimize: false });
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({
                rows: [
                    ['@begin', sleepy_version],
                    ['@noop', '[]'],
                    ['@noop'],
                    ['@noop', 'Hello World!'],
                    ['@end'],
                ],
            });
        });
        it('should handle unknown commands', async () => {
            const unknownCommands = `["print", "Hello World!"]
                [ "sleep", 50 ]
                [ "check", { "gt": 32, "lt": 293} ]
                ["exit"]`;
            const promise = compileText(unknownCommands);
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({
                rows: [
                    ['@begin', sleepy_version],
                    ['print', 'Hello World!'],
                    ['sleep', 50],
                    ['check', { 'gt': 32, 'lt': 293 }],
                    ['exit'],
                    ['@end'],
                ],
            });
        });
    });
});
