import { expect, it } from 'vitest';
import { answer } from './q2';
import { mathlifierDj as mathlifier } from 'mathlifier';

const ans = answer.answer;
const actual: typeof ans = {
	parts: [
		{
			body:
				mathlifier`${{}}gf:x\\mapsto \\frac{1}{\\left( x - 3 \\right)^2}, \\quad \\allowbreak  {x \\in \\mathbb{R}, x \\neq 3}.` +
				'\\\n' +
				mathlifier`${'fg'}
does not exist as ${{}} {R_{g} \\not  \\subseteq D_{f}.}`
		},
		{
			body: mathlifier`${{}} f^{-1}(x) = \\frac{1 + 3x}{x}.
\\
${{}} D_{f^{-1}}  = \\left( -\\infty, 0 \\right) \\cup \\left( 0, \\infty \\right).`
		}
	]
};
it('2007p1q2', () => {
	expect(ans).toEqual(actual);
	expect(answer).toMatchSnapshot();
});
