import { Answer } from '$content/solutions/answerObject';
import { mathlify, mathlifyQED } from '$lib/mathlifier';
import { Expression, Polynomial, quotient } from 'mathlify';
import { fractionalInverseWorking } from '$content/learn/h2/fns/02-inverse/03-formula.practice';
import { EquationWorking } from 'mathlify/working';
import { QED } from '$lib/utils/typesetting';

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
	const h2Verbatim = h.subIn({ x }, { verbatim });
	const h2 = h2Verbatim.simplify();
	const gh2Verbatim = g.subIn({ x: h2 }, { verbatim });
	const gh2 = gh2Verbatim.simplify();
	const soln = mathlifyQED`$${'align*'} gh(${x}) &= g\\left(${h2Verbatim}\\right)
\\\\ &= g(${h2}) \\\\ &= ${gh2Verbatim} \\\\ &= ${gh2}`;
	const ans = mathlify`${{}} gh(${x}) = ${gh2}.`;
	answer.addSubPart(ans, soln);
}
// aii
{
	const b = quotient(14, 10);
	const working = new EquationWorking(g, b);
	working.crossMultiply().expand().solve.linear('x');
	const x = working.eqn.rhs;
	const soln = mathlifyQED`$${'gather*'} g(x) = ${b.valueOf()} \\\\ ${working}`;
	const ans = mathlify`${{}} x = ${x}.`;
	answer.addSubPart(ans, soln);
}
answer.newPart();
// bi
{
	const working = new EquationWorking(den, 0);
	const { root: k } = working.solve.linear('x');
	const soln = mathlifyQED`Note that division by zero is undefined
$${'gather*'}${working}

Hence ${{}}k=${k}
and it must be excluded from the domain of ${'f'}
since ${'f'}
is not defined when ${{}} x = ${k}`;
	const ans = mathlify`${{}} k = ${k}.
\\
It must be excluded as ${'f'}
is not defined when ${{}} {x = ${k}}`;
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
		mathlify`$${'align*'} f(x) &= f^{-1}(x) \\\\ ${f} &= ${fInv1} 

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
	const ans = mathlify`${{}} b = ${b}.
\\
${{}} a \\in \\mathbb{R}, a \\neq ${a}.`;
	answer.addSubPart(ans, soln);
}
// bIII
{
	const x = -4;
	const verbatimWorking = fInv.subIn({ x }, { verbatim });
	const working2 = verbatimWorking.simplify();
	const finalAns = expandNegativeIntoQuotient(working2);
	const ans = mathlify`${{}} f^{-1}(${x}) = ${finalAns}.`;
	const soln = mathlifyQED`$${'align*'} f^{-1}(${x}) &= f(${x})
\\\\ &= ${verbatimWorking} \\\\ &= ${working2} \\\\ &= ${finalAns}`;
	answer.addSubPart(ans, soln);
}

export function expandNegativeIntoQuotient(exp: Expression) {
	if (!exp.is.negativeUnit()) throw new Error('Expected a product with coefficient -1');
	const q = exp._getProductTerm();
	if (q.node.type !== 'quotient') throw new Error('Expected a quotient');
	const { num, den } = q.node;
	return quotient(num.negative().expand(), den);
}
