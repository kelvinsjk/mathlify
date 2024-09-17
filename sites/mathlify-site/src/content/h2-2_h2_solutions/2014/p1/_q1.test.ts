import { expect, it } from 'vitest';
import { answer } from './q1';
import { mathlifierDj as mathlifier } from 'mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlifier`${{}}f^2(x)=f^{-1}(x) = \\frac{x - 1}{x}.`
		},
		{ body: mathlifier`${{}}f^3(x)=x.` }
	]
};

it('2014p1q1', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
