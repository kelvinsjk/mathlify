import { Answer } from '$content/solutions/answerObject';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import {
	generateAns,
	generateFracFnDefinition,
} from '$content/learn/h2/fns/04-more/01-self-inverse.practice';

export const answer = new Answer();

// TODO: sketch (ii), transformations (iii)
// f(x) = ax/(bx-a)
// g(x) = 1/x

const fState: Parameters<typeof generateFracFnDefinition>[0] = {
	// (bx+k)/(cx+a)
	fnType: 'frac',
	b: 1,
	c: 1,
	k: 'k',
	n: 2,
	show: true,
};
const fExp = generateFracFnDefinition(fState, { for: true })[1];
// a
{
	const { ans, soln } = generateAns(fState, fExp, 'g');
	answer.addPart(
		ans +
			mathlify`${{}}R_{f^2} = \\left( -\\infty, \\frac{a}{b} \\right) \\cup \\left( \\frac{a}{b}, \\infty \\right).`,
		soln,
	);
}
// b
{
	const soln = 'svg';
	const ans = mathlify`[Sketch](#soln-2)`;
	answer.addPart(ans, soln);
}
// c
{
	const ans = mathlify`Line ${{}} {y=x.}`;
	const soln = mathlifyQED``;
	answer.addPart(ans, soln);
}
