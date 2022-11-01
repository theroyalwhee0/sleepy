// This is a hacky monkey-patch of Chai deep-equals functionality to add a custom comparator
// to do type check and regexp matching during deep equality. It does not produce nice error messages.

import { isString, isNumber, isArray, isObject } from '@theroyalwhee0/istype';
import { DeepEqualOptions } from 'deep-eql';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Monkey patching, need to use require.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const chaiUtils = require('chai/lib/chai/utils/index.js');

/**
 * IsVaries symbol to flag what entries belonging to this module.
 */
const IsVaries = Symbol('IsVaries');

/**
 * Single sided equality function.
 */
export type EqualsFunc = ((value: unknown) => boolean | null);

/**
 * Equality function flaged as belonging to this module.
 */
export type VariesEqual = EqualsFunc & {
    [IsVaries]: true,
};

/**
 * Flag a equality function to belong to this module.
 * @param fn An equality function.
 * @returns A flagged equality function.
 */
function buildEquals(fn: EqualsFunc): VariesEqual {
    const equals = (fn) as VariesEqual;
    equals[IsVaries] = true;
    return equals;
}

/**
 * Fluent builder for VariesEqual equality functions.
 */
export class VariesBuilder {
    get to(): this {
        return this;
    }

    get be(): this {
        return this;
    }

    get as(): this {
        return this;
    }

    get an(): this {
        return this;
    }

    get a(): this {
        return this;
    }

    /**
     * Expect value to be a string.
     * @returns True if string, false otherwise.
     */
    string(): VariesEqual {
        return buildEquals((value: unknown): boolean | null => {
            return isString(value);
        });
    }

    /**
     * Expect value to be a number.
     * @returns True if number, false otherwise.
     */
    number(): VariesEqual {
        return buildEquals((value: unknown): boolean | null => {
            return isNumber(value);
        });
    }

    /**
     * Expect value to be an array.
     * @returns True if array, false otherwise.
     */
    array(): VariesEqual {
        return buildEquals((value: unknown): boolean | null => {
            return isArray(value);
        });
    }

    /**
     * Expect value to be an object.
     * @returns True if object, false otherwise.
     */
    object(): VariesEqual {
        return buildEquals((value: unknown): boolean | null => {
            return isObject(value);
        });
    }

    /**
     * Expect value to be a regexp match, must also be a string.
     * @returns True if match, false otherwise.
     */
    match(regexp: RegExp): VariesEqual {
        return buildEquals((value: unknown): boolean | null => {
            return typeof value === 'string' && regexp.test(value);
        });
    }
}

/**
 * Build an instance of the fluent builder.
 */
export const varies = new VariesBuilder();

/**
 * This monkey patches 'varies' support into Chai deep-eql.
 */
export function variesChaiEql() {
    if (chaiUtils[IsVaries] !== true) {
        const deepEql = chaiUtils.eql;
        chaiUtils[IsVaries] = true;
        chaiUtils.eql = function eql(left: unknown, right: unknown, options?: DeepEqualOptions): unknown {
            const optionsComparator = options?.comparator;
            function comparator(left: unknown, right: unknown): boolean | null {
                if (optionsComparator) {
                    // Call whatever comparator was already in options.
                    const result = optionsComparator(right, left);
                    if (result === true || result == false) {
                        return result;
                    }
                }
                let value: unknown;
                let equals: VariesEqual | undefined;
                if (typeof right === 'function' && right[IsVaries as keyof unknown] === true) {
                    // If right was VariesEqual.
                    equals = right as VariesEqual;
                } else {
                    value = right;
                }
                if (typeof left === 'function' && left[IsVaries as keyof unknown] === true) {
                    // If left was VariesEqual.
                    if (equals) {
                        // They can't both be VariesEqual.
                        throw new Error('Can not compare Varies against Varies');
                    }
                    equals = left as VariesEqual;
                } else {
                    value = left;
                }
                if (equals) {
                    // If one of them was VariesEqual.
                    return equals(value);
                }
                return null;
            }
            options = options ? Object.assign({}, options) : {};
            options.comparator = comparator;
            return deepEql(left, right, options);
        };
    }
    // Return fluent builder. Can also be imported directly from library.
    return varies;
}
