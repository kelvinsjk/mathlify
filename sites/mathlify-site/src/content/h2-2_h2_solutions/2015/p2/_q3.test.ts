import { expect, it } from 'vitest';
import { answer } from './q3';
import { mathlifierDj as mathlifier } from 'mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			parts: [
				{
					body: mathlifier`All horizontal lines ${{}}{y=k, k \\in \\mathbb{R},}
cuts the graph of ${{}}{y=f(x)}
at most once. Hence ${'f'}
is  one-to-one and has an inverse.`
				},
				{
					body: mathlifier`${{}} f^{-1}(x) = \\sqrt{\\frac{x - 1}{x}}.
\\
${{}} D_{f^{-1}} = R_{f} = \\left( -\\infty, 0 \\right).`
				}
			]
		},
		{
			body: mathlifier`${{}} \\left( -\\infty, \\frac{2 - \\sqrt{3}}{2} \\right] \\allowbreak \\cup \\left[ \\frac{2 + \\sqrt{3}}{2}, \\infty \\right).`
		}
	]
};

it('2015p2q3', () => {
	expect(ans).toEqual(actual);
	expect(answer).toMatchSnapshot();
});
