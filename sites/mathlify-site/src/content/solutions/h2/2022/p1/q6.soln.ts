import { Answer } from '$content/solutions/answerObject';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import { Polynomial, quotient } from 'mathlify';
import { fractionalInverseWorking } from '$content/learn/h2/fns/02-inverse/03-formula.practice';
import { selfInverseWorking } from '$content/learn/h2/fns/04-more/01-self-inverse.practice';

export const answer = new Answer();

const num = new Polynomial(['a', 'k']);
const den = new Polynomial([1, [-1, 'a']]);
const f = quotient(num, den);

// a
{
	const { quotient, remainder, result } = num.longDivide(den);
	const soln = mathlifyQED`$${{}} ${f} = ${result}

- Translate the curve ${{}} {y=\\frac{1}{x}}
by ${'a'}
units in the positive ${'x\\text{-axis}'}
direction
- Scale the resulting curve by a factor of ${remainder}
parallel to the ${'y\\text{-axis}'}
- Translate the resulting curve by ${quotient}
units in the positive ${'y\\text{-axis}'}
direction`;
	const ans = mathlify`Translate the curve ${{}} {y=\\frac{1}{x}}
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
	});
	const ans = mathlify`${{}} f^{-1}(x) = ${fInv}.`;
	answer.addPart(ans, working);
}
// c
{
	const soln = mathlifyQED`We observe from part (b) that ${{}} {f(x) = f^{-1}(x).}
Hence $${'align*'} f^2(x) &= ff(x)
\\\\ ff^{-1}(x)
\\\\ x`;
	const ans = mathlify`${{}}f^2(x)=x.`;
	answer.addPart(ans, soln);
}
// d
{
	const { ans, soln } = selfInverseWorking(f, 2023, 1);
	answer.addPart(ans, soln);
}
