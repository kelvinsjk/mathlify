/** Binomial General Term class
 * @property {Fraction|string} coeff1
 * @property {number} power1
 * @property {Fraction|string} coeff2
 * @property {number} power2
 * @property {number} n
 */
export class BinomialGeneralTerm extends ExpansionTerm {
    /**
     * @constructor
     * Creates a Binomial General Term instance instance
     * @param {number|Fraction|string} coeff1
     * @param {number} power1
     * @param {number|Fraction|string} coeff2
     * @param {number} power2
     * @param {number} n
     */
    constructor(coeff1: number | Fraction | string, power1: number, coeff2: number | Fraction | string, power2: number, n: number);
    /** @type {Fraction|string} coeff1 */
    coeff1: Fraction | string;
    /** @type {number} power1 */
    power1: number;
    /** @type {Fraction|string} coeff2 */
    coeff2: Fraction | string;
    /** @type {number} power2 */
    power2: number;
    /** @type {number} n  */
    n: number;
    /** @type {Term} term1 */
    term1: Term;
    /** @type {Term} term2 */
    term2: Term;
    /**
     * power
     * @return {Polynomial}
     */
    power(): Polynomial;
    /**
     * coeff
     * @return {string}
     */
    coefficient(): string;
    /**
     * coeff
     * @param {number|Fraction} r
     * @return {Fraction}
     */
    coefficientFraction(r: number | Fraction): Fraction;
    /**
     * general term
     * @param {{working?: boolean, aligned?: boolean}} [options] defaults to {working: true, aligned: true}
     * @returns {string}
     */
    generalTerm(options?: {
        working?: boolean | undefined;
        aligned?: boolean | undefined;
    } | undefined): string;
}
import { ExpansionTerm } from "../../algebra/index.js";
import { Fraction } from "../../core/index.js";
import { Term } from "../../core/index.js";
import { Polynomial } from "../../core/index.js";
//# sourceMappingURL=generalTerm.d.ts.map