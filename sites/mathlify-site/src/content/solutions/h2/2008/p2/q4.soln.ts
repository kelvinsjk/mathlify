import { Answer } from '$content/solutions/answerObject';
import { mathlify } from '$lib/mathlifier';
import { Polynomial, sum } from 'mathlify';
import { quadraticInverse } from '$content/learn/h2/fns/02-inverse/03-formula.practice';
import { inverseRelationshipSolver } from '$content/learn/h2/fns/02-inverse/05-relationship.practice';
import svg from '$static/images/h2/fns/2008p2q4a.svg?raw';
import svg2 from '$static/images/h2/fns/2008p2q4c.svg?raw';

export const answer = new Answer();

// ! Complete
// (x-4)^2 + 1

const [a, b, x] = [-4, 1, 4];
const state: Parameters<typeof quadraticInverse>[0] &
	Parameters<typeof inverseRelationshipSolver>[0] = {
	fnType: 'quadratic',
	a,
	b,
	c: 0,
	restriction: {
		type: 'right',
		x,
		inclusive: false,
	},
	definition: false,
	unknownConstants: false,
};
const f = sum([new Polynomial([1, a]), '^', 2], b);

// a
{
	const soln = svg;
	const ans = mathlify`[Sketch](#soln-1).`;
	answer.addPart(ans, soln);
}
// b
{
	const { ans, soln } = quadraticInverse(state, f);
	answer.addPart(ans, soln);
}
// c
{
	const soln = svg2;
	const ans = mathlify`[Sketch](#soln-3).`;
	answer.addPart(ans, soln);
}
// d
{
	const { ans, soln } = inverseRelationshipSolver(state, f, { lineQED: true });
	//const soln = '';
	const ansLine = mathlify`Line ${'y=x'}.`;
	answer.addPart(ansLine + ans, soln);
}
