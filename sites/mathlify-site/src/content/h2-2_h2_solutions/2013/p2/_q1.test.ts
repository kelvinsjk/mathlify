import { expect, it } from 'vitest';
import { answer } from './q1';
import { mathlifierDj as mathlifier } from 'mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlifier`${{}} fg
does not exist as ${{}} {R_{g} \\not \\subseteq D_{f}.}`
		},
		{
			body: mathlifier`${{}} gf(x) = \\frac{-3-3x}{1-x}.

${{}} (gf)^{-1}(5) = 4.`
		}
	]
};

it('2013p2q1', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
