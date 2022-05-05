import { Fraction, FractionJSON } from '../fractionClass';
import { numberToFraction } from '../utils/numberToFraction';
import { BasicTerm } from './basicTermClass';

/**
 * `Unknown` class representing "k x^n"
 */
export class Unknown extends BasicTerm {
	/** variable string (before taking powers) */
	unknown: string;
	/** degree of the polynomial term: must be a non-negative integer */
	n: Fraction;

	/**
	 * Creates a new polynomial term instance
	 * @param coeff coefficient of the term. If a string is passed, we will use that as the unknown and let the coefficient and power be 1
	 * @param options defaults to `{ unknown: 'x', n: 1, }`;
	 */
	constructor(coeff: Fraction | number | string = 1, options?: { unknown?: string; n?: number | Fraction }) {
		const { unknown, n: nNumber } = {
			unknown: 'x',
			n: 1,
			...options,
		};
		if (typeof coeff === 'string') {
			super(1, coeff);
			this.unknown = coeff;
			this.n = new Fraction(1);
		} else {
			coeff = numberToFraction(coeff);
			const n = numberToFraction(nNumber);
			let variable: string;
			if (n.isEqualTo(0)) {
				variable = '';
			} else if (n.isEqualTo(1)) {
				variable = unknown;
			} else {
				const powerString = `${n}`.length > 1 ? `{${n}}` : `${n}`;
				variable = `${unknown}^${powerString}`;
			}
			super(coeff, variable);
			this.unknown = unknown;
			this.n = n;
		}
	}

	/**
	 * Multiplication
	 */
	times(k: number | Fraction | Unknown): Unknown {
		if (k instanceof Unknown) {
			if (k.unknown !== this.unknown) {
				throw new Error('Cannot multiply two power terms with different unknowns');
			}
			return new Unknown(this.coeff.times(k.coeff), { unknown: this.unknown, n: this.n.plus(k.n) });
		}
		return new Unknown(this.coeff.times(k), { unknown: this.unknown, n: this.n });
	}
	/**
	 * Division
	 */
	divide(k: number | Fraction | Unknown): Unknown {
		if (k instanceof Unknown) {
			if (k.unknown !== this.unknown) {
				throw new Error('Cannot multiply two power terms with different unknowns');
			}
			return new Unknown(this.coeff.divide(k.coeff), { unknown: this.unknown, n: this.n.minus(k.n) });
		}
		return new Unknown(this.coeff.divide(k), { unknown: this.unknown, n: this.n });
	}

	/**
	 * @returns the negative of this `Term`. Equivalent to `term.multiply(-1)`.
	 */
	negative(): Unknown {
		return this.times(-1);
	}

	pow(n: number): Unknown {
		return new Unknown(this.coeff.pow(n), { unknown: this.unknown, n: this.n.times(n) });
	}

	/**
	 * substitutes the unknown in
	 *
	 * only supports fraction and only when n is an integer at the moment
	 */
	subIn(x: number | Fraction): Fraction {
		x = numberToFraction(x);
		if (!this.n.isInteger()) {
			throw new Error(`Cannot substitute in a non-integer power ${this.n}`);
		}
		return this.coeff.times(x.pow(this.n.num));
	}

	/** Clones this `pTerm`, creating a new instance */
	clone(): Unknown {
		return new Unknown(this.coeff.clone(), { unknown: this.unknown, n: this.n });
	}

	toJSON(): UnknownJSON {
		return {
			type: 'unknown',
			args: [this.coeff.toJSON(), { unknown: this.unknown, n: this.n.toJSON() }],
		};
	}
}

export interface UnknownJSON {
	type: string;
	args: [FractionJSON, { unknown: string; n: FractionJSON }];
}
