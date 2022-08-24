import { Expression } from './expressionClass';
import { Unknown } from '../basic/unknownClass';
import { Fraction } from '../fractionClass';
import { numberToFraction } from '../utils/numberToFraction';

/**
 * Polynomial class representing "ax^n + bx^n-1 + ... + k"
 */
export class Polynomial extends Expression {
	/** array of coefficients in ascending order, starting from constant term */
	coeffs: Fraction[];
	/** whether polynomial in ascending or descending order */
	ascending: boolean;
	/** degree of the polynomial */
	degree: number;
	/** variable name (e.g. "x") */
	unknown: string;

	/**
	 * Creates a new Polynomial instance
	 * @param coeffs array of coefficients
	 * @param options defaults to `{ascending: false, degree: coeffs.length-1, unknown: 'x'}`
	 */
	constructor(coeffs: (number | Fraction)[], options?: { ascending?: boolean; degree?: number; unknown?: string }) {
		const { unknown, ascending, degree } = {
			ascending: false,
			degree: coeffs.length - 1,
			unknown: 'x',
			...options,
		};
		if (degree < 0 || degree < coeffs.length - 1) {
			throw new RangeError('degree must be greater than coefficients.length-1');
		}
		// reverse coefficient array if descending order
		if (!ascending) {
			coeffs = [...coeffs].reverse();
		}
		// add extra zeros to start from constant term
		if (degree > coeffs.length - 1) {
			const extraCoeffLength = degree - coeffs.length + 1;
			coeffs = [...createZeroArray(extraCoeffLength), ...coeffs];
		}
		// convert to Fraction type
		let coeffsFrac = coeffs.map(numberToFraction);
		// remove unnecessary terms (leading coefficients should be non-zero, unless it is a constant polynomial)
		while (coeffsFrac[coeffsFrac.length - 1].isEqualTo(0) && coeffsFrac.length > 1) {
			coeffsFrac.pop();
		}
		// generate unknown terms
		const polynomialTerms = coeffsFrac.map((coeff, n) => {
			return new Unknown(coeff, { unknown, n });
		});
		// descending order typesetting if necessary;
		if (!ascending) {
			polynomialTerms.reverse();
		}
		super(...polynomialTerms);
		this.coeffs = coeffsFrac;
		this.degree = coeffsFrac.length - 1;
		this.unknown = unknown;
		this.ascending = ascending;
	}

	/** add two polynomials
	 *
	 * fraction/numbers will be converted a "constant polynomial", while a string will be converted to a polynomial term with coefficient 1
	 */
	plus(p2: number | Fraction | string | Polynomial): Polynomial {
		p2 = toPolynomial(p2);
		const degree = Math.max(this.degree, p2.degree);
		const thisCoeffs = [...this.coeffs, ...createZeroArray(degree - this.degree)];
		const p2Coeffs = [...p2.coeffs, ...createZeroArray(degree - p2.degree)];
		const newCoeffs = thisCoeffs.map((thisCoeff, i) => thisCoeff.plus(p2Coeffs[i]));
		if (!this.ascending) {
			newCoeffs.reverse();
		}
		return new Polynomial(newCoeffs, { unknown: this.unknown, ascending: this.ascending, degree });
	}

	/** multiplies two polynomials */
	times(p2: number | Fraction | string | Polynomial): Polynomial {
		p2 = toPolynomial(p2);
		const degree = this.degree + p2.degree;
		const coeffs = createZeroArray(degree + 1);
		for (let i = 0; i < this.coeffs.length; i++) {
			for (let j = 0; j < p2.coeffs.length; j++) {
				coeffs[i + j] = coeffs[i + j].plus(this.coeffs[i].times(p2.coeffs[j]));
			}
		}
		if (!this.ascending) {
			coeffs.reverse();
		}
		return new Polynomial(coeffs, { ascending: this.ascending, degree, unknown: this.unknown });
	}

	/** negative of this polynomial */
	negative(): Polynomial {
		return this.times(-1);
	}

	/**
	 * divide by a *scalar*
	 */
	divide(p2: number | Fraction): Polynomial {
		p2 = numberToFraction(p2);
		return this.times(p2.reciprocal());
	}

	/** subtracts this by p2 */
	minus(p2: number | Fraction | string | Polynomial): Polynomial {
		p2 = toPolynomial(p2);
		return this.plus(p2.times(-1));
	}

