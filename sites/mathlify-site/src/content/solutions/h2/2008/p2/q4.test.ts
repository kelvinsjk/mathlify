import { expect, it } from 'vitest';
import { answer } from './q4.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{ body: mathlify`[Sketch](#soln-1).` },
		{
			body: mathlify`${{}} f^{-1}(x) = \\sqrt{x-1} + 4.
\\
${{}} D_{f^{-1}} = R_f = \\left(1, \\infty\\right).`,
		},
		{ body: mathlify`[Sketch](#soln-3).` },
		{
			body: mathlify`Line ${'y=x.'}

${{}} x = \\frac{9+\\sqrt{13}}{2}.`,
		},
	],
};
it('2008p2q4', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
