import { Product, Quotient, to_Expression } from '../../../core/expression/index.js';
import { Polynomial, Expression, Sum } from '../../../core/index.js';
import { Equation } from '../../../equation/index.js';

// TODO: refactor target left/right
// TODO: drop repeated lhs

/** @typedef {{hide?: boolean, string?: boolean}} WorkingOptions */

/**
 * EqnWorking Class to handle the step-by-step working in manipulating an equation
 */
export class EquationWorking {
	/** @type {Equation} the current equation */
	eqn;
	/** @type {[(Expression|string), (Expression|string)][]} array of the lhs/rhs expressions on each step */
	eqns;
	/** @type {boolean}	 */
	aligned;

	/**
	 * Creates an ExpressionWorking
	 * @param {Equation|Expression|number|string} lhs - the initial expression on the left
	 * @param {Expression|number|string} [rhs=0] - the initial expression on the right. (ignored if Equation supplied for previous argument)
	 * @param {{aligned?: boolean}} [options] - aligned: true adds the & before =. Defaults to false
	 */
	constructor(lhs, rhs = 0, options) {
		this.eqn = lhs instanceof Equation ? lhs : new Equation(to_Expression(lhs), to_Expression(rhs));
		this.eqns = [[this.eqn.lhs, this.eqn.rhs]];
		this.aligned = options?.aligned ?? false;
	}

	/** @typedef {import('../../../macros/index.js').QuotientShorthand} FractionShorthand */
	/**
	 * @param {Object.<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
	 * @param {WorkingOptions & {verbatim?: boolean}} [options] - default to automatic simplification
	 * @returns {EquationWorking}
	 */
	subIn(scope, options) {
		// TODO: if verbatim, simplify after subbing in?
		this.eqn = this.eqn.subIn(scope, options);
		addStep(this, options);
		this.eqn = this.eqn.clone().simplify();
		return addStep(this, options);
	}

	/** @typedef {import('../../../core/expression/index.js').SimplifyOptions} SimplifyOptions */
	/**
	 * @param {WorkingOptions & SimplifyOptions} [options] - {brackets?, product?, sum?, quotient?, numeral?, exponent?, hide?}
	 * @returns {EquationWorking}
	 * */
	simplify(options) {
		this.eqn = this.eqn.clone().simplify(options);
		return addStep(this, options);
	}

	/** @typedef {import('../../../core/expression/index.js').ExpansionOptions} ExpansionOptions */
	/**
	 * @param {WorkingOptions & ExpansionOptions} [options] - default to automatic simplification
	 * @returns {EquationWorking}
	 * */
	expand(options) {
		// TODO: simplify afterwards?
		this.eqn = this.eqn.clone().expand(options);
		return addStep(this, options);
	}

	factorize = {
		/**
		 * factorizes by taking out common factor
		 * @param {WorkingOptions & {targetRight?: boolean, verbatim?: boolean}} [options] - targets lhs by default
		 * @returns {EquationWorking}
		 * */
		commonFactor: (options) => {
			this.eqn = this.eqn.clone().factorize.commonFactor(options);
			addStep(this, options);
			if (!options?.verbatim) return this;
			// show simplification steps
			// TODO: for simplification steps on the right, and if it is aligned, lhs string should just be ''
			const expToSimplify = options?.targetRight ? this.eqn.rhs : this.eqn.lhs;
			if (expToSimplify.node.type !== 'product') return this;
			const factors = expToSimplify._getProductTerms()[1];
			const innerSum = factors.filter((x) => x.node.type === 'sum')[0];
			if (innerSum) {
				innerSum._expand_({ verbatim: true });
				addStep(this, { string: true, ...options });
				innerSum._expand_();
				addStep(this, options);
			}
			// simplify inner sums
			// note we use a workaround by just calling the factorize function without simplification instead of trying to target said inner sum. this should be tested to prevent regression
			this.eqn = this.eqn.clone().factorize.commonFactor();
			return addStep(this, options);
		},
		/**
		 * @param {WorkingOptions & {targetRight?: boolean}} [options] - targets lhs by default
		 * @returns {EquationWorking}
		 * */
		quadratic: (options) => {
			// TODO: use underlying Equation method
			const quadratic = options?.targetRight ? this.eqn.rhs : this.eqn.lhs;
			if (!(quadratic instanceof Polynomial)) return this;
			const { multiple } = quadratic.factorize.quadratic();
			if (!multiple.is.one()) {
				const preQuadraticFactorization = quadratic.factorize.commonFactor({ forcePositiveLeadingCoefficient: true });
				preQuadraticFactorization.remainingFactor.ascending = false;
				if (options?.targetRight) {
					this.eqn = new Equation(this.eqn.lhs.clone(), preQuadraticFactorization);
				} else {
					this.eqn = new Equation(preQuadraticFactorization, this.eqn.rhs.clone());
				}
				addStep(this, options);
			}
			if (options?.targetRight) {
				this.eqn.rhs = quadratic.clone().factorize.quadratic();
			} else {
				this.eqn.lhs = quadratic.clone().factorize.quadratic();
			}
			return addStep(this, options);
		},
	};

	// /**
	//  * toggle Mixed fractions
	//  * @param {{hide?: boolean}} [options] - options to hide this step
	//  * @returns {ExpressionWorking}
	//  */
	// toggleMixedFractions(options) {
	// 	const exp = this.expression.clone();
	// 	exp._mixedFractions = !exp._mixedFractions;
	// 	this.expression = exp;
	// 	return addStep(this, options);
	// }

	/**
	 * rearrange
	 * @param {number[]} order - order of the variables. e.g. [2, 0, 1] for c, a, b
	 * @param {WorkingOptions & {targetRight?: boolean}} [options] - options to hide this step, or to target rhs (defaults to lhf)
	 * @returns {EquationWorking}
	 */
	rearrange(order, options) {
		this.eqn = this.eqn.rearrange(order, options);
		return addStep(this, options);
	}

	/**
	 * isolate variable
	 * @param {string} [variable='x'] - defaults to 'x'
	 * @param {WorkingOptions & { steps?: boolean; targetRight?: boolean}} [options] - options to hide this step, or to target rhs (defaults to lhf)
	 * @returns {EquationWorking}
	 */
	isolate(variable = 'x', options) {
		// TODO: handle target. For now always move lhs terms to rhs
		// TODO: move terms from rhs to lhs
		// TODO handle other types other than sums
		/** @type {Expression[]} */
		const lhsTermsToMove = [];
		/** @type {Expression[]} */
		const lhsTermsToKeep = [];
		/** @type {Expression[]} */
		const rhsTermsToMove = [];
		/** @type {Expression[]} */
		const rhsTermsToKeep = [];
		if (this.eqn.lhs.node.type === 'sum') {
			for (const term of this.eqn.lhs._getSumTerms()) {
				if (term.contains(variable)) {
					lhsTermsToKeep.push(term.clone());
				} else {
					lhsTermsToMove.push(term.negative());
				}
			}
		} else {
			if (this.eqn.lhs.contains(variable)) {
				lhsTermsToKeep.push(this.eqn.lhs.clone());
			} else {
				lhsTermsToMove.push(this.eqn.lhs.negative());
			}
		}
		if (this.eqn.rhs.node.type === 'sum') {
			for (const term of this.eqn.rhs._getSumTerms()) {
				if (term.contains(variable)) {
					rhsTermsToMove.push(term.negative());
				} else {
					rhsTermsToKeep.push(term.clone());
				}
			}
		} else {
			if (this.eqn.rhs.contains(variable)) {
				rhsTermsToMove.push(this.eqn.rhs.negative());
			} else {
				rhsTermsToKeep.push(this.eqn.rhs.clone());
			}
		}
		const lhs = new Expression(new Sum(...lhsTermsToKeep, ...rhsTermsToMove));
		const rhs = new Expression(new Sum(...rhsTermsToKeep, ...lhsTermsToMove));
		if (options?.steps) {
			this.eqn = new Equation(lhs.clone(), rhs.clone());
			addStep(this, options);
		}
		this.eqn = new Equation(lhs.simplify(), rhs.simplify());
		return addStep(this, options);
	}

	/**
	 * make subject from product
	 * Experimental API
	 * @param {string} [variable='x'] - defaults to 'x'
	 * @param {WorkingOptions & { steps?: 'fraction'|'divide'|'postMultiply'|'preMultiply'; targetRight?: boolean}} [options] - options to hide this step, or to target rhs (defaults to lhf)
	 * @returns {EquationWorking}
	 */
	_makeSubjectFromProduct(variable = 'x', options) {
		// TODO: handle target. For now always move lhs terms to rhs
		// TODO: move terms from rhs to lhs
		// TODO handle other types other than products
		if (this.eqn.lhs.node.type !== 'product') return this;
		/** @type {Expression[]} */
		const factorsToMove = [];
		const [coeff, factors] = this.eqn.lhs._getProductTerms();
		for (const factor of factors) {
			if (!factor.contains(variable)) {
				factorsToMove.push(factor);
			}
		}
		const lhs = new Expression(variable);
		const den = new Expression(new Product(coeff, ...factorsToMove)).simplify();
		const rhs = new Expression(new Quotient(this.eqn.rhs, den));
		if (options?.steps && !(den.node.type === 'numeral' && den._getNumeral().is.one())) {
			// given kx = a, we can either present
			// x = a/k as a fraction, or
			// x = a \div k, or
			// x = a \times kinv or
			// x = kinv (a)
			if (options.steps === 'fraction') {
				this.eqn = new Equation(lhs, rhs.clone());
				addStep(this, options);
			} else if (options.steps === 'divide') {
				this.addCustomStep(variable, `${this.eqn.rhs} \\div ${den}`);
			} else if (options.steps === 'postMultiply') {
				// only works for numeral at this moment
				const reciprocal = den._getNumeral().reciprocal();
				this.addCustomStep(variable, `${this.eqn.rhs} \\times ${reciprocal}`);
			} else {
				// only works for numeral at this moment
				const reciprocal = den._getNumeral().reciprocal();
				const rhs = new Expression(new Product(reciprocal, this.eqn.rhs));
				this.eqn = new Equation(lhs, rhs);
				addStep(this, options);
			}
		}
		this.eqn = new Equation(lhs, rhs.simplify());
		return addStep(this, options);
	}

