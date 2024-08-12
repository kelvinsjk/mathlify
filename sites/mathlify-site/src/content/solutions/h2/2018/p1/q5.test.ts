import { expect, it } from 'vitest';
import { answer } from './q5.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	body: mathlify`${{}} b = -1.
\\
${{}} f^{-1}(x) = \\frac{x+a}{x-1}.`,
};

it('2018p1q5', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
