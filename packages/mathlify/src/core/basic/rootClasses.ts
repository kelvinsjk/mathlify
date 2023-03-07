import { Fraction, FractionJSON } from '../fractionClass';
import { BasicTerm } from './basicTermClass';
import { numberToFraction } from '../utils/numberToFraction';
import { numberToNthRoot } from '../utils/numberToNthRoot';
import { numberToSquareRoot } from '../utils/numberToSquareRoot';

/**
 * the NthRoot class
 * `${coeff: Fraction, n: positive integer, radicand: non-negative fraction}`
 * representing $a \sqrt[n]{b}$ where $a$ is the coefficient and $b$ is the radicand.
 *
 * Note that we do not support negative radicands at this point.
 * For odd `n`, you may want to consider 'hoisting' the negative sign to the coefficient)
 *
 * Simplification of perfect Nth-powers are only done if the radicand is made up of
 * prime factors less than 100.
 *
 * It is recommended to use the `SquareRoot` class instead of `NthRoot` for square roots.
 */
export class NthRoot extends BasicTerm {
	/** the n-th root */
	n: number;
	/** the non-negative integer inside the radical */
	radicand: Fraction;

	//// constructor
	/**
	 * creates a new NthRoot instance representing $a \sqrt[n]{b}$.
	 * @param radicand only non-negative integers or Fractions are supported at this moment.
	 * @param coeff coefficient of the radical (defaults to 1).
	 */
	constructor(n: number, radicand: number | Fraction, coeff: number | Fraction = 1) {
		if (!Number.isInteger(n) || n < 2) {
			throw new Error('n must be a integer at least 2');
		}
		if (radicand.valueOf() < 0) {
			throw new Error('radicand must be non-negative');
		}
		// 'rationalize'
		coeff = numberToFraction(coeff);
		radicand = numberToFraction(radicand);
		// extract powers
		const [aNum, bNum] = extractPowers(radicand.num, n);
		const [aDen, bDen] = extractPowers(radicand.den, n);
		if (bNum === 1 || bDen === 1) {
			coeff = coeff.times(aNum).divide(aDen);
			radicand = new Fraction(bNum, bDen);
		}
		// create term
		super(coeff, `\\sqrt[${n}]{${radicand}}`);
		this.n = n;
		this.radicand = radicand;
		// edge cases for typesetting
		if (this.radicand.valueOf() === 0) {
			this.coeff = new Fraction(0);
			this.variableString = '';
		} else if (this.radicand.valueOf() === 1) {
			this.variableString = '';
		}
		if (this.coeff.isEqualTo(0)) {
			this.variableString = '';
		}
	}

	//// Arithmetic methods

	/**
	 * radical multiplication: $a_1 \sqrt[n]{b_1} \times a_2 \sqrt[n]{b_2} = a_1 a_2 \sqrt[n]{b_1 b_2}$
	 *
	 * only valid if n is the same for both terms.
	 */
	times(x: NthRoot | number | Fraction): NthRoot {
		x = numberToNthRoot(this.n, x);
		if (this.n !== x.n) {
			throw new Error('n must be the same for both terms');
		}
		return new NthRoot(this.n, this.radicand.times(x.radicand), this.coeff.times(x.coeff));
	}
	/**
	 * radical division: a_1 \sqrt[n]{b_1} / a_2 \sqrt[n]{b_2} = a_1 / a_2 * \sqrt[n]{b_1 / b_2}$
	 */
	divide(x: NthRoot | number | Fraction): NthRoot {
		x = numberToNthRoot(this.n, x);
		if (this.n !== x.n) {
			throw new Error('n must be the same for both terms');
		}
		return new NthRoot(this.n, this.radicand.divide(x.radicand), this.coeff.divide(x.coeff));
	}

	/**
	 * exponentiation
	 *
	 * @param n non-negative integer
	 * @returns this NthRoot to the power of n
	 */
	pow(n: number): NthRoot {
		if (!Number.isInteger(n) || n < 0) {
			throw new Error('n must be a non-negative integer');
		}
		return new NthRoot(this.n, this.radicand.pow(n), this.coeff.pow(n));
	}

	/**
	 * @returns the value of this NthRoot in the primitive number type
	 */
	valueOf(): number {
		return Math.pow(this.radicand.valueOf(), 1 / this.n) * this.coeff.valueOf();
	}

	//// Comparison methods
	/**
	 * tests for equality
	 */
	isEqualTo(x: number | Fraction | NthRoot): boolean {
		x = x instanceof NthRoot ? x : new NthRoot(this.n, 1, x);
		if (x.coeff.isEqualTo(0) || this.coeff.isEqualTo(0)) {
			return x.coeff.isEqualTo(0) && this.coeff.isEqualTo(0);
		}
		return this.n === x.n && this.radicand.isEqualTo(x.radicand) && this.coeff.isEqualTo(x.coeff);
	}
	/**
	 * @returns true if this NthRoot represents a rational number
	 */
	isRational(): boolean {
		return this.radicand.valueOf() === 1 || this.radicand.valueOf() === 0;
	}

	/**
	 * if this NthRoot is a rational number, returns the rational number as a `Fraction` instance.
	 *
	 * Warning: throws if NthRoot is not a rational number.
	 */
	toFraction(): Fraction {
		if (!this.isRational()) {
			throw new Error('NthRoot is not a rational number');
		}
		return this.coeff.clone();
	}

	toPrecision(precision: number): string {
		return `${Number(this.valueOf().toPrecision(precision))}`;
	}
	toFixed(digits: number): string {
		return this.valueOf().toFixed(digits);
	}

