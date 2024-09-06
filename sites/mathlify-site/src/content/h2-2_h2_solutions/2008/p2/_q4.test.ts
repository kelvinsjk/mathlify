import { expect, it } from 'vitest';
import { answer } from './q4';
import { mathlifierDj as mathlifier } from 'mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{ body: mathlifier`[Sketch](#soln-1).` },
		{
			body: mathlifier`${{}} f^{-1}(x) = \\sqrt{x-1} + 4.
\\
${{}} D_{f^{-1}} = R_f = \\left(1, \\infty\\right).`
		},
		{ body: mathlifier`[Sketch](#soln-3).` },
		{
			body: mathlifier`Line ${'y=x.'}

${{}} x = \\frac{9+\\sqrt{13}}{2}.`
		}
	]
};
it('2008p2q4', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
