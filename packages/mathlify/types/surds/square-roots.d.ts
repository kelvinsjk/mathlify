/**
 * SquareRoot extending the Term class
 * will be automatically rationalized into k sqrt(radicand), where k is the coefficient (handled by the base Term class)
 * supports automatic simplification involving prime factors at most 100
 * @property {Fraction} radicand - radicand of the square root (will be rationalized to an integer)
 * @property {"sqrt"} type - mathlify sqrt class kind
 * @extends Term
 */
export class SquareRoot extends Term {
    /**
     * re-instantiate Polynomial class instance from JSON object literal
     * @param {SqrtJSON} s JSON object literal obtained from JSON.parse
     * @returns {SquareRoot} Term class instance
     */
    static fromJSON(s: import("./types.d.ts").SqrtJSON): SquareRoot;
    /**
     * @constructor
     * Creates a Square Root Term instance
     * @param {number|Fraction} radicand x in k sqrt{x}
     * @param {{coeff: number|Fraction}} [options] - options object defaulting to `{coeff: 1}`
     */
    constructor(radicand: number | Fraction, options?: {
        coeff: number | Fraction;
    } | undefined);
    /** @type {Fraction} */
    radicand: Fraction;
    /** @type {"sqrt"} mathlify sqrt class type */
    type: "sqrt";
    /**
     * @returns {SquareRoot} - the square root Term but with coeff = 1
     */
    resetCoeff(): SquareRoot;
    times(x: number | Fraction | SquareRoot): SquareRoot;
    times(x: string | Term): Term;
    /**
     * reciprocal
     * @returns {SquareRoot} - the reciprocal
     */
    reciprocal(): SquareRoot;
    divide(x: number | Fraction | SquareRoot): SquareRoot;
    divide(x: string | Term): Term;
    /**
     * @param {number} n - the exponent
     * @returns {SquareRoot} - this raised to the power of n
     */
    pow(n: number): SquareRoot;
    /**
     * @returns {Fraction} the square
     */
    square(): Fraction;
    /**
     * @returns {SquareRoot} the negative
     */
    negative(): SquareRoot;
    /**
     * @returns {SquareRoot} the absolute value
     */
    abs(): SquareRoot;
    /**
     * value of
     * @returns {number} - the numerical value of the term
     */
    valueOf(): number;
    /**
     *
     * @param {number} precision
     * @returns {string}
     */
    toPrecision(precision: number): string;
    /**
     *
     * @param {number} digits
     * @returns {string}
     */
    toFixed(digits: number): string;
    /** @typedef {import('./types.d.ts').SqrtJSON} SqrtJSON */
    /**
     * serializes polynomial object. can be used with the static
     * `SquareRoot.FromJSON` method to recreate this polynomial
     * class instance
     * @returns {SqrtJSON}
     */
    toJSON(): import("./types.d.ts").SqrtJSON;
}
import { Term } from '../core/index.js';
import { Fraction } from '../core/index.js';
//# sourceMappingURL=square-roots.d.ts.map