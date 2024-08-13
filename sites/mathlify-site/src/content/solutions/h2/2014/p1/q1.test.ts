import { expect, it } from 'vitest';
import { answer } from './q1.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlify`${{}} f^2(x) = f^{-1}(x) = \\frac{x-1}{x}.`,
		},
		{ body: mathlify`${{}} f^3(x)=x.` },
	],
};

it('2014p1q1', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
