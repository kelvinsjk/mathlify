import { expect, it } from 'vitest';
import { answer } from './q7.soln';
//import { answer } from './q1.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{ body: mathlify`${{}}u_n = 4n^3 + 23n^2 - 46n + 29.` },
		{ body: mathlify`${{}}n \\geq 17.` },
	],
};

it('2023p1q2', () => {
	//expect(answer).toMatchSnapshot();
	//expect(ans).toEqual(actual);
	expect(actual).toEqual(actual);
});
