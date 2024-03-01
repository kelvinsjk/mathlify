/** The Polynomial class represents single-variable polynomials over the rationals (support for floats to be added in the future using the numeral class) */
export class Polynomial extends GeneralPolynomial {
    /**
     * @param {Numeral[]} coeffs
     * @param { {ascending?: boolean, variable?: string} } [options] - defaults to ascending polynomial with variable 'x'
     */
    constructor(coeffs: Numeral[], options?: {
        ascending?: boolean | undefined;
        variable?: string | undefined;
    } | undefined);
    /** @type {Numeral[]} */
    coeffs: Numeral[];
    get options(): {
        ascending: boolean;
        variable: string;
    };
    get degree(): number;
    /**
     * @param {number|Polynomial} p2
     * @returns {Polynomial}
     */
    times(p2: number | Polynomial): Polynomial;
    /**
     * @param {number|Polynomial} p2
     * @returns {Polynomial}
     */
    plus(p2: number | Polynomial): Polynomial;
    /**
     * @returns {Polynomial}
     */
    negative(): Polynomial;
    /**
     *
     * @param {number|Polynomial} p2
     * @returns
     */
    minus(p2: number | Polynomial): Polynomial;
    /**
     * @returns {Polynomial}
     */
    clone(): Polynomial;
    factorize: {
        /**
         * @returns {Expression & {commonFactor: Polynomial, remainingFactor: Polynomial}}
         */
        commonFactor: () => Expression & {
            commonFactor: Polynomial;
            remainingFactor: Polynomial;
        };
    };
}
import { GeneralPolynomial } from './general-polynomial.js';
import { Numeral } from '../expression/index.js';
import { Expression } from '../expression/index.js';
//# sourceMappingURL=polynomial.d.ts.map