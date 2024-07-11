import { Fraction, FractionJSON } from '../fractionClass';
import { numberToFraction } from '../utils/numberToFraction';
import { BasicTerm } from './basicTermClass';

/**
 * `Unknown` class representing "k x^n"
 */
export class VariableTerm extends BasicTerm {
	/** variable string (before taking powers) */
	variable: string;
	/** degree of the polynomial term: must be a non-negative integer */
	n: Fraction;

	/**
	 * Creates a new polynomial term instance
	 * @param coeff coefficient of the term. If a string is passed, we will use that as the unknown and let the coefficient and power be 1
	 * @param options defaults to `{ unknown: 'x', n: 1, }`;
	 */
	constructor(coeff: Fraction | number | string = 1, options?: { variable?: string; n?: number | Fraction }) {
		const { variable, n: nNumber } = {
			variable: 'x',
			n: 1,
			...options,
		};
		if (typeof coeff === 'string') {
			// edge case
			super(1, coeff);
			this.variable = coeff;
			this.n = new Fraction(1);
		} else {
			coeff = numberToFraction(coeff);
			const n = numberToFraction(nNumber);
			let variableString: string; // x^n
			if (n.isEqualTo(1) || n.isEqualTo(0)) {
				variableString = n.isEqualTo(1) ? variable : '';
			} else {
				const powerString = `${n}`.length > 1 ? `{${n}}` : `${n}`;
				variableString = `${variable}^${powerString}`;
			}
			super(coeff, variableString);
			this.variable = variable;
			this.n = n;
		}
	}

	/**
	 * Multiplication
	 */
	times(k: number | Fraction | VariableTerm): VariableTerm {
		if (k instanceof VariableTerm) {
			if (k.variable !== this.variable) {
				throw new Error('Cannot multiply two power terms with different unknowns');
			}
			return new VariableTerm(this.coeff.times(k.coeff), { variable: this.variable, n: this.n.plus(k.n) });
		}
		return new VariableTerm(this.coeff.times(k), { variable: this.variable, n: this.n });
	}
	/**
	 * Division
	 */
	divide(k: number | Fraction | VariableTerm): VariableTerm {
		if (k instanceof VariableTerm) {
			if (k.variable !== this.variable) {
				throw new Error('Cannot multiply two power terms with different unknowns');
			}
			return new VariableTerm(this.coeff.divide(k.coeff), { variable: this.variable, n: this.n.minus(k.n) });
		}
		return new VariableTerm(this.coeff.divide(k), { variable: this.variable, n: this.n });
	}

	/**
	 * @returns the negative of this `Term`. Equivalent to `term.multiply(-1)`.
	 */
	negative(): VariableTerm {
		return this.times(-1);
	}

	pow(n: number): VariableTerm {
		return new VariableTerm(this.coeff.pow(n), { variable: this.variable, n: this.n.times(n) });
	}

	/**
	 * substitutes the unknown in and returns a fraction
	 *
	 * only supports fraction when n is an integer at the moment
	 */
	subIn(x: number | Fraction): Fraction {
		x = numberToFraction(x);
		if (!this.n.isInteger()) {
			throw new Error(`Cannot substitute in a non-integer power ${this.n}`);
		}
		return this.coeff.times(x.pow(this.n.num));
	}

	/**
	 * substitutes the unknown in and returns a number type
	 */
	subInNumber(x: number): number {
		return this.coeff.valueOf() * Math.pow(x, this.n.valueOf());
	}

	/** clones and creates a new instance */
	clone(): VariableTerm {
		return new VariableTerm(this.coeff.clone(), { variable: this.variable, n: this.n });
	}

	toJSON(): VariableTermJSON {
		return {
			type: 'variable',
			args: [this.coeff.toJSON(), { variable: this.variable, n: this.n.toJSON() }],
		};
	}
}

export interface VariableTermJSON {
	type: 'variable';
	args: [FractionJSON, { variable: string; n: FractionJSON }];
}
