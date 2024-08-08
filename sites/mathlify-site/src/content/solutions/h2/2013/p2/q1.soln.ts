import { Answer } from '$content/solutions/answerObject';
import { fnTerm, Polynomial, quotient } from 'mathlify';
import { generateDomain } from '$content/learn/h2/fns/02-inverse/02-domain.practice';
import { compositeExists } from '$content/learn/h2/fns/03-composite/01-existence.practice';
import { compositeFormula } from '$content/learn/h2/fns/03-composite/02-formula.practice';
import { EquationWorking } from 'mathlify/working';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import { Interval } from '$content/learn/h2/fns/intervals';

export const answer = new Answer();

// ! Complete
// f(x) = (2+x)/(1-x)
// g(x) = 1-2x

const [a, b, c] = [-1, 1, 2];
const ascending = true;
const f = quotient(new Polynomial([c, b], { ascending }), new Polynomial([1, -1], { ascending }));
const g = new Polynomial([1, -2], { ascending });
const rhs = 5;
const fState = {
	fnType: 'improper',
	a,
	b,
	c,
	restriction: false,
	unknownConstants: false,
} as const;
const gState = {
	fnType: 'linear',
	a: -2,
	b: 1,
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
	const { ans, soln } = compositeExists(compositeStateFg, [f, g]);
	answer.addPart(ans, soln);
}
// b
{
	const {
		ans: ans1,
		soln: soln1,
		exp: gf,
	} = compositeFormula([f, generateDomain(fState), g, [Interval.ALL_REAL]], false, false, {
		noDomain: true,
		ansInline: true,
		combineFraction: true,
		QED: true,
	});

	const gfx = fnTerm('gf', 'x');
	const working = new EquationWorking(gfx, rhs, { aligned: true });
	working.subIn({ gf }).crossMultiply({ hide: true }).expand();
	const { root } = working.solve.linear('x');
	const soln =
		soln1 +
		mathlifyQED`$${'align*'} \\text{Let } \\quad x &= (gf)^{-1}(${rhs})  \\\\ ${working}
	
	$${{}} (gf)^{-1} (${rhs}) = ${root}`;
	const ans = ans1 + mathlify`${{}} (gf)^{-1} (${rhs}) = ${root}.`;
	answer.addPart(ans, soln);
}
