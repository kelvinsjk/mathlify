import { Expression, Variable, Numeral, Fraction } from '../index.js';

/** @typedef {import('../index.js').ExpressionType} ExpressionType */

/**
 * to ExpressionType
 * @param {ExpressionType|string|number|Fraction|Expression} exp
 * @return {ExpressionType}
 */
export function to_ExpressionType(exp) {
	if (exp instanceof Expression) {
		return exp.expression;
	} else if (typeof exp === 'string') {
		return new Variable(exp);
	} else if (typeof exp === 'number' || exp instanceof Fraction) {
		return new Numeral(exp, { verbatim: true });
	}
	return exp;
}

/**
 * to Expression
 * @param {ExpressionType|string|number|Fraction|Expression} exp
 * @return {Expression}
 */
export function to_Expression(exp) {
	if (typeof exp === 'string') {
		return new Expression(new Variable(exp));
	} else if (typeof exp === 'number' || exp instanceof Fraction) {
		return new Expression(new Numeral(exp, { verbatim: true }));
	} else if (exp instanceof Expression) {
		return exp;
	}
	return new Expression(exp);
}