	/**
	 * exponentiation
	 * @returns this polynomial taken to a power of `n`
	 */
	pow(n: number): Polynomial {
		if (!(Number.isInteger(n) && n >= 0)) {
			throw new RangeError(`only non-negative integers allowed for n (${n} received)`);
		}
		let newPoly = new Polynomial([1], { unknown: this.unknown });
		for (let i = 0; i < n; i++) {
			newPoly = newPoly.times(this);
		}
		return newPoly;
	}

	/**
	 * replace x with a new polynomial
	 * @param x if string, replaces the unknown
	 */
	replaceXWith(x: string | Polynomial): Polynomial {
		x = typeof x === 'string' ? new Polynomial([1, 0], { unknown: x }) : x;
		return this.coeffs.reduce(
			(prev, coeff, i) => prev.plus((<Polynomial>x).pow(i).times(coeff)),
			new Polynomial([0], { ascending: this.ascending, unknown: x.unknown }),
		);
	}

	/**
	 * square
	 *
	 * @returns the square of this polynomial
	 *  */
	square(): Polynomial {
		return this.pow(2);
	}

	/**
	 * changes ascending/behavior of polynomial
	 *
	 * @param ascending sets ascending behavior. By default, this
	 * option is set to toggle current ascending/descending behavior
	 *
	 * @returns a reference to this polynomial instance
	 *
	 * WARNING: mutates current instance
	 */
	changeAscending(ascending = !this.ascending): this {
		if (this.ascending === ascending) {
			return this;
		}
		this.terms.reverse();
		this.ascending = ascending;
		return this;
	}

	/** derivative of the polynomial */
	differentiate(): Polynomial {
		if (this.degree === 0) {
			return new Polynomial([0]);
		}
		const newCoeffs = this.coeffs.map((coeff, i) => coeff.times(i)).slice(1);
		const newPoly = new Polynomial(newCoeffs, { ascending: true, unknown: this.unknown });
		return this.ascending ? newPoly : newPoly.changeAscending();
	}

	/** integral of the polynomial
	 * @param options `{c, x1, y1}` where we can put in the integration constant c (defaults to 0),
	 * or a point on the curve (x1, y1).
	 */
	integrate(options?: { c?: number | Fraction; x1?: number | Fraction; y1?: number | Fraction }): Polynomial {
		if (this.degree === 0) {
			return new Polynomial([0]);
		}
		const newCoeffs = [0, ...this.coeffs.map((coeff, i) => coeff.divide(i + 1))];
		const newPoly = new Polynomial(newCoeffs, { ascending: true, unknown: this.unknown });
		const { x1, y1 } = {
			...options,
		};
		let c = options?.c ?? 0;
		if (x1 !== undefined && y1 !== undefined) {
			c = newPoly.subIn(x1).negative().plus(y1);
		}
		const polyWithC = newPoly.plus(c);
		return this.ascending ? polyWithC : polyWithC.changeAscending();
	}

	/** checks if two polynomials are equal: i.e., coefficient array is the same and same unknown */
	isEqualTo(poly2: Polynomial): boolean {
		if (this.unknown === poly2.unknown) {
			if (this.coeffs.length === poly2.coeffs.length) {
				let valid = true;
				this.coeffs.forEach((coeff, i) => {
					if (!coeff.isEqualTo(poly2.coeffs[i])) {
						valid = false;
					}
				});
				return valid;
			}
		}
		return false;
	}

	/** clones this polynomial */
	clone(): Polynomial {
		const coeffs = [...this.coeffs];
		if (!this.ascending) {
			// coeffs in ascending by default
			coeffs.reverse();
		}
		return new Polynomial(coeffs, { ascending: this.ascending, degree: this.degree, unknown: this.unknown });
	}

	/**
	 * toJSON method that allows for quick reconstruction of class instance
	 * by storing its constructor arguments
	 */
	toJSON(): { type: string; args: [Fraction[], { ascending: boolean; degree: number; unknown: string }] } {
		const coeffs = this.coeffs.map((e) => e.clone());
		if (!this.ascending) {
			coeffs.reverse();
		}
		return {
			type: 'polynomial',
			args: [coeffs, { ascending: this.ascending, degree: this.degree, unknown: this.unknown }],
		};
	}
}

export function createZeroArray(n: number): Fraction[] {
	let zeroArray: Fraction[] = [];
	for (let i = 0; i < n; i++) {
		zeroArray.push(Fraction.ZERO);
	}
	return zeroArray;
}

function toPolynomial(p2: number | Fraction | string | Polynomial): Polynomial {
	if (typeof p2 === 'number' || p2 instanceof Fraction) {
		return new Polynomial([p2]);
	}
	if (typeof p2 === 'string') {
		return new Polynomial([1, 0], { unknown: p2 });
	}
	return p2;
}
