import { Answer } from '$lib/classes/answer';
import { QED } from '$lib/utils/typesetting/utils';
import { Polynomial } from 'mathlify';
import { generateDomain } from '$content/h2-1_h2_learn/01_functions/02_inverse/02_domain/02_practice';
import { improperInverse } from '$content/h2-1_h2_learn/01_functions/02_inverse/03_formula/02_practice';
import { compositeExists } from '$content/h2-1_h2_learn/01_functions/03_composite/01_existence/02_practice';
import { compositeFormula } from '$content/h2-1_h2_learn/01_functions/03_composite/02_formula/02_practice';

export const answer = new Answer();

// ! Complete
// f(x) = 1/(x-3)
// g(x) = x^2

const [a, b, c] = [-3, 0, 1];
const f = new Polynomial([1, a]).reciprocal();
const g = Polynomial.ofDegree(2);
const fState: Parameters<typeof improperInverse>[0] = {
	fnType: 'frac',
	a,
	b,
	c,
	restriction: false,
	unknownConstants: false,
	definition: false
};
const gState = {
	fnType: 'quadratic',
	a: 0,
	b: 0,
	c: 0,
	restriction: false,
	unknownConstants: false
} as const;
const compositeStateFg: Parameters<typeof compositeExists>[0] = {
	f: fState,
	g: gState,
	fg: true
};

// a
{
	const { ans: ans2, soln: soln2 } = compositeExists(compositeStateFg, [f, g]);
	const { ans, soln } = compositeFormula(
		[f, generateDomain(fState), g, generateDomain(gState)],
		false,
		true,
		{ ansInline: true, QED: true }
	);
	answer.addPart(ans + '\\\n' + ans2, soln + '\n\n' + soln2);
}
// b
{
	const { ans, soln } = improperInverse(fState, {
		definition: false,
		rhs: f,
		QED,
		omitReasoningInAns: true
	});
	answer.addPart(ans, soln);
}
