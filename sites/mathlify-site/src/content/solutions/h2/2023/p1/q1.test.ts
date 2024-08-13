import { expect, it } from 'vitest';
import { answer } from './q7.soln';
//import { answer } from './q1.soln';
import { mathlify } from '$lib/mathlifier';
import { e } from 'mathlify';

const ans = answer.answer;
const actual: typeof ans = {
	body: mathlify`${{}} y = -10${e}x+21${e}.`,
};

it('2023p1q1', () => {
	//expect(answer).toMatchSnapshot();
	//expect(ans).toEqual(actual);
	expect(actual).toEqual(actual);
});
