export { Fraction };
/**
 * Numeral class
 * @property {Fraction} number
 */
export class Numeral {
    /**
     * @param {Numeral|number|Fraction} x
     * @param {Numeral|number|Fraction} y
     * @returns {Numeral}
     */
    static min(x: Numeral | number | Fraction, y: Numeral | number | Fraction): Numeral;
    /**
     * @param {Numeral|number|Fraction} x
     * @param {Numeral|number|Fraction} y
     * @returns {Numeral}
     */
    static max(x: Numeral | number | Fraction, y: Numeral | number | Fraction): Numeral;
    /**
     * @param {(Numeral|number|Fraction)[]} numerals
     * @returns {Numeral}
     */
    static gcd(...numerals: (Numeral | number | Fraction)[]): Numeral;
    /**
     * @param {Numeral|number|Fraction} x
     * @param {Numeral|number|Fraction} y
     * @returns {Numeral}
     */
    static lcm(x: Numeral | number | Fraction, y: Numeral | number | Fraction): Numeral;
    /**
     * @constructor
     * Creates a Numeral
     * note: fractions are automatically simplified by default
     * @param {number|Fraction|[number,number]} number - either the fraction or the numerator of the fraction
     * @param {{verbatim?: boolean}} [options] - default: `{verbatim: false}`
     */
    constructor(number: number | Fraction | [number, number], options?: {
        verbatim?: boolean | undefined;
    } | undefined);
    /** @type {'numeral'} */
    type: 'numeral';
    /** @type {Fraction} */
    number: Fraction;
    /**
     * simplifies this fraction
     * warning: mutates current instance
     * @returns {this}
     */
    simplify(): this;
    /**
     * @param {{mixedFractions?: boolean}} [options] - default: `{mixedFractions: false}`
     * @returns {string}
     */
    toString(options?: {
        mixedFractions?: boolean | undefined;
    } | undefined): string;
    /**
     * @returns {string}
     */
    toLexicalString(): string;
    /**
     * @returns {Numeral}
     */
    clone(): Numeral;
    /**
     * @param {Numeral|number|Fraction} x
     * @returns {Numeral}
     */
    plus(x: Numeral | number | Fraction): Numeral;
    /**
     * @param {Numeral|number|Fraction} x
     * @returns {Numeral}
     */
    times(x: Numeral | number | Fraction): Numeral;
    /**
     * @returns {Numeral}
     */
    reciprocal(): Numeral;
    /**
     * @param {Numeral|number|Fraction} x
     * @returns {Numeral}
     */
    divide(x: Numeral | number | Fraction): Numeral;
    /** @returns {Numeral} */
    abs(): Numeral;
    /** @returns {Numeral} */
    negative(): Numeral;
    /**
     * @param {Numeral|number|Fraction} x
     * @returns {Numeral}
     * */
    minus(x: Numeral | number | Fraction): Numeral;
    /**
     * @param {Numeral|number|Fraction} n
     * @returns {Numeral}
     */
    pow(n: Numeral | number | Fraction): Numeral;
    /**
     * @returns {Numeral}
     */
    subIn(): Numeral;
    is: {
        /** @returns {boolean} */
        one: () => boolean;
        /** @returns {boolean} */
        negative_one: () => boolean;
        /** @returns {boolean} */
        zero: () => boolean;
        /** @returns {boolean} */
        negative: () => boolean;
        /** @returns {boolean} */
        nonzero: () => boolean;
        /** @returns {boolean} */
        positive: () => boolean;
        /** @returns {boolean} */
        integer: () => boolean;
        /**
         * @param {number|Numeral|Fraction} x
         * @returns {boolean} */
        equal: (x: number | Numeral | Fraction) => boolean;
    };
    /** @returns {number} */
    valueOf(): number;
}
import { Fraction } from './fraction/index.js';
//# sourceMappingURL=index.d.ts.map