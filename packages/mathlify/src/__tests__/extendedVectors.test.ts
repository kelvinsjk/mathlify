import { xVector, Expression, Fraction, Unknown, Term, uVector, uVectorExpression, uxVectorExpression } from '../index';

import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { uxVector } from '../vectors';
const xVectors = suite('xVector');

xVectors('clone', () => {
	const x = new xVector('x', 0, 2);
	const xClone = x.clone();
	x.y = new Expression(5);
	assert.is(`${x.toCoordinates()}`, '\\left( x, 5, 2 \\right)');
	assert.is(`${xClone.toCoordinates()}`, '\\left( x, 0, 2 \\right)');
});

xVectors('boolean checks', () => {
	const x = new xVector('x', new Term(0), new Expression(2));
	const y = new xVector('x', 0, new Fraction(2));
	const z = new xVector('y', 0, new Fraction(2));
	const twoX = new xVector(new Unknown(2, { unknown: 'x' }), 0, 4);
	const xPerp = new xVector(-2, 'y', 'x');
	const threeX = x.multiply(3);
	const threeX2 = x.multiply(3, { multiplyIntoCoeff: true });
	const negativeX = x.negative({ multiplyIntoCoeff: true });
	const zero = x.plus(negativeX);
	const zero2 = new xVector(2, 3, 4, { coeff: 0 });
	assert.is(zero.isEqualTo(zero2), true);
	assert.is(x.isEqualTo(y), true);
	assert.is(x.isEqualTo(z), false);
	assert.is(x.isParallelTo(y), true);
	assert.is(x.isParallelTo(twoX), true);
	assert.is(x.isParallelTo(z), false);
	assert.is(x.isPerpendicularTo(twoX), false);
	assert.is(x.isPerpendicularTo(xPerp), true);
	assert.is(`${threeX}`, `\\begin{pmatrix}\n\t3 x \\\\\n\t0 \\\\\n\t6\n\\end{pmatrix}`);
	assert.is(`${threeX2}`, `3 \\begin{pmatrix}\n\tx \\\\\n\t0 \\\\\n\t2\n\\end{pmatrix}`);
	assert.is(`${negativeX}`, `- \\begin{pmatrix}\n\tx \\\\\n\t0 \\\\\n\t2\n\\end{pmatrix}`);
	assert.is(`${zero}`, `\\begin{pmatrix}\n\t0 \\\\\n\t0 \\\\\n\t0\n\\end{pmatrix}`);
});

xVectors('uVectors', () => {
	const a = new uVector('a');
	const ka = new uxVector('a', 'k');
	const twoPlusKA = new uxVectorExpression(a, a, ka);
	const threeA = new uVectorExpression(a, a, a);
	const clone2 = threeA.clone();
	const clone1 = twoPlusKA.clone();
	const zero = twoPlusKA.cross(a);
	const zero2 = ka.minus(ka);
	const zero3 = twoPlusKA.cross(twoPlusKA);
	const dot1 = twoPlusKA.dot(ka);

	assert.is(`${twoPlusKA}`, `2 \\mathbf{a} + k \\mathbf{a}`);
	assert.is(`${threeA}`, `3 \\mathbf{a}`);
	assert.is(`${clone2}`, `3 \\mathbf{a}`);
	assert.is(`${clone1}`, `2 \\mathbf{a} + k \\mathbf{a}`);
	assert.is(`${zero}`, `\\mathbf{0}`);
	assert.is(`${zero2}`, `\\mathbf{0}`);
	assert.is(`${zero3}`, `\\mathbf{0}`);
	assert.is(`${dot1}`, `2 \\left| \\mathbf{a} \\right|^2 k + \\left| \\mathbf{a} \\right|^2 k^2`);
});

xVectors.run();
