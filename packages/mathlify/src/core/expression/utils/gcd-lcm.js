//import { Expression, Numeral, Quotient, Product, Exponent } from '../index.js';
import { Numeral } from '../numeral/index.js';
import { Product } from '../product/index.js';
import { Quotient } from '../quotient/index.js';
import { Exponent } from '../exponent/index.js';

/** @typedef {import('../index.js').Expression} Expression */
/** @typedef {import('../index.js').ExpressionType} ExpressionType */

/**
 * get denominator lcm of expressions
 * @param {...Expression} expressions
 * @returns {Expression}
 */
export function denominator_lcm(...expressions) {
	if (expressions.length === 0) {
		throw new Error('Cannot find denominator lcm of empty array');
	}
	if (expressions.length === 1) {
		let exp = expressions[0].node;
		const dummy = expressions[0];
		if (exp instanceof Numeral) {
			return dummy._new_exp(new Numeral(exp.number.den).abs());
		} else if (exp instanceof Quotient) {
			return dummy._new_exp(exp.den.node.clone());
		} else if (exp instanceof Product && exp.coeff.is.negative() && exp.factors.length === 1) {
			return denominator_lcm(exp._factorsExp[0]);
		} else {
			return dummy._new_exp(new Numeral(1));
		}
	}
	if (expressions.length === 2) {
		const [a, b] = expressions;
		const aDen = denominator_lcm(a);
		const bDen = denominator_lcm(b);
		return expression_lcm_two(aDen, bDen);
	}
	// more than 2 expressions
	const dens = expressions.map((exp) => denominator_lcm(exp));
	let multiple = expression_lcm_two(dens[0], dens[1]);
	dens.shift();
	dens.shift();
	for (const exp of dens) {
		multiple = expression_lcm_two(multiple, exp);
	}
	return multiple;
}

/**
 * get lcm of two expressions
 * @param {Expression} exp1
 * @param {Expression} exp2
 * @returns {Expression}
 */
