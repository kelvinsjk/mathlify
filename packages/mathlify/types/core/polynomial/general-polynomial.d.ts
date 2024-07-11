/** @typedef {import('../expression/index.js').ExpressionType} ExpressionType */
/** The GeneralPolynomial class is a single-variable polynomial with coefficients that are arbitrary expression */
export class GeneralPolynomial extends Expression {
    /**
     * @param {ExpressionType[]} coeffs
     * @param { {ascending?: boolean, variable?: string} } [options] - defaults to ascending polynomial with variable 'x'
     * WARNING: do ensure that the coefficients are free of the variable. we currently do not check for this.
     */
    constructor(coeffs: ExpressionType[], options?: {
        ascending?: boolean | undefined;
        variable?: string | undefined;
    } | undefined);
    /** @type {ExpressionType[]} coeffs in ascending order */
    coeffs: ExpressionType[];
    /** @type {string} */
    variable: string;
    /** @type {boolean} */
    _ascending: boolean;
    get degree(): number;
    get options(): {
        ascending: boolean;
        variable: string;
    };
    /**
     * @param {boolean} asc
     */
    set ascending(asc: boolean);
    /** @returns {Expression} */
    quadraticDiscriminant(): Expression;
}
export type ExpressionType = import('../expression/index.js').ExpressionType;
import { Expression } from '../expression/index.js';
//# sourceMappingURL=general-polynomial.d.ts.map