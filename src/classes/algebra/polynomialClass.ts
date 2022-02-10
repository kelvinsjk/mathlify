import { pTerm } from './termClasses';
import { xExpression } from './expressionClasses';
import { Fraction } from '../fractionClass';
import toFraction from '../../utils/toFraction';

/**
 * Polynomial class representing "ax^n + bx^n-1 + ... + k"
 */
export class Polynomial extends xExpression {
	/** array of coefficients in ascending order, starting from constant term */
	coefficients: Fraction[];
	/** whether polynomial in ascending or descending order */
	ascending: boolean;
	/** degree of the polynomial */
	degree: number;
	/** variable name (e.g. "x") */
	variableAtom: string;

	/**
	 * Creates a new Polynomial instance
	 * @param coefficients array of coefficients
	 * @param options defaults to `{ascending: false, degree: coeffs.length-1, variableAtom: 'x'}`
	 */
	constructor(coefficients: (number | Fraction)[], options?: Partial<PolynomialOptions>) {
		const polyOptions: PolynomialOptions = {
			ascending: false,
			degree: coefficients.length - 1,
			variableAtom: 'x',
			...options,
		};
		if (polyOptions.degree < 0 || polyOptions.degree < coefficients.length - 1) {
			throw new RangeError('degree must be greater than coefficients.length-1');
		}
		// reverse coefficient array if descending order
		if (!polyOptions.ascending) {
			coefficients.reverse();
		}
		// add extra zeros to start from constant term
		if (polyOptions.degree > coefficients.length - 1) {
			const extraCoeffLength = polyOptions.degree - coefficients.length + 1;
			coefficients = [...createZeroArray(extraCoeffLength), ...coefficients];
		}
		// convert to Fraction type
		let coeffs = coefficients.map((k) => toFraction(k));
		// remove unnecessary terms (leading coefficients should be non-zero, unless it is a constant polynomial)
		while (coeffs[coeffs.length - 1].isEqualTo(0) && coeffs.length > 1) {
			coeffs = coeffs.slice(0, coeffs.length - 1);
		}
		// generate pTerms
		const polynomialTerms = coeffs.map((coeff, n) => {
			return new pTerm(coeff, { variableAtom: polyOptions.variableAtom, n });
		});
		// descending order typesetting if necessary;
		if (!polyOptions.ascending) {
			polynomialTerms.reverse();
		}
		super(...polynomialTerms);
		this.coefficients = coeffs;
		this.degree = coeffs.length - 1;
		this.variableAtom = polyOptions.variableAtom;
		this.ascending = polyOptions.ascending;
	}

	/** add two polynomials
	 *
	 * fraction/numbers will be converted a "constant polynomial", while a string will be converted to a polynomial term with coefficient 1
	 */
	add(p2: number | Fraction | string | Polynomial): Polynomial {
		p2 = toPolynomial(p2);
		const degree = Math.max(this.degree, p2.degree);
		const thisCoeffs = [...this.coefficients, ...createZeroArray(degree - this.degree)];
		const p2Coeffs = [...p2.coefficients, ...createZeroArray(degree - p2.degree)];
		const newCoeffs = thisCoeffs.map((thisCoeff, i) => thisCoeff.plus(p2Coeffs[i]));
		if (!this.ascending) {
			newCoeffs.reverse();
		}
		return new Polynomial(newCoeffs, { ascending: this.ascending, degree });
	}

	/** multiplies two polynomials */
	multiply(p2: number | Fraction | string | Polynomial): Polynomial {
		p2 = toPolynomial(p2);
		const degree = this.degree + p2.degree;
		const coeffs = createZeroArray(degree + 1);
		for (let i = 0; i < this.coefficients.length; i++) {
			for (let j = 0; j < p2.coefficients.length; j++) {
				coeffs[i + j] = coeffs[i + j].plus(this.coefficients[i].times(p2.coefficients[j]));
			}
		}
		if (!this.ascending) {
			coeffs.reverse();
		}
		return new Polynomial(coeffs, { ascending: this.ascending, degree, variableAtom: this.variableAtom });
	}

	/** subtracts this by p2 */
	subtract(p2: number | Fraction | string | Polynomial): Polynomial {
		p2 = toPolynomial(p2);
		return this.add(p2.multiply(-1));
	}

	/**
	 * exponentiation
	 * @returns this polynomial taken to a power of `n`
	 */
	pow(n: number): Polynomial {
		if (!(Number.isInteger(n) && n >= 0)) {
			throw new RangeError(`only non-negative integers allowed for n (${n} received)`);
		}
		let newPoly = new Polynomial([1], { variableAtom: this.variableAtom });
		for (let i = 0; i < n; i++) {
			newPoly = newPoly.multiply(this);
		}
		return newPoly;
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
		this.xTerms.reverse();
		this.terms.reverse();
		this.ascending = ascending;
		return this;
	}

	/** clones this polynomial */
	clone(): Polynomial {
		const coeffs = [...this.coefficients];
		if (this.ascending) {
			coeffs.reverse();
		}
		return new Polynomial(coeffs, { ascending: this.ascending, degree: this.degree, variableAtom: this.variableAtom });
	}
}

interface PolynomialOptions {
	ascending: boolean;
	degree: number;
	variableAtom: string;
}

function createZeroArray(n: number): Fraction[] {
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
		return new Polynomial([1, 0], { variableAtom: p2 });
	}
	return p2;
}
