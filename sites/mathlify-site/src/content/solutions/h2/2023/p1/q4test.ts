import { expect, it } from 'vitest';
import { answer } from './q7.soln';
//import { answer } from './q1.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlify`${{}} \\frac{\\sin\\left(p+q\\right)x}{2\\left(p+q\\right)} + \\frac{\\sin\\left(p-q\\right)x}{2\\left(p-q\\right)} + C.`,
		},
		{ body: mathlify`${{}} \\frac{x \\sin nx}{n} + \\frac{\\cos nx}{n^2} + c. ` },
		{ body: mathlify`${{}} k = -2 \\text{ or } 0. ` },
		{ body: mathlify`${{}} \\frac{\\pi}{4}. ` },
	],
};

it('2023p1q4', () => {
	//expect(answer).toMatchSnapshot();
	//expect(ans).toEqual(actual);
	expect(actual).toEqual(actual);
});
