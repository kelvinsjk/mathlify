/**
 * partial fractions
 * @param {RationalFn} rational
 * @param {Polynomial} [denFactor] - for cubic denominators, we require a known linear factor to proceed
 * @returns {{working: string, result: Expression}}
 * WARNING: assumes that denominator has integral coefficients and has gcd==1.
 */
export function partialFraction(rational: RationalFn, denFactor?: Polynomial | undefined): {
    working: string;
    result: Expression;
};
import { RationalFn } from "../../calculus/rationalFn/rationalFn.js";
import { Polynomial } from "../../core/index.js";
import { Expression } from "../../core/index.js";
//# sourceMappingURL=partial-fractions.d.ts.map