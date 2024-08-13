import { Answer } from '$content/solutions/answerObject';
import { Expression, Polynomial } from 'mathlify';
import { mathlify, mathlifyQED } from '$lib/mathlifier';

import { generateFn } from '$content/learn/h2/fns/01-concepts/02-functions.practice';
import { compositeFormula } from '$content/learn/h2/fns/03-composite/02-formula.practice';
import { QED } from '$lib/utils/typesetting';
import svg from '$static/images/h2/fns/2010p2q4a.svg?raw';
import svg2 from '$static/images/h2/fns/2010p2q4d.svg?raw';
import { Interval, intervalBuilder } from '$content/learn/h2/fns/intervals';

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
	unknownConstants: false,
	definition: false,
};
const f = generateFn(fState)[1];
const g = new Polynomial([1, -3]).reciprocal();

// a
{
	const soln = svg;
	const ans = mathlify`[Sketch](#soln-1).`;
	answer.addPart(ans, soln);
}
// b
{
	const ans = mathlify`Least value of ${'{k=0.}'}`;
	const soln = mathlifyQED`Least value of ${{}} {k = 0 ${QED}}

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
		factorizeDenominator: true,
	});
	const { ans, soln } = composite;
	({ exp: fg } = composite);
	answer.addPart(ans, soln);
}
// d
{
	const soln =
		mathlify`$${fg} > 0` + svg2 + mathlifyQED`$${{}} 2 < x < 3 \\; \\text{ or } \\; 3 < x < 4`;
	const ans = mathlify`${{}}{2 < x < 3}
or ${{}} {3 < x < 4.}`;
	answer.addPart(ans, soln);
}
// e
{
	const Rfg = [intervalBuilder('left', -1, false), intervalBuilder('right', 0, false)].join(
		' \\cup ',
	);
	const ans = mathlify`${'R_{fg}'} = ${Rfg}.`;
	const soln = mathlifyQED`$${'align*'}
	D_{g} &= ${[intervalBuilder('left', 2, false), new Interval({ left: 2, right: 3 }), new Interval({ left: 3, right: 4 }), intervalBuilder('right', 4, false)].join(' \\cup ')} \\\\
	&\\downarrow g \\\\
	R_{g} &= ${[intervalBuilder('left', -1, false), new Interval({ left: -1, right: 0 }), new Interval({ left: 0, right: 1 }), intervalBuilder('right', 1, false)].join(' \\cup ')} \\\\
	&\\downarrow f \\\\
	R_{fg} &= ${Rfg}
`;
	answer.addPart(ans, soln);
}
