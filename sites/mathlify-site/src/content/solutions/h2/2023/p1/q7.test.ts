import { expect, it } from 'vitest';
import { answer } from './q7.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{ body: mathlify`[Sketch](#soln-1).` },
		{ body: mathlify`${{}} R_f = \\left[0, \\infty\\right).` },
		{
			body: mathlify`${{}} f^2
does not exist as ${{}} {R_{f} \\not \\subseteq D_{f}.}`,
		},
		{ body: mathlify`Greatest value of ${{}} {a = -2.}` },
		{
			body: mathlify`${{}} f^{-1}(x) = \\frac{3x+4}{x-2}.
\\
${{}} D_{f^{-1}} = R_f = \\left[0, 2\\right).`,
		},
	],
};

it('2023p1q7', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
