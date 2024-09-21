import { Expression, expressionToPolynomial, Polynomial, quotient, sum } from 'mathlify';
import { gcd } from 'mathlify';
import { sqrtTerm } from 'mathlify/fns';
import { EquationWorking } from 'mathlify/working';

// ax + b + c / (dx+e)
// a,d non-zero
// ac/d = k: 1,4,9, 2,3,5
// c = kd / a
// a divides kd

export const rationalQns: [number[], Expression][] = [];
export const surd2Qns: [number[], Expression][] = [];
export const surd3Qns: [number[], Expression][] = [];
export const surd5Qns: [number[], Expression][] = [];

for (let a = 1; a <= 4; a++) {
	//if (a === 0) continue;
	for (let b = -4; b <= 4; b++) {
		for (let d = -4; d <= 4; d++) {
			if (d === 0) continue;
			for (let e = -4; e <= 4; e++) {
				if (signedGcd(d, e) !== 1) continue;
				for (let f = 1; f <= 6; f++) {
					const k = f < 6 ? f : 9;
					if ((k * d) % a !== 0) continue;
					const c = (k * d) / a;
					const den = new Polynomial([d, e]);
					if (d < 0) den.ascending = true;
					const num = den.times(new Polynomial([a, b])).plus(c);
					if (k === 1 || k === 4 || k === 9) {
						const root1 = sum(sqrtTerm([a * c, '/', d], { coeff: -2 }), [-e * a, '/', d], b);
						const root2 = sum(sqrtTerm([a * c, '/', d], { coeff: 2 }), [-e * a, '/', d], b);
						if (
							[
								root1.abs()._getNumeral().number.num,
								root1.abs()._getNumeral().number.den,
								root2.abs()._getNumeral().number.num,
								root2.abs()._getNumeral().number.den
							].some((n) => n > 10)
						)
							continue;
						rationalQns.push([[a, b, c, d, e], quotient(num, den)]);
					} else {
						const exp = quotient(num, den);
						const working = new EquationWorking('y', exp);
						working.crossMultiply().expand().makeRhsZero();
						let xPoly = expressionToPolynomial(working.eqn.lhs, 'x');
						if (new Expression(xPoly.leadingCoefficient).is.negative()) {
							xPoly = xPoly.negative({ expand: true });
						}
						working.addCustomStep(xPoly);
						const discriminant = expressionToPolynomial(
							working.eqn.lhs,
							'x'
						).quadraticDiscriminant();
						const working2 = new EquationWorking(discriminant, 0, { sign: '>=' });
						working2.expand();
						const d2 = expressionToPolynomial(working2.eqn.lhs, 'y').quadraticDiscriminant();
						if (d2.valueOf() > 100) continue;
						if (k === 2) {
							surd2Qns.push([[a, b, c, d, e], exp]);
						} else if (k === 3) {
							surd3Qns.push([[a, b, c, d, e], exp]);
						} else if (k === 5) {
							surd5Qns.push([[a, b, c, d, e], exp]);
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
	rationalQns.length + surd2Qns.length + surd3Qns.length + surd5Qns.length
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
