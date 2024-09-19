import { expect, it } from 'vitest';
import { answer } from './q3';
import { mathlifierDj as mathlifier } from 'mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			parts: [
				{ body: mathlifier`${{}} gh\\left(2\\right) = \\frac{1}{4}.` },
				{ body: mathlifier`${{}} x = \\frac{2}{5}.` }
			]
		},
		{
			parts: [
				{
					body: mathlifier`${{}} k = - \\frac{b}{2}.
\\
It must be excluded as ${'f'}
is not defined when ${{}} {x = - \\frac{b}{2}.}`
				},
				{
					body: mathlifier`${{}} b = -1.
\\
${{}} a \\in \\mathbb{R}, a \\neq - \\frac{1}{2}.`
				},
				{ body: mathlifier`${{}} f^{-1}(-4) = \\frac{4 - a}{9}.` }
			]
		}
	]
};

it('2021p2q3', () => {
	expect(ans).toEqual(actual);
	expect(answer).toMatchSnapshot();
});
