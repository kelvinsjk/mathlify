import { Answer } from '$content/solutions/answerObject';
import { Polynomial } from 'mathlify';
import { generateDomain } from '$content/learn/h2/fns/02-inverse/02-domain.practice';
import { improperInverse } from '$content/learn/h2/fns/02-inverse/03-formula.practice';
import { compositeExists } from '$content/learn/h2/fns/03-composite/01-existence.practice';
import { compositeFormula } from '$content/learn/h2/fns/03-composite/02-formula.practice';
import { QED } from '$lib/utils/typesetting';

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
	definition: false,
};
const gState = {
	fnType: 'quadratic',
	a: 0,
	b: 0,
	c: 0,
	restriction: false,
	unknownConstants: false,
} as const;
const compositeStateFg: Parameters<typeof compositeExists>[0] = {
	f: fState,
	g: gState,
	fg: true,
};

// a
{
	const { ans: ans2, soln: soln2 } = compositeExists(compositeStateFg, [f, g]);
	const { ans, soln } = compositeFormula(
		[f, generateDomain(fState), g, generateDomain(gState)],
		false,
		true,
		{ ansInline: true },
	);
	answer.addPart(ans + ans2, soln + soln2);
}
// b
{
	const { ans, soln } = improperInverse(fState, {
		definition: false,
		rhs: f,
		QED,
		omitReasoningInAns: true,
	});
	answer.addPart(ans, soln);
}
