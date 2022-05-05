import { Fraction, Polynomial, SquareRoot, Term, toFraction } from 'mathlify';
import { PolynomialFn } from './polynomialFnClass';
import type { Angle } from '../complex/angleClass';

/**
 * k sin f(x) function, where f(x) is a polynomial
 */
export class SinFn {
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
		this.numericalFn = (x: number) => Math.sin(fxFn.numericalFn(x)) * this.coefficient.valueOf();
		this.fx = fxFn;
	}

	/**
	 * differentiates the exponential term
	 */
	derivative(): CosFn | [PolynomialFn, CosFn] {
		if (this.fx.degree === 1) {
			return new CosFn(this.fx.clone(), this.coefficient.times(this.fx.coefficients[1]));
		}
		return [this.fx.derivative(), new CosFn(this.fx.clone(), this.coefficient)];
	}

	multiply(k: number | Fraction): SinFn {
		return new SinFn(this.fx.clone(), this.coefficient.times(k));
	}

	/**
	 * integrates the exponential: only valid if f(x) is linear
	 *
	 * assumes constant of integration is 0
	 */
	integral(): CosFn {
		if (this.fx.degree > 1) {
			throw new Error(`integral only valid for linear fx. ${this.fx} invalid`);
		}
		return new CosFn(this.fx.clone(), this.coefficient.divide(this.fx.coefficients[1]).times(-1));
	}

	/**
	 * @returns the definite integral
	 */
	definiteIntegral(lower: number | Fraction, upper: number | Fraction): number {
		return (
			this.integral().numericalFn(upper.valueOf()) - this.integral().numericalFn(lower.valueOf())
		);
	}

	/**
	 * @returns special ratios
	 *
	 * only works for sin nx at the moment
	 */
	subXAs(x: Angle): SquareRoot {
		let surd: SquareRoot;
		let deg = x.times(this.fx.coefficients[1].valueOf()).degrees.valueOf();
		if (deg > 90 && deg <= 180) {
			// second quadrant
			deg = 180 - deg;
		}
		if (deg >= 0 && deg <= 90) {
			if (deg === 0) {
				surd = new SquareRoot(0);
			} else if (deg === 30) {
				surd = new SquareRoot(1, new Fraction(1, 2));
			} else if (deg === 45) {
				surd = new SquareRoot(2, new Fraction(1, 2));
			} else if (deg === 60) {
				surd = new SquareRoot(3, new Fraction(1, 2));
			} else if (deg === 90) {
				surd = new SquareRoot(1);
			} else {
				throw new Error(`${deg} not a special angle`);
			}
		} else {
			// third and fourth quadrant
			deg = deg <= -90 ? deg + 180 : deg < 0 ? -deg : deg;
			if (deg === 0) {
				surd = new SquareRoot(0);
			} else if (deg === 30) {
				surd = new SquareRoot(1, new Fraction(-1, 2));
			} else if (deg === 45) {
				surd = new SquareRoot(2, new Fraction(-1, 2));
			} else if (deg === 60) {
				surd = new SquareRoot(3, new Fraction(-1, 2));
			} else if (deg === 90) {
				surd = new SquareRoot(1, -1);
			} else {
				throw new Error(`${deg} not a special angle`);
			}
		}
		return surd.times(this.coefficient);
	}

	toTerm(): Term {
		return new Term(this.coefficient, `\\sin ${this.fx}`);
	}

	/**
	 * returns latex string
	 */
	toString(): string {
		return this.toTerm().toString();
	}

	/**
	 * clone
	 */
	clone(): SinFn {
		return new SinFn(this.fx.clone(), this.coefficient.clone());
	}
}

/**
 * k sin f(x) function, where f(x) is a polynomial
 */
export class CosFn {
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
		this.numericalFn = (x: number) => Math.cos(fxFn.numericalFn(x)) * this.coefficient.valueOf();
		this.fx = fxFn;
	}

	/**
	 * differentiates the exponential term
	 */
	derivative(): SinFn | [PolynomialFn, SinFn] {
		if (this.fx.degree === 1) {
			return new SinFn(this.fx.clone(), this.coefficient.times(this.fx.coefficients[1]).times(-1));
		}
		return [this.fx.derivative(), new SinFn(this.fx.clone(), this.coefficient.times(-1))];
	}

	/**
	 * integrates the exponential: only valid if f(x) is linear
	 *
	 * assumes constant of integration is 0
	 */
	integral(): SinFn {
		if (this.fx.degree > 1) {
			throw new Error(`integral only valid for linear fx. ${this.fx} invalid`);
		}
		return new SinFn(this.fx.clone(), this.coefficient.divide(this.fx.coefficients[1]));
	}

	/**
	 * @returns the definite integral
	 */
	definiteIntegral(lower: number | Fraction, upper: number | Fraction): number {
		return (
			this.integral().numericalFn(upper.valueOf()) - this.integral().numericalFn(lower.valueOf())
		);
	}

	/**
	 * @returns special ratios
	 *
	 */
	subXAs(x: Angle): SquareRoot {
		let surd: SquareRoot;
		let deg = x.times(this.fx.coefficients[1].valueOf()).degrees.valueOf();
		if (deg < 0 && deg >= -90) {
			// fourth quadrant
			deg = -deg;
		}
		if (deg >= 0 && deg <= 90) {
			if (deg === 0) {
				surd = new SquareRoot(1);
			} else if (deg === 30) {
				surd = new SquareRoot(3, new Fraction(1, 2));
			} else if (deg === 45) {
				surd = new SquareRoot(2, new Fraction(1, 2));
			} else if (deg === 60) {
				surd = new SquareRoot(1, new Fraction(1, 2));
			} else if (deg === 90) {
				surd = new SquareRoot(0);
			} else {
				throw new Error(`${x} not a special angle`);
			}
		} else {
			// second and third quadrants
			deg = deg > 90 ? 180 - deg : deg > 180 ? 180 + deg : deg;
			if (deg === 0) {
				surd = new SquareRoot(1, -1);
			} else if (deg === 30) {
				surd = new SquareRoot(3, new Fraction(-1, 2));
			} else if (deg === 45) {
				surd = new SquareRoot(2, new Fraction(-1, 2));
			} else if (deg === 60) {
				surd = new SquareRoot(1, new Fraction(-1, 2));
			} else if (deg === 90) {
				surd = new SquareRoot(0);
			} else {
				throw new Error(`${x} not a special angle`);
			}
		}
		return surd.times(this.coefficient);
	}

	multiply(k: number | Fraction): CosFn {
		return new CosFn(this.fx.clone(), this.coefficient.times(k));
	}

	toTerm(): Term {
		return new Term(this.coefficient, `\\cos ${this.fx}`);
	}

	/**
	 * returns latex string
	 */
	toString(): string {
		return this.toTerm().toString();
	}

	/**
	 * clone
	 */
	clone(): CosFn {
		return new CosFn(this.fx.clone(), this.coefficient.clone());
	}
}
