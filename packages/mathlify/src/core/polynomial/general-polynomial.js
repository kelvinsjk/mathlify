import { Expression, Numeral, Variable, Exponent, Product, Sum } from '../expression/index.js';
/** @typedef {import('../expression/index.js').ExpressionType} ExpressionType */

/** The GeneralPolynomial class is a single-variable polynomial with coefficients that are arbitrary expression */
export class GeneralPolynomial extends Expression {
	/** @type {ExpressionType[]} coeffs in ascending order */
	coeffs;
	/** @type {string} */
	variable;
	/** @type {boolean} */
	_ascending;

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
		const name = options?.variable || 'x';
		const x = new Expression(new Variable(name));
		const terms = coeffs
			.map((coeff, i) => {
				return i === 0
					? coeff
					: i === 1
						? new Product(new Expression(coeff), x)
						: new Product(new Expression(coeff), new Expression(new Exponent(x, new Expression(i))));
			})
			.map((term) => new Expression(term));
		if (!options?.ascending) terms.reverse();
		super(new Sum(...terms));
		this.simplify();
		this.coeffs = coeffs;
		this.variable = name;
		this._ascending = options?.ascending ?? false;
	}

	/**
	 * @param {boolean} asc
	 */
	set ascending(asc) {
		if (this._ascending !== asc) {
			// there might be only 1 term so expression is not a sum
			try {
				this.getSumTerms().reverse();
			} catch {}
		}
		this._ascending = asc;
	}
}
