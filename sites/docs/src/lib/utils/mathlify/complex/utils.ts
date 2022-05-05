import type { ComplexPolar } from './complexPolarClass';
import { Polynomial, SquareRoot, type Fraction } from 'mathlify';
import { cos, sin } from './trigFns';
import { Complex } from './complexClass';
import { solveQuadratic } from '../polynomials';

export function toCartesianString(z: ComplexPolar): string {
	const x = cos(z.theta).times(z.r);
	const y = sin(z.theta).times(z.r);
	const imaginaryTerm = new SquareRootTerm(y, '\\mathrm{i}');
	if (x.isEqualTo(0)) {
		return `${imaginaryTerm}`;
	}
	if (y.isEqualTo(0)) {
		return `${x}`;
	}
	// complex number
	return y.coeff.isGreaterThan(0) ? `${x} + ${imaginaryTerm}` : `${x} ${imaginaryTerm}`;
}

class SquareRootTerm {
	coeff: SquareRoot;
	variable: string;

	constructor(coeff: SquareRoot, variable: string) {
		this.coeff = coeff;
		this.variable = variable;
	}

	toString(): string {
		if (this.coeff.isEqualTo(0)) {
			return '0';
		}
		if (this.coeff.isEqualTo(1)) {
			return this.variable === '' ? '1' : `${this.variable}`;
		}
		if (this.coeff.isEqualTo(-1)) {
			return this.variable === '' ? '- 1' : `- ${this.variable}`;
		}

		// non 0/1/-1 coefficient
		if (this.variable === '') {
			// constant term
			return `${this.coeff}`;
		}

		// variable term and non 0/1/-1 coefficient
		return `${this.coeff} ${this.variable}`;
	}
}

/**
 * solves a quadratic equation
 *
 */
export function solveQuadraticComplex(
	poly: Polynomial,
): [Fraction, Fraction] | [number, number] | [Complex, Complex] {
	if (poly.degree !== 2) {
		throw new Error(`only quadratic polynomials can be solved`);
	}
	const [c, b, a] = poly.coefficients;
	const discriminant = b.square().minus(a.times(c).times(4));
	if (discriminant.valueOf() < 0) {
		const imaginaryPart = new SquareRoot(discriminant.negative());
		if (!imaginaryPart.isRational()) {
			throw new Error(`${imaginaryPart}i irrational imaginary roots not supported yet`);
		}
		const y = imaginaryPart.toFraction().divide(2).divide(a);
		const x = b.negative().divide(2).divide(a);
		return [new Complex(x, y), new Complex(x, y.negative())];
	}
	// real roots
	return solveQuadratic(poly);
}

export function solveQuadraticWorking(
	poly: Polynomial,
): [string, [Fraction, Fraction] | [number, number] | [Complex, Complex]] {
	const [c, b, a] = poly.coefficients;
	const bBrackets = b.isLessThan(0) ? `(${b})` : `${b}`;
	const roots = solveQuadraticComplex(poly);
	const working = `&= \\frac{-${bBrackets}\\pm\\sqrt{${bBrackets}^2-4(${a})(${c})}}{2(${a})}\\\\ 
	&= \\frac{${b.negative()}\\pm\\sqrt{${b.square().minus(a.times(c).times(4))}}}{${a.times(2)}}\\\\`;
	return [working, roots];
}

export function toQuadraticFactor(z: Complex, variableAtom = 'z'): Polynomial {
	return new Polynomial([1, z.x.times(-2), z.modulusSquared()], { variableAtom });
}
