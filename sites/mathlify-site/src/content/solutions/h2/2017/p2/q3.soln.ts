import { Answer } from '$content/solutions/answerObject';
import { Expression, fnTerm, Polynomial, quotient, sum } from 'mathlify';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import { QED } from '$lib/utils/typesetting';
import { EquationWorking, ExpressionWorking } from 'mathlify/working';

export const answer = new Answer();

// 1 - 1/(1-x)

const g = sum(1, [-1, quotient(1, new Polynomial([1, -1], { ascending: true }))]);

// a
{
	const a = new Expression('a');
	const b = new Expression('b');
	const half = quotient(1, 2);
	// ai
	const pt1a = `\\left( ${a.divide(2)}, 0 \\right)`;
	const pt1b = `\\left( 0, ${b} \\right)`;
	answer.addSubPart(
		mathlify`${pt1a},
${{}} ${pt1b}.`,
		mathlify`We apply a scaling of scale factor ${half}
parallel to the ${'x\\text{-axis}'}
on ${'y=f(x)'}

$${'gather*'} ${pt1a} ${QED}
\\\\ ${pt1b} ${QED}`,
	);
	// aii
	const aPlus1 = a.plus(1);
	const pt2 = `\\left( ${aPlus1}, 0 \\right)`;
	answer.addSubPart(
		mathlify`${pt2}.`,
		mathlify`We apply a translation of ${'1'}
unit in the positive ${'x\\text{-axis}'}
direction on ${'y=f(x)'}

$${{}} ${pt2} ${QED}`,
	);
	// a iii
	const aPlus1Over2 = aPlus1.divide(2);
	const pt3 = `\\left( ${aPlus1Over2}, 0 \\right)`;
	answer.addSubPart(
		mathlify`${pt3}.`,
		mathlify`We apply a scaling of scale factor ${half}
parallel to the ${'x\\text{-axis}'}
on ${'y=f(x-1)'}
from the previous part

$${{}} ${pt2} ${QED}`,
	);
	// a iv
	const pt4a = `\\left( 0, ${a} \\right)`;
	const pt4b = `\\left( ${b}, 0 \\right)`;
	answer.addSubPart(
		mathlify`${pt4a},
${pt4b}.`,
		mathlify`We apply a reflection of the curve ${'y=f(x)'}
about the line ${'{y=x.}'}

$${'gather*'} ${pt4a} ${QED}
\\\\ ${pt4b} ${QED}`,
	);
}

answer.newPart();
// bi
answer.addSubPart(
	mathlify`${{}}a=1.
\\
It must be excluded as ${'g'}
is not defined when ${'{x=1.}'}`,
	mathlify`$${{}} a=1 ${QED}

${'x=1'}
has to be excluded from the domain of ${'g'}
as ${'g(1)'}
is not defined ${QED}`,
);
// bii
let g2: Expression;
let gInv: Expression;
{
	const working = new ExpressionWorking(fnTerm('g', g), { leadingEqual: true });
	working.subIn({ g });
	const term2 = working.expression._getSumTerms()[1]._getProductTerm();
	const soln1 = mathlifyQED`$${'align*'} g^2(x) &= gg(x)
\\\\ ${working}
\\\\ &= 1 - \\left( ${term2.expand()} \\right)
\\\\ &= x`;
	g2 = new Expression('x');
	gInv = g.clone();
	const soln2 = mathlifyQED`$${'align*'} gg(x) &= x
\\\\ g^{-1}gg(x) 	&= g^{-1}(x)
\\\\ g(x) 				&= g^{-1}(x)
\\\\ g^{-1}(x) 		&= ${g}`;
	const ans = mathlify`${{}} g^2(x) = x.
\\
${{}} g^{-1}(x) = ${g}.`;
	answer.addSubPart(ans, soln1 + soln2);
}
// b iii
{
	const working = new EquationWorking(g2.subIn({ x: 'b' }), gInv.subIn({ x: 'b' }));
	working.moveTerms([[0], [1]], { swapSides: true });
	working.crossMultiply();
	const soln = mathlify`$${'gather*'} g^2(b) = g^{-1}(b)
\\\\ ${working}
\\\\ 1-b = \\pm 1
\\\\ b=0 ${QED} \\quad \\text{or} \\quad b=2${QED}`;
	const ans = mathlify`${{}} {b=0}
or ${{}} {b=2.}`;
	answer.addSubPart(ans, soln);
}
