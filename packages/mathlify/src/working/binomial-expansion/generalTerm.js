// the expression class is a collection of terms under addition
// the termPowerMap contains a map of all the terms that have appeared in the expression in order, but may contain terms with zero coefficients
// the terms array removes any such terms with zero coefficients

import { numberToFraction } from '../../utils/toFraction.js';
import { ExpressionProduct } from '../../algebra/index.js';
import { Polynomial, Term, Fraction, Expression } from '../../core/index.js';
import { nCr } from '../../numerical/index.js';

export class BinomialGeneralTermWorking {
	/** @type {Fraction|Term} */
	coeff1;
	/** @type {number} */
	pow1;
	/** @type {Fraction|Term} */
	coeff2;
	/** @type {number} */
	pow2;
	/** @type {number} */
	n;
	/** @type {string} */
	variable;
	/** @type {Term} */
	term1;
	/** @type {Term} */
	term2;
	/** @type {ExpressionProduct} */
	binomial;
	/** @type {Polynomial} */
	power;
	/** @type {boolean} */
	aligned;

	/**
	 * @param {number|Fraction|string|Term} coeff1
	 * @param {number} pow1
	 * @param {number|Fraction|string|Term} coeff2
	 * @param {number} pow2
	 * @param {number} n
	 * @param {{variable?: string, aligned?: boolean}} [options]
	 */
	constructor(coeff1, pow1, coeff2, pow2, n, options) {
		if (typeof coeff1 === 'number') {
			coeff1 = numberToFraction(coeff1);
		} else if (typeof coeff1 === 'string') {
			coeff1 = new Term(coeff1);
		}
		if (typeof coeff2 === 'number') {
			coeff2 = numberToFraction(coeff2);
		} else if (typeof coeff2 === 'string') {
			coeff2 = new Term(coeff2);
		}
		this.coeff1 = coeff1;
		this.pow1 = pow1;
		this.coeff2 = coeff2;
		this.pow2 = pow2;
		this.n = n;
		this.power = new Polynomial([n * pow1, pow2 - pow1], {
			ascending: true,
			variable: 'r',
		});
		const variable = options?.variable ?? 'x';
		this.variable = variable;
		const term1 =
			coeff1 instanceof Term
				? coeff1.times(new Term([variable, pow1]))
				: new Term(coeff1, [variable, pow1]);
		const term2 =
			coeff2 instanceof Term
				? coeff2.times(new Term([variable, pow2]))
				: new Term(coeff2, [variable, pow2]);
		this.term1 = term1;
		this.term2 = term2;
		this.binomial = new ExpressionProduct([new Expression(term1, term2), n]);
		this.aligned = options?.aligned ?? false;
	}

	toString() {
		const equal = this.aligned ? '&=' : '=';
		const negativePowerStep =
			this.pow1 < 0 || this.pow2 < 0
				? `\n\t ${equal} ${new ExpressionProduct([
						new Expression(
							this.term1.setDisplayMode('never'),
							this.term2.setDisplayMode('never')
						),
						this.n,
				  ])} \\\\`
				: '';

		const pow1 = new Polynomial([this.n, -1], {
			ascending: true,
			variable: 'r',
		}).times(this.pow1);
		const secondStep = new Term(
			`{${this.n} \\choose r}`,
			`\\left( ${this.term1.setDisplayMode('never')} \\right)^{${this.n}-r}`,
			`\\left( ${this.term2.setDisplayMode('never')} \\right)^r`
		);
		const coeffString = handleCoeffString(this);
		return `${this.binomial} \\\\ ${negativePowerStep}
      ${equal} ${secondStep} \\\\
      ${equal} {${this.n} \\choose r} ${coeffString}
      \\left( ${this.variable}^{${pow1}} \\right) 
      \\left( ${this.variable}\\right)^{${new Polynomial('r').times(
				this.pow2
			)}} \\\\
      ${equal} {${this.n} \\choose r} ${coeffString} ${this.variable}^{${
				this.power
			}}`;
	}

	get generalTerm() {
		const coeffString = handleCoeffString(this);
		return `{${this.n} \\choose r} ${coeffString} ${this.variable}^{${this.power}}`;
	}

	/**
	 * @param {number|Fraction} r
	 * @returns {{working: string, coeffWorking: string, term: Term, coeff: Term|Fraction}}
	 */
	at(r) {
		r = r.valueOf();
		const choose = nCr(this.n, r);
		const nMinusR = this.n - r;
		const coeff1 = this.coeff1.pow(nMinusR);
		const coeff2 = this.coeff2.pow(r);
		const coeff = (
			coeff1 instanceof Term ? coeff1.times(coeff2) : coeff2.times(coeff1)
		).times(choose);
		const power = this.power.subIn(r);
		const term =
			coeff instanceof Term
				? coeff.times(new Term([this.variable, power]))
				: new Term(coeff, [this.variable, power]);
		let coeff1String =
			`${this.coeff1}` === '1'
				? ''
				: `${this.coeff1}`.length > 1
				? `\\left( ${this.coeff1} \\right)`
				: `${this.coeff1}`;
		if (coeff1String) {
			coeff1String += `^{${this.n}-${r}}`;
		}
		let coeff2String =
			`${this.coeff2}` === '1'
				? ''
				: `${this.coeff2}`.length > 1
				? `\\left( ${this.coeff2} \\right)`
				: `${this.coeff2}`;
		if (coeff2String) {
			coeff2String += `^{${r}}`;
		}
		const coeffString = `${coeff1String}${coeff2String}`;
		const working = `{${this.n} \\choose ${r}} ${coeffString} ${
			this.variable
		}^{${this.power.replaceXWith(`(${r})`)}} `;
		return {
			coeffWorking: `{${this.n} \\choose ${r}} ${coeffString}`,
			working,
			term,
			coeff,
		};
	}
}

/**
 * @param {BinomialGeneralTermWorking} b
 * @returns {string}
 */
function handleCoeffString(b) {
	let coeff1String =
		`${b.coeff1}` === '1'
			? ''
			: `${b.coeff1}`.length > 1
			? `\\left( ${b.coeff1} \\right)`
			: `${b.coeff1}`;
	if (coeff1String) {
		coeff1String += `^{${b.n}-r}`;
	}
	let coeff2String =
		`${b.coeff2}` === '1'
			? ''
			: `${b.coeff2}`.length > 1
			? `\\left( ${b.coeff2} \\right)`
			: `${b.coeff2}`;
	if (coeff2String) {
		coeff2String += `^{r}`;
	}
	return `${coeff1String}${coeff2String}`;
}
