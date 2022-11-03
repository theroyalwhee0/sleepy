import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { describe, it } from 'mocha';
import { Evaluator, execCompiled, SleepyContext } from '../src/exec';
import { JsonValue } from '../src/utilities/json';
import { mockCompiled } from './mock';
import { SleepyError } from '../src/errors/sleepyerror';

describe('exec', () => {
    describe('execCompiled', () => {
        it('should be an function', () => {
            expect(execCompiled).to.be.a('function');
        });
    });
    it('should execute an empty script', async () => {
        const compiled = mockCompiled();
        const evaluator = spy<Evaluator>((
            _ctx: SleepyContext,
            _command: string,
            ..._args: JsonValue[]
        ): Awaited<void> => {
            expect.fail('Should not be called.');
        });
        const promise = execCompiled(compiled, evaluator);
        expect(promise).to.be.a('promise');
        const result = await promise;
        expect(result).to.eql({ state: {} });
        const evaluatorSpy = evaluator as SinonSpy;
        expect(evaluatorSpy.callCount).to.equal(0);
    });
    it('should execute an a simple script', async () => {
        const simpleScript = [
            ['@begin', [0, 0, 1]],
            ['@noop', 'This is a comment.'],
            ['@noop'],
            ['@noop'],
            ['@noop'],
            ['@set', 'name', 'Bob Smith'],
            ['$counter', 0],
            ['add'],
            ['print', 'Hello World!'],
            ['sleep', 5],
            ['print-state', 'counter'],
            ['add', 2],
            ['print-state', 'counter'],
            ['raise', 2],
            ['print-state', 'counter'],
            ['print-state', 'name'],
            ['print', 'Goodbye.'],
            ['@end'],
        ];
        const compiled = mockCompiled(simpleScript);
        type MyState = {
            name: string,
            counter: number,
        }
        const print: string[] = [];
        const evaluator = spy<Evaluator<MyState>>(async (
            ctx: SleepyContext<MyState>,
            command: string,
            ...args: JsonValue[]
        ): Promise<void> => {
            switch (command) {
                case 'sleep': {
                    // An async command...
                    await new Promise<void>((resolve) => {
                        const ms = (args[0] as number) ?? 100;
                        setTimeout(() => resolve(), ms);
                    });
                    break;
                }
                case 'print': {
                    // A command that consumes a variable number of arguments.
                    print.push(`> ${args.join(' ')}`);
                    break;
                }
                case 'print-state': {
                    // A command that consumes state.
                    const key = (args[0] as keyof MyState) || '';
                    print.push(`> State "${key}" = ${ctx.state[key]}`);
                    break;
                }
                case 'add': {
                    // A command that mutates state and consumes an argument.
                    ctx.state.counter += (args[0] as number) || 1;
                    break;
                }
                case 'raise': {
                    // A command that mutates state and consumes an argument.
                    ctx.state.counter **= (args[0] as number) || 1;
                    break;
                }
                default: {
                    expect.fail(`Unrecognized command '${command}'`);
                }
            }
        });
        const result = await execCompiled(compiled, evaluator);
        expect(result).to.eql({
            state: {
                name: 'Bob Smith',
                counter: 9,
            },
        });
        const evaluatorSpy = evaluator as SinonSpy;
        expect(evaluatorSpy.callCount).to.equal(10);
        expect(print).to.eql([
            '> Hello World!',
            '> State "counter" = 1',
            '> State "counter" = 3',
            '> State "counter" = 9',
            '> State "name" = Bob Smith',
            '> Goodbye.',
        ]);
    });
    it('should support both language command and dollarsign set state', async () => {
        const simpleScript = [
            ['@begin', [0, 0, 1]],
            ['@set', 'firstName', 'Bob'],
            ['$lastName', 'Smith'],
            ['@end'],
        ];
        const compiled = mockCompiled(simpleScript);
        type MyState = {
            name: string,
            counter: number,
        }
        const evaluator = spy<Evaluator<MyState>>((
            _ctx: SleepyContext<MyState>,
            _command: string,
            ..._args: JsonValue[]
        ): Awaited<void> => {
            expect.fail('Should not be called.');
        });
        const result = await execCompiled(compiled, evaluator);
        expect(result).to.eql({
            state: {
                firstName: 'Bob',
                lastName: 'Smith',
            },
        });
        const evaluatorSpy = evaluator as SinonSpy;
        expect(evaluatorSpy.callCount).to.equal(0);
    });
    it('should catch and wrap errors thrown by commands', async () => {
        const simpleScript = [
            ['@begin', [0, 0, 1]],
            ['causeError'],
            ['@end'],
        ];
        const compiled = mockCompiled(simpleScript);
        type MyState = {
            name: string,
            counter: number,
        }
        const evaluator = spy<Evaluator<MyState>>(async (
            ctx: SleepyContext<MyState>,
            command: string,
            ..._args: JsonValue[]
        ): Promise<void> => {
            if (command === 'causeError') {
                throw new Error('Something went wrong');
            } else {
                expect.fail(`Unrecognized command '${command}'`);
            }
        });
        try {
            await execCompiled(compiled, evaluator);
            expect.fail('Should have thrown');
        } catch (err) {
            expect(err.message).to.equal('Something went wrong');
            expect(err.parent?.message).to.equal('Something went wrong');
            expect(err).to.be.an.instanceOf(SleepyError);
            if (err instanceof SleepyError) {
                expect(err.lineNum).to.equal(2);
            }
        }
        const evaluatorSpy = evaluator as SinonSpy;
        expect(evaluatorSpy.callCount).to.equal(1);
    });
});
