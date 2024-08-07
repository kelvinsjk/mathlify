import { Answer } from '$content/solutions/answerObject';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import { Expression, Polynomial } from 'mathlify';
import { fractionalInverseWorking } from '$content/learn/h2/fns/02-inverse/03-formula.practice';
import { compositeFormula } from '$content/learn/h2/fns/03-composite/02-formula.practice';

export const answer = new Answer();

// ! Complete
// 1/(1-x)

const f = new Expression([1, '/', new Polynomial([1, -1], { ascending: true })]);

// a
{
	const { soln: f2Working, exp: f2 } = compositeFormula([f, [], f, []], true, false, {
		gName: 'f',
		noDomain: true,
	});
	const { working: fInvWorking } = fractionalInverseWorking(f, false, { reportInverse: true });
	const soln = f2Working + fInvWorking + mathlifyQED`Hence ${'f^2(x) = f^{-1}(x)'}`;
	const ans = mathlify`${{}}f^2(x)=f^{-1}(x) = ${f2}.`;
	answer.addPart(ans, soln);
}
// b
{
	const soln = mathlifyQED`$${'align*'} f^3(x) &= f^2f(x) \\\\ &= f^{-1}f(x) \\quad \\text{since } f^2(x)=f^{-1}(x) \\\\ &= x`;
	const ans = mathlify`${{}}f^3(x)=x.`;
	answer.addPart(ans, soln);
}
