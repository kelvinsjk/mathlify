import { type Fraction, Polynomial, Expression } from 'mathlify';

/**
 * at the moment support between 2 to 4 distinct roots
 *
 * @param roots: Fractions representing the roots
 * @param sign '<' or '>'
 * @returns solutions
 */
export function solveInequalities(sign: string, ...roots: (Fraction | number)[]): string[] {
	const solutions: string[] = [];
	const sortedRoots = roots.sort((a, b) => a.valueOf() - b.valueOf());
	const n = sortedRoots.length;
	if (sign === '<') {
		solutions.push(`${sortedRoots[n - 2]} < x < ${sortedRoots[n - 1]}`);
		if (n === 3) {
			solutions.push(`x < ${sortedRoots[0]}`);
		} else if (n === 4) {
			solutions.push(`${sortedRoots[0]} < x < ${sortedRoots[1]}`);
		}
	} else {
		solutions.push(`x > ${sortedRoots[n - 1]}`);
		if (n === 2) {
			solutions.push(`x < ${sortedRoots[0]}`);
		} else {
			solutions.push(`${sortedRoots[n - 3]} < x < ${sortedRoots[n - 2]}`);
			if (n === 4) {
				solutions.push(`x < ${sortedRoots[0]}`);
			}
		}
	}
	solutions.reverse();
	return solutions;
}

/**
 * currently only support monic quadratic
 */
export function completeSquare(poly: Polynomial): string {
	const [c, b, a] = poly.coefficients;
	if (poly.degree !== 2 || !a.isEqualTo(1)) {
		throw new Error(`${poly}: only monic quadratic supported at the moment`);
	}
	const perfectSquare = new Polynomial([1, b.divide(2)], { variableAtom: poly.variableAtom });
	const firstTerm = `\\left(${perfectSquare}\\right)^2`;
	const secondTerm = c.minus(b.divide(2).square());
	const exp = new Expression(firstTerm, secondTerm);
	return `${exp}`;
}
