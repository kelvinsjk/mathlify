import { Fraction } from '../fractionClass';
import { numberToFraction } from '../utils/numberToFraction';

/**
 * Basic Term class `{coeff: Fraction, variable: string }`
 */
export class BasicTerm {
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
		coeff = numberToFraction(coeff);
		this.coeff = coeff;
		this.variable = variable;
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
}
