import { Polynomial, Expression, Fraction } from '../../../core/index.js';

export const castExpression = {
	/**
	 * cast an Expression to Polynomial type with single variable x
	 * @param {Expression} exp - the expression to be casted
	 * @param {{ascending?: boolean, variable?: string}} [options] - options for the polynomial (default: {ascending: false, variable: 'x'})
	 * @returns {Polynomial} the polynomial representation of this term
	 */
	toPolynomial: (exp, options) => {
		const x = options?.variable ?? 'x';
		/** @type {(number|Fraction)[]} */
		const coeffs = [];
		exp.terms.forEach((term) => {
			if (term.powerMap.size === 0) {
				coeffs[0] = term.coeff;
			} else if (term.powerMap.size === 1) {
				const power = term.powerMap.get(x);
				if (power) {
					if (power.is.integer() && power.is.positive()) {
						coeffs[power.valueOf()] = term.coeff;
					} else {
						throw new Error(
							`cannot cast ${this} to Polynomial: non-positive integer power ${power} detected`
						);
					}
				} else {
					throw new Error(
						`cannot cast ${this} to Polynomial: variables other than ${x} detected`
					);
				}
			} else {
				throw new Error(
					`cannot cast ${this} to Polynomial: more than 1 variable detected`
				);
			}
		});
		const ascending = options?.ascending ?? false;
		for (let i = 0; i < coeffs.length; i++) {
			if (coeffs[i] === undefined) {
				coeffs[i] = 0;
			}
		}
		if (!ascending) {
			coeffs.reverse();
		}
		const newPoly = new Polynomial(coeffs, { ascending, variable: x });
		return newPoly;
	},
};
