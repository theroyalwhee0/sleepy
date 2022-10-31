import { describe, it } from 'mocha';
import { expect } from 'chai';
import { getArgv } from '../src/argv';

describe('argv', () => {
    describe('getArgv', () => {
        // NOTE: Make sure the 'exit' argument (2nd argument) is set to false to prevent 
        // yargs from exiting tests.
        it('should be an function', () => {
            expect(getArgv).to.be.a('function');
            expect(getArgv.length).to.equal(1);
        });
        it('should parse command line', () => {
            const argv = [
                '/home/user/.nvm/versions/node/v18.0.0/bin/node',
                '/home/user/sleepy/compiler/dist/cli.js',
                './noop.zzz',
                './out/'
              ];
            const result = getArgv(argv, false);
            expect(result).to.be.an('object');
        });
    });
});
