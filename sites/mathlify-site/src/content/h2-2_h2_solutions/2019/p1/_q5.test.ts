import { expect, it } from 'vitest';
import { answer } from './q5';
import { mathlifierDj as mathlifier } from 'mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlifier`${{}} f^{-1}(x) = \\frac{\\ln \\left(x+4\\right)}{2}.
\\
${{}} D_{f^{-1}} = R_f = \\left( -4, \\infty\\right).`
		},
		{ body: mathlifier`${{}} x = \\ln 3 - 2.` }
	]
};

it('2019p1q5', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
