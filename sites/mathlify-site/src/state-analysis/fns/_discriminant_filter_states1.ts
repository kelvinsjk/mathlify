import { Expression, expressionToPolynomial, Polynomial, quotient } from 'mathlify';
import { gcd } from 'mathlify';
import { Sqrt } from 'mathlify/fns';
import { EquationWorking } from 'mathlify/working';

// dx+e / (ax^2+bx+c)
// b^2 - 4ax < 0
// a non-zero
// d,e not simultaneously zero

const qns: [number[], Expression][] = [];

for (let a = 1; a <= 4; a++) {
	//if (a === 0) continue;
	for (let b = -4; b <= 4; b++) {
		for (let c = -4; c <= 4; c++) {
			if (b * b - 4 * a * c >= 0) continue;
			if (signedGcd(a, b, c) !== 1) continue;
			for (let d = -4; d <= 4; d++) {
				if (d === 0) continue;
				for (let e = -4; e <= 4; e++) {
					if (signedGcd(d, e) !== 1) continue;
					const ascending = a < 0 || d < 0;
					const num = new Polynomial([d, e]);
					const den = new Polynomial([a, b, c]);
					num.ascending = ascending;
					den.ascending = ascending;
					qns.push([[a, b, c, d, e], quotient(num, den)]);
				}
			}
		}
	}
}

export const rationalQns: [number[], Expression][] = [];
export const surd2Qns: [number[], Expression][] = [];
export const surd3Qns: [number[], Expression][] = [];
export const surd5Qns: [number[], Expression][] = [];
const surd6Questions: [number[], Expression][] = [];

for (const [variables, exp] of qns) {
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
			new Expression(expressionToPolynomial(working2.eqn.lhs, 'y').leadingCoefficient).is.negative()
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
	} else {
		if (d2.valueOf() >= 100) continue;
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
		if (radicand === 2 || radicand === 3 || radicand === 5 || radicand === 6 || radicand === 7) {
			if (radicand === 2) {
				surd2Qns.push([variables, exp]);
			} else if (radicand === 3) {
				surd3Qns.push([variables, exp]);
			} else if (radicand === 5) {
				surd5Qns.push([variables, exp]);
			} else if (radicand === 6) {
				surd6Questions.push([variables, exp]);
			}
		}
	}
}

console.log(
	qns.length,
	rationalQns.length,
	surd2Qns.length,
	surd3Qns.length,
	surd5Qns.length,
	surd6Questions.length,
	rationalQns.length + surd2Qns.length + surd3Qns.length + surd5Qns.length + surd6Questions.length
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
