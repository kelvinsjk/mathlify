import { expect, it } from 'vitest';
import { answer } from './q6';
import { mathlifierDj as mathlifier } from 'mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlifier`${{}} x = 0,
${{}} x = 4a.`
		},
		{ body: mathlifier`${{}} \\frac{1}{2a}.` },
		{
			body: mathlifier`Translate the graph by ${'2a'}
units in the negative ${{}} x\\text{-direction}.`
		}
	]
};

it('2021p1q6', () => {
	expect(ans).toEqual(actual);
	expect(answer).toMatchSnapshot();
});
