/** @typedef {import('../../../macros/index.js').QuotientShorthand} FractionShorthand */
import { to_Expression } from './type-coercions.js';
import { unpack_shorthand_single } from '../../../macros/index.js';
import { Expression, Variable } from '../index.js';

/**
 * @param {Object.<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
 * @returns {Object.<string,Expression>}
 */
function resolve_scope(scope) {
	/** @type {Object.<string,Expression>} */
	const scope_exp = {};
	for (const [key, value] of Object.entries(scope)) {
		scope_exp[key] = to_Expression(unpack_shorthand_single(value));
	}
	return scope_exp;
}

/**
 * @param {Expression} expression
 * @param {Object.<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
 * @param {{verbatim?: boolean}} [options] - default to automatic simplification
 * @returns {Expression}
 */
export function sub_in(expression, scope, options) {
	const scope_exp = resolve_scope(scope);
	/** @type {Expression} */
	let exp;
	if (expression.expression instanceof Variable) {
		const name = expression.expression.name;
		if (name in scope_exp) {
			exp = new Expression(scope_exp[name].expression.clone());
			exp.multiplicationSign = expression.multiplicationSign;
			exp.mixedFractions = expression.mixedFractions;
		} else {
			exp = expression.clone();
		}
	} else {
		exp = new Expression(expression.expression.subIn(scope_exp, { verbatim: false, ...options }));
		exp.multiplicationSign = expression.multiplicationSign;
		exp.mixedFractions = expression.mixedFractions;
	}
	if (!options?.verbatim) exp.simplify();
	return exp;
}
