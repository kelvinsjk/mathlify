import { to_Expression } from '../core/expression/index.js';
import { Polynomial } from '../core/index.js';

/** @typedef {import('../core/index.js').Expression} Expression */

// TODO: refactor target left/right

/**
 * EqnWorking Class to handle the step-by-step working in manipulating an equation
 */
export class Equation {
	/** @type {Expression} the expression on the left*/
	lhs;
	/** @type {Expression} the expression on the right*/
	rhs;

	/**
	 * Creates an Equation
	 * @param {Expression|number|string} lhs - the initial expression on the left
	 * @param {Expression|number|string} [rhs=0] - the initial expression on the right
	 * @param {{aligned?: boolean}} [options] - aligned: true adds the & before =. Defaults to false
	 */
	constructor(lhs, rhs = 0, options) {
		this.lhs = to_Expression(lhs);
		this.rhs = to_Expression(rhs);
		this.aligned = options?.aligned ?? false;
	}

	/** @typedef {import('../macros/index.js').QuotientShorthand} FractionShorthand */
	/**
	 * @param {Object.<string, Expression|string|number|FractionShorthand>} scope - variables to be replaced in the expression
	 * @returns {Equation}
	 */
	subIn(scope) {
		return new Equation(this.lhs.subIn(scope), this.rhs.subIn(scope));
	}

	/** @typedef {import('../core/expression/index.js').SimplifyOptions} SimplifyOptions */
	/**
	 * simplifies the equation: warning: mutates current equation
	 * @param {SimplifyOptions} [options] - {brackets?, product?, sum?, quotient?, numeral?, exponent?, hide?}
	 * @returns {this}
	 * */
	simplify(options) {
		this.lhs.simplify(options);
		this.rhs.simplify(options);
		return this;
	}

	/** @typedef {import('../core/expression/index.js').ExpansionOptions} ExpansionOptions */
	/**
	 * @param {ExpansionOptions} [options] - default to automatic simplification
	 * @returns {Equation}
	 * */
	expand(options) {
		return new Equation(this.lhs.clone().expand(options), this.rhs.clone().expand(options));
	}

	factorize = {
		/**
		 * factorizes by taking out common factor
		 * @param {{targetRight?: boolean, verbatim?: boolean}} [options] - targets lhs by default
		 * @returns {Equation}
		 * */
		commonFactor: (options) => {
			if (options?.targetRight) {
				return new Equation(this.lhs.clone(), this.rhs.clone().factorize.commonFactor(options));
			} else {
				return new Equation(this.lhs.clone().factorize.commonFactor(options), this.rhs.clone());
			}
		},
		/**
		 * @param {{targetRight?: boolean}} [options] - targets lhs by default
		 * @returns {Equation}
		 * */
		quadratic: (options) => {
			// TODO: handle conversion of Expression to Polynomial. throw if not?
			const quadratic = options?.targetRight ? this.rhs : this.lhs;
			if (!(quadratic instanceof Polynomial)) return this;
			if (options?.targetRight) {
				return new Equation(this.lhs.clone(), quadratic.factorize.quadratic());
			} else {
				return new Equation(quadratic.factorize.quadratic(), this.rhs.clone());
			}
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
	 * @param {{targetRight?: boolean}} [options] - options to hide this step, or to target rhs (defaults to lhf)
	 * @returns {Equation}
	 */
	rearrange(order, options) {
		if (options?.targetRight) {
			return new Equation(this.lhs.clone(), this.rhs.clone()._rearrange_(order));
		} else {
			return new Equation(this.lhs.clone()._rearrange_(order), this.rhs.clone());
		}
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
		const eq = this.aligned ? `&=` : `=`;
		return `${this.lhs} ${eq} ${this.rhs}`;
	}

	/** @return {Equation} */
	clone() {
		return new Equation(this.lhs.clone(), this.rhs.clone(), { aligned: this.aligned });
	}
}
