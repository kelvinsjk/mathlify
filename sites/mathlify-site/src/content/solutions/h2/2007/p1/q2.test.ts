import { expect, it } from 'vitest';
import { answer } from './q2.soln';
import { mathlify } from '$lib/mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body: mathlify`${{}} gf:x\\mapsto \\frac{1}{\\left(x-3\\right)^2}, \\quad \\allowbreak  {x \\in \\mathbb{R}, x \\neq 3}.

${'fg'}
does not exist as ${{}} {R_{g} \\not \\subseteq D_{f}.}`,
		},
		{
			body: mathlify`${{}} f^{-1}(x) = \\frac{1+3x}{x}.
\\
${{}} D_{f^{-1}} = \\left(-\\infty, 0\\right) \\cup \\left( 0, \\infty \\right).`,
		},
	],
};
it('2007p1q2', () => {
	expect(answer).toMatchSnapshot();
	expect(ans).toEqual(actual);
});
