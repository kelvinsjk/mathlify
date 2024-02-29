import { Exponent } from '../exponent/index.js';
import { Numeral } from '../numeral/index.js';

/** @typedef {import('../index.js').SimplifyOptions} SimplifyOptions */
/** @typedef {import('../index.js').ExpressionType} ExpressionType */
/** @typedef {import('../index.js').Expression} Expression */

/**
 * simplifies exponents:
 * numeral^integer -> numeral
 * base^0 -> 1
 * base^1 -> base
 * @param {Expression} expression
 * @param {SimplifyOptions} [options] - options for which types to simplify. if not provided, all will be true. if object provided, all will be false unless indicated.
 * @returns {ExpressionType|undefined}
 * WARNING: mutates current instance
 */
export function simplify_exponent(expression, options) {
	const exp = expression.expression;
	if (!(exp instanceof Exponent)) return undefined;
	exp.simplify(options);
	const { base, power } = exp;
	if (base instanceof Numeral && power instanceof Numeral && power.number.is.integer()) {
		return new Numeral(base.number.pow(power.number));
	} else if (power instanceof Numeral && power.number.is.zero()) {
		return new Numeral(1);
	} else if (power instanceof Numeral && power.number.is.one()) {
		return base;
	}
}
