/** Fraction class
 * @property {number} num - the numerator (an integer)
 * @property {number} den - the denominator (a positive integer)
 * @property {"fraction"} kind - mathlify fraction class kind
 * @property {"fraction"|"fraction-int"} type - mathlify fraction class type: whether it is an integer or a regular fraction
 */
export class Fraction {
    /**
     * gcd of n fractions. if all fractions are negative, will return a negative number
     * otherwise returns a positive fraction
     * @param  {...(Fraction|number)} fractions
     * @returns {Fraction} negative gcd if all fractions negative, otherwise positive gcd
     */
    static gcd(...fractions: (Fraction | number)[]): Fraction;
    /**
     * get back Fraction class instance from JSON object
     * @param {FractionJSON} f - fraction JSON object
     * @returns {Fraction} fraction class instance
     */
    static fromJSON(f: {
        /**
         * - 'fraction'
         */
        kind: string;
        /**
         * - numerator
         */
        num: number;
        /**
         * - denominator
         */
        den: number;
        /**
         * - array of arguments to reconstruct current fraction
         */
        args: [number, number];
    }): Fraction;
    /** 1 in the fraction class */
    static ONE: Fraction;
    /** 0 in the fraction class */
    static ZERO: Fraction;
    /**
     * @constructor
     * Creates a Fraction instance, automatically hoisting any negatives to the
     * numerator, and simplifying the numerator and denominator such that
     * gcd(num, den) == 1
     * @param {number} num - the numerator (an integer)
     * @param {number} [den=1] - the denominator (a non-zero integer)
     */
    constructor(num: number, den?: number | undefined);
    /** @type {number} */
    num: number;
    /** @type {number} */
    den: number;
    /** @type {"fraction"} */
    kind: "fraction";
    /** @type {"fraction"|"fraction-int"} */
    type: "fraction" | "fraction-int";
    /**
     * casts this fraction as a float
     * @returns {number} this fraction in js number primitive type
     */
    valueOf(): number;
    /**
     * casts this fraction as a latex string
     * @returns {string} the latex string representation of this fraction
     */
    toString(): string;
    /**
     * boolean methods for this fraction
     */
    is: {
        /**
         * checks if this fraction is an integer
         * @returns {boolean} whether this fraction is an integer
         */
        integer: () => boolean;
        /**
         * checks if this fraction is positive
         * @returns {boolean} whether this fraction is positive
         */
        positive: () => boolean;
        /**
         * checks if this fraction is negative
         * @returns {boolean} whether this fraction is negative
         */
        negative: () => boolean;
        /**
         * checks if this fraction is zero
         * @returns {boolean} whether this fraction is zero
         */
        zero: () => boolean;
        /**
         * checks if this fraction is one
         * @returns {boolean} whether this fraction is one
         */
        one: () => boolean;
        /**
         * checks if two fractions are equal
         * @param {number|Fraction} x
         * @returns {boolean}
         */
        equalTo: (x: number | Fraction) => boolean;
        /**
         * checks if this fraction is greater than x
         * @param {number|Fraction} x
         * @returns {boolean}
         */
        greaterThan: (x: number | Fraction) => boolean;
        /**
         * checks if this fraction is less than x
         * @param {number|Fraction} x
         * @returns {boolean}
         */
        lessThan: (x: number | Fraction) => boolean;
        /** checks negation */
        not: {
            /**
             * @returns {boolean} whether this fraction is not an integer
             */
            integer: () => boolean;
            /**
             * @returns {boolean} whether this fraction is not positive
             */
            positive: () => boolean;
            /**
             * @returns {boolean} whether this fraction is not negative
             * */
            negative: () => boolean;
            /**
             * checks if this fraction is not zero
             * @returns {boolean} whether this fraction is not zero
             */
            zero: () => boolean;
            /**
             * checks if this fraction is note one
             * @returns {boolean} whether this fraction is not one
             */
            one: () => boolean;
            /**
             * checks if this is not equal to x
             * @param {number|Fraction} x
             * @returns {boolean}
             */
            equalTo: (x: number | Fraction) => boolean;
            /**
             * @param {number|Fraction} x
             * @returns {boolean} if this is not less than or equal to x
             * */
            greaterThan: (x: number | Fraction) => boolean;
            /**
             * @param {number|Fraction} x
             * @returns {boolean} if this is not greater than or equal to x
             * */
            lessThan: (x: number | Fraction) => boolean;
        };
        /**
         * at least
         * @param {number|Fraction} x
         * @returns {boolean} if this is at least x
         */
        atLeast: (x: number | Fraction) => boolean;
        /**
         * at most
         * @param {number|Fraction} x
         * @returns {boolean} if this is at most x
         * */
        atMost: (x: number | Fraction) => boolean;
    };
    /**
     * the sign of this fraction
     * @returns {number} 1 if this is positive, 0 if this is zero, and -1 otherwise
     */
    sign(): number;
    /**
     * fraction addition
     * @param {number|Fraction} x
     * @returns {Fraction} this plus x
     */
    plus(x: number | Fraction): Fraction;
    /**
     * fraction multiplication
     * @param {number|Fraction} x
     * @returns {Fraction} this times x
     */
    times(x: number | Fraction): Fraction;
    /**
     * negative
     * @returns {Fraction} negative of this fraction
     */
    negative(): Fraction;
    /**
     * fraction subtraction
     * @param {number|Fraction} x
     * @returns {Fraction} this minus x
     */
    minus(x: number | Fraction): Fraction;
    /**
     * reciprocal
     * @returns {Fraction} reciprocal of this fraction
     */
    reciprocal(): Fraction;
    /**
     * fraction division
     * @param {number|Fraction} x
     * @returns {Fraction} this divided by x
     */
    divide(x: number | Fraction): Fraction;
    /**
     * fraction exponentiation
     * @param {number} n - power/index
     * @returns {Fraction} this power n
     */
    pow(n: number): Fraction;
    /**
     * squares this fraction
     * @returns {Fraction} this^n
     */
    square(): Fraction;
    /**
     * absolute value
     * @returns {Fraction} - the absolute value of this
     */
    abs(): Fraction;
    /**
     * rounds off number
     * @returns {number}
     */
    round(): number;
    /**
     * floor: greatest integer less than or equal to this
     * @returns {number}
     */
    floor(): number;
    /**
     * ceil: smallest integer greater than or equal to this
     * @returns {number}
     */
    ceil(): number;
    /**
     * calls the default toFixed number method
     * @param {number|undefined} fractionDigits - number of digits after the decimal point (0-20 inclusive)
     * @returns {string}
     */
    toFixed(fractionDigits: number | undefined): string;
    /**
     * calls the default toPrecision number method
     * @param {number|undefined} precision - number of significant digits (1-21 inclusive)
     * @returns
     */
    toPrecision(precision: number | undefined): string;
    /**
     * @typedef {Object} FractionJSON
     * @property {string} kind - 'fraction'
     * @property {number} num - numerator
     * @property {number} den - denominator
     * @property {[number, number]} args - array of arguments to reconstruct current fraction
     */
    /**
     * serializes object. can be used with the static
     * `Fraction.FromJSON` method to recreate this fraction
     * class instance
     * @returns {FractionJSON}
     */
    toJSON(): {
        /**
         * - 'fraction'
         */
        kind: string;
        /**
         * - numerator
         */
        num: number;
        /**
         * - denominator
         */
        den: number;
        /**
         * - array of arguments to reconstruct current fraction
         */
        args: [number, number];
    };
}
//# sourceMappingURL=fraction.d.ts.map