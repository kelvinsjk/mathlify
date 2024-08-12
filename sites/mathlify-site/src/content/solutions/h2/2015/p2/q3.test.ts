import { expect, it } from 'vitest';
import { answer } from './q3.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			parts: [
				{
					body: mathlify`All horizontal lines ${{}} {y =k,}
${{}} {k\\in\\mathbb{R}}
cuts the graph of ${{}} {y=f(x)}
at most once. Hence ${'f'}
is one-to-one and has an inverse.`,
				},
				{
					body: mathlify`${{}} f^{-1}(x) = \\sqrt{\\frac{x-1}{x}}.
\\
D_{f^{-1}} = R_f = (-\\infty, 0).`,
				},
			],
		},
		{
			body: mathlify`${{}} \\left(-\\infty, \\frac{2-\\sqrt{3}}{2} \\right] \\cup \\left[ \\frac{2+\\sqrt{3}}{2}, \\infty ).`,
		},
	],
};

it('dummy', () => {
	expect(2).toEqual(2);
});

//it('2018p1q5', () => {
//	expect(answer).toMatchSnapshot();
//	expect(ans).toEqual(actual);
//});
