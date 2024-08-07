import { Answer } from '$content/solutions/answerObject';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import { Expression, expTerm, Polynomial, quotient, sum } from 'mathlify';
import { expInverse } from '$content/learn/h2/fns/02-inverse/03-formula.practice';
import { EquationWorking } from 'mathlify/working';
import { logTerm } from 'mathlify/fns';

export const answer = new Answer();

// ! Complete

// e^(2x) - 4
// x + 2

const [a, b] = [2, -4];
const ax = Polynomial.ofDegree(1, { coeff: a });
const f = sum(expTerm(ax), b);
const g = new Polynomial([1, 2]);
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
	const rhs = fInv.subIn({ x }, { verbatim: true });
	const working = new EquationWorking(g, rhs);
	working.simplify();
	working.addCustomStep(
		g,
		quotient(logTerm([3, '^', 2], { verbatim: true }), 2, { verbatim: true }),
	);
	working.addCustomStep(g, quotient([2, logTerm(3)], 2, { verbatim: true }));
	working.simplify();
	const { root } = working.solve.linear('x');
	const soln = mathlifyQED`$${'gather*'}
fg(x) = ${x}
\\\\ g(x) = f^{-1}(${x})
\\\\ ${working}`;
	const ans = mathlify`${{}} x = ${root}.`;
	answer.addPart(ans, soln);
}
