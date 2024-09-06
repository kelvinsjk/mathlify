import { Answer } from '$lib/classes/answer';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Expression, fnTerm, Polynomial, quotient } from 'mathlify';
import { fractionalInverseWorking } from '$content/h2-1_h2_learn/01_functions/02_inverse/03_formula/02_practice';
import { EquationWorking, ExpressionWorking } from 'mathlify/working';
import { QED } from '$lib/typesetting/utils';

export const answer = new Answer();

// ! Complete, but can be further abstracted

// 1/2 x^2 + 3
// (x+1)/(5x-1)
// (x+a)(2x+b)

const h = new Polynomial([[1, '/', 2], 0, 3]);
const g = quotient(new Polynomial([1, 1]), new Polynomial([5, -1]));
const verbatim = true;
const num = new Polynomial([1, 'a']);
const den = new Polynomial([2, 'b']);
const f = quotient(num, den);

// ai
{
	const x = 2;
	const h2 = fnTerm('h', x);
	const gh2 = fnTerm('g', h2);
	const working = new ExpressionWorking(gh2);
	working.subIn({ h }, { verbatim }).simplify().subIn({ g }, { verbatim }).simplify();
	const finalAns = working.expression;

	const soln = mathlifier`$${'align*'} ${working}`;
	const ans = mathlifier`${{}} ${gh2} = ${finalAns}.`;
	answer.addSubPart(ans, soln);
}
// aii
{
	const b = quotient(14, 10);
	const working = new EquationWorking(g, b);
	working.crossMultiply().expand().solve.linear('x');
	const x = working.eqn.rhs;
	const soln = mathlifier`$${'gather*'} g(x) = ${b.valueOf()} \\\\ ${working}`;
	const ans = mathlifier`${{}} x = ${x}.`;
	answer.addSubPart(ans, soln);
}
answer.newPart();
// bi
{
	const working = new EquationWorking(den, 0);
	const { root: k } = working.solve.linear('x');
	const soln = mathlifier`Note that division by zero is undefined
$${'gather*'}${working}

Hence ${{}}k=${k}
and it must be excluded from the domain of ${'f'}
since ${'f'}
is not defined when ${{}} x = ${k}`;
	const ans = mathlifier`${{}} k = ${k}.
\\
It must be excluded as ${'f'}
is not defined when ${{}} {x = ${k}.}`;
	answer.addSubPart(ans, soln);
}
// bii
let fInv: Expression;
{
	const { working, exp: fInv1 } = fractionalInverseWorking(f, false, { reportInverse: true });
	const b = -1;
	const a = quotient(-1, 2);
	fInv = f.subIn({ b });
	const soln =
		working +
		mathlifier`$${'align*'} f(x) &= f^{-1}(x) \\\\ ${f} &= ${fInv1} 

Since this is valid for all ${'x'}
in the domain of ${'f'},
by comparing,

$${{}} b = ${b} ${QED}

Substituting this into ${'f(x)'}:

$${{}} f(x) = ${fInv}

We observe that if ${{}} {a = ${a},}
then ${{}} {f(x) = ${fInv.subIn({ a })} = \\frac{1}{2}}
which is not a one-to-one function and does not have an inverse.

Hence ${'a'}
can take all real values except ${a}

$${{}} a \\in \\mathbb{R}, a \\neq ${a} ${QED}`;
	const ans = mathlifier`${{}} b = ${b}.
\\
${{}} a \\in \\mathbb{R}, a \\neq ${a}.`;
	answer.addSubPart(ans, soln);
}
// bIII
{
	const x = -4;
	const fInvX = fnTerm('f^{-1}', x);
	const working = new ExpressionWorking(fInvX, { startOnFirstLine: true });
	working
		.subIn({ 'f^{-1}': fnTerm('f', x) })
		.subIn({ f: fInv }, { verbatim })
		.simplify()
		.expandNegativeIntoQuotient();
	const finalAns = working.expression;
	const ans = mathlifier`${{}} f^{-1}(${x}) = ${finalAns}.`;
	const soln = mathlifier`$${'align*'} ${working}`;
	answer.addSubPart(ans, soln);
}
