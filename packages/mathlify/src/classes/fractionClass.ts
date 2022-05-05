import { gcd } from '../functions/arithmetic/gcd';
import toFraction from '../utils/toFraction';

/**
 * Fraction class `{num: numerator, den: denominator}`
 *
 * `num` represents the numerator and is an integer
 *
 * `den` represents the denominator and is a positive integer (any negative signs are "hoisted" to `num`)
 */
export class Fraction {
	/** numerator of the fraction (integer) */
	num: number;
	/** denominator of the fraction (positive integer) */
	den: number;

	/**
	 * Creates a new `Fraction` instance, 'simplifying' the fraction to the form a/b such that a is an integer, b is a positive integer and gcd(a,b)=1.
	 * @param num numerator
	 * @param den denominator defaults to `1`
	 */
	constructor(num: number, den: number = 1) {
		if (!Number.isInteger(den) || !Number.isInteger(num)) {
			throw new RangeError('parameters must be integers');
		}
		if (den === 0) {
			throw new RangeError('denominator must be non-zero');
		}
		const divisor = gcd(num, den);
		const sign = Math.sign(num) * Math.sign(den); // signs hoisted to top
		this.num = (sign * Math.abs(num)) / divisor;
		this.den = Math.abs(den) / divisor;
	}

	/**
	 * addition
	 * @param f2 the number/fraction to be added
	 * @returns the sum of this fraction and `f2`
	 */
	plus(f2: number | Fraction): Fraction {
		f2 = toFraction(f2);
		return new Fraction(this.num * f2.den + f2.num * this.den, this.den * f2.den);
	}

	/**
	 * multiplication
	 * @param f2 the number/fraction to be multiplied
	 * @returns the product of this fraction and `f2`
	 */
	times(f2: number | Fraction): Fraction {
		f2 = toFraction(f2);
		return new Fraction(this.num * f2.num, this.den * f2.den);
	}

	/**
	 * @returns negative of this fraction
	 */
	negative(): Fraction {
		return this.times(-1);
	}

	/**
	 * @returns the absolute value of this Fraction
	 */
	abs(): Fraction {
		return new Fraction(Math.abs(this.num), this.den);
	}

	/**
	 * subtraction
	 * @param f2 the number/fraction to be subtracted
	 * @returns this fraction minus `f2`
	 */
	minus(f2: number | Fraction): Fraction {
		f2 = toFraction(f2);
		return this.plus(f2.negative());
	}

	/**
	 * reciprocal
	 * @returns this 1/(this fraction), provided that this fraction is non-zero
	 */
	reciprocal(): Fraction {
		return new Fraction(this.den, this.num);
	}

	/**
	 * division
	 * @param f2 the number/fraction to be divided by. Cannot be zero.
	 * @returns this fraction divided by `f2`
	 */
	divide(f2: number | Fraction): Fraction {
		f2 = toFraction(f2);
		return this.times(f2.reciprocal());
	}

	/**
	 * exponentiation
	 * @param n integer
	 * @returns this fraction to the power of `n`
	 */
	pow(n: number): Fraction {
		if (!Number.isInteger(n)) {
			throw new RangeError('only integral n are allowed for fraction.pow(n)');
		}
		const modN = Math.abs(n);
		const thisPowerModN = new Fraction(Math.pow(this.num, modN), Math.pow(this.den, modN));
		return n >= 0 ? thisPowerModN : thisPowerModN.reciprocal();
	}

	/**
	 * square
	 * @returns the square of this fraction
	 */
	square(): Fraction {
		return this.pow(2);
	}

	/**
	 * checks if this fraction is equal to `f2`
	 */
	isEqualTo(f2: number | Fraction): boolean {
		f2 = toFraction(f2);
		return this.num === f2.num && this.den == f2.den;
	}

	/**
	 * checks if this fraction is an integer
	 */
	isInteger(): boolean {
		return this.den === 1;
	}

	/**
	 * checks if this fraction is larger than f2
	 * @param f2 number or fraction to compare against
	 */
	isGreaterThan(f2: number | Fraction): boolean {
		return this.valueOf() > f2.valueOf();
	}

	/**
	 * checks if this fraction is smaller than f2
	 * @param f2 number or fraction to compare against
	 */
	isLessThan(f2: number | Fraction): boolean {
		return this.valueOf() < f2.valueOf();
	}

	/**
	 * checks if this fraction is greater than or equal to f2
	 * @param f2 number or fraction to compare against
	 */
	isAtLeast(f2: number | Fraction): boolean {
		return this.isGreaterThan(f2) || this.isEqualTo(f2);
	}

