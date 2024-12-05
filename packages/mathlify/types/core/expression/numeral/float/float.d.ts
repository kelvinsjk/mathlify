/** @typedef {import('../fraction/fraction.js').Fraction} Fraction */
/**
 * The `Float` class represents a floating point number
 * @property {'float'} type
 * @property {number} value
 * @property {'fixed'|'precision'} displayMode
 * @property {number} precision
 *
 */
export class Float {
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
     * @param {Float} float
     * @returns {number} 1 or -1, depending on the sign. 0 or -0 are returned as-is.
     */
    static sign(float: Float): number;
    /**
     * @constructor
     * Creates a `Float` instance
     * @param {number} value
     * @param {{displayMode?: 'fixed'|'precision', precision?: number}} [options]
     */
    constructor(value: number, options?: {
        displayMode?: "fixed" | "precision";
        precision?: number;
    } | undefined);
    /** @type {'float'} */
    type: "float";
    /** @type {number} */
    value: number;
    /** @type {'fixed'|'precision'} */
    displayMode: "fixed" | "precision";
    /** @type {number} */
    precision: number;
    /**
     * @returns {Float}
     */
    clone(): Float;
    /**
     * @returns {number}
     */
    valueOf(): number;
    simplify(): Float;
    /**
     * returns the latex string representing this decimal
     * @param {{displayMode?: 'fixed'|'precision', precision?: number}} [options]
     * @returns {string}
     */
    toString(options?: {
        displayMode?: "fixed" | "precision";
        precision?: number;
    } | undefined): string;
    /**
     * @param {number} digits
     * @returns {string}
     */
    toFixed(digits: number): string;
    /**
     * @param {number} precision
     * @returns {string}
     */
    toPrecision(precision: number): string;
    is: {
        /** @returns {boolean} */
        positive: () => boolean;
        /** @returns {boolean} */
        negative: () => boolean;
        /** @returns {boolean} */
        non_negative: () => boolean;
        /** @returns {boolean} */
        zero: () => boolean;
        /** @returns {boolean} */
        nonzero: () => boolean;
        /** @returns {boolean} */
        integer: () => boolean;
        /** @returns {boolean} */
        one: () => boolean;
        /** @returns {boolean} */
        negative_one: () => boolean;
    };
    /**
     * sum of two floats
     * @param {Float|Fraction|number} x - the float to add
     * @returns {Float}
     */
    plus(x: Float | Fraction | number): Float;
    /**
     * product of two floats
     * @param {Float|Fraction|number} x - the float to multiply by
     * @returns {Float}
     */
    times(x: Float | Fraction | number): Float;
    /**
     * power of this float
     * @param {number|Fraction} n - the power to raise to
     * @returns {Float}
     */
    pow(n: number | Fraction): Float;
    /**
     * reciprocal of this float
     * @returns {Float}
     */
    reciprocal(): Float;
    /**
     * division
     * @param {Float|Fraction|number} x - the float to divide by
     */
    divide(x: Float | Fraction | number): Float;
    /**
     * absolute value of this float
     * @returns {Float}
     */
    abs(): Float;
    /**
     * negation of this float
     * @returns {Float}
     */
    negative(): Float;
}
export type Fraction = import("../fraction/fraction.js").Fraction;
//# sourceMappingURL=float.d.ts.map