export function expression_lcm_two(exp1, exp2) {
	const a = exp1.node;
	const b = exp2.node;
	if (a.type === 'product') {
		if (b.type === 'product') {
			// lexical string: {power, expression}
			/** @type {Object.<string,{power: Numeral, expression: Expression}>} */
			const termMap = {};
			/** @type {string[]} */
			const orderedKeys = [];
			// loop through a
			for (const factor of a.factors) {
				if (factor.type === 'exponent' && factor.power.type === 'numeral') {
					const key = factor.base.toLexicalString();
					orderedKeys.push(key);
					termMap[key] = { power: factor.power, expression: factor.baseExp.clone() };
				} else {
					const key = factor.toLexicalString();
					orderedKeys.push(key);
					termMap[key] = { power: new Numeral(1), expression: exp1._new_exp(factor.clone()) };
				}
			}
			// loop through b
			for (const factor of b.factors) {
				if (factor instanceof Exponent && factor.power instanceof Numeral) {
					const key = factor.base.toLexicalString();
					const val = termMap[key];
					if (val) {
						val.power = Numeral.max(factor.power, val.power);
					} else {
						termMap[key] = { power: factor.power, expression: factor.baseExp.clone() };
						orderedKeys.push(key);
					}
				} else {
					const key = factor.toLexicalString();
					const val = termMap[key];
					if (val) {
						val.power = Numeral.max(1, val.power);
					} else {
						termMap[key] = { power: new Numeral(1), expression: exp1._new_exp(factor.clone()) };
						orderedKeys.push(key);
					}
				}
			}
			/** @type {Expression[]} */
			const factors = [];
			for (const key of orderedKeys) {
				const val = termMap[key];
				if (val) {
					const { power, expression } = val;
					if (power.is.one()) {
						factors.push(expression);
					} else if (power.is.nonzero()) {
						factors.push(exp1._new_exp(new Exponent(expression, exp1._new_exp(power))));
					}
				}
			}
			return exp1._new_exp(new Product(exp1._new_exp(Numeral.lcm(a.coeff, b.coeff)), ...factors)).simplify();
		} else if (b instanceof Numeral) {
			return exp1._new_exp(new Product(exp1._new_exp(Numeral.lcm(a.coeff, b)), ...a._factorsExp)).simplify();
		} else {
			/** @type {ExpressionType[]} */
			const factors = [];
			/** @type {boolean} */
			let noCommonFactor = true;
			for (const f of a.factors) {
				if (
					f instanceof Exponent &&
					f.power instanceof Numeral &&
					b instanceof Exponent &&
					b.power instanceof Numeral &&
					f.base.toLexicalString() === b.base.toLexicalString()
				) {
					factors.push(new Exponent(exp1._new_exp(f.base), exp1._new_exp(Numeral.max(f.power, b.power))));
					noCommonFactor = false;
				} else if (
					f instanceof Exponent &&
					f.power instanceof Numeral &&
					f.base.toLexicalString() === b.toLexicalString()
				) {
					factors.push(new Exponent(exp1._new_exp(f.base), exp1._new_exp(Numeral.max(f.power, 1))));
					noCommonFactor = false;
				} else if (f.toLexicalString() === b.toLexicalString()) {
					factors.push(f);
					noCommonFactor = false;
				} else {
					factors.push(f);
				}
			}
			if (noCommonFactor) {
				factors.push(b);
			}
			return exp1._new_exp(new Product(a.coeff, ...factors.map((f) => exp1._new_exp(f)))).simplify();
		}
	} else if (b instanceof Product) {
		return expression_lcm_two(exp2, exp1);
	} else if (a instanceof Exponent && a.power instanceof Numeral) {
		if (b instanceof Exponent && b.power instanceof Numeral) {
			if (a.base.toLexicalString() === b.base.toLexicalString()) {
				return exp1._new_exp(new Exponent(a.baseExp.clone(), exp1._new_exp(Numeral.max(a.power, b.power))));
			}
			return exp1._new_exp(new Product(exp1.clone(), exp2.clone())).simplify();
		} else {
			if (a.base.toLexicalString() === b.toLexicalString()) {
				return a.power.valueOf() >= 1 ? exp1.clone() : exp2.clone();
			}
			return exp1._new_exp(new Product(exp1.clone(), exp2.clone())).simplify();
		}
	} else if (b instanceof Exponent && b.power instanceof Numeral) {
		return expression_lcm_two(exp2, exp1);
	} else if (a instanceof Numeral) {
		if (b instanceof Numeral) {
			return exp1._new_exp(Numeral.lcm(a, b));
		}
		return exp1._new_exp(new Product(a, exp2.clone())).simplify();
	} else if (b instanceof Numeral) {
		return expression_lcm_two(exp2, exp1);
	} else {
		if (exp1._to_lexical_string() === exp2._to_lexical_string()) {
			return exp1.clone();
		}
		return exp1._new_exp(new Product(exp1.clone(), exp2.clone())).simplify();
	}
}

/**
 * get gcd of two expressions
 * @param {Expression} exp1
 * @param {Expression} exp2
 * @returns {Expression}
 */
