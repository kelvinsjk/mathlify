/** @typedef {import('../expression.js').Variable} Variable */
/**
 * The `Numeral` class represents a number.
 * At the moment, this is a wrapper around the `Fraction` class,
 * though we may add support for floats in the future
 *
 * @property {'numeral'} type
 * @property {Fraction|Float} number
 */
export class Numeral {
    /**
     * @param {Numeral|number|Fraction|Float} x
     * @param {Numeral|number|Fraction|Float} y
     * @returns {Numeral}
     */
    static min(x: Numeral | number | Fraction | Float, y: Numeral | number | Fraction | Float): Numeral;
    /**
     * @param {Numeral|number|Fraction|Float} x
     * @param {Numeral|number|Fraction|Float} y
     * @returns {Numeral}
     */
    static max(x: Numeral | number | Fraction | Float, y: Numeral | number | Fraction | Float): Numeral;
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
     * Creates a `Numeral` instance (supports only fractions at the moment)
     * @param {number|Fraction|Float|[number,number]} number
     * @param {{verbatim?: boolean}} [options] - options to override default simplification behavior
     */
    constructor(number: number | Fraction | Float | [number, number], options?: {
        verbatim?: boolean;
    } | undefined);
    /** @type {'numeral'} */
    type: "numeral";
    /** @type {Fraction|Float} */
    number: Fraction | Float;
    /**
     * Simplifies this numeral/fraction
     * @param {import('../expression.js').SimplifyOptions} [options]
     * @returns {Numeral}
     */
    simplify(options?: import("../expression.js").SimplifyOptions | undefined): Numeral;
    /** @returns {number} */
    valueOf(): number;
    /**
     * Returns the LaTeX string representation of this numeral
     * @returns {string}
     */
    toString(): string;
    /**
     * @returns {string}
     */
    _to_lexical_string(): string;
    /**
     * @returns {Numeral}
     */
    clone(): Numeral;
    /**
     * @param {Numeral|number|Fraction|Float} x
     * @returns {Numeral}
     */
    plus(x: Numeral | number | Fraction | Float): Numeral;
    /** @returns {Numeral} */
    negative(): Numeral;
    /**
     * @param {Numeral|number|Fraction|Float} x
     * @returns {Numeral}
     * */
    minus(x: Numeral | number | Fraction | Float): Numeral;
    /**
     * @param {Numeral|number|Fraction|Float} x
     * @returns {Numeral}
     */
    times(x: Numeral | number | Fraction | Float): Numeral;
    /**
     * @returns {Numeral}
     */
    reciprocal(): Numeral;
    /**
     * @param {Numeral|number|Fraction|Float} x
     * @returns {Numeral}
     */
    divide(x: Numeral | number | Fraction | Float): Numeral;
    /** @returns {Numeral} */
    abs(): Numeral;
    /**
     * @param {Numeral|number|Fraction|Float} n
     * @returns {Numeral}
     */
    pow(n: Numeral | number | Fraction | Float): Numeral;
    /**
     * @returns {Numeral}
     */
    square(): Numeral;
    /**
     * @returns {Numeral}
     */
    subIn(): Numeral;
    /**
     * @param {number} _x
     * @param {string|Variable} [_variable]
     * @returns {number}
     */
    fn: (_x: number, _variable?: string | import("../expression.js").Variable | undefined) => number;
    is: {
        /** @returns {boolean} */
        one: () => boolean;
        /** @returns {boolean} */
        negative_one: () => boolean;
        /** @returns {boolean} */
        zero: () => boolean;
        /** @returns {boolean} */
        nonzero: () => boolean;
        /** @returns {boolean} */
        positive: () => boolean;
        /** @returns {boolean} */
        negative: () => boolean;
        /** @returns {boolean} */
        non_negative: () => boolean;
        /** @returns {boolean} */
        integer: () => boolean;
        /**
         * @param {number|Numeral|Fraction} x
         * @returns {boolean} */
        equalTo: (x: number | Numeral | Fraction) => boolean;
        /**
         * @param {number|Numeral|Fraction} x
         * @returns {boolean} */
        lessThan: (x: number | Numeral | Fraction) => boolean;
        /**
         * @param {number|Numeral|Fraction} x
         * @returns {boolean} */
        moreThan: (x: number | Numeral | Fraction) => boolean;
        /**
         * @param {number|Numeral|Fraction} x
         * @returns {boolean} */
        atLeast: (x: number | Numeral | Fraction) => boolean;
        /**
         * @param {number|Numeral|Fraction} x
         * @returns {boolean} */
        atMost: (x: number | Numeral | Fraction) => boolean;
    };
    /**
     * @returns {number}
     */
    floor(): number;
    /**
     * @returns {number}
     */
    ceil(): number;
    /**
     * numerals do not contain any variables
     * @returns {false}
     */
    contains(): false;
}
export type Variable = import("../expression.js").Variable;
import { Fraction } from './fraction/fraction.js';
import { Float } from './float/float.js';
//# sourceMappingURL=numeral.d.ts.map