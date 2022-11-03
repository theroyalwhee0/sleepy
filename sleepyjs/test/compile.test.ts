import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe, it } from 'mocha';
import { BlankCommand, CommentCommand, NoopCommand, UserCommand } from '../src/commands';
import { compileParsed } from '../src/compile';
import { asyncIterabletoArray, mockParsed } from './mock';
import { variesChaiEql } from './patch-eql';

chai.use(chaiAsPromised);
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
            expect(result).to.be.a('promise');
            const compiled = await result;
            expect(compiled).to.be.a('object');
            expect(typeof compiled.rows).to.equal('object');
            expect(compiled.rows[Symbol.asyncIterator]).to.be.a('function');
            const rows = await asyncIterabletoArray(compiled.rows);
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
            const compiled = await compileParsed(parsed, { optimize: true });
            const rows = await asyncIterabletoArray(compiled.rows);
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
            const compiled = await compileParsed(parsed, {
                source: 'noop.zzz',
                optimize: true,
                info: true,
            });
            const rows = await asyncIterabletoArray(compiled.rows);
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
            const compiled = await compileParsed(parsed, { optimize: false });
            const rows = await asyncIterabletoArray(compiled.rows);
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
            const compiled = await compileParsed(parsed, { optimize: false });
            const rows = await asyncIterabletoArray(compiled.rows);
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
            const compiled = await compileParsed(parsed);
            const rows = await asyncIterabletoArray(compiled.rows);
            expect(rows).to.eql([
                ['@begin', sleepy_version],
                ['print', 'Hello World!'],
                ['sleep', 50],
                ['check', { 'gt': 32, 'lt': 293 }],
                ['exit'],
                ['@end'],
            ]);
        });
        it('should throw once iterated over', async () => {
            const parsed = mockParsed([
                new UserCommand('print', ['Hello World!']),
                new Error('Something went wrong'),
            ]);
            const compiled = await compileParsed(parsed);
            expect(compiled).to.be.a('object');
            expect(typeof compiled.rows).to.equal('object');
            expect(compiled.rows[Symbol.asyncIterator]).to.be.a('function');
            const result = asyncIterabletoArray(compiled.rows);
            expect(result).to.eventually.be.rejectedWith('Something went wrong');
        });
        it('should fail immediately when validateNow option set', async () => {
            const parsed = mockParsed([
                new UserCommand('print', ['Hello World!']),
                new Error('Something went wrong'),
            ]);
            const result = compileParsed(parsed, { validateNow: true });
            return expect(result).to.eventually.be.rejectedWith('Something went wrong');
        });
    });
});
