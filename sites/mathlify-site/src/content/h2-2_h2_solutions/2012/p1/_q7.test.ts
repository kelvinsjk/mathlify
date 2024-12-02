import { expect, it } from 'vitest';
import { answer } from './q7';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { xAxis, yAxis } from '$lib/utils/typesetting/math';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{ body: mathlifier`[Show](#soln-1).` },
		{ body: mathlifier`[Sketch](#soln-2).` },
		{
			body: mathlifier`Line of symmetry: ${{}} {y=x.}

Translate the curve ${{}} {y = \\frac{1}{x}}
by ${1}
unit in the positive ${xAxis}
direction.
\\
Scale the resulting curve by a factor of ${'1 + k'}
parallel to the ${yAxis}.
\\
Translate the resulting curve by ${1}
unit in the positive ${yAxis}
direction.`
		}
	]
};

it('2012p1q7', () => {
	expect(ans).toEqual(actual);
	expect(ans).toMatchSnapshot();
});
