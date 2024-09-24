import { Answer } from '$lib/classes/answer';
import { fnTerm, Polynomial, quotient } from 'mathlify';
import { generateDomain } from '$content/h2-1_h2_learn/01_functions/02_inverse/02_domain/02_practice';
import { compositeExists } from '$content/h2-1_h2_learn/01_functions/03_composite/01_existence/02_practice';
import { compositeFormula } from '$content/h2-1_h2_learn/01_functions/03_composite/02_formula/02_practice';
import { EquationWorking } from 'mathlify/working';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Interval } from '$content/h2-1_h2_learn/01_functions/_intervals';
import { QED } from '$lib/utils/typesetting/utils';

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
	unknownConstants: false
} as const;
const gState = {
	fnType: 'linear',
	a: -2,
	b: 1,
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
	const { ans, soln } = compositeExists(compositeStateFg, [f, g]);
	answer.addPart(ans, soln);
}
// b
{
	const {
		ans: ans1,
		soln: soln1,
		exp: gf
	} = compositeFormula([f, generateDomain(fState), g, [Interval.ALL_REAL]], false, false, {
		noDomain: true,
		ansInline: true,
		combineFraction: true,
		QED: true
	});

	const gfx = fnTerm('gf', 'x');
	const working = new EquationWorking(gfx, rhs, { aligned: true });
	working.subIn({ gf }).crossMultiply({ hide: true }).expand();
	const { root } = working.solve.linear('x');
	const soln =
		soln1 +
		mathlifier`$${'align*'} \\text{Let } \\quad x &= (gf)^{-1}(${rhs})  \\\\ ${working}
	
	$${{}} (gf)^{-1} (${rhs}) = ${root} \\; ${QED}`;
	const ans = ans1 + '\\\n' + mathlifier`${{}} (gf)^{-1} (${rhs}) = ${root}.`;
	answer.addPart(ans, soln);
}
