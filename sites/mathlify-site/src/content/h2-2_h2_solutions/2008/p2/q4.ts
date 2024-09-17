import { Answer } from '$lib/classes/answer';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Polynomial, sum } from 'mathlify';
import { quadraticInverse } from '$content/h2-1_h2_learn/01_functions/02_inverse/03_formula/02_practice';
import { inverseRelationshipSolver } from '$content/h2-1_h2_learn/01_functions/02_inverse/05_relationship/02_practice-1';
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
		inclusive: false
	},
	definition: false,
	unknownConstants: false
};
const f = sum([new Polynomial([1, a]), '^', 2], b);

// a
{
	const soln = `\`\`\` =html\n${svg}\n\`\`\`\n\n`;
	const ans = mathlifier`[Sketch](#soln-1).`;
	answer.addPart(ans, soln);
}
// b
{
	const { ans, soln } = quadraticInverse(state, f);
	answer.addPart(ans, soln);
}
// c
{
	const soln = `\`\`\` =html\n${svg2}\n\`\`\`\n\n`;
	const ans = mathlifier`[Sketch](#soln-3).`;
	answer.addPart(ans, soln);
}
// d
{
	const { ans, soln } = inverseRelationshipSolver(state, f, { lineQED: true });
	//const soln = '';
	const ansLine = mathlifier`Line ${'y=x'}.`;
	answer.addPart(ansLine + '\n\n' + ans, soln);
}
