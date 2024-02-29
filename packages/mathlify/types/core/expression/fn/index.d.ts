export { Brackets };
/** @typedef {import('../index.js').Expression} Expression */
/**
 * Fn class
 * @property {Brackets} fn
 */
export class Fn {
    /**
     * @constructor
     * Creates a Fn
     * @param {Brackets} fn
     */
    constructor(fn: Brackets);
    /** @type {'fn'} */
    type: 'fn';
    /** @type {Brackets} */
    fn: Brackets;
    /**
     * @returns {string}
     */
    toString(): string;
    /**
     * @returns {string}
     */
    toLexicalString(): string;
    /**
     * @returns {Fn}
     */
    clone(): Fn;
    /**
     * @param {Object.<string, Expression>} scope - variables to be replaced in the expression
     * @param {{verbatim: boolean}} options - default to automatic simplification
     * @returns {Fn}
     */
    subIn(scope: {
        [x: string]: Expression;
    }, options: {
        verbatim: boolean;
    }): Fn;
}
export type Expression = import('../index.js').Expression;
import { Brackets } from './brackets/index.js';
//# sourceMappingURL=index.d.ts.map