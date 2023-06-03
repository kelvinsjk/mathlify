import { Fraction, Expression, numberToFraction, Term, Polynomial } from '../core';

/**
 * Polynomial class representing "ax^n + bx^n-1 + ... + k"
 */
export class xPolynomial extends Expression {
	/** array of coefficients in ascending order, starting from constant term */
	coeffs: Expression[];
	/** whether polynomial in ascending or descending order */
	ascending: boolean;
	/** degree of the polynomial */
	degree: number;
	/** variable name (e.g. "x") */
	variable: string;

	/**
	 * Creates a new Polynomial instance
	 * @param coeffs array of coefficients. if a number/fraction is provided, will create the polynomial "kx".
	 * @param options defaults to `{ascending: false, degree: coeffs.length-1, variable: 'x'}`
	 */
	constructor(
		coeffs: (number | Fraction | string | Expression)[] | (number | Fraction),
		options?: { ascending?: boolean; degree?: number; variable?: string },
	) {
		if (!Array.isArray(coeffs)) {
			coeffs = options?.ascending ? [0, coeffs] : [coeffs, 0];
		}
		const { variable, ascending, degree } = {
			ascending: false,
			degree: coeffs.length - 1,
			variable: 'x',
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
		let coeffsFrac = coeffs.map(toExpression);
		// remove unnecessary terms (leading coefficients should be non-zero, unless it is a constant polynomial)
		while (`${coeffsFrac[coeffsFrac.length - 1]}` === '0' && coeffsFrac.length > 1) {
			coeffsFrac.pop();
		}
		// generate unknown terms
		const polynomialTerms = coeffsFrac.map((coeff, n) => {
			return coeff.times(new Term(variable, n));
		});
		// descending order typesetting if necessary;
		if (!ascending) {
			polynomialTerms.reverse();
		}
		const polynomialExpressions: Expression[] = [...polynomialTerms];
		let terms: Term[] = [];
		polynomialExpressions.forEach((e) => {
			terms.push(...e.terms);
		});
		super(...terms);
		this.coeffs = coeffsFrac;
		this.degree = coeffsFrac.length - 1;
		this.variable = variable;
		this.ascending = ascending;
	}

	/** add two polynomials
	 *
	 * fraction/numbers will be converted a "constant polynomial", while a string will be converted to a polynomial term with coefficient 1
	 */
	plus(p2: number | Fraction | string | Polynomial | xPolynomial | Expression): xPolynomial {
		const p2x = toXPolynomial(p2);
		const [higherPoly, lowerPoly] = this.degree >= p2x.degree ? [this, p2x] : [p2x, this];
		const newCoeffs = higherPoly.coeffs.map((thisCoeff, i) => {
			if (lowerPoly.coeffs[i] === undefined) {
				return thisCoeff;
			} else {
				return thisCoeff.plus(lowerPoly.coeffs[i]);
			}
		});
		if (!this.ascending) {
			newCoeffs.reverse();
		}
		return new xPolynomial(newCoeffs, { variable: this.variable, ascending: this.ascending });
	}

	/** multiplies two polynomials */
	times(p2: number | Fraction | string | Polynomial | xPolynomial | Expression): xPolynomial {
		const p2x = toXPolynomial(p2);
		const degree = this.degree + p2x.degree;
		const coeffs = createZeroArray(degree + 1);
		for (let i = 0; i < this.coeffs.length; i++) {
			for (let j = 0; j < p2x.coeffs.length; j++) {
				coeffs[i + j] = coeffs[i + j].plus(this.coeffs[i].times(p2x.coeffs[j]));
			}
		}
		if (!this.ascending) {
			coeffs.reverse();
		}
		return new xPolynomial(coeffs, { ascending: this.ascending, degree, variable: this.variable });
	}

	/** negative of this polynomial */
	negative(): xPolynomial {
		return this.times(-1);
	}

	/**
	 * divide by a *scalar*
	 */
	divide(p2: number | Fraction): xPolynomial {
		p2 = numberToFraction(p2);
		return this.times(p2.reciprocal());
	}

	/** subtracts this by p2 */
	minus(p2: number | Fraction | string | Polynomial | xPolynomial): xPolynomial {
		p2 = toXPolynomial(p2);
		return this.plus(p2.times(-1));
	}

	/**
	 * exponentiation
	 * @returns this polynomial taken to a power of `n`
	 */
	pow(n: number): xPolynomial {
		if (!(Number.isInteger(n) && n >= 0)) {
			throw new RangeError(`only non-negative integers allowed for n (${n} received)`);
		}
		let newPoly = new xPolynomial([1], { variable: this.variable, ascending: this.ascending });
		for (let i = 0; i < n; i++) {
			newPoly = newPoly.times(this);
		}
		return newPoly;
	}

	/**
	 * replace x with a new polynomial
	 * @param x if string, replaces the unknown
	 */
	replaceXWith(x: string | Polynomial | xPolynomial): xPolynomial {
		const xPoly = typeof x === 'string' ? new xPolynomial([1, 0], { variable: x }) : toXPolynomial(x);
		let poly = new xPolynomial([0], { ascending: this.ascending, variable: this.variable });
		this.coeffs.forEach((coeff, i) => {
			poly = poly.plus(xPoly.pow(i).times(coeff));
		});
		return poly;
	}

	/**
	 * square
	 *
	 * @returns the square of this polynomial
	 *  */
	square(): xPolynomial {
		return this.pow(2);
	}

	/**
	 * @returns an ascending polynomial only up until degree n
	 */
	concatenate(n: number): xPolynomial {
		const coeffs = this.coeffs.slice(0, n + 1);
		return new xPolynomial(coeffs, { ascending: this.ascending, variable: this.variable });
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
	differentiate(): xPolynomial {
		if (this.degree === 0) {
			return new xPolynomial([0]);
		}
		const newCoeffs = this.coeffs.map((coeff, i) => coeff.times(i)).slice(1);
		const newPoly = new xPolynomial(newCoeffs, { ascending: true, variable: this.variable });
		return this.ascending ? newPoly : newPoly.changeAscending();
	}

	///** integral of the polynomial
	// * @param options `{c, x1, y1}` where we can put in the integration constant c (defaults to 0),
	// * or a point on the curve (x1, y1).
	// */
	//integrate(options?: { c?: number | Fraction; x1?: number | Fraction; y1?: number | Fraction }): xPolynomial {
	//	if (this.degree === 0) {
	//		return new xPolynomial([0]);
	//	}
	//	const newCoeffs = [0, ...this.coeffs.map((coeff, i) => coeff.divide(i + 1))];
	//	const newPoly = new Polynomial(newCoeffs, { ascending: true, variable: this.variable });
	//	const { x1, y1 } = {
	//		...options,
	//	};
	//	let c = options?.c ?? 0;
	//	if (x1 !== undefined && y1 !== undefined) {
	//		c = newPoly.subIn(x1).negative().plus(y1);
	//	}
	//	const polyWithC = newPoly.plus(c);
	//	return this.ascending ? polyWithC : polyWithC.changeAscending();
	//}

	/** checks if two polynomials are equal: i.e., coefficient array is the same and same unknown */
	isEqualTo(poly2: xPolynomial): boolean {
		if (this.variable === poly2.variable) {
			if (this.coeffs.length === poly2.coeffs.length) {
				let valid = true;
				this.coeffs.forEach((coeff, i) => {
					if (!(`${coeff}` === `${poly2.coeffs[i]}`)) {
						valid = false;
					}
				});
				return valid;
			}
		}
		return false;
	}

	/** clones this polynomial */
	clone(): xPolynomial {
		const coeffs = [...this.coeffs];
		if (!this.ascending) {
			// coeffs in ascending by default
			coeffs.reverse();
		}
		return new xPolynomial(coeffs, { ascending: this.ascending, degree: this.degree, variable: this.variable });
	}

	//	/**
	//	 * toJSON method that allows for quick reconstruction of class instance
	//	 * by storing its constructor arguments
	//	 */
	//	toJSON(): { type: string; args: [Fraction[], { ascending: boolean; degree: number; unknown: string }] } {
	//		const coeffs = this.coeffs.map((e) => e.clone());
	//		if (!this.ascending) {
	//			coeffs.reverse();
	//		}
	//		return {
	//			type: 'polynomial',
	//			args: [coeffs, { ascending: this.ascending, degree: this.degree, unknown: this.unknown }],
	//		};
	//	}
}

function createZeroArray(n: number): Expression[] {
	let zeroArray: Expression[] = [];
	for (let i = 0; i < n; i++) {
		zeroArray.push(new Expression(0));
	}
	return zeroArray;
}

function toXPolynomial(p2: number | Fraction | string | Polynomial | xPolynomial | Expression): xPolynomial {
	if (p2 instanceof xPolynomial) {
		return p2;
	}
	if (p2 instanceof Polynomial) {
		const newXPoly = new xPolynomial(p2.coeffs, { ascending: true, variable: p2.variable });
		return p2.ascending ? newXPoly : newXPoly.changeAscending();
	}
	return new xPolynomial([p2]);
}

function toExpression(x: number | Fraction | string | Expression) {
	if (x instanceof Expression) {
		return x;
	}
	return new Expression(x);
}
