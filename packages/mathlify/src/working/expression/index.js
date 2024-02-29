import { Expression, Sum } from '../../core/index.js';

/** @typedef {'aligned'|'single'|'multi'} LineBreakMode */
/** @typedef {import('../../macros/index.js').BracketShorthand} BracketShorthand */
/** @typedef {import('../../macros/index.js').QuotientShorthand} FractionShorthand */
/** @typedef {import('../../core/expression/index.js').SimplifyOptions} SimplifyOptions */

/** @typedef {{hide?: boolean, string?: boolean}} ExpressionWorkingOptions */

/**
 * ExpressionWorking Class to handle the step-by-step working in manipulating an expression
 */
export class ExpressionWorking {
	/** @type {Expression} the current expression*/
	expression;
	/** @type {(Expression|string)[]} */
	expressions;
	/**
	 * @type {LineBreakMode}
	 * aligned: x &= y \\ &= z ...
	 * single: x = y = z ...
	 * multi: x \\ = y \\ = z ...
	 */
	lineBreakMode;
	/**
	 * @type {boolean}
	 * Only applicable for aligned and multi lineBreakMode
	 * If true: x = y \\ = z ...
	 * else: x \\ = y \\ = z ...
	 * */
	startOnFirstLine;

	/**
	 * Creates an ExpressionWorking
	 * @param {Expression} expression - the initial expression
	 * @param {{lineBreakMode?: LineBreakMode, startOnFirstLine?: boolean}} [options] - defaults to `{lineBreakMode: 'aligned', startOnFirstLine: false}`
	 */
	constructor(expression, options) {
		this.expressions = [expression];
		this.expression = expression;
		this.lineBreakMode = options?.lineBreakMode || 'aligned';
		this.startOnFirstLine = options?.startOnFirstLine || false;
	}

	/**
	 * @param {Object.<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
	 * @param {{verbatim?: boolean, hide?: boolean}} [options] - default to automatic simplification
	 * @returns {ExpressionWorking}
	 */
	subIn(scope, options) {
		this.expression = this.expression.subIn(scope, options);
		return addStep(this, options);
	}

	/**
	 * @typedef {SimplifyOptions & {hide?: boolean}} WorkingSimplifyOptions
	 * */

	/**
	 * @param {WorkingSimplifyOptions} [options] - {brackets?, product?, sum?, quotient?, numeral?, exponent?, hide?}
	 * @returns {ExpressionWorking}
	 * */
	simplify(options) {
		this.expression = this.expression.clone().simplify(options);
		return addStep(this, options);
	}

	/**
	 * @param {{verbatim?: boolean, numerator?: boolean, hide?: boolean}} [options] - default to automatic simplification
	 * @returns {ExpressionWorking}
	 * */
	expand(options) {
		this.expression = this.expression.clone().expand(options);
		return addStep(this, options);
	}

	/**
	 * @param {{hide?: boolean}} [options]
	 * @returns {ExpressionWorking}
	 * */
	factorize(options) {
		const start = this.expression;
		this.expression = start.clone().factorize({ verbatim: true });
		addStep(this, options);
		this.expression = this.expression.clone();
		const factors = this.expression.getProductTerms()[1];
		const innerSum = factors.filter((x) => x.expression instanceof Sum)[0];
		if (innerSum) {
			innerSum.expand({ verbatim: true });
			addStep(this, { string: true, ...options });
			innerSum.expand();
			addStep(this, options);
		}
		addStep(this, options);
		this.expression = start.clone().factorize();
		return addStep(this, options);
	}

	/**
	 * toggle Mixed fractions
	 * @param {{hide?: boolean}} [options] - options to hide this step
	 * @returns {ExpressionWorking}
	 */
	toggleMixedFractions(options) {
		const exp = this.expression.clone();
		exp.mixedFractions = !exp.mixedFractions;
		this.expression = exp;
		return addStep(this, options);
	}

	/**
	 * rearrange
	 * @param {number[]} order - order of the variables. e.g. [2, 0, 1] for c, a, b
	 * @param {{hide?: boolean}} [options] - options to hide this step
	 * @returns {ExpressionWorking}
	 */
	rearrange(order, options) {
		this.expression = this.expression.clone().rearrange(order);
		return addStep(this, options);
	}

	/**
	 * @param {string} exp
	 * @return {this}
	 */
	addCustomStep(exp) {
		this.expressions.push(exp);
		return this;
	}

	/**
	 * @param {{hide?: boolean, working?: boolean}} [options]
	 */
	combineFraction(options) {
		if (!options?.working) {
			this.expression = this.expression.clone().combine_fraction();
			return addStep(this, options);
		}
		this.expression = this.expression.clone()._common_denominator();
		addStep(this, options);
		this.expression = this.expression.clone()._combine_fraction({ verbatim: true });
		addStep(this, options);
		this.expression = this.expression.clone().expand({ numeratorOnly: true, verbatim: true });
		addStep(this, options);
		this.expression = this.expression.clone().simplify();
		addStep(this, options);
		this.expression = this.expression.clone()._remove_common_factors();
		return addStep(this, options);
	}

	/**
	 * @return {string}
	 */
	toString() {
		let str = '';
		for (const [i, exp] of this.expressions.entries()) {
			if (this.lineBreakMode === 'single') {
				str += (i === 0 ? '' : ' = ') + exp.toString();
			} else if (this.lineBreakMode === 'multi') {
				if (this.startOnFirstLine) {
					str += i === 0 ? exp.toString() : i === 1 ? ` = ${exp}` : `\n\t\\\\ = ${exp}`;
				} else {
					str += i === 0 ? exp.toString() : `\n\t\\\\ = ${exp}`;
				}
			} else if (this.lineBreakMode === 'aligned') {
				if (this.startOnFirstLine) {
					str += i === 0 ? exp.toString() : i === 1 ? ` &= ${exp}` : `\n\t\\\\ &= ${exp}`;
				} else {
					str += i === 0 ? `& ${exp}` : `\n\t\\\\ &= ${exp}`;
				}
			}
		}
		return str;
	}
}

/**
 * @param {ExpressionWorking} working
 * @param {ExpressionWorkingOptions} [options]
 * @returns {ExpressionWorking}
 */
function addStep(working, options) {
	const prev = working.expressions[working.expressions.length - 1];
	const exp = working.expression;
	if (!options?.hide && `${prev}` !== `${exp}`) {
		if (options?.string) {
			working.expressions.push(exp.toString());
		} else {
			working.expressions.push(exp);
		}
	}
	return working;
}
