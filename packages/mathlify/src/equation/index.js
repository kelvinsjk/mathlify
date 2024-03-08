import { to_Expression, Expression, Product } from '../core/expression/index.js';
import { Polynomial } from '../core/index.js';

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

	/**
	 * @returns {Equation} - the equation after combining fractions on both sides
	 */
	combineFraction() {
		return new Equation(this.lhs.clone().combineFraction(), this.rhs.clone().combineFraction());
	}

	/**
	 * @returns {Equation}
	 */
	_common_denominator() {
		return new Equation(this.lhs.clone()._common_denominator_(), this.rhs.clone()._common_denominator_());
	}

	/**
	 * @param {{verbatim?: boolean}} [options] - {{verbatim: true}} to not simplify after combination
	 * @returns {Equation}
	 */
	_combine_fraction(options) {
		return new Equation(this.lhs.clone()._combine_fraction_(options), this.rhs.clone()._combine_fraction_(options));
	}

	/**
	 * @returns {Equation}
	 */
	_remove_common_factors() {
		return new Equation(this.lhs.clone()._remove_common_factors_(), this.rhs.clone()._remove_common_factors_());
	}

	/**
	 * @param {{verbatim?: boolean}} [options] - {{verbatim: true}} to not simplify after combination
	 * @returns {Equation}
	 */
	crossMultiply(options) {
		const leftNum =
			this.lhs.node.type === 'quotient'
				? this.lhs._getQuotientTerms()[0].clone()
				: this.lhs.node.type === 'numeral'
					? new Expression(this.lhs._getNumeral().number.num)
					: this.lhs.clone();
		const leftDen =
			this.lhs.node.type === 'quotient'
				? this.lhs._getQuotientTerms()[1].clone()
				: this.lhs.node.type === 'numeral'
					? this.lhs._getNumeral().number.den
					: 1;
		const rightNum =
			this.rhs.node.type === 'quotient'
				? this.rhs._getQuotientTerms()[0].clone()
				: this.rhs.node.type === 'numeral'
					? new Expression(this.rhs._getNumeral().number.num)
					: this.rhs.clone();
		const rightDen =
			this.rhs.node.type === 'quotient'
				? this.rhs._getQuotientTerms()[1]
				: this.rhs.node.type === 'numeral'
					? this.rhs._getNumeral().number.den
					: 1;
		/** @type {[number|Expression, Expression]|Expression[]} */
		const lhsArgs =
			typeof rightDen === 'number' || rightDen.node.type === 'numeral' ? [rightDen, leftNum] : [leftNum, rightDen];
		/** @type {[number|Expression, Expression]|Expression[]} */
		const rhsArgs =
			typeof leftDen === 'number' || leftDen.node.type === 'numeral' ? [leftDen, rightNum] : [rightNum, leftDen];
		const eqn = new Equation(new Expression(new Product(...lhsArgs)), new Expression(new Product(...rhsArgs)));
		if (!options?.verbatim) eqn.simplify();
		return eqn;
	}

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