function expression_gcd_two(exp1, exp2) {
	const a = exp1.node;
	const b = exp2.node;
	// exponent with numeral power with exponent
	// exponent with numeral power with product
	// product with product
	// product with numeral
	if (a instanceof Exponent && a.power instanceof Numeral) {
		if (b instanceof Exponent && b.power instanceof Numeral) {
			if (a.base.toLexicalString() === b.base.toLexicalString()) {
				return exp1._new_exp(new Exponent(a.baseExp.clone(), exp1._new_exp(Numeral.min(a.power, b.power))));
			}
			return exp1._new_exp(new Numeral(1));
		} else if (b instanceof Product) {
			for (const factor of b.factors) {
				if (factor instanceof Exponent && factor.power instanceof Numeral) {
					if (factor.base.toLexicalString() === a.base.toLexicalString()) {
						return exp1._new_exp(new Exponent(a.baseExp.clone(), exp1._new_exp(Numeral.min(a.power, factor.power))));
					}
				} else if (factor.toLexicalString() === a.base.toLexicalString()) {
					return exp1._new_exp(new Exponent(a.baseExp.clone(), exp1._new_exp(Numeral.min(a.power, 1)))).simplify();
				}
			}
			return exp1._new_exp(new Numeral(1));
		} else {
			if (a.base.toLexicalString() == exp2._to_lexical_string()) {
				return exp1._new_exp(new Exponent(a.baseExp.clone(), exp1._new_exp(Numeral.min(a.power, 1)))).simplify();
			}
			return exp1._new_exp(new Numeral(1));
		}
	} else if (a instanceof Product) {
		if (b instanceof Exponent && b.power instanceof Numeral) {
			return expression_gcd_two(exp2, exp1);
		} else if (b instanceof Product) {
			// lexical string: [power, expression, modified?]
			/** @type {Object.<string,[Numeral,Expression,true?]>} */
			const termMap = {};
			/** @type {string[]} */
			const orderedKeys = [];
			// loop through a
			for (const factor of a.factors) {
				if (factor instanceof Exponent && factor.power instanceof Numeral) {
					const key = factor.base.toLexicalString();
					orderedKeys.push(key);
					termMap[key] = [factor.power, factor.baseExp.clone()];
				} else {
					const key = factor.toLexicalString();
					orderedKeys.push(key);
					termMap[key] = [new Numeral(1), exp1._new_exp(factor.clone())];
				}
			}
			// loop through b
			for (const factor of b.factors) {
				if (factor instanceof Exponent && factor.power instanceof Numeral) {
					const key = factor.base.toLexicalString();
					const val = termMap[key];
					if (val) {
						val[0] = Numeral.min(factor.power, val[0]);
						val[2] = true;
					}
				} else {
					const key = factor.toLexicalString();
					const val = termMap[key];
					if (val) {
						val[0] = Numeral.min(1, val[0]);
						val[2] = true;
					}
				}
			}
			for (const [key, val] of Object.entries(termMap)) {
				if (val[2] === undefined) {
					// no-dynamic-delete
					// eslint-disable-next-line
					delete termMap[key];
				}
			}
			/** @type {Expression[]} */
			const factors = [];
			for (const key of orderedKeys) {
				const val = termMap[key];
				if (val) {
					const [power, expression] = val;
					if (power.is.one()) {
						factors.push(expression);
					} else if (power.is.nonzero()) {
						factors.push(exp1._new_exp(new Exponent(expression, exp1._new_exp(power))));
					}
				}
			}
			let numericalGcd = Numeral.gcd(a.coeff, b.coeff);
			if (a.coeff.is.negative() && b.coeff.is.negative()) numericalGcd = numericalGcd.negative();
			return exp1._new_exp(new Product(numericalGcd, ...factors)).simplify();
		} else if (b instanceof Numeral) {
			const gcd = Numeral.gcd(a.coeff, b);
			return exp1._new_exp(a.coeff.is.negative() && b.is.negative() ? gcd.negative() : gcd);
		} else {
			for (const factor of a.factors) {
				if (factor instanceof Exponent && factor.power instanceof Numeral) {
					if (factor.base.toLexicalString() === b.toLexicalString()) {
						return exp2._new_exp(factor.base.clone());
					}
				} else if (factor.toLexicalString() === b.toLexicalString()) {
					return exp2._new_exp(factor.clone());
				}
			}
			return exp1._new_exp(new Numeral(1));
		}
	} else if ((b instanceof Exponent && b.power instanceof Numeral) || b instanceof Product) {
		return expression_gcd_two(exp2, exp1);
	} else {
		if (exp1._to_lexical_string() === exp2._to_lexical_string()) {
			return exp1.clone();
		}
		return exp1._new_exp(new Numeral(1));
	}
}

/**
 *
 * @param {Expression[]} exps
 * @returns {Expression}
 */
export function expression_gcd(...exps) {
	if (exps.length === 0) {
		throw new Error('Cannot find gcd of empty array');
	} else if (exps.length === 1) {
		return exps[0].clone();
	} else if (exps.length === 2) {
		return expression_gcd_two(exps[0], exps[1]);
	}
	// more than 2 expressions
	let gcd = expression_gcd_two(exps[0], exps[1]);
	exps.shift();
	exps.shift();
	for (const exp of exps) {
		gcd = expression_gcd_two(gcd, exp);
	}
	return gcd;
}
