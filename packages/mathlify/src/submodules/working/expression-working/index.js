import { Expression, Polynomial, Sum, Product } from '../../../core/index.js';

/** @typedef {'aligned'|'single'|'multi'} LineBreakMode */
/** @typedef {{hide?: boolean, string?: boolean}} WorkingOptions */

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
	 * Only applicable for aligned lineBreakMode
	 * If true: x &= y \\ &= z ...
	 * else: & x \\ &= y \\ &= z ...
	 * */
	startOnFirstLine;

	/**
	 * Creates an ExpressionWorking
	 * @param {Expression} expression - the initial expression
	 * @param {{lineBreakMode?: LineBreakMode, startOnFirstLine?: boolean}} [options] - lineBreakMode is either 'aligned' (default), 'single' or 'multi'
	 */
	constructor(expression, options) {
		this.expressions = [expression];
		this.expression = expression;
		this.lineBreakMode = options?.lineBreakMode || 'aligned';
		this.startOnFirstLine = options?.startOnFirstLine || false;
	}

	/** @typedef {import('../../../macros/index.js').QuotientShorthand} FractionShorthand */
	/**
	 * @param {Object.<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
	 * @param {WorkingOptions & {verbatim?: boolean}} [options] - default to automatic simplification
	 * @returns {ExpressionWorking}
	 */
	subIn(scope, options) {
		this.expression = this.expression.subIn(scope, options);
		return addStep(this, options);
	}

	/** @typedef {import('../../../core/expression/index.js').SimplifyOptions} SimplifyOptions */

	/**
	 * @param {SimplifyOptions & WorkingOptions} [options] - {brackets?, product?, sum?, quotient?, numeral?, exponent?, hide?}
	 * @returns {ExpressionWorking}
	 * */
	simplify(options) {
		this.expression = this.expression.clone().simplify(options);
		return addStep(this, options);
	}

	/** @typedef {import('../../../core/expression/index.js').ExpansionOptions} ExpansionOptions */
	/**
	 * @param {WorkingOptions & ExpansionOptions} [options] - default to automatic simplification
	 * @returns {ExpressionWorking}
	 * */
	expand(options) {
		this.expression = this.expression.clone().expand(options);
		return addStep(this, options);
	}

	factorize = {
		/**
		 * factorizes by taking out common factor
		 * @param {WorkingOptions} [options]
		 * @returns {ExpressionWorking}
		 * */
		commonFactor: (options) => {
			// take out common factor without further simplification
			const start = this.expression;
			this.expression = start.clone().factorize.commonFactor({ verbatim: true });
			addStep(this, options);
			// expand inner sums
			this.expression = this.expression.clone();
			if (this.expression.node.type !== 'product') return this;
			const factors = this.expression._getProductTerms()[1];
			const innerSum = factors.filter((x) => x.node.type === 'sum')[0];
			if (innerSum) {
				innerSum._expand_({ verbatim: true });
				addStep(this, { string: true, ...options });
				innerSum._expand_();
				addStep(this, options);
			}
			// simplify inner sums
			// note we use a workaround by just calling the factorize function without simplification instead of trying to target said inner sum. this should be tested to prevent regression
			this.expression = start.clone().factorize.commonFactor();
			return addStep(this, options);
		},
		/**
		 * @param {WorkingOptions} [options]
		 * @returns {ExpressionWorking}
		 * */
		quadratic: (options) => {
			const quadratic = this.expression;
			if (!(quadratic instanceof Polynomial)) return this;
			const { multiple } = quadratic.factorize.quadratic();
			if (!multiple.is.one()) {
				const preQuadraticFactorization = quadratic.factorize.commonFactor({ forcePositiveLeadingCoefficient: true });
				preQuadraticFactorization.remainingFactor.ascending = false;
				this.expression = preQuadraticFactorization;
				addStep(this, options);
			}
			this.expression = quadratic.clone().factorize.quadratic();
			return addStep(this, options);
		},
		/**
		 * @param {number[][]} groupedIndices - indices of the groups (eg [[0, 1], [2, 3]] means group first two terms and last two terms)
		 * @param {WorkingOptions & {negative?: (number|{group: number, rearrange: number[]})[]}} [options] {negative: [1, {group: 3, rearrange: [1,0]}]} means the 2nd and 4th groups will be factorized with an extra negative. The 4th group will also have a reversed order
		 */
		byGrouping: (groupedIndices, options) => {
			// rearrange expression to match the grouped indices
			this.expression = this.expression.clone()._rearrange_(groupedIndices.flat());
			addStep(this, options);
			// get the groups
			const terms = this.expression._getSumTerms().map((x) => x.clone());
			const groupSizes = groupedIndices.map((group) => group.length);
			if (groupSizes.reduce((prev, curr) => prev + curr) !== terms.length)
				throw new Error('Total indices provided does not match number of terms.');
			const groups = [];
			for (const groupSize of groupSizes) {
				groups.push(terms.splice(0, groupSize));
			}
			// factorize each group
			const sums = groups.map((group) => new Expression(new Sum(...group)));
			const factorizedGroups = sums.map((sum) => sum.factorize.commonFactor());
			this.expression = new Expression(new Sum(...factorizedGroups));
			addStep(this, options);
			// extract negative
			if (options?.negative) {
				for (const groupObject of options.negative) {
					const group = typeof groupObject === 'number' ? groupObject : groupObject.group;
					let factorizedGroup = factorizedGroups[group];
					if (factorizedGroup.node instanceof Product) {
						const coeff = factorizedGroup.node.coeff;
						const factors = factorizedGroup.node._factorsExp;
						const modifiedFactors = factors.map((x, i) => (i === factors.length - 1 ? x.negative() : x));
						if (typeof groupObject === 'object') {
							const lastFactor = modifiedFactors.pop();
							lastFactor?._rearrange_(groupObject.rearrange);
							if (lastFactor !== undefined) modifiedFactors.push(lastFactor);
						}
						factorizedGroups[group] = new Expression(new Product(coeff.negative(), ...modifiedFactors));
					}
				}
				this.expression = new Expression(new Sum(...factorizedGroups));
				addStep(this, options);
			}
			// factorize by grouping
			this.expression = this.expression.factorize.commonFactor();
			//// show step before taking out common factor
			//if (options?.commonFactor) {
			//	const [coeff, factors] = this.expression.getProductTerms();
			//	const factorsClone = factors.map((x) => x.clone());
			//	factorsClone[factorsClone.length - 1] = new Expression(
			//		new Product(coeff, factorsClone[factorsClone.length - 1]),
			//	).expand();
			//	const product = new Expression(new Product(...factorsClone));
			//	this.expressions.push(product);
			//}
			return addStep(this, options);
		},
	};

	/**
	 * toggle Mixed fractions
	 * @param {WorkingOptions} [options] - options to hide this step
	 * @returns {ExpressionWorking}
	 */
	toggleMixedFractions(options) {
		const exp = this.expression.clone();
		exp._mixedFractions = !exp._mixedFractions;
		this.expression = exp;
		return addStep(this, options);
	}

	/**
	 * rearrange
	 * @param {number[]} order - order of the variables. e.g. [2, 0, 1] for c, a, b
	 * @param {WorkingOptions} [options] - options to hide this step
	 * @returns {ExpressionWorking}
	 */
	rearrange(order, options) {
		this.expression = this.expression.clone()._rearrange_(order);
		return addStep(this, options);
	}

	/**
	 * @param {string|Expression} exp
	 * @return {ExpressionWorking}
	 */
	addCustomStep(exp) {
		if (typeof exp === 'string') {
			this.expressions.push(exp);
			return this;
		}
		this.expression = exp;
		return addStep(this);
	}

	/**
	 * @param {WorkingOptions & {steps?: boolean}} [options]
	 */
	combineFraction(options) {
		if (!options?.steps) {
			this.expression = this.expression.clone().combineFraction();
			return addStep(this, options);
		}
		this.expression = this.expression.clone()._common_denominator_();
		addStep(this, options);
		this.expression = this.expression.clone()._combine_fraction_({ verbatim: true });
		addStep(this, options);
		this.expression = this.expression.clone().expand({ numeratorOnly: true, verbatim: true });
		addStep(this, options);
		this.expression = this.expression.clone().simplify({ sum: true });
		addStep(this, options);
		this.expression = this.expression.clone()._remove_common_factors_();
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
				str += i === 0 ? exp.toString() : `\n\t\\\\ = ${exp}`;
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
 * @param {WorkingOptions} [options]
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
