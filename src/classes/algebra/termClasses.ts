import { Fraction } from '../fractionClass';
import { Expression, xExpression } from './expressionClasses';
import toFraction from '../../utils/toFraction';

/**
 * Term class `{coeff: Fraction, variable: string}` representing
 * a term "kx", where "k" is the coefficient `coeff` and "x" is the `variable`
 */
export class Term {
	/** Coefficient of the term */
	coeff: Fraction;
	/**
	 * String representation of the variable.
	 *
	 * An empty string here will represent the "constant term"
	 */
	variable: string;

	/**
	 * Creates a new term instance
	 * @param coeff coefficient of the term
	 * @param variable string representation of the term/'variable'.
	 * An empty string (default) means we are working with the constant term
	 */
	constructor(coeff: Fraction | number, variable = '') {
		coeff = toFraction(coeff);
		this.coeff = coeff;
		this.variable = coeff.isEqualTo(0) ? '' : variable;
	}

	/**
	 * `toString()` method
	 *
	 * @returns the LaTeX string representation of the term
	 */
	toString(): string {
		if (this.coeff.isEqualTo(0)) {
			return '0';
		}
		if (this.coeff.isEqualTo(1)) {
			return this.variable === '' ? '1' : `${this.variable}`;
		}
		if (this.coeff.isEqualTo(-1)) {
			return this.variable === '' ? '- 1' : `- ${this.variable}`;
		}

		// non 0/1/-1 coefficient
		if (this.variable === '') {
			// constant term
			return `${this.coeff}`;
		}

		// variable term and non 0/1/-1 coefficient
		return `${this.coeff} ${this.variable}`;
	}

	/**
	 * Scalar multiplication
	 */
	multiply(k: number | Fraction): Term {
		return new Term(this.coeff.times(k), this.variable);
	}

	/**
	 * @returns the negative of this `Term`. Equivalent to `term.multiply(-1)`.
	 */
	negative(): Term {
		return this.multiply(-1);
	}

	/** Clones this `Term`, creating a new instance */
	clone(): Term {
		return new Term(this.coeff.clone(), this.variable);
	}

	/**
	 * Adds to this `Term`,
	 *
	 * @returns an `Expression` class representing the sum
	 */
	add(x: number | Fraction | string | Term): Expression {
		return new Expression(this, x);
	}

	/**
	 * Subtract from this `Term`,
	 *
	 * @returns an `Expression` class representing the difference
	 */
	subtract(x: number | Fraction | string | Term): Expression {
		x = typeof x === 'number' ? -x : typeof x === 'string' ? new Term(-1, x) : x.negative();
		return new Expression(this, x);
	}
}

/**
 * `xTerm` class extends the `Term` class by adding a function `f()` that mimics
 * substituting "x" into the term
 */
export class xTerm extends Term {
	/** for internal use only: store for "f" function */
	f: (x: number | Fraction) => Fraction | undefined;

	/**
	 * Creates a new term instance
	 * @param coeff coefficient of the term
	 * @param variable string representation of the term/'variable'. Defaults to 'x'
	 * @param f a function mimicking substituting "x" into the variable term
	 * (the coefficient will be handled automatically, so do not account for it here).
	 * Defaults to the identity function x => x
	 */
	constructor(coeff: Fraction | number, variable = 'x', f?: (x: number | Fraction) => Fraction | undefined) {
		super(coeff, variable);
		this.f = f || ((x: number | Fraction) => toFraction(x));
	}

	/**
	 * Scalar multiplication
	 */
	multiply(k: number | Fraction): xTerm {
		return new xTerm(this.coeff.times(k), this.variable, this.f);
	}

	/**
	 * @returns the negative of this `Term`. Equivalent to `term.multiply(-1)`.
	 */
	negative(): xTerm {
		return this.multiply(-1);
	}

	/** Clones this `xTerm`, creating a new instance */
	clone(): xTerm {
		return new xTerm(this.coeff.clone(), this.variable, this.f);
	}

	/**
	 * substitute "x" into this term
	 * @param x number/Fraction to substitute into the term
	 * @returns "kx"
	 */
	subXAs(x: number | Fraction): Fraction | undefined {
		const fx = this.f(x);
		if (fx !== undefined) {
			return this.coeff.times(fx);
		}
	}

	/**
	 * Adds to this `xTerm`,
	 *
	 * @returns an `xExpression` class representing the sum
	 */
	add(x: number | Fraction | string | xTerm): xExpression {
		return new xExpression(this, x);
	}

	/**
	 * Subtract from this `xTerm`,
	 *
	 * @returns an `xExpression` class representing the difference
	 */
	subtract(x: number | Fraction | string | xTerm): xExpression {
		x = typeof x === 'number' ? -x : typeof x === 'string' ? new xTerm(-1, x) : x.negative();
		return new xExpression(this, x);
	}
}

/**
 * `pTerm` class representing a polynomial term "k x^n"
 */
export class pTerm extends xTerm {
	/** variable string (before taking powers) */
	variableAtom: string;
	/** degree of the polynomial term: must be a non-negative integer */
	n: number;

	/**
	 * Creates a new polynomial term instance
	 * @param coeff coefficient of the term
	 * @param options defaults to `{ variableAtom: 'x', n: 1, f: x => x }`;
	 */
	constructor(coeff: Fraction | number, options?: Partial<PolynomialTermOptions>) {
		const defaultOptions = {
			variableAtom: 'x',
			n: 1,
			f: (x: number | Fraction) => toFraction(x),
		};
		const termOptions = { ...defaultOptions, ...options } as PolynomialTermOptions;
		let variable: string;
		let f: (x: number | Fraction) => Fraction | undefined;
		if (termOptions.n === 0) {
			variable = '';
			f = (x: number | Fraction) => Fraction.ONE;
		} else if (termOptions.n === 1) {
			variable = termOptions.variableAtom;
			f = termOptions.f;
		} else {
			const powerString = termOptions.n > 9 ? `{${termOptions.n}}` : `${termOptions.n}`;
			variable = `${termOptions.variableAtom}^${powerString}`;
			f = (x: number | Fraction) => {
				return termOptions.f(x)!.pow(termOptions.n);
			};
		}
		super(coeff, variable, f);
		this.variableAtom = termOptions.variableAtom;
		this.n = termOptions.n;
	}

	/**
	 * Scalar multiplication
	 */
	multiply(k: number | Fraction): pTerm {
		return new pTerm(this.coeff.times(k), { variableAtom: this.variableAtom, n: this.n, f: this.f });
	}

	/**
	 * @returns the negative of this `Term`. Equivalent to `term.multiply(-1)`.
	 */
	negative(): pTerm {
		return this.multiply(-1);
	}

	/** Clones this `pTerm`, creating a new instance */
	clone(): pTerm {
		return new pTerm(this.coeff.clone(), { variableAtom: this.variableAtom, n: this.n, f: this.f });
	}
}

interface PolynomialTermOptions {
	variableAtom: string;
	n: number;
	f: (x: number | Fraction) => Fraction | undefined;
}
