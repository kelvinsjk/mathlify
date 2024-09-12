import { Answer } from '$lib/classes/answer';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Polynomial, quotient } from 'mathlify';
import { EquationWorking, ExpressionWorking } from 'mathlify/working';
import { QED } from '$lib/typesetting/utils';

export const answer = new Answer();

// ! Complete, but can be further abstracted

// (x+a)(x+b)
// x

const num = new Polynomial([1, 'a']);
const den = new Polynomial([1, 'b']);
const f = quotient(num, den);
const g = Polynomial.ofDegree(1);
const verbatim = true;

{
	const working = new ExpressionWorking(f.subIn({ x: f }, { verbatim }), { leadingEqual: true });
	working.combineFraction().simplify();
	const working2 = new EquationWorking(working.expression, g);
	working2.crossMultiply().expand().toPolynomial('x', { target: 'b' });
	const b = -1;
	const fInv = f.subIn({ b });
	const soln = mathlifier`$${'align*'} ff(x) &= f\\left( ${f} \\right) \\\\ ${working}

Since ${'ff = g'},
$${'gather*'} ${working2}

Comparing coefficients of ${'x^2'},
$${'align*'} 1+b &= 0 \\\\ b &= ${b} \\; ${QED}

$${'align*'} 
ff(x) &= g(x)
\\\\ ff(x) &= x
\\\\ f(x) &= f^{-1}(x)
\\\\ f^{-1}(x) &= f(x)
\\\\ &= ${f}
\\\\ &= ${fInv} \\; ${QED}
`;
	const ans = mathlifier`${{}} b = ${b}.
\\
${{}} f^{-1}(x) = ${fInv}.`;
	answer.addBody(ans, soln);
}
