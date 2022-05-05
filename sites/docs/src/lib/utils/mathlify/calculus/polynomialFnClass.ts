import { Polynomial, type Fraction } from 'mathlify';

/**
 * adds calculus methods to polynomials
 */
export class PolynomialFn extends Polynomial {
	numericalFn: (x: number) => number;

	constructor(coefficients: (number | Fraction)[], options?: Partial<PolynomialOptions>) {
		super(coefficients, options);
		this.numericalFn = (x: number) =>
			this.coefficients.reduce((prev, coeff, i) => prev + coeff.valueOf() * Math.pow(x, i), 0);
	}

	/**
	 * differentiates the polynomial
	 */
	derivative(): PolynomialFn {
		const newCoeffs = this.coefficients.map((coeff, i) => coeff.times(i)).slice(1);
		const derivative = new PolynomialFn(newCoeffs, {
			variableAtom: this.variableAtom,
			ascending: true,
		});
		return derivative.changeAscending(this.ascending);
	}

	/**
	 * integrates the polynomial
	 * @param C constant of integration: defaults to 0
	 */
	integral(C: number | Fraction = 0): PolynomialFn {
		const newCoeffs = [C, ...this.coefficients.map((coeff, i) => coeff.divide(i + 1))];
		const integral = new PolynomialFn(newCoeffs, {
			variableAtom: this.variableAtom,
			ascending: true,
		});
		return integral.changeAscending(this.ascending);
	}

	/**
	 * @returns the definite integral
	 */
	definiteIntegral(lower: number | Fraction, upper: number | Fraction): Fraction {
		return this.integral().subXAs(upper).minus(this.integral().subXAs(lower));
	}

	/**
	 * clones this Polynomial Fn
	 */
	clone(): PolynomialFn {
		const clonedPolynomial = new PolynomialFn(
			this.coefficients.map((c) => c.clone()),
			{
				variableAtom: this.variableAtom,
				ascending: true,
			},
		);
		return clonedPolynomial.changeAscending(this.ascending);
	}
}

interface PolynomialOptions {
	ascending: boolean;
	degree: number;
	variableAtom: string;
}