	/**
	 * checks if this fraction is less than or equal to f2
	 * @param f2 number or fraction to compare against
	 */
	isAtMost(f2: number | Fraction): boolean {
		return this.isLessThan(f2) || this.isEqualTo(f2);
	}

	/**
	 * ceiling function
	 * @returns the least integer greater than or equal to this fraction in Fraction form
	 */
	ceil(): Fraction {
		return new Fraction(Math.ceil(this.valueOf()));
	}
	/**
	 * floor function
	 * @returns the greatest integer less than or equal to this fraction in Fraction form
	 */
	floor(): Fraction {
		return new Fraction(Math.floor(this.valueOf()));
	}
	/**
	 * rounding function
	 *
	 * round off this fraction to the nearest integer, and
	 * @returns the value in Fraction form
	 */
	round(): Fraction {
		return new Fraction(Math.round(this.valueOf()));
	}
	/**
	 * sign function
	 *
	 * @returns the sign of this fraction
	 */
	sign(): number {
		return Math.sign(this.valueOf());
	}

	/**
	 * converts to Javascript built-in Number type
	 * @returns the float representation of this fraction in the JavaScript number format
	 */
	valueOf(): number {
		return this.num / this.den;
	}

	/**
	 * invokes the JavaScript `Number.prototype.toFixed()` method
	 */
	toFixed(digits?: number): string {
		return this.valueOf().toFixed(digits);
	}
	/**
	 * invokes the JavaScript `Number.prototype.toPrecision()` method
	 */
	toPrecision(precision?: number): string {
		return this.valueOf().toPrecision(precision);
	}

	/**
	 * `toString()` method
	 *
	 * @returns the LaTeX string representation of the fraction
	 */
	toString(): string {
		if (this.isInteger()) {
			return this.num < 0 ? `- ${Math.abs(this.num)}` : `${this.num}`;
		}
		// fraction
		const sign = this.num < 0 ? '- ' : '';
		return `${sign}\\frac{${Math.abs(this.num)}}{${this.den}}`;
	}

	/**
	 * toJSON method that allows for quick reconstruction of class instance
	 * by storing its constructor arguments
	 */
	toJSON(): { type: string; args: [number, number] } {
		return {
			type: 'fraction',
			args: [this.num, this.den],
		};
	}

	/**
	 * clones the Fraction: creating a new Fraction instance
	 */
	clone(): Fraction {
		return new Fraction(this.num, this.den);
	}

	/**
	 * the fraction class instance of 1
	 */
	static ONE = new Fraction(1);
	/**
	 * the fraction class instance of 0
	 */
	static ZERO = new Fraction(0);

	/**
	 * @returns gcd of given fractions
	 */
	static gcd(...fractions: (number | Fraction)[]): Fraction {
		if (fractions.length === 0) {
			throw new Error('Fraction ERROR: gcd function must have at least one argument');
		} else if (fractions.length === 1) {
			const fraction = toFraction(fractions[0]);
			return fraction;
		} else if (fractions.length === 2) {
			const fraction1 = toFraction(fractions[0]);
			const fraction2 = toFraction(fractions[1]);
			const gcdNum = gcd(fraction1.num, fraction2.num);
			const gcdDen = gcd(fraction1.den, fraction2.den);
			const lcmDen = Math.abs(fraction1.den * fraction2.den) / gcdDen;
			return new Fraction(gcdNum, lcmDen);
		} else {
			// recursively call this method
			const [fraction1, fraction2, ...restOfFractions] = fractions;
			return fraction1.valueOf() === 0 && fraction2.valueOf() === 0
				? Fraction.gcd(0, ...restOfFractions)
				: Fraction.gcd(Fraction.gcd(fraction1, fraction2), ...restOfFractions);
		}
	}

	/**
	 * given a set of fractions (a, b, c, ..., n)
	 * @returns an array `[[A, B, C, ..., N], k ]`,
	 * where k(A, B, C, ..., N) = (a, b, c, ..., n)
	 */
	static factorize(...fractions: (number | Fraction)[]): [Fraction[], Fraction] {
		let gcd = Fraction.gcd(...fractions);
		let simplifiedArray = fractions.map((fraction) => {
			fraction = toFraction(fraction);
			return fraction.divide(gcd);
		});
		if (simplifiedArray.reduce((acc, current) => acc && current.valueOf() <= 0, true)) {
			simplifiedArray = simplifiedArray.map((fraction) => fraction.negative());
			gcd = gcd.negative();
		}
		return [simplifiedArray, gcd];
	}
}
