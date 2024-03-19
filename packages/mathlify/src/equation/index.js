import { to_Expression, Expression, Product, Quotient } from '../core/expression/index.js';
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
	/** @type {'equation'} */
	type = 'equation';

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
	 * @param {{verbatim?: boolean}} [options] - {{verbatim: true}} to not simplify after substitution
	 * @returns {Equation}
	 */
	subIn(scope, options) {
		return new Equation(this.lhs.subIn(scope, options), this.rhs.subIn(scope, options));
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
		let lhs = this.lhs.clone();
		// negative workaround: hoist to numerator
		if (lhs.node.type === 'product' && lhs.node.factors.length === 1 && lhs.node.factors[0].type === 'quotient') {
			lhs = new Expression(
				new Quotient(
					new Expression(new Product(lhs.node.coeff, lhs.node.factors[0].num)).expand(),
					lhs.node.factors[0].den,
				),
			);
		}
		let rhs = this.rhs.clone();
		if (rhs.node.type === 'product' && rhs.node.factors.length === 1 && rhs.node.factors[0].type === 'quotient') {
			rhs = new Expression(
				new Quotient(
					new Expression(new Product(rhs.node.coeff, rhs.node.factors[0].num)).expand(),
					rhs.node.factors[0].den,
				),
			);
		}
		const leftNum =
			lhs.node.type === 'quotient'
				? lhs._getQuotientTerms()[0].clone()
				: lhs.node.type === 'numeral'
					? new Expression(lhs._getNumeral().number.num)
					: lhs;
		const leftDen =
			lhs.node.type === 'quotient'
				? lhs._getQuotientTerms()[1].clone()
				: lhs.node.type === 'numeral'
					? lhs._getNumeral().number.den
					: 1;
		const rightNum =
			rhs.node.type === 'quotient'
				? rhs._getQuotientTerms()[0].clone()
				: rhs.node.type === 'numeral'
					? new Expression(rhs._getNumeral().number.num)
					: rhs;
		const rightDen =
			rhs.node.type === 'quotient'
				? rhs._getQuotientTerms()[1]
				: rhs.node.type === 'numeral'
					? rhs._getNumeral().number.den
					: 1;
		if (
			(leftDen === 1 || (typeof leftDen !== 'number' && leftDen.node.type === 'numeral' && leftDen.node.is.one())) &&
			(rightDen === 1 || (typeof rightDen !== 'number' && rightDen.node.type === 'numeral' && rightDen.node.is.one()))
		)
			return this;
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
	 *
	 * @param {number|string|Expression} exp
	 * @returns {Equation}
	 */
	plus(exp) {
		return new Equation(this.lhs.plus(exp), this.rhs.plus(exp));
	}

	/**
	 *
	 * @param {number|string|Expression} exp
	 * @returns {Equation}
	 */
	times(exp) {
		return new Equation(this.lhs.times(exp), this.rhs.times(exp));
	}

	/**
	 * @returns {Equation}
	 */
	swapSides() {
		return new Equation(this.rhs.clone(), this.lhs.clone());
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
