import { Answer } from '$content/solutions/answerObject';
import { mathlify } from '$lib/mathlifier';
import { Polynomial, sum } from 'mathlify';
import { logInverse } from '$content/learn/h2/fns/02-inverse/03-formula.practice';
import { inverseRelationshipSolver } from '$content/learn/h2/fns/02-inverse/05-relationship.practice';
import svg from '$static/images/h2/fns/2011p2q3.svg?raw';
import { logTerm } from 'mathlify/fns';

export const answer = new Answer();

// ! Complete
// ln(2x+1) + 3

const argument = new Polynomial([2, 1]);
const b = 3;
const yMinusB = sum('y', -b);
const f = sum(logTerm(argument), b);

// a
{
	const { ans, soln } = logInverse(f, argument, yMinusB);
	answer.addPart(ans, soln);
}
// b
{
	const soln = svg;
	const ans = mathlify`[Sketch](#soln-2).`;
	answer.addPart(ans, soln);
}
// c
const state = {
	fnType: 'log',
	a: 1,
	c: 2,
	b: 3,
} as const;
{
	const { ans, soln } = inverseRelationshipSolver(state, f, {
		precision: 4,
		tys2011ExtraStep: true,
	});
	answer.addPart(ans, soln);
}
