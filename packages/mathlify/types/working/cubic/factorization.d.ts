/**
 * cubic factorization
 * @param {Polynomial} cubic
 * @param {number|Fraction|Polynomial} root
 * @param {{constants: [string, string, string]}} [options] - options for constant names. defaults to a,b,c
 * @returns {{factors: [Polynomial, Polynomial, Polynomial?], exp: ExpressionProduct, working: string, quadratic: Polynomial} }
 */
export function factorizeCubicWorking(cubic: Polynomial, root: number | Fraction | Polynomial, options?: {
    constants: [string, string, string];
} | undefined): {
    factors: [Polynomial, Polynomial, Polynomial?];
    exp: ExpressionProduct;
    working: string;
    quadratic: Polynomial;
};
import { Polynomial } from "../../core";
import { Fraction } from "../../core";
import { ExpressionProduct } from "../../algebra";
//# sourceMappingURL=factorization.d.ts.map