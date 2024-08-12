import { expect, it } from 'vitest';
import { answer } from './q3.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			parts: [
				{ body: mathlify`${{}} gh\\left(2\\right) = \\frac{1}{4}.` },
				{ body: mathlify`${{}} x = \\frac{2}{5}.` },
			],
		},
		{
			parts: [
				{
					body: mathlify`${{}} k = -\\frac{b}{2}.
\\
It must be excluded as ${'f'}
is not defined when ${{}} {x = -\\frac{b}{2}.}`,
				},
				{
					body: mathlify`${{}} b=-1.
\\
${{}} a \\in \\mathbb{R}, a \\neq -\\frac{1}{2}.`,
				},
				{ body: mathlify`${{}} f^{-1}(-4) = \\frac{4-a}{9}.` },
			],
		},
	],
};

it('2021p2q3', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
