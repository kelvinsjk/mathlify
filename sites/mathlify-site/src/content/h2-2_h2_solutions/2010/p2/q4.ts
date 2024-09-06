import { Answer } from '$lib/classes/answer';
import { QED } from '$lib/typesetting/utils';
import { Expression, Polynomial } from 'mathlify';
import { mathlifierDj as mathlifier } from 'mathlifier';

import { generateFn } from '$content/h2-1_h2_learn/01_functions/01_concepts/02_domain-and-range/02_practice';
import { compositeFormula } from '$content/h2-1_h2_learn/01_functions/03_composite/02_formula/02_practice';
import svg from '$static/images/h2/fns/2010p2q4a.svg?raw';
import svg2 from '$static/images/h2/fns/2010p2q4d.svg?raw';
import { Interval, intervalBuilder } from '$content/h2-1_h2_learn/01_functions/_intervals';

export const answer = new Answer();

// TODO: answer (iv) using inequalities
// f(x) = 1/(x^2-1)
// g(x) = 1/(x-3)

const [a, b] = [1, 1];
const fState: Parameters<typeof generateFn>[0] = {
	fnType: 'special',
	a,
	b,
	c: 1,
	restriction: false,
	unknownConstants: false
	//definition: false
};
const f = generateFn(fState)[1];
const g = new Polynomial([1, -3]).reciprocal();

// a
{
	const soln = svg;
	const ans = mathlifier`[Sketch](#soln-1).`;
	answer.addPart(ans, soln);
}
// b
{
	const ans = mathlifier`Least value of ${'{k=0.}'}`;
	const soln = mathlifier`Least value of ${{}} {k = 0 ${QED}}

This is because, when ${'{k=0,}'}
the domain of ${'f'}
is ${{}} [0, 1) \\cup (1, \\infty).
\\
Under this domain, all horizontal lines ${{}}{y=k, k \\in \\mathbb{R},}
cuts the graph of ${'{y=f(x)}'}
at most once so ${'f'}
is a one-to-one function and the function ${'f^{-1}'}
exists.`;
	answer.addPart(ans, soln);
}
// c
let fg: Expression;
{
	const composite = compositeFormula([f, [], g, []], true, false, {
		noDomain: true,
		factorizeDenominator: true
	});
	const { ans, soln } = composite;
	({ exp: fg } = composite);
	answer.addPart(ans, soln);
}
// d
{
	const soln =
		mathlifier`$${fg} > 0` + svg2 + mathlifier`$${{}} 2 < x < 3 \\; \\text{ or } \\; 3 < x < 4`;
	const ans = mathlifier`${{}}{2 < x < 3}
or ${{}} {3 < x < 4.}`;
	answer.addPart(ans, soln);
}
// e
{
	const Rfg = [intervalBuilder('left', -1, false), intervalBuilder('right', 0, false)].join(
		' \\cup '
	);
	const ans = mathlifier`${'R_{fg}'} = ${Rfg}.`;
	const soln = mathlifier`$${'align*'}
	D_{g} &= ${[intervalBuilder('left', 2, false), new Interval({ left: 2, right: 3 }), new Interval({ left: 3, right: 4 }), intervalBuilder('right', 4, false)].join(' \\cup ')} \\\\
	&\\downarrow g \\\\
	R_{g} &= ${[intervalBuilder('left', -1, false), new Interval({ left: -1, right: 0 }), new Interval({ left: 0, right: 1 }), intervalBuilder('right', 1, false)].join(' \\cup ')} \\\\
	&\\downarrow f \\\\
	R_{fg} &= ${Rfg}
`;
	answer.addPart(ans, soln);
}
