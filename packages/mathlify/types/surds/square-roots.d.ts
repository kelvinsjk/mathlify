/**
 * extract perfect n powers from a number
 * takes an integer x, and returns [a, b] such that x = a^n b, where b is n-power free (up to prime factors less than 100)
 * @param {number} x - the number to be factorized
 * @param {number} [n=2] - the power to be extracted
 * @param {number} [y=1] - a^n store-keep. for purposes of recurrence, should typically only be used internally.
 * @return {[number, number]} - [a, b] such that x = a^n b, where b is n-power free (up to prime factors less than 100)
 */
export function extractPowers(x: number, n?: number | undefined, y?: number | undefined): [number, number];
/**
 * SquareRoot extending the Term class
 * will be automatically rationalized into k sqrt(radicand), where k is the coefficient (handled by the base Term class)
 * supports automatic simplification involving prime factors at most 100
 * @property {Fraction} radicand - radicand of the square root (will be rationalized to an integer)
 * @property {"sqrt"} kind - mathlify sqrt class kind
 * @property {"sqrt"|"sqrt-rational"} type - mathlify sqrt class type
 * @extends Term
 */
export class SquareRoot extends Term {
    /**
     * @constructor
     * Creates an Expansion Term instance
     * @param {number|Fraction} radicand - x in k sqrt{x}
     * @param {{coeff: number|Fraction}} [options] - options object defaulting to `{coeff: 1}`
     */
    constructor(radicand: number | Fraction, options?: {
        coeff: number | Fraction;
    } | undefined);
    /** @type {Fraction} */
    radicand: Fraction;
    /** @type {"sqrt"} kind - mathlify sqrt class kind */
    kind: "sqrt";
    /** @type {"sqrt"|"sqrt-rational"} type - mathlify sqrt class type */
    type: "sqrt" | "sqrt-rational";
    /**
     * resets coeff
     * should not be used directly: only present to ensure compatibility with Expression class
     * @returns {SquareRoot} - the Expansion Term but with coeff = 1
     */
    resetCoeff(): SquareRoot;
    times(x: string | Term): Term | SquareRoot;
    times(x: number | Fraction | SquareRoot): SquareRoot;
    /**
     * reciprocal
     * @returns {SquareRoot} - the reciprocal
     */
    reciprocal(): SquareRoot;
    divide(x: string | Term): Term;
    divide(x: number | Fraction | SquareRoot): SquareRoot;
    /**
     * power
     * @param {number} n - the exponent
     * @returns {SquareRoot} - the power
     */
    pow(n: number): SquareRoot;
    /**
     * square
     * @returns {Fraction} - the square
     */
    square(): Fraction;
    /**
     * negative
     * @returns {SquareRoot} - the negative
     */
    negative(): SquareRoot;
    /**
     * abs
     * @returns {SquareRoot} - the absolute value
     */
    abs(): SquareRoot;
    /**
     * boolean methods for this term
     */
    is: {
        constant: () => boolean;
        /** @type {(term2: string|number|Fraction|Term)=>boolean} */
        like: (term2: string | number | Fraction | Term) => boolean;
        /**
         * checks if two square roots are equal
         * @param {SquareRoot|number|Fraction|Term|string} term2
         * @return {boolean}
         */
        equalTo: (term2: SquareRoot | number | Fraction | Term | string) => boolean;
        /**
         * whether this square root is rational (ie radicand of one)
         */
        rational: () => boolean;
        not: {
            rational: () => boolean;
            /**
             * checks if two square roots are not equal
             * @param {SquareRoot|number|Fraction|Term|string} term2
             * @return {boolean}
             */
            equalTo: (term2: SquareRoot | number | Fraction | Term | string) => boolean;
            constant: () => boolean;
            /** @type {(term2: string|number|Fraction|Term)=>boolean} */
            like: (term2: string | number | Fraction | Term) => boolean;
        };
    };
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
}
import { Term } from "../core/index.js";
import { Fraction } from "../core/index.js";
//# sourceMappingURL=square-roots.d.ts.map