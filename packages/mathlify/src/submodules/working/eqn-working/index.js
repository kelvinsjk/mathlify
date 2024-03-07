import { to_Expression } from '../../../core/expression/index.js';
import { Polynomial } from '../../../core/index.js';
import { Equation } from '../../../equation/index.js';

// TODO: refactor target left/right

/** @typedef {import('../../../core/index.js').Expression} Expression */
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
		this.eqn = this.eqn.subIn(scope);
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
	 * @param {Equation|Expression|string|number} lhs
	 * @param {Expression|string|number} [rhs] - defaults to original rhs
	 * @return {EquationWorking}
	 */
	addCustomStep(lhs, rhs) {
		this.eqn =
			lhs instanceof Equation ? lhs : new Equation(to_Expression(lhs), rhs ? to_Expression(rhs) : this.eqn.rhs);
		return addStep(this);
	}

	// TODO: combine Fractions
	// /**
	//  * @param {{hide?: boolean, steps?: boolean}} [options]
	//  */
	// combineFraction(options) {
	// 	if (!options?.steps) {
	// 		this.expression = this.expression.clone().combineFraction();
	// 		return addStep(this, options);
	// 	}
	// 	this.expression = this.expression.clone()._common_denominator_();
	// 	addStep(this, options);
	// 	this.expression = this.expression.clone()._combine_fraction_({ verbatim: true });
	// 	addStep(this, options);
	// 	this.expression = this.expression.clone().expand({ numeratorOnly: true, verbatim: true });
	// 	addStep(this, options);
	// 	this.expression = this.expression.clone().simplify({ sum: true });
	// 	addStep(this, options);
	// 	this.expression = this.expression.clone()._remove_common_factors_();
	// 	return addStep(this, options);
	// }

	/**
	 * @return {string}
	 */
	toString() {
		const eq = this.aligned ? ' &= ' : ' = ';
		return this.eqns.reduce((acc, curr) => {
			return acc + `\n\t\\\\ ${curr[0]}${eq}${curr[1]}`;
		}, '');
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
	if (!options?.hide && `${prevLeft}` !== `${lhs}` && `${prevRight}` !== `${rhs}`) {
		if (options?.string) {
			working.eqns.push([lhs.toString(), rhs.toString()]);
		} else {
			working.eqns.push([lhs, rhs]);
		}
	}
	return working;
}
