import { expect, it } from 'vitest';
import { answer } from './q4.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{ body: mathlify`[Sketch](#soln-1).` },
		{ body: mathlify`Least value of ${{}} {k=0.}` },
		{
			body: mathlify`${{}} fg(x) = \\frac{\\left(x-3\\right)^2}{\\left(4-x\\right)\\left(x-2\\right)}.`,
		},
		{
			body: mathlify`${{}} {2 < x < 3}
or ${{}} {3 < x < 4.}`,
		},
		{
			body: mathlify`${{}} R_{fg} = \\left(-\\infty, -1\\right) \\cup \\left( 0, \\infty \\right).`,
		},
	],
};
it('2010p2q4', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