	clone(): NthRoot {
		return new NthRoot(this.n, this.radicand.clone(), this.coeff.clone());
	}
}

/**
 * the SquareRoot class
 * `${coeff: Fraction, radicand: non-negative integer}`
 * representing $a \sqrt{b}$ where $a$ is the coefficient and $b$ is the radicand.
 *
 * Note that we do not support negative radicands at this point.
 */
export class SquareRoot extends NthRoot {
	//// constructor
	/**
	 * creates a new SquareRoot instance representing $a \sqrt{b}$.
	 * @param radicand only non-negative integers or Fractions are supported at this moment.
	 * @param coeff coefficient of the radical (defaults to 1).
	 *
	 * If a fraction is provided as the radicand, we will 'rationalize' it such that
	 * $a \sqrt{b/c}$ is converted to $\frac{a}{c} \sqrt{bc}$ so that the radicand is an integer.
	 *
	 * we will also simplify our radical such that the final surd $a\sqrt{b}$ is such that b square free,
	 * up to prime powers less than 100
	 */
	constructor(radicand: number | Fraction, coeff: number | Fraction = 1) {
		if (radicand.valueOf() < 0) {
			throw new Error('radicand must be non-negative');
		}
		// 'rationalize'
		coeff = numberToFraction(coeff);
		if (typeof radicand !== 'number') {
			const c = radicand.den;
			radicand = radicand.num * c;
			coeff = coeff.divide(c);
		}
		// extract powers
		const [a, b] = extractPowers(radicand);
		coeff = coeff.times(a);
		radicand = b;
		super(2, radicand, coeff);
		// edge cases for typesetting
		if (radicand !== 0 && radicand !== 1) {
			this.variableString = `\\sqrt{${this.radicand}}`;
		}
	}

	//// Arithmetic methods

	/**
	 * radical multiplication: $a_1 \sqrt[n]{b_1} \times a_2 \sqrt[n]{b_2} = a_1 a_2 \sqrt[n]{b_1 b_2}$
	 *
	 * only valid if n is the same for both terms.
	 */
	times(x: SquareRoot | number | Fraction): SquareRoot {
		x = numberToSquareRoot(x);
		return new SquareRoot(this.radicand.times(x.radicand), this.coeff.times(x.coeff));
	}
	/**
	 * radical division: a_1 \sqrt[n]{b_1} / a_2 \sqrt[n]{b_2} = a_1 / a_2 * \sqrt[n]{b_1 / b_2}$
	 */
	divide(x: SquareRoot | number | Fraction): SquareRoot {
		x = numberToSquareRoot(x);
		return new SquareRoot(this.radicand.divide(x.radicand), this.coeff.divide(x.coeff));
	}
	/**
	 * addition of radicals: only work for same radicand currently
	 */
	plus(x: SquareRoot): SquareRoot {
		if (this.isEqualTo(0)) {
			return x;
		}
		if (x.isEqualTo(0)) {
			return this;
		}
		if (this.radicand.isEqualTo(x.radicand)) {
			return new SquareRoot(this.radicand, this.coeff.plus(x.coeff));
		}
		throw new Error(`${x} and ${this} have different radicands. Consider using an Expression class`);
	}
	/**
	 * subtraction of radicals: only work for same radicand currently
	 */
	minus(x: SquareRoot): SquareRoot {
		return this.plus(x.negative());
	}

	/**
	 * exponentiation
	 *
	 * @param n non-negative integer
	 * @returns this NthRoot to the power of n
	 */
	pow(n: number): SquareRoot {
		if (!Number.isInteger(n) || n < 0) {
			throw new Error('n must be a non-negative integer');
		}
		return new SquareRoot(this.radicand.pow(n), this.coeff.pow(n));
	}

	abs(): SquareRoot {
		return new SquareRoot(this.radicand, this.coeff.abs());
	}

	square(): Fraction {
		return this.coeff.pow(2).times(this.radicand);
	}

	/**
	 * @returns negative of this SquareRoot
	 */
	negative(): SquareRoot {
		return new SquareRoot(this.radicand.clone(), this.coeff.negative());
	}

	/**
	 * @returns the reciprocal this SquareRoot
	 */
	reciprocal(): SquareRoot {
		return new SquareRoot(this.radicand.reciprocal(), this.coeff.reciprocal());
	}

	clone(): SquareRoot {
		return new SquareRoot(this.radicand.clone(), this.coeff.clone());
	}

	/**
	 * the number one in SquareRoot class
	 */
	static ONE = new SquareRoot(1);

	toJSON(): SquareRootJSON {
		return {
			type: 'squareRoot',
			args: [this.radicand.toJSON(), this.coeff.toJSON()],
		};
	}
}

/**
 * takes an integer x, and returns [a, b] such that x = a^n b and b is n-power free (up to 100)
 * */
function extractPowers(x: number, n = 2, y = 1): [number, number] {
	//if (!Number.isInteger(n) || n < 2) {
	//  throw 'n must be an integer more than 2';
	//}
	if (x == 0) {
		return [0, 0];
	}
	// primes up to 100
	const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
	for (const prime of primes) {
		if (x % Math.pow(prime, n) === 0) {
			return extractPowers(x / Math.pow(prime, n), n, y * prime);
		} else if (x < Math.pow(prime, n)) {
			break;
		}
	}
	return [y, x];
}

export interface SquareRootJSON {
	type: string;
	args: [FractionJSON, FractionJSON];
}
