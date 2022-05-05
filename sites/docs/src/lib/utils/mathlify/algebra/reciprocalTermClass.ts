import { Fraction, Term, toFraction, Expression, Polynomial } from 'mathlify';

/**
 * Reciprocal class `{coeff: Fraction, variable: Polynomial`
 * representing k/(f(x))
 */
export class ReciprocalTerm {
	/** Coefficient of the term */
	coeff: Fraction;
	/**
	 * String representation of the variable.
	 *
	 * An empty string here will represent the "constant term"
	 */
	variable: Polynomial;

	/**
	 * Creates a new term instance
	 * @param coeff coefficient of the term
	 * @param variable string representation of the term/'variable'.
	 * An empty string (default) means we are working with the constant term
	 */
	constructor(coeff: Fraction | number, variable: string | Polynomial = 'x') {
		coeff = toFraction(coeff);
		this.coeff = coeff;
		this.variable =
			typeof variable === 'string' ? new Polynomial([1, 0], { variableAtom: variable }) : variable;
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
		if (this.coeff.isInteger()) {
			return `\\frac{${this.coeff}}{${this.variable}}`;
		}
		const bracketedTerm =
			`${this.variable}`.length === 1 ? `${this.variable}` : `\\left( ${this.variable} \\right)`;
		return `\\frac{${this.coeff.num}}{${this.coeff.den} ${bracketedTerm}}`;
	}

	/**
	 * Scalar multiplication
	 */
	multiply(k: number | Fraction): ReciprocalTerm {
		return new ReciprocalTerm(this.coeff.times(k), this.variable);
	}

	/**
	 * @returns the negative of this `Term`. Equivalent to `term.multiply(-1)`.
	 */
	negative(): ReciprocalTerm {
		return this.multiply(-1);
	}

	/** Clones this `Term`, creating a new instance */
	clone(): ReciprocalTerm {
		return new ReciprocalTerm(this.coeff.clone(), this.variable);
	}

	/**
	 * absolute value
	 */
	abs(): ReciprocalTerm {
		return new ReciprocalTerm(this.coeff.abs(), this.variable);
	}

	/**
	 * Adds to this `Term`,
	 *
	 * @returns the combined Rational Term
	 */
	add(x: number | Fraction | string | Term): Expression {
		return new Expression(this.toString(), x);
	}

	/**
	 * Adds like terms
	 *
	 * WARNING: only works for like terms. use "add" method instead 'combine the fractions'
	 *
	 * @returns an `Expression` class representing the sum
	 */
	plus(x: ReciprocalTerm): ReciprocalTerm {
		if (`${this.variable}` !== `${x.variable}`) {
			throw new Error('Cannot add unlike terms. Use the "add" method instead to get an expression');
		}
		return new ReciprocalTerm(this.coeff.plus(x.coeff), this.variable);
	}

	/**
	 * subtract like terms
	 *
	 * WARNING: only works for like terms. use "subtract" method instead to 'combine the fractions'
	 *
	 * @returns an `Expression` class representing the sum
	 */
	minus(x: ReciprocalTerm): ReciprocalTerm {
		if (`${this.variable}` !== `${x.variable}`) {
			throw new Error('Cannot add unlike terms. Use the "add" method instead to get an expression');
		}
		return new ReciprocalTerm(this.coeff.minus(x.coeff), this.variable);
	}

	/**
	 * Subtract from this RationalTerm,
	 *
	 * @returns a combined RationalTerm
	 */
	subtract(x: number | Fraction | string | Term): Expression {
		x = typeof x === 'number' ? -x : typeof x === 'string' ? new Term(-1, x) : x.negative();
		return new Expression(this.toString(), x);
	}

	/**
	 * substitute "x" into this term
	 * @param x number/Fraction to substitute into the term
	 * @returns "kx"
	 */
	subXAs(x: number | Fraction): Fraction | undefined {
		const fx = this.variable.subXAs(x);
		if (fx !== undefined) {
			return this.coeff.divide(fx);
		}
	}
}
