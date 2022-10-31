import { describe, it } from 'mocha';
import { expect } from 'chai';
import { spy } from 'sinon';
import { Evaluator, execIterable, SleepyState, SleepyContext } from '../src/exec';
import { JsonValue } from '../src/utilities/json';

describe('compile', () => {
    describe('execIterable', () => {
        it('should be an function', () => {
            expect(execIterable).to.be.a('function');
        });
        it('should execute an empty script', async () => {
            const noopData = [
                [ '@begin', [0,0,1]],
                [ '@end '],
            ];
            const evaluator:Evaluator = spy((ctx:SleepyContext, state:SleepyState, command:string, ...args:JsonValue[]):Awaited<void> => {

            });
            const promise = execIterable(noopData, evaluator);
            expect(promise).to.be.a('promise');
            const result = await promise;
            expect(result).to.eql({
                rows: [
                    ['@begin', [0,0,1]],
                    ['@end'],
                ],
            });
        });
    });
});

