export class BinomialGeneralTermWorking {
    /**
     * @param {number|Fraction|string|Term} coeff1
     * @param {number} pow1
     * @param {number|Fraction|string|Term} coeff2
     * @param {number} pow2
     * @param {number} n
     * @param {{variable?: string, aligned?: boolean}} [options]
     */
    constructor(coeff1: number | Fraction | string | Term, pow1: number, coeff2: number | Fraction | string | Term, pow2: number, n: number, options?: {
        variable?: string | undefined;
        aligned?: boolean | undefined;
    } | undefined);
    /** @type {Fraction|Term} */
    coeff1: Fraction | Term;
    /** @type {number} */
    pow1: number;
    /** @type {Fraction|Term} */
    coeff2: Fraction | Term;
    /** @type {number} */
    pow2: number;
    /** @type {number} */
    n: number;
    /** @type {string} */
    variable: string;
    /** @type {Term} */
    generalTerm: Term;
    /** @type {Term} */
    term1: Term;
    /** @type {Term} */
    term2: Term;
    /** @type {ExpressionProduct} */
    binomial: ExpressionProduct;
    /** @type {Polynomial} */
    power: Polynomial;
    /** @type {boolean} */
    aligned: boolean;
    toString(): string;
    /**
     * @param {number|Fraction} r
     * @returns {{working: string, coeffWorking: string, term: Term, coeff: Term|Fraction}}
     */
    at(r: number | Fraction): {
        working: string;
        coeffWorking: string;
        term: Term;
        coeff: Term | Fraction;
    };
}
import { Fraction } from '../../core/index.js';
import { Term } from '../../core/index.js';
import { ExpressionProduct } from '../../algebra/index.js';
import { Polynomial } from '../../core/index.js';
//# sourceMappingURL=generalTerm.d.ts.map