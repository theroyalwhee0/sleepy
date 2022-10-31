import { describe, it } from 'mocha';
import { expect } from 'chai';
import { SinonSpy, spy } from 'sinon';
import { Evaluator, execIterable, SleepyState, SleepyContext } from '../src/exec';
import { JsonValue } from '../src/utilities/json';

describe('compile', () => {
    describe('execIterable', () => {
        it('should be an function', () => {
            expect(execIterable).to.be.a('function');
        });
        it('should execute an empty script', async () => {
            const emptyScript = [
                '[ "@begin", [ 0, 0, 1] ]',
                '[ "@end"]',
            ];
            const evaluator: Evaluator = spy((
                _ctx: SleepyContext,
                _state: SleepyState,
                _command: string,
                ..._args: JsonValue[]
            ): Awaited<void> => {
                expect.fail('Should not be called.');
            });
            const promise = execIterable(emptyScript, evaluator);
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({ state: {} });
            const evaluatorSpy = evaluator as SinonSpy;
            expect(evaluatorSpy.callCount).to.equal(0);
        });
        it('should execute an a simple script', async () => {
            const emptyScript = [
                '[ "@begin", [ 0, 0, 1] ]',
                '[ "@noop", "This is a comment." ]',
                '[ "@noop" ]',
                '[ "@noop" ]',
                '[ "@noop" ]',
                '[ "$name", "Bob Smith" ]',
                '[ "$counter", 0 ]',
                '[ "add" ]',
                '[ "print", "Hello World!" ]',
                '[ "sleep", 5 ]',
                '[ "print-state", "counter" ]',
                '[ "add", 2 ]',
                '[ "print-state", "counter" ]',
                '[ "raise", 2 ]',
                '[ "print-state", "counter" ]',
                '[ "print-state", "name" ]',
                '[ "print", "Goodbye." ]',
                '[ "@end" ]',
            ];
            type MyState = {
                name: string,
                counter: number,
            }
            const print: string[] = [];
            const evaluator = spy<Evaluator<MyState>>(async (
                ctx: SleepyContext,
                state: MyState,
                command: string,
                ...args: JsonValue[]
            ): Promise<void> => {
                switch (command) {
                    case 'sleep': {
                        await new Promise<void>((resolve) => {
                            const ms = (args[0] as number) ?? 100;
                            setTimeout(() => resolve(), ms);
                        });
                        break;
                    }
                    case 'print': {
                        print.push(`> ${args.join(' ')}`);
                        break;
                    }
                    case 'print-state': {
                        const key = (args[0] as keyof MyState) || '';
                        print.push(`> State "${key}" = ${state[key]}`);
                        break;
                    }
                    case 'add': {
                        state.counter += (args[0] as number) || 1;
                        break;
                    }
                    case 'raise': {
                        state.counter **= (args[0] as number) || 1;
                        break;
                    }
                    default: {
                        throw new Error(`Runtime Error: Unrecognized command '${command}'`);
                    }
                }
            });
            const result = await execIterable(emptyScript, evaluator);
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
    });
});

