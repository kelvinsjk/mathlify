import { Answer } from '$lib/classes/answer';
import { fnTerm, sum } from 'mathlify';

import { sqrtInverse } from '$content/h2-1_h2_learn/01_functions/02_inverse/03_formula/02_practice';
import { generateFn } from '$content/h2-1_h2_learn/01_functions/01_concepts/02_domain-and-range/02_practice-1';
import { EquationWorking } from 'mathlify/working';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { simplifySurd } from 'mathlify/fns';
import { bisection, cubicRoot } from 'mathlify/numerical';
import { QED } from '$lib/utils/typesetting/utils';

export const answer = new Answer();

// 1 + sqrt(x)

const [a, b] = [0, 1];

const state: Parameters<typeof sqrtInverse>[0] = {
	fnType: 'sqrt',
	a,
	b,
	restriction: false,
	// dummies
	definition: false,
	c: 1,
	unknownConstants: false
};
const f = generateFn(state)[1];

// ai
{
	const { ans, soln } = sqrtInverse(state, f, { definition: false });
	answer.addSubPart(ans, soln);
}
// aii
{
	const working = new EquationWorking(fnTerm('f', f), 'x');
	EquationWorking.RegisterCustomSimplifier(simplifySurd);
	working.subIn({ f }).moveTerms(1).square().expand().moveTerms(1);
	working.square().expand().moveTerms(0, { swapSides: true }).divide('x');
	EquationWorking.DeregisterCustomSimplifier();
	const cubic = working.eqn.lhs;

	const soln1 = mathlifier`$${'gather*'} ff(x) = x \\\\ ${working}`;
	const x2 = cubicRoot(cubic);
	const x1 = bisection(cubic.fn, 0, 1);
	const x3 = bisection(cubic.fn, 2, 3);

	const soln2 = mathlifier`Solving with a GC,

$${{}} x = ${x1.toPrecision(3)}, \\quad ${x2} \\quad \\text{or} \\quad ${x3.toPrecision(3)}

From ${{}} {\\sqrt{\\sqrt{x}+1}+1=x,}
we observe that ${{}} {x>1.}
Hence

$${{}} x = ${x3.toPrecision(3)} \\; ${QED} \n\n`;
	const soln3 = mathlifier`From ${{}}{ff(x)=x},
we can apply ${'f^{-1}'}
on both sides

$${'align*'} ff(x) &= x
\\\\ f^{-1}ff(x) &= f^{-1}(x)
\\\\ f(x) &= f^{-1}(x)

Hence the value of ${'x'}
obtained satisfies the equation ${{}} {f(x)=f^{-1}(x)} \\; ${QED}`;
	const ans = mathlifier`${{}} x = ${x3.toPrecision(3)}.`;
	answer.addSubPart(ans, soln1 + soln2 + soln3);
}
answer.newPart();
// b
{
	const evenCase = sum(2, fnTerm('g', [[1, '/', 2], 'n']));
	const oddCase = sum(1, fnTerm('g', sum('n', -1)));
	const soln = mathlifier`$${'align*'} g(2) &= ${evenCase.subIn({ n: 2 })}
\\\\ &= 2 + ${oddCase.subIn({ n: 1 })}
\\\\ &= 3 + 1
\\\\ &= 4

$${'align*'} g(4) &= ${evenCase.subIn({ n: 4 })}
\\\\ &= 2 + 4
\\\\ &= 6 \\; ${QED}

$${'align*'} g(6) &= ${evenCase.subIn({ n: 6 })}
\\\\ &= 2 + ${oddCase.subIn({ n: 3 })}
\\\\ &= 3 + 4
\\\\ &= 7

$${'align*'} g(7) &= ${oddCase.subIn({ n: 7 })}
\\\\ &= 1 + 7
\\\\ &= 8 \\; ${QED}

$${'align*'} g(12) &= ${evenCase.subIn({ n: 12 })}
\\\\ &= 2 + ${evenCase.subIn({ n: 6 })}
\\\\ &= 2 + 7
\\\\ &= 9 \\; ${QED}
`;
	const ans = mathlifier`${{}} g(4) = 6.
\\
${{}} g(7) = 8.
\\
${{}} g(12) = 9.`;
	answer.addSubPart(ans, soln);

	// bii
	const soln2 = mathlifier`$${'align*'} g(8) &= ${evenCase.subIn({ n: 8 })}
\\\\ &= 2 + 6
\\\\ &= 8

Since ${{}} {g(7)=g(8)=8,}
${'g'}
is not a one-to-one function and ${'g'}
does not have an inverse ${QED}`;
	const ans2 = mathlifier`${'g'}
does not have an inverse as ${{}}{g(7)=g(8)=8}
so ${'g'}
is not a one-to-one function.`;
	answer.addSubPart(ans2, soln2);
}
