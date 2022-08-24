import { Polynomial, Fraction, numberToFraction } from '../core';
import { solveLinear, solveQuadratic, longDivide } from '../polynomialMethods';

/**
 * function representing f(x) / g(x) where f, g are polynomials
 * Does not consider repeated roots at the moment
 */
export class Rational {
	/** numerator */
	num: Polynomial;
	/** denominator */
	den: Polynomial;
	/** Rational poles of the function */
	poles: Fraction[];

	/**
	 * Creates a new Rational class
	 * @param options defaults to `{ poles: [] }` Poles are automatically determined for degree at most 2.
	 */
	constructor(
		num: Polynomial | number | Fraction,
		den: Polynomial | Fraction | number = 1,
		options?: { poles?: (number | Fraction)[] },
	) {
		// identify unknown
		let unknown = 'x';
		if (num instanceof Polynomial) {
			if (den instanceof Polynomial) {
				if (num.unknown !== den.unknown) {
					console.warn(
						`different unknowns detected for numerator and denominator. Will use numerator's ${num.unknown}`,
					);
				}
				unknown = num.unknown;
			} else {
				if (den instanceof Polynomial) {
					unknown = den.unknown;
				}
			}
		}
		// change to Polynomials
		if (typeof num === 'number' || num instanceof Fraction) {
			num = new Polynomial([num], { unknown });
		}
		if (typeof den === 'number' || den instanceof Fraction) {
			den = new Polynomial([den], { unknown });
		}
		const poles = assignPoles(den, options?.poles);
		// check for common factors
		let newPoles = poles.map((x) => x);
		poles.forEach((x) => {
			const numerator = num as Polynomial;
			if (numerator.subIn(x).isEqualTo(0)) {
				({ quotient: num } = longDivide(<Polynomial>num, new Polynomial([1, x.negative()], { unknown })));
				({ quotient: den } = longDivide(<Polynomial>den, new Polynomial([1, x.negative()], { unknown })));
				newPoles = newPoles.filter((y) => !y.isEqualTo(x));
			}
		});
		this.num = num.clone();
		this.den = den.clone();
		this.poles = poles;
	}

	/** Addition */
	plus(rational2: number | Fraction | Polynomial | Rational): Rational {
		if (typeof rational2 === 'number' || rational2 instanceof Fraction) {
			rational2 = new Polynomial([rational2], { unknown: this.num.unknown });
		}
		if (rational2 instanceof Polynomial) {
			return new Rational(this.num.plus(rational2.times(this.den)), this.den, { poles: this.poles });
		}
		let commonDivisor = new Polynomial([1], { unknown: this.num.unknown });
		let sharesCommonDivisor = false;
		const f = rational2.den;
		this.poles.forEach((x) => {
			if (f.subIn(x).isEqualTo(0)) {
				commonDivisor = commonDivisor.times(new Polynomial([1, x.negative()], { unknown: this.num.unknown }));
				sharesCommonDivisor = true;
			}
		});
		if (sharesCommonDivisor) {
			const { quotient: multiple1 } = longDivide(rational2.den, commonDivisor);
			const { quotient: multiple2 } = longDivide(this.den, commonDivisor);
			const den = this.den.times(multiple1);
			return new Rational(this.num.times(multiple1).plus(rational2.num.times(multiple2)), den, {
				poles: [...this.poles, ...rational2.poles],
			});
		} else {
			return new Rational(
				this.num.times(rational2.den).plus(rational2.num.times(this.den)),
				this.den.times(rational2.den),
				{ poles: [...this.poles, ...rational2.poles] },
			);
		}
	}

	negative(): Rational {
		return new Rational(this.num.negative(), this.den, { poles: this.poles });
	}

	/** subtraction */
	minus(rational2: number | Fraction | Polynomial | Rational): Rational {
		if (typeof rational2 === 'number' || rational2 instanceof Fraction) {
			rational2 = new Polynomial([rational2], { unknown: this.num.unknown });
		}
		return this.plus(rational2.negative());
	}

	/** multiplication */
	times(rational2: number | Fraction | Polynomial | Rational): Rational {
		if (typeof rational2 === 'number' || rational2 instanceof Fraction) {
			rational2 = new Polynomial([rational2], { unknown: this.num.unknown });
		}
		if (rational2 instanceof Polynomial) {
			rational2 = new Rational(rational2);
		}
		return new Rational(this.num.times(rational2.num), this.den.times(rational2.den), {
			poles: [...this.poles, ...rational2.poles],
		});
	}

	reciprocal(): Rational {
		return new Rational(this.den, this.num);
	}

	/** division */
	divide(rational2: number | Fraction | Polynomial | Rational): Rational {
		if (typeof rational2 === 'number' || rational2 instanceof Fraction) {
			rational2 = new Polynomial([rational2], { unknown: this.num.unknown });
		}
		if (rational2 instanceof Polynomial) {
			rational2 = new Rational(rational2);
		}
		return this.times(rational2.reciprocal());
	}

	/**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the terms
	 */
	toString(): string {
		if (this.den.degree === 0) {
			const f = this.num.divide(this.den.coeffs[0]);
			return `${f}`;
		} else {
			return `\\frac{ ${this.num} }{ ${this.den} }`;
		}
	}
}

function assignPoles(den: Polynomial, providedPoles?: (number | Fraction)[]): Fraction[] {
	if (den.degree === 0) {
		return [];
	} else if (den.degree === 1) {
		return [solveLinear(den)];
	} else if (den.degree === 2) {
		const roots = solveQuadratic(den);
		if (roots[0] instanceof Fraction) {
			return <Fraction[]>roots;
		}
	} else {
		// degree 3 and above
		if (providedPoles) {
			const poles: Fraction[] = [];
			const f = den;
			// check if poles are valid
			providedPoles.forEach((x) => {
				if (f.subIn(x).isEqualTo(0)) {
					poles.push(numberToFraction(x));
				} else {
					throw new Error(`Provided pole ${x} is incorrect for denominator ${f}`);
				}
			});
			return poles;
		}
	}
	return [];
}
