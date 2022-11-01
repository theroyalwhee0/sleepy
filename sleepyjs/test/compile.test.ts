import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BlankCommand, CommentCommand, NoopCommand, UserCommand } from '../src/commands';
import { compileParsed } from '../src/compile';
import { asyncIterabletoArray, mockParsed } from './mock';
import { variesChaiEql } from './patch-eql';

const varies = variesChaiEql();

const sleepy_version = [0, 0, 1];

describe('compile', () => {
    describe('compileParsed', () => {
        it('should be an function', () => {
            expect(compileParsed).to.be.a('function');
        });
        it('should compile empty script', async () => {
            const parsed = mockParsed();
            const result = compileParsed(parsed);
            expect(result).to.be.a('object');
            const rows = await asyncIterabletoArray(result.rows());
            expect(rows).to.eql([
                ['@begin', sleepy_version],
                ['@end'],
            ]);
        });
        it('should optimize script', async () => {
            const parsed = mockParsed([
                new BlankCommand(),
                new CommentCommand(),
                new NoopCommand(),
            ]);
            const result = compileParsed(parsed, { optimize: true });
            const rows = await asyncIterabletoArray(result.rows());
            expect(rows).to.eql([
                ['@begin', sleepy_version],
                ['@end'],
            ]);
        });
        it('should add compile info', async () => {
            const parsed = mockParsed([
                new NoopCommand(),
                new BlankCommand(),
                new NoopCommand(),
                new NoopCommand(),
            ]);
            const result = compileParsed(parsed, {
                source: 'noop.zzz',
                optimize: true,
                info: true,
            });
            const rows = await asyncIterabletoArray(result.rows());
            expect(rows).to.eql([
                ['@begin', sleepy_version],
                ['@meta', '@date', varies.to.match(/^\d+-\d+-\d+T\d+:\d+:\d+\.\d+Z$/)],
                ['@meta', '@source', 'noop.zzz'],
                ['@end'],
            ]);
        });
        it('should handle noop and blank lines', async () => {
            const parsed = mockParsed([
                new NoopCommand(),
                new BlankCommand(),
                new NoopCommand(),
                new NoopCommand(),
            ]);
            const result = compileParsed(parsed, { optimize: false });
            const rows = await asyncIterabletoArray(result.rows());
            expect(rows).to.eql([
                ['@begin', sleepy_version],
                ['@noop'],
                ['@noop'],
                ['@noop'],
                ['@noop'],
                ['@end'],
            ]);
        });
        it('should handle single line comments', async () => {
            const parsed = mockParsed([
                new CommentCommand('#[]'),
                new NoopCommand(),
                new CommentCommand('# Hello World!'),
            ]);
            const result = compileParsed(parsed, { optimize: false });
            const rows = await asyncIterabletoArray(result.rows());
            expect(rows).to.eql([
                ['@begin', sleepy_version],
                ['@noop', '[]'],
                ['@noop'],
                ['@noop', 'Hello World!'],
                ['@end'],
            ]);
        });
        it('should handle unknown commands', async () => {
            const parsed = mockParsed([
                new CommentCommand('# The answer is not 42.'),
                new UserCommand('print', ['Hello World!']),
                new UserCommand('sleep', [50]),
                new UserCommand('check', [{ 'gt': 32, 'lt': 293 }]),
                new UserCommand('exit',),
            ]);
            const result = compileParsed(parsed);
            const rows = await asyncIterabletoArray(result.rows());
            expect(rows).to.eql([
                ['@begin', sleepy_version],
                ['print', 'Hello World!'],
                ['sleep', 50],
                ['check', { 'gt': 32, 'lt': 293 }],
                ['exit'],
                ['@end'],
            ]);
        });
    });
});