	/**
	 * @param {Equation|Expression|string|number} lhs
	 * @param {Expression|string|number} [rhs] - defaults to original rhs
	 * @return {EquationWorking}
	 */
	addCustomStep(lhs, rhs) {
		if (typeof lhs === 'string' || typeof lhs === 'number') {
			this.eqns.push([lhs.toString(), (rhs ?? this.eqn.rhs).toString()]);
			return this;
		}
		this.eqn =
			lhs instanceof Equation ? lhs : new Equation(to_Expression(lhs), rhs ? to_Expression(rhs) : this.eqn.rhs);
		return addStep(this);
	}

	/**
	 * @param {WorkingOptions & {steps?: boolean}} [options]
	 * @returns {EquationWorking}
	 */
	combineFraction(options) {
		if (!options?.steps) {
			this.eqn = this.eqn.combineFraction();
			return addStep(this, options);
		}
		this.eqn = this.eqn._common_denominator();
		addStep(this, options);
		this.eqn = this.eqn._combine_fraction({ verbatim: true });
		addStep(this, options);
		this.eqn = this.eqn.expand({ numeratorOnly: true, verbatim: true });
		addStep(this, options);
		this.eqn = this.eqn.clone().simplify({ sum: true });
		addStep(this, options);
		this.eqn = this.eqn._remove_common_factors();
		return addStep(this, options);
	}

	/**
	 * @param {WorkingOptions & {steps: boolean}} [options] - if {steps: true}, show steps of simplifying and expanding
	 * @returns {EquationWorking}
	 */
	crossMultiply(options) {
		//TODO: handle expansion afterwards?
		this.eqn = this.eqn.crossMultiply({ verbatim: options?.steps });
		addStep(this, options);
		if (!options?.steps) return this;
		this.eqn = this.eqn.clone().simplify();
		addStep(this, options);
		this.eqn = this.eqn.expand();
		return addStep(this, options);
	}

	/**
	 *
	 * @param {number|number[]} indices
	 * @param {WorkingOptions & {fromRight?: boolean}} [options] - default from lhs
	 */
	moveTerms(indices, options) {
		// TODO: show steps to get final result
		const exp = options?.fromRight ? this.eqn.rhs : this.eqn.lhs;
		if (exp.node.type !== 'sum') {
			throw new Error('Can only move terms in a sum');
		}
		const indicesArray = Array.isArray(indices) ? indices : [indices];
		const terms = exp
			._getSumTerms()
			.filter((_, i) => indicesArray.includes(i))
			.map((x) => x.negative());
		this.eqn = this.eqn.plus(new Expression(new Sum(...terms)));
		return addStep(this, options);
	}

	/**
	 *
	 * @returns {EquationWorking}
	 */
	swapSides() {
		this.eqn = this.eqn.swapSides();
		return addStep(this);
	}

	/**
	 * @param {number|string|Expression} exp
	 * @returns {EquationWorking}
	 */
	times(exp) {
		this.eqn = this.eqn.times(exp);
		return addStep(this);
	}

	/**
	 * @return {string}
	 */
	toString() {
		const eq = this.aligned ? ' &= ' : ' = ';
		let str = `${this.eqns[0][0]}${eq}${this.eqns[0][1]}`;
		let prevLHS = this.eqns[0][0].toString();
		for (const [lhs, rhs] of this.eqns.slice(1)) {
			const lhsString = this.aligned && lhs.toString() === prevLHS ? '' : lhs.toString();
			str += `\n\t\\\\ ${lhsString}${eq}${rhs}`;
			prevLHS = lhs.toString();
		}
		return str;
	}
}

/**
 * @param {EquationWorking} working
 * @param {WorkingOptions & {target?: 'l'|'r'|'b'}} [options] - options to target l/r/both(default)
 * @returns {EquationWorking}
 */
function addStep(working, options) {
	const [prevLeft, prevRight] = working.eqns[working.eqns.length - 1];
	const lhs = working.eqn.lhs;
	const rhs = working.eqn.rhs;
	if (!options?.hide && (`${prevLeft}` !== `${lhs}` || `${prevRight}` !== `${rhs}`)) {
		if (options?.string) {
			working.eqns.push([lhs.toString(), rhs.toString()]);
		} else {
			working.eqns.push([lhs, rhs]);
		}
	}
	return working;
}
