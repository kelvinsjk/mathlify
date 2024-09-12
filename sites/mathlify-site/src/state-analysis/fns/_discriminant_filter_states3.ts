import { Answer } from '$lib/classes/answer';
import { Expression, expressionToPolynomial, Polynomial, quotient } from 'mathlify';
import { gcd } from 'mathlify';
import { Sqrt } from 'mathlify/fns';
import { EquationWorking } from 'mathlify/working';

export const answer = new Answer();

// (dx+e) / (c^2-a^2x^2)
// a,c positive. d non-zero

export const rationalQns: [number[], Expression][] = [];
export const surd2Qns: [number[], Expression][] = [];
export const surd3Qns: [number[], Expression][] = [];
export const surd5Qns: [number[], Expression][] = [];
export const surd6Qns: [number[], Expression][] = [];
export const surd7Qns: [number[], Expression][] = [];
export const surd10Qns: [number[], Expression][] = [];
export const surd15Qns: [number[], Expression][] = [];

for (let a = 1; a <= 4; a++) {
	//if (a === 0) continue;
	for (let c = 1; c <= 5; c++) {
		if (signedGcd(a, c) !== 1) continue;
		for (let d = -5; d <= 5; d++) {
			if (d === 0) continue;
			for (let e = -5; e <= 5; e++) {
				if (signedGcd(d, e) !== 1) continue;
				if (Math.abs(c * d) >= Math.abs(a * e)) continue;
				const variables = [a, c, d, e];
				const den = new Polynomial([c * c, 0, -a * a], { ascending: true });
				const num = new Polynomial([e, d], { ascending: true });
				const exp = quotient(num, den);
				const working = new EquationWorking('y', exp);
				working.crossMultiply().expand().makeRhsZero();
				const discriminant = expressionToPolynomial(working.eqn.lhs, 'x').quadraticDiscriminant();
				const working2 = new EquationWorking(discriminant, 0, { sign: '>=' });
				working2.expand();
				const d2 = expressionToPolynomial(working2.eqn.lhs, 'y').quadraticDiscriminant();
				const surdTerm = new Sqrt(d2).simplify();
				if (surdTerm.type === 'numeral') {
					// get roots
					const hide = true;
					const working = new EquationWorking('y', exp);
					working.crossMultiply().expand().makeRhsZero({ hide });
					let xPoly = expressionToPolynomial(working.eqn.lhs, 'x');
					if (new Expression(xPoly.leadingCoefficient).is.negative()) {
						xPoly = xPoly.negative({ expand: true });
					}
					working.addCustomStep(xPoly);
					const discriminant = expressionToPolynomial(working.eqn.lhs, 'x').quadraticDiscriminant();
					const working2 = new EquationWorking(discriminant, 0, { sign: '>=' });
					working2.expand();
					if (
						new Expression(
							expressionToPolynomial(working2.eqn.lhs, 'y').leadingCoefficient
						).is.negative()
					) {
						working2.times(-1, { expand: true });
					}
					const { roots } = working2.solve.quadraticInequality('y');
					const [root1, root2] = roots;
					if (
						[
							root1.abs()._getNumeral().number.num,
							root1.abs()._getNumeral().number.den,
							root2.abs()._getNumeral().number.num,
							root2.abs()._getNumeral().number.den
						].some((n) => n > 10)
					)
						continue;
					rationalQns.push([variables, exp]);
					rationalQns.push([variables, exp]);
				} else {
					if (d2.valueOf() >= 300) continue;
					let radicand: number;
					if (surdTerm.type === 'fn') {
						radicand = surdTerm.argument._getNumeral().valueOf();
					} else if (surdTerm.type === 'product') {
						const surdNode = surdTerm.factors[0].node;
						if (surdNode.type !== 'fn') throw new Error('not a surd');
						radicand = surdNode.argument._getNumeral().valueOf();
					} else {
						throw new Error('did not expect a quotient here');
					}
					if (
						radicand === 2 ||
						radicand === 3 ||
						radicand === 5 ||
						radicand === 6 ||
						radicand === 7 ||
						radicand === 10 ||
						radicand === 15
					) {
						if (radicand === 2) {
							surd2Qns.push([variables, exp]);
						} else if (radicand === 3) {
							surd3Qns.push([variables, exp]);
						} else if (radicand === 5) {
							surd5Qns.push([variables, exp]);
						} else if (radicand === 6) {
							surd6Qns.push([variables, exp]);
						} else if (radicand === 7) {
							surd7Qns.push([variables, exp]);
						} else if (radicand === 10) {
							surd10Qns.push([variables, exp]);
						} else if (radicand === 15) {
							surd15Qns.push([variables, exp]);
						}
					}
				}
			}
		}
	}
}

console.log(
	rationalQns.length,
	surd2Qns.length,
	surd3Qns.length,
	surd5Qns.length,
	surd6Qns.length,
	surd7Qns.length,
	surd10Qns.length,
	surd15Qns.length
);

function someNegative(...numbers: number[]): boolean {
	return numbers.some((n) => n < 0);
}
function allNonPositive(...numbers: number[]): boolean {
	return numbers.every((n) => n <= 0);
}
function signedGcd(...numbers: number[]): number {
	const d = gcd(...numbers);
	return allNonPositive(...numbers) && someNegative(...numbers) ? -d : d;
}
