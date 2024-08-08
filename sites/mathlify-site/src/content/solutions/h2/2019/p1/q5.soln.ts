import { Answer } from '$content/solutions/answerObject';
import { Expression, expTerm, Polynomial, sum } from 'mathlify';
import { expInverse } from '$content/learn/h2/fns/02-inverse/03-formula.practice';
import { generateAns as solveFgx } from '$content/learn/h2/fns/03-composite/05-compose-inverse.practice';

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
	const { ans, soln } = solveFgx({ a, b, c, rhs: x, fnType: 'exp' }, fInv);
	answer.addPart(ans, soln);
}
