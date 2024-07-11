import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import {
	Vector,
	SquareRoot,
	Fraction,
	gcd,
	xVector,
	uVector,
	VariableTerm,
	Term,
	expToPoly,
	solveQuadratic,
	uVectorExpression,
	uxVector,
	cramersFrac,
	Expression,
} from '../../index';

const vectorsI = suite('12: Vectors I');

vectorsI('2007-2009', () => {
	const vars07 = qn07();
	assert.is(`${vars07[0]}`, '1');
	assert.is(`${vars07[1]}`, '\\frac{1}{3} \\begin{pmatrix}\n\t4 \\\\\n\t2 \\\\\n\t5\n\\end{pmatrix}');
	assert.is(`${vars07[2]}`, '\\sqrt{35}');
	const vars08 = qn08();
	assert.is(`${vars08[0].toIJKString()}`, '6 \\mathbf{i} + 3 \\mathbf{j} - 3 \\mathbf{k}');
	assert.is(`${vars08[1]}`, '87.8^\\circ');
	assert.is(`${vars08[2]}`, '15 \\sqrt{3}');
	const vars09 = qn09();
	assert.is(`${vars09[0].toCoordinates()}`, '\\left( 12, - 4, 6 \\right)');
	assert.is(vars09[1].isEqualTo(0), true);
	assert.is(`${vars09[2]}`, '\\frac{1}{7} \\begin{pmatrix}\n\t6 \\\\\n\t- 2 \\\\\n\t3\n\\end{pmatrix}');
	assert.is(`${vars09[3]}`, '139');
});

vectorsI('2010-2014', () => {
	const vars10 = qn10();
	assert.is(`${vars10[0]}`, '\\begin{pmatrix}\n\t2 p \\\\\n\t3 p \\\\\n\t6 p\n\\end{pmatrix}');
	assert.is(`${vars10[1]}`, '\\frac{3}{7}');
	const vars11a = qn11a();
	assert.is(`${vars11a[0]}`, '\\frac{1}{6} \\mathbf{a} + \\frac{3}{10} \\mathbf{b}');
	assert.is(vars11a[1].isEqualTo(new Fraction(1, 20)), true);
	const vars12 = qn12();
	assert.is(`${vars12[0].toCoordinates()}`, '\\left( 5, 7, 1 \\right)');
	assert.is(`${vars12[1].toCoordinates('C')}`, 'C \\left( \\frac{17}{3}, \\frac{19}{3}, \\frac{5}{3} \\right)');
});
vectorsI('2015-2019', () => {
	const vars15 = qn15();
	assert.is(`${vars15[0]}`, '\\frac{3}{5} \\mathbf{a}');
	assert.is(`${vars15[1]}`, '\\mathbf{r} = (1-\\mu) \\mathbf{a} + \\frac{5}{11} \\mu \\mathbf{b}');
	assert.is(`${vars15[2]}`, '\\frac{9}{20} \\mathbf{a} + \\frac{1}{4} \\mathbf{b}');
	assert.is(`${vars15[3]}`, '\\frac{11}{9}');
	const vars16 = qn16();
	assert.is(`${vars16[0]}`, '\\begin{pmatrix}\n\t2 b \\\\\n\t- 4 a + 4 b \\\\\n\t- 2 a\n\\end{pmatrix}');
	assert.is(`${vars16[1].toCartesianString()}`, '- 2 a x - 8 a y - 2 a z');
	//const vars11a = qn11a();
	//assert.is(`${vars11a[0]}`, '\\frac{1}{6} \\mathbf{a} + \\frac{3}{10} \\mathbf{b}');
	//assert.is(vars11a[1].isEqualTo(new Fraction(1, 20)), true);
	//const vars12 = qn12();
	//assert.is(`${vars12[0].toCoordinates()}`, '\\left( 5, 7, 1 \\right)');
	//assert.is(`${vars12[1].toCoordinates('C')}`, 'C \\left( \\frac{17}{3}, \\frac{19}{3}, \\frac{5}{3} \\right)');
});

vectorsI.run();

function qn07(variables?: {
	a?: Vector;
	b?: Vector;
	c?: Vector;
	lambda?: number;
	mu?: number;
}): [Fraction, Vector, SquareRoot] {
	let { a, b, c, lambda, mu } = {
		a: new Vector(1, -1, 2),
		b: new Vector(2, 4, 1),
		c: new Vector(-4, 2, 2),
		lambda: 1,
		mu: 2,
	};
	const b2Vec = new Vector(b.x, b.y);
	const b2 = b2Vec.isZero() ? `p \\mathbf{k}` : `${b2Vec.toIJKString()} + p \\mathbf{k}`;

	// solution working
	const m = a
		.multiply(mu)
		.plus(b.multiply(lambda))
		.multiply(new Fraction(1, mu + lambda))
		.simplify();
	const area = a.cross(c).magnitude().divide(2);

	// answer
	return [b.z, m, area];
}

function qn08(variables?: { a?: Vector; b?: Vector }): [Vector, string, SquareRoot] {
	let { a, b } = { a: new Vector(1, 4, -3), b: new Vector(5, -1) };

	// solution working
	const p = a.plus(b);
	const angle = a.angleTo(b);
	const area = a.cross(b).magnitude();

	return [p, angle, area];
}

