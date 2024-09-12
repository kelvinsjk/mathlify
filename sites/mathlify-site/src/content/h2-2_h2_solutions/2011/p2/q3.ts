import { Answer } from '$lib/classes/answer';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Polynomial, sum } from 'mathlify';
import { logInverse } from '$content/h2-1_h2_learn/01_functions/02_inverse/03_formula/02_practice';
import { inverseRelationshipSolver } from '$content/h2-1_h2_learn/01_functions/02_inverse/05_relationship/02_practice-1';
import svg from '$static/images/h2/fns/2011p2q3b.svg?raw';
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
	const soln = `\`\`\` =html\n${svg}\n\`\`\`\n\n`;
	const ans = mathlifier`[Sketch](#soln-2).`;
	answer.addPart(ans, soln);
}
// c
const state = {
	fnType: 'log',
	a: 1,
	c: 2,
	b: 3
} as const;
{
	const { ans, soln } = inverseRelationshipSolver(state, f, {
		precision: 4,
		tys2011ExtraStep: true
	});
	answer.addPart(ans, soln);
}
