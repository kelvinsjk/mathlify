/** The Polynomial class represents single-variable polynomials over the rationals (support for floats to be added in the future using the numeral class) */
export class Polynomial extends GeneralPolynomial {
    /**
     *
     * @param {number} n
     * @param {{coeff?: number|Numeral|Expression, ascending?: boolean, variable?: string}} [options] coeff defaults to 1
     * @returns {Polynomial}
     */
    static ofDegree(n: number, options?: {
        coeff?: number | Numeral | Expression | undefined;
        ascending?: boolean | undefined;
        variable?: string | undefined;
    } | undefined): Polynomial;
    /**
     * @param {(Numeral|Expression|number)[]} coeffs
     * @param { {ascending?: boolean, variable?: string} } [options] - defaults to ascending polynomial with variable 'x'
     */
    constructor(coeffs: (Numeral | Expression | number)[], options?: {
        ascending?: boolean | undefined;
        variable?: string | undefined;
    } | undefined);
    /** @type {Numeral[]} */
    coeffs: Numeral[];
    /** @returns {Numeral} */
    get leadingCoefficient(): Numeral;
    /**
     * @returns {Polynomial}
     */
    negative(): Polynomial;
    /**
     * @param {number|Polynomial} p2
     * @returns {Polynomial}
     */
    plus(p2: number | Polynomial): Polynomial;
    /**
     *
     * @param {number|Polynomial} p2
     * @returns {Polynomial}
     */
    minus(p2: number | Polynomial): Polynomial;
    /**
     * @param {number|Numeral|Polynomial|Expression} p2 - Expression must be a numeral
     * @returns {Polynomial}
     */
    times(p2: number | Numeral | Polynomial | Expression): Polynomial;
    solve: {
        /**
         * @param {number|Polynomial|Expression} [rhs=0] - if in Expression type, only support Numerals
         * @returns {Expression}
         */
        linear: (rhs?: number | Expression | Polynomial | undefined) => Expression;
        /**
         *
         * @param {number|Polynomial} [rhs=0]
         * @returns {[Expression, Expression, 'rational']} such that either root1 = 0 or root1 \leq root2
         * TODO: allow options to modify output types
         * TODO: ensure integer discriminant
         */
        quadratic: (rhs?: number | Polynomial | undefined) => [Expression, Expression, 'rational'];
    };
    /**
     * @returns {Polynomial}
     */
    clone(): Polynomial;
    factorize: {
        /**
         * @param {{forcePositiveLeadingCoefficient?: boolean, verbatim?: boolean}} [options]
         * @returns {Expression & {commonFactor: Polynomial, remainingFactor: Polynomial}}
         */
        commonFactor: (options?: {
            forcePositiveLeadingCoefficient?: boolean | undefined;
            verbatim?: boolean | undefined;
        } | undefined) => Expression & {
            commonFactor: Polynomial;
            remainingFactor: Polynomial;
        };
        /**
         * returns factorized expression of the form k(ax-b)(cx-d) where a,b,c,d \in \mathbb{Z} and gcd(a,b)=gcd(c,d)=1 and d=0 or b/a < d/c. if equal roots, will return k(ax-b)^2
         * special exception: expressions like 4-x^2 factorize to (2+x)(2-x) rather than -(x+2)(x-2)
         * @returns {Expression & {factors: [Polynomial, Polynomial], multiple: Numeral}}
         */
        quadratic: () => Expression & {
            factors: [Polynomial, Polynomial];
            multiple: Numeral;
        };
    };
}
import { GeneralPolynomial } from './general-polynomial.js';
import { Numeral } from '../expression/index.js';
import { Expression } from '../expression/index.js';
//# sourceMappingURL=polynomial.d.ts.map