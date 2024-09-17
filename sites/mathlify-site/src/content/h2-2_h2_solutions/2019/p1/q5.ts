import { Answer } from '$lib/classes/answer';
import { Expression, expTerm, Polynomial, sum } from 'mathlify';
import { expInverse } from '$content/h2-1_h2_learn/01_functions/02_inverse/03_formula/02_practice';
import { generateAns as solveFgx } from '$content/h2-1_h2_learn/01_functions/03_composite/05_compose-inverse/02_practice';

export const answer = new Answer();

// ! Complete

// e^(2x) - 4
// x + 2

const [a, b, c] = [2, -4, 2];
const ax = Polynomial.ofDegree(1, { coeff: a });
const f = sum(expTerm(ax), b);
//const g = new Polynomial([1, c]);
const yMinusB = sum('y', -b);

// i
let fInv: Expression;
{
	const { ans, soln, exp } = expInverse(f, ax, yMinusB, { b });
	fInv = exp;
	answer.addPart(ans, soln);
}
// ii
{
	const x = 5;
	const { ans, soln } = solveFgx({ a, b, c, rhs: x, fnType: 'exp' }, fInv, { qed: true });
	answer.addPart(ans, soln);
}
