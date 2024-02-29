import { Expression, Numeral, Variable, Exponent, Product, Sum } from '../expression/index.js';
/** @typedef {import('../expression/index.js').ExpressionType} ExpressionType */

/** The GeneralPolynomial class is a single-variable polynomial with coefficients that are arbitrary expression */
export class GeneralPolynomial extends Expression {
	/** @type {ExpressionType[]} coeffs in ascending order */
	coeffs;
	/** @type {string} */
	variable;
	/** @type {boolean} */
	ascending;

	/**
	 * @param {ExpressionType[]} coeffs
	 * @param { {ascending?: boolean, variable?: string} } [options] - defaults to ascending polynomial with variable 'x'
	 * WARNING: do ensure that the coefficients are free of the variable. we currently do not check for this.
	 */
	constructor(coeffs, options) {
		// simplify coeffs
		coeffs = coeffs.map((coeff) => {
			return new Expression(coeff).simplify().expression;
		});
		if (!options?.ascending) coeffs.reverse();
		// remove trailing zeros
		while (
			coeffs.length > 1 &&
			coeffs[coeffs.length - 1] instanceof Numeral &&
			/** @type {Numeral} */ (coeffs[coeffs.length - 1]).is.zero()
		) {
			coeffs.pop();
		}
		// construct terms
		const x = new Variable(options?.variable || 'x');
		const terms = coeffs.map((coeff, i) => {
			return i === 0 ? coeff : i === 1 ? new Product(coeff, x) : new Product(coeff, new Exponent(x, i));
		});
		if (!options?.ascending) terms.reverse();
		super(new Sum(...terms));
		this.coeffs = coeffs;
		this.variable = x.name;
		this.ascending = options?.ascending ?? false;
	}
}
