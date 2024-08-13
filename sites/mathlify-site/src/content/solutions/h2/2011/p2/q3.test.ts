import { expect, it } from 'vitest';
import { answer } from './q3.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlify`${{}} f^{-1}(x) = \\frac{\\mathrm{e}^{x-3} - 1}{2}.
\\
${{}} D_{f^{-1}} = R_f = \\left(-\\infty, \\infty\\right).`,
		},
		{ body: mathlify`[Sketch](#soln-2).` },
		{ body: mathlify`${{}} x = -0.4847, 5.482.` },
	],
};
it('2011p2q3', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
