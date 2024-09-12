import { expect, it } from 'vitest';
import { answer } from './q5';
import { mathlifierDj as mathlifier } from 'mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	body: mathlifier`${{}} b = -1.
\\
${{}} f^{-1}(x) = \\frac{x + a}{x - 1}.`
};

it('2018p1q5', () => {
	expect(ans).toEqual(actual);
	expect(answer).toMatchSnapshot();
});
