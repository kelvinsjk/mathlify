import { Fraction, Polynomial } from 'mathlify';

/**
 * Rational class `{num: Polynomial, den: Polynomial}`
 * representing N(x)/D(x)
 */
export class RationalTerm {
	/** Numerator of the term */
	num: Polynomial;
	/** Denominator of the term */
	den: Polynomial;

	/**
	 * Creates a new term instance
	 */
	constructor(
		num: Fraction | number | Polynomial,
		den: Fraction | number | Polynomial = 1,
		options?: { variableAtom?: string },
	) {
		options = {
			variableAtom: 'x',
			...options,
		};
		num =
			typeof num === 'number' || num instanceof Fraction
				? new Polynomial([num], options)
				: num.clone();
		den =
			typeof den === 'number' || den instanceof Fraction
				? new Polynomial([den], options)
				: den.clone();
		this.num = num;
		this.den = den;
	}

	/**
	 * `toString()` method
	 *
	 * @returns the LaTeX string representation of the term
	 */
	toString(): string {
		return `\\frac{${this.num}}{${this.den}}`;
	}

	/**
	 * multiplication
	 */
	multiply(k: number | Fraction | Polynomial | RationalTerm): RationalTerm {
		if (typeof k === 'number' || k instanceof Fraction) {
			k = new Polynomial([k], { variableAtom: this.num.variableAtom });
		}
		k = <RationalTerm>(k instanceof RationalTerm ? k.clone() : new RationalTerm(k));
		return new RationalTerm(this.num.times(k.num), this.den.times(k.den));
	}

	/**
	 * @returns the negative of this `Term`. Equivalent to `term.multiply(-1)`.
	 */
	negative(): RationalTerm {
		return this.multiply(-1);
	}

	/** Clones this `Term`, creating a new instance */
	clone(): RationalTerm {
		return new RationalTerm(this.num.clone(), this.den.clone());
	}

	/**
	 * Adds terms
	 *
	 * @returns the combined fraction
	 */
	plus(x: number | Fraction | Polynomial | RationalTerm): RationalTerm {
		if (typeof x === 'number' || x instanceof Fraction) {
			x = new Polynomial([x], { variableAtom: this.num.variableAtom });
		}
		x = <RationalTerm>(x instanceof RationalTerm ? x.clone() : new RationalTerm(x));
		return new RationalTerm(
			this.num.times(x.den).plus(x.num.times(this.den)),
			this.den.times(x.den),
		);
	}

	/**
	 * subtract terms
	 *
	 * @returns the combined fraction
	 */
	minus(x: number | Fraction | Polynomial | RationalTerm): RationalTerm {
		if (typeof x === 'number' || x instanceof Fraction) {
			x = new Polynomial([x], { variableAtom: this.num.variableAtom });
		}
		x = <RationalTerm>(x instanceof RationalTerm ? x.clone() : new RationalTerm(x));
		return this.plus(x.negative());
	}

	/**
	 * substitute "x" into this term
	 * @param x number/Fraction to substitute into the term
	 * @returns "kx"
	 */
	subXAs(x: number | Fraction): Fraction | undefined {
		return this.num.subXAs(x).divide(this.den.subXAs(x));
	}
}
