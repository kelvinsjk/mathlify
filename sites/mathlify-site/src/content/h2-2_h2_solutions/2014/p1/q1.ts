import { Answer } from '$lib/classes/answer';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Expression, Polynomial } from 'mathlify';
import { fractionalInverseWorking } from '$content/h2-1_h2_learn/01_functions/02_inverse/03_formula/02_practice';
import { compositeFormula } from '$content/h2-1_h2_learn/01_functions/03_composite/02_formula/02_practice';
import { QED } from '$lib/utils/typesetting/utils';

export const answer = new Answer();

// ! Complete
// 1/(1-x)

const f = new Expression([1, '/', new Polynomial([1, -1], { ascending: true })]);

// a
{
	const { soln: f2Working, exp: f2 } = compositeFormula([f, [], f, []], true, false, {
		gName: 'f',
		noDomain: true
	});
	const { working: fInvWorking } = fractionalInverseWorking(f, false, { reportInverse: true });
	const soln = f2Working + fInvWorking + mathlifier`Hence ${'f^2(x) = f^{-1}(x)'} \\; ${QED}`;
	const ans = mathlifier`${{}}f^2(x)=f^{-1}(x) = ${f2}.`;
	answer.addPart(ans, soln);
}
// b
{
	const soln = mathlifier`$${'align*'} f^3(x) &= f^2f(x) \\\\ &= f^{-1}f(x) \\quad \\text{since } f^2(x)=f^{-1}(x) \\\\ &= x \\; ${QED}`;
	const ans = mathlifier`${{}}f^3(x)=x.`;
	answer.addPart(ans, soln);
}
