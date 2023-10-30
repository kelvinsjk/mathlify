/**
 * partial fractions
 * @param {number|Fraction|string|Polynomial} num
 * @param {(Polynomial|string|[string|Polynomial, 2])[]|Polynomial|ExpressionProduct} den
 * - if polynomial provided, then expect reducible polynomial of degree 2.
 * Else expect an array of irreducible factors
 * @returns {{working: {start: string, substitutions: [Fraction, string][], comparing: string, final: string}, result: Expression}}
 */
export function partialFractionsWorking(num: number | Fraction | string | Polynomial, den: (Polynomial | string | [string | Polynomial, 2])[] | Polynomial | ExpressionProduct): {
    working: {
        start: string;
        substitutions: [Fraction, string][];
        comparing: string;
        final: string;
    };
    result: Expression;
};
import { Fraction } from "../../core/index.js";
import { Polynomial } from "../../core/index.js";
import { ExpressionProduct } from "../../algebra/index.js";
import { Expression } from "../../core/index.js";
//# sourceMappingURL=partial-fractions.d.ts.map