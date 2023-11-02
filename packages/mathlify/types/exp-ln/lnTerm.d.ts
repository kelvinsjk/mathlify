export class LnTerm extends Term {
    /**
     * @param {number|Fraction} arg
     * @param {{coeff?: number|Fraction, base?: string|Fraction|number}} [options]
     */
    constructor(arg: number | Fraction, options?: {
        coeff?: number | Fraction | undefined;
        base?: string | number | Fraction | undefined;
    } | undefined);
    /** @type {'ln-term'} */
    type: 'ln-term';
    /** @type {Fraction} */
    arg: Fraction;
    /** @type {string|Fraction} */
    base: string | Fraction;
    /** @type {string} */
    ln: string;
    /**
     * @param {LnTerm} x
     * @returns {LnTerm}
     */
    plus(x: LnTerm): LnTerm;
    /**
     * @returns {LnTerm}
     */
    negative(): LnTerm;
    /**
     * @returns {LnTerm}
     */
    makeCoeffPositive(): LnTerm;
    /**
     * @param {LnTerm} x
     * @returns {LnTerm}
     */
    minus(x: LnTerm): LnTerm;
    /**
     * change base working
     * @param {string|Fraction|number} newBase
     * @returns {string}
     */
    changeBase(newBase: string | Fraction | number): string;
}
import { Term } from "../core/index.js";
import { Fraction } from "../core/index.js";
//# sourceMappingURL=lnTerm.d.ts.map