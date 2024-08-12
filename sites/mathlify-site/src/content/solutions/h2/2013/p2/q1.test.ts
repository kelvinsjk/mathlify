import { expect, it } from 'vitest';
import { answer } from './q1.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlify`${{}} fg
does not exist as ${{}} {R_{g} \\not \\subseteq D_{f}.}`,
		},
		{
			body: mathlify`${{}} gf(x) = \\frac{-3-3x}{1-x}.

${{}} (gf)^{-1}(5) = 4.`,
		},
	],
};

it('2013p2q1', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