function qn09(variables?: {
	p1?: Vector;
	k?: number;
	q?: Vector;
	l?: number;
	m?: number;
}): [Vector, Fraction, Vector, string] {
	// set up
	const { p1, k, q } = { p1: new Vector(6, -2, 3), k: 2, q: new Vector(-1, -9, -4) };
	let { l, m } = { l: 2, m: 1 };
	const divisor = gcd(l, m);
	l /= divisor;
	m /= divisor;
	// question
	const p = p1.multiply(k);
	const a = p.minus(q.multiply(l));
	const b = p.plus(q.multiply(m));

	// solution working
	const pSolve = Vector.Ratio(a, b, { lambda: l, mu: m });
	const ab = b.minus(a);
	const dot = ab.dot(pSolve);
	const c = p.divide(p.magnitude().coeff, { multiplyIntoCoeff: true }).simplify();
	const area = a.cross(p).magnitude().divide(2);
	const approxArea = area.toPrecision(3);

	return [pSolve, dot, c, approxArea];
}

function qn10(variables?: { a?: Vector; b?: Vector }): [xVector, SquareRoot] {
	let { a, b } = { a: new Vector(2, 3, 6), b: new Vector(1, -2, 2) };
	// construction
	const variable = 'p';
	const pA = new xVector(new Term(a.x, variable), new Term(a.y, variable), new Term(a.z, variable));
	const p = b.magnitude().divide(a.magnitude());

	return [pA, p];
}

function qn11a(variables?: { l1?: number; m1?: number; l2?: number; m2?: number }): [uVectorExpression, Fraction] {
	let { l1, m1, l2, m2 } = { l1: 1, m1: 2, l2: 3, m2: 2 };

	// construction
	const p = new uVector('a', new Fraction(l1, l1 + m1));
	const q = new uVector('b', new Fraction(l2, l2 + m2));
	const m = p.multiply(new Fraction(1, 2)).plus(q.multiply(new Fraction(1, 2)));
	const cross = m.cross(p).multiply(new Fraction(1, 2));
	const k = cross.vectors[0].coeff.abs();
	return [m, k];
}

function qn12(variables?: { a?: Vector; b?: Vector; m1?: number; l2?: number; m2?: number }): [Vector, Vector] {
	let { a, b, m1, l2, m2 } = { a: new Vector(1, -1, 1), b: new Vector(1, 2), m1: 6, l2: 1, m2: 4 };
	let c2 = a.multiply(l2).plus(b.multiply(m2));
	while (c2.dot(a).isEqualTo(0) || c2.dot(b).isEqualTo(0)) {
		l2++;
		c2 = a.multiply(l2).plus(b.multiply(m2));
	}
	// construct qn/answers
	const c1 = b.multiply(m1);
	const area = c1.cross(a).magnitude().divide(2);

	// solution working
	const lambda = new Term('\\lambda');
	const c3 = new xVector(
		new Expression(lambda.times(a.x), b.multiply(m2).x),
		new Expression(lambda.times(a.y), b.multiply(m2).y),
		new Expression(lambda.times(a.z), b.multiply(m2).z),
	);
	const quadratic = expToPoly(c3.magnitudeSquare().minus(c2.magnitudeSquare()));
	const roots = solveQuadratic(quadratic);
	const [lambda1, lambda2] = roots;
	const c2b = c3.subIn(lambda2 as Fraction);
	const c2a = c3.subIn(lambda1 as Fraction);

	return [c2a, c2b];
}

function qn15(variables?: {
	l1?: number;
	m1?: number;
	l2?: number;
	m2?: number;
}): [uVector, string, uVectorExpression, Fraction] {
	// set up
	let { l1, l2, m1, m2 } = { l1: 3, m1: 2, l2: 5, m2: 6 };
	const divisor1 = gcd(l1, m1);
	const divisor2 = gcd(l2, m2);
	[l1, m1] = [l1 / divisor1, m1 / divisor1];
	[l2, m2] = [l2 / divisor2, m2 / divisor2];

	// question
	const f1 = new Fraction(l1, l1 + m1);
	const f2 = new Fraction(l2, l2 + m2);
	const f1A = new uxVector('a', new Term(f1, '\\lambda'));
	const f2B = new uxVector('b', new Term(f2, '\\mu'));
	const bcVec = `\\mathbf{r} = ${f1A} + (1-\\lambda) \\mathbf{b}`;
	const adVec = `\\mathbf{r} = (1-\\mu) \\mathbf{a} + ${f2B}`;

	// answer
	const c = new uVector('a', f1);
	const [lambda, mu] = cramersFrac(f1, 1, 1, 1, f2, 1);
	const a1 = f1A.subIn(lambda);
	const b1 = new uVector('b', lambda.negative().plus(1));
	const e = a1.plus(b1);
	const ratio = mu.divide(mu.negative().plus(1));

	return [c, adVec, e, ratio];
}

function qn16(variables?: { u?: Vector }): [xVector, xVector] {
	// setup
	let { u } = { u: new Vector(2, -1, 2) };

	// question
	const v = new xVector('a', 0, 'b');
	const vIJK = `a\\mathbf{i} + b \\mathbf{k}`;

	// answer
	const vector = v.plus(u).cross(v.negative().plus(u));
	const v2 = new xVector('a', 0, new Term(-1, 'a'));
	const vector2 = v2.plus(u).cross(v2.negative().plus(u));
	// typeset
	return [vector, vector2];
}
