/**
 * converts number or fraction to Fraction class
 * @param {number|Fraction} x - number or fraction to be converted
 * @returns the Fraction class representation of x
 */
export function numberToFraction(x: number | Fraction): Fraction;
/** Fraction class representing a/b, where $a \in \mathbb{Z}$, $b \in \mathbb{Z}^+$, and $\gcd(a,b)=1$.
 * @property {number} num - the numerator (an integer)
 * @property {number} den - the denominator (a positive integer)
 * @property {"fraction"} type - mathlify fraction type
 */
export class Fraction {
    /**
     * gcd of n fractions. if all fractions are negative, will return a negative number
     * otherwise returns a positive fraction
     * @param  {...(Fraction|number)} fractions
     * @returns {Fraction} gcd. will be negative if all fractions negative. positive gcd otherwise
     */
    static gcd(...fractions: (Fraction | number)[]): Fraction;
    /**
     * lcm of n fractions
     * @param  {...(Fraction|number)} fractions
     * @returns {Fraction} positive lcm of the fractions
     */
    static lcm(...fractions: (Fraction | number)[]): Fraction;
    /**
     * factorize n fractions, returning the common factor and a list of integers after factorization
     * @param  {...(Fraction|number)} fractions
     * @returns {[Fraction[], Fraction]} [list of integers after factorization, common factor]
     */
    static factorize(...fractions: (Fraction | number)[]): [Fraction[], Fraction];
    /**
     * max of n fractions
     * @param  {...(Fraction|number)} fractions
     * @returns {Fraction} max of the fractions
     */
    static max(...fractions: (Fraction | number)[]): Fraction;
    /**
     * min of n fractions
     * @param  {...(Fraction|number)} fractions
     * @returns {Fraction} min of the fractions
     */
    static min(...fractions: (Fraction | number)[]): Fraction;
    /**
     * re-instantiate Fraction class instance from JSON object literal
     * @param {FractionJSON} f JSON object literal obtained from JSON.parse
     * @returns {Fraction} fraction class instance
     */
    static fromJSON(f: import("./types.js").FractionJSON): Fraction;
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
    type: "fraction";
    /**
     * casts this fraction as a float
     * @returns {number} this fraction in js number primitive type
     */
    valueOf(): number;
    /**
     * casts this fraction as a latex string "(sign?)\frac{num}{den}"
     * @returns {string} the latex string representation of this fraction
     */
    toTex(): string;
    toString(): string;
    /**
     * boolean methods for this fraction
     */
    is: {
        /**
         * @returns {boolean} whether this fraction is an integer
         */
        integer: () => boolean;
        /**
         * @returns {boolean} whether this fraction is positive
         */
        positive: () => boolean;
        /**
         * @returns {boolean} whether this fraction is negative
         */
        negative: () => boolean;
        /**
         * @returns {boolean} whether this fraction is zero
         */
        zero: () => boolean;
        /**
         * @returns {boolean} whether this fraction is one
         */
        one: () => boolean;
        /**
         * @param {number|Fraction} x the second number/fraction
         * @returns {boolean} whether this fraction is equal to x
         */
        equalTo: (x: number | Fraction) => boolean;
        /**
         * @param {number|Fraction} x the second number/fraction
         * @returns {boolean} whether this fraction is greater than x
         */
        greaterThan: (x: number | Fraction) => boolean;
        /**
         * @param {number|Fraction} x the second number/fraction
         * @returns {boolean} whether this fraction is less than to x
         */
        lessThan: (x: number | Fraction) => boolean;
        /**
         * @param {number|Fraction} x the second number/fraction
         * @returns {boolean} whether this fraction is greater than or equal to x
         */
        atLeast: (x: number | Fraction) => boolean;
        /**
         * @param {number|Fraction} x the second number/fraction
         * @returns {boolean} whether this fraction is less than or equal to x
         */
        atMost: (x: number | Fraction) => boolean;
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
             * @returns {boolean} whether this fraction is not zero
             */
            zero: () => boolean;
            /**
             * @returns {boolean} whether this fraction is not one
             */
            one: () => boolean;
            /**
             * @param {number|Fraction} x the second number/fraction
             * @returns {boolean} whether this fraction is not equal to x
             */
            equalTo: (x: number | Fraction) => boolean;
            /**
             * @param {number|Fraction} x the second number/fraction
             * @returns {boolean} whether this fraction is not greater than x
             */
            greaterThan: (x: number | Fraction) => boolean;
            /**
             * @param {number|Fraction} x the second number/fraction
             * @returns {boolean} whether this fraction is not less than to x
             */
            lessThan: (x: number | Fraction) => boolean;
            /**
             * @param {number|Fraction} x the second number/fraction
             * @returns {boolean} whether this fraction is not at least (ie smaller than) x
             */
            atLeast: (x: number | Fraction) => boolean;
            /**
             * @param {number|Fraction} x the second number/fraction
             * @returns {boolean} whether this fraction is not at most (ie greater than) x
             */
            atMost: (x: number | Fraction) => boolean;
        };
    };
    /**
     * the sign of this fraction
     * @returns {number} 1 if this is positive, 0 if this is zero, and -1 otherwise
     */
    sign(): number;
    /**
     * @param {number|Fraction} x the number/fraction to be added
     * @returns {Fraction} the sum
     */
    plus(x: number | Fraction): Fraction;
    /**
     * @param {number|Fraction} x the number/fraction to be multiplied
     * @returns {Fraction} the product
     */
    times(x: number | Fraction): Fraction;
    /**
     * @returns {Fraction} the negative of this fraction
     */
    negative(): Fraction;
    /**
     * @param {number|Fraction} x - the number/fraction to be subtracted
     * @returns {Fraction} the difference this minus x
     */
    minus(x: number | Fraction): Fraction;
    /**
     * @returns {Fraction} the reciprocal of this fraction
     */
    reciprocal(): Fraction;
    /**
     * @param {number|Fraction} x the number/fraction to be divided by
     * @returns {Fraction} the quotient this divided by x
     */
    divide(x: number | Fraction): Fraction;
    /**
     * @returns {Fraction} the negative reciprocal
     */
    negativeReciprocal(): Fraction;
    /**
     * @param {number|Fraction} n the power/index
     * @returns {Fraction} the exponent, this to the power of n
     */
    pow(n: number | Fraction): Fraction;
    /**
     * @returns {Fraction} the square
     */
    square(): Fraction;
    /**
     * @returns {Fraction} the absolute value
     */
    abs(): Fraction;
    /**
     * @returns {number} this rounded off to the nearest integer
     */
    round(): number;
    /**
     * @returns {number} the floor: the greatest integer less than or equal to this
     */
    floor(): number;
    /**
     * @returns {number} the ceiling: the smallest integer greater than or equal to this
     */
    ceil(): number;
    /**
     * calls the js toFixed number method
     * @param {number|undefined} fractionDigits number of digits after the decimal point (0-20 inclusive)
     * @returns {string}
     */
    toFixed(fractionDigits: number | undefined): string;
    /**
     * calls the js toPrecision number method
     * @param {number|undefined} precision number of significant digits (1-21 inclusive)
     * @returns
     */
    toPrecision(precision: number | undefined): string;
    /**
     * @typedef {import('./types.js').FractionJSON} FractionJSON
     */
    /**
     * serializes object. can be used with the static
     * `Fraction.FromJSON` method to recreate this fraction
     * class instance
     * @returns {FractionJSON}
     */
    toJSON(): import("./types.js").FractionJSON;
}
//# sourceMappingURL=fraction.d.ts.map