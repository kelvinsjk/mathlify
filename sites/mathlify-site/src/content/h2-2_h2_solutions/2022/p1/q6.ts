import { Answer } from '$lib/classes/answer';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Polynomial, quotient } from 'mathlify';
import { fractionalInverseWorking } from '$content/h2-1_h2_learn/01_functions/02_inverse/03_formula/02_practice';
import { selfInverseWorking } from '$content/h2-1_h2_learn/01_functions/04_more/01_self-inverse/02_practice';
import { QED } from '$lib/typesetting/utils';

export const answer = new Answer();

const num = new Polynomial(['a', 'k']);
const den = new Polynomial([1, [-1, 'a']]);
const f = quotient(num, den);

// a
{
	const { quotient, remainder, result } = num.longDivide(den);
	const soln = mathlifier`$${{}} ${f} = ${result}

- Translate the curve ${{}} {y=\\frac{1}{x}}
by ${'a'}
units in the positive ${'x\\text{-axis}'}
direction
- Scale the resulting curve by a factor of ${remainder}
parallel to the ${'y\\text{-axis}'}
- Translate the resulting curve by ${quotient}
units in the positive ${'y\\text{-axis}'}
direction`;
	const ans = mathlifier`Translate the curve ${{}} {y=\\frac{1}{x}}
by ${'a'}
units in the positive ${'x\\text{-axis}'}
direction.
\\
Scale the resulting curve by a factor of ${remainder}
parallel to the ${'y\\text{-axis}.'}
\\
Translate the resulting curve by ${quotient}
units in the positive ${'y\\text{-axis}'}
direction.`;
	answer.addPart(ans, soln);
}
// b
{
	const { working, exp: fInv } = fractionalInverseWorking(f, false, {
		reportInverse: true,
		swapNum: true,
		qed: true
	});
	const ans = mathlifier`${{}} f^{-1}(x) = ${fInv}.`;
	answer.addPart(ans, working);
}
// c
{
	const soln = mathlifier`We observe from part (b) that ${{}} {f(x) = f^{-1}(x).}
Hence $${'align*'} f^2(x) &= ff(x)
\\\\ &= ff^{-1}(x)
\\\\ &= x \\; ${QED}`;
	const ans = mathlifier`${{}}f^2(x)=x.`;
	answer.addPart(ans, soln);
}
// d
{
	const { ans, soln } = selfInverseWorking(f, 2023, { x: 1, qed: true });
	answer.addPart(ans, soln);
}
