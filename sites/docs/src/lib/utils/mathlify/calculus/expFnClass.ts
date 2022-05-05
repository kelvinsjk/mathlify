import { Polynomial, Term, toFraction, type Fraction } from 'mathlify';
import { PolynomialFn } from './polynomialFnClass';

/**
 * k e^f(x) function, where f(x) is a polynomial
 */
export class ExpFn {
	coefficient: Fraction;
	numericalFn: (x: number) => number;
	fx: PolynomialFn;

	constructor(fx: string | Polynomial | PolynomialFn = 'x', coefficient: number | Fraction = 1) {
		this.coefficient = toFraction(coefficient);
		let fxFn: PolynomialFn;
		if (typeof fx === 'string') {
			fxFn = new PolynomialFn([1, 0], { variableAtom: fx });
		} else if (fx instanceof Polynomial) {
			fxFn = new PolynomialFn(fx.coefficients, { variableAtom: fx.variableAtom, ascending: true });
			if (fx instanceof Polynomial && !fx.ascending) {
				fxFn.changeAscending();
			}
		} else {
			fxFn = fx;
		}
		this.numericalFn = (x: number) => Math.exp(fxFn.numericalFn(x)) * this.coefficient.valueOf();
		this.fx = fxFn;
	}

	/**
	 * differentiates the exponential term
	 */
	derivative(): ExpFn | [PolynomialFn, ExpFn] {
		if (this.fx.degree === 1) {
			return new ExpFn(this.fx.clone(), this.coefficient.times(this.fx.coefficients[1]));
		}
		return [this.fx.derivative(), this.clone()];
	}

	/**
	 * integrates the exponential: only valid if f(x) is linear
	 *
	 * assumes constant of integration is 0
	 */
	integral(): ExpFn {
		if (this.fx.degree > 1) {
			throw new Error(`integral only valid for linear fx. ${this.fx} invalid`);
		}
		return new ExpFn(this.fx.clone(), this.coefficient.divide(this.fx.coefficients[1]));
	}

	/**
	 * @returns the definite integral
	 */
	definiteIntegral(lower: number | Fraction, upper: number | Fraction): number {
		return (
			this.integral().numericalFn(upper.valueOf()) - this.integral().numericalFn(lower.valueOf())
		);
	}

	multiply(k: number | Fraction): ExpFn {
		return new ExpFn(this.fx.clone(), this.coefficient.times(k));
	}

	/**
	 * returns latex string
	 */
	toString(): string {
		const term = new Term(this.coefficient, `\\mathrm{e}^{${this.fx}}`);
		return term.toString();
	}

	/**
	 * clone
	 */
	clone(): ExpFn {
		return new ExpFn(this.fx.clone(), this.coefficient.clone());
	}
}
