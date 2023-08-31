/**
 * PowerTerm class extending the Term class representing k (f(x))^n
 * @property {Fraction} coeff
 * @property {Polynomial} fx
 * @property {Fraction} power
 * @property {"power-fn"} kind - mathlify rational class kind
 * @property {"power-fn"} type - mathlify rational class type
 * @extends Term
 */
export class PowerFn extends Term {
    /**
     * @constructor
     * Creates an Expansion Term instance
     * @param {Polynomial} fx - f(x) in k (f(x))^n
     * @param {number|Fraction} power - n in k (f(x))^n
     * @param {{coeff?: number|Fraction}} [options] - options
     */
    constructor(fx: Polynomial, power: number | Fraction, options?: {
        coeff?: number | Fraction | undefined;
    } | undefined);
    /** @type {Polynomial} coeff  */
    fx: Polynomial;
    /** @type {Fraction} power  */
    power: Fraction;
    /** @type {"power-fn"} kind - mathlify rational class kind */
    kind: "power-fn";
    /** @type {"power-fn"} type - mathlify rational class type */
    type: "power-fn";
    /**
     * differentiates
     * @returns {ExpansionTerm|PowerFn} powerFn type if fx is a linear polynomial, otherwise expansion term
     */
    differentiate(): ExpansionTerm | PowerFn;
    /**
     * integrates. only does automatic division for linear polynomials, otherwise assumes f'(x) is already there
     * @returns {PowerFn} - the Expansion Term multiplied by x
     */
    integrate(): PowerFn;
}
import { Term } from "../../core";
import { Polynomial } from "../../core";
import { Fraction } from "../../core";
import { ExpansionTerm } from "../../algebra";
//# sourceMappingURL=powerFn.d.ts.map