/**
 * solve long division
 * @param {Polynomial} poly - the polynomial to be divided
 * @param {Polynomial} divisor - the divisor
 * @param {Fraction[]} [accumulator=[]] - the accumulator (for recursive calls)
 * @returns {{exp: Expression, quotient: Polynomial, remainder: Polynomial, divisor: Polynomial}} - the long divided form q(x) + r(x)/d(x)
 */
export function longDivide(poly: Polynomial, divisor: Polynomial, accumulator?: Fraction[] | undefined): {
    exp: Expression;
    quotient: Polynomial;
    remainder: Polynomial;
    divisor: Polynomial;
};
import { Polynomial } from "../../core/index.js";
import { Fraction } from "../../core/index.js";
import { Expression } from "../../core/index.js";
//# sourceMappingURL=longDivision.d.ts.map