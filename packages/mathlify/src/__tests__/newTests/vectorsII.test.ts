import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Expression } from '../../core';
import {
	Vector,
	SquareRoot,
	Fraction,
	gcd,
	xVector,
	uVector,
	Unknown,
	Term,
	expToPoly,
	solveQuadratic,
	uVectorExpression,
	uxVector,
	cramersFrac,
	Line,
	Plane,
	solveLinear,
	completeSquare,
} from '../../index';

const vectorsI = suite('12: Vectors I');

vectorsI('2007-2009', () => {
	const vars07 = qn07();
	assert.is(`${vars07[0].toCoordinates()}`, '\\left( \\frac{5}{2}, \\frac{3}{2}, \\frac{11}{2} \\right)');
	assert.is(`${vars07[1]}`, '78.8^\\circ');
	assert.is(`${vars07[2]}`, '\\frac{4}{7} \\sqrt{14}');
	const vars08 = qn08();
	assert.is(`${vars08[0].toCoordinates()}`, '\\left( - \\frac{4}{11}, - \\frac{4}{11}, \\frac{7}{11} \\right)');
	assert.is(
		`${vars08[1]}`,
		'\\mathbf{r} = \\begin{pmatrix}\n\t- 1 \\\\\n\t- 1 \\\\\n\t0\n\\end{pmatrix} + \\lambda \\begin{pmatrix}\n\t1 \\\\\n\t1 \\\\\n\t1\n\\end{pmatrix}',
	);
	assert.is(`${vars08[2]}`, '- 22');
	assert.is(`${vars08[3]}`, '17');
	assert.is(`${vars08[4].toCartesianString()}`, '- 3 x + y + 2 z = 2');
	//const vars09 = qn09();
	//assert.is(`${vars09[0].toCoordinates()}`, '\\left( 12, - 4, 6 \\right)');
	//assert.is(vars09[1].isEqualTo(0), true);
	//assert.is(`${vars09[2]}`, '\\frac{1}{7} \\begin{pmatrix}\n\t6 \\\\\n\t- 2 \\\\\n\t3\n\\end{pmatrix}');
	//assert.is(`${vars09[3]}`, '139');
});

vectorsI('2010-2014', () => {
	//const vars10 = qn10();
	//assert.is(`${vars10[0]}`, '\\begin{pmatrix}\n\t2 p \\\\\n\t3 p \\\\\n\t6 p\n\\end{pmatrix}');
	//assert.is(`${vars10[1]}`, '\\frac{3}{7}');
	//const vars11a = qn11a();
	//assert.is(`${vars11a[0]}`, '\\frac{1}{6} \\mathbf{a} + \\frac{3}{10} \\mathbf{b}');
	//assert.is(vars11a[1].isEqualTo(new Fraction(1, 20)), true);
	//const vars12 = qn12();
	//assert.is(`${vars12[0].toCoordinates()}`, '\\left( 5, 7, 1 \\right)');
	//assert.is(`${vars12[1].toCoordinates('C')}`, 'C \\left( \\frac{17}{3}, \\frac{19}{3}, \\frac{5}{3} \\right)');
	const vars14 = qn14();
	assert.is(`${vars14[0]}`, '\\mathbf{r} \\cdot \\begin{pmatrix}\n\t- 1 \\\\\n\t2 \\\\\n\t1\n\\end{pmatrix} = 0');
	assert.is(vars14[1].isEqualTo(new Line(new Vector(10, 4, 2), new Vector(-8, -2, -4))), true);
	assert.is(`${vars14[2]}`, '21 \\mu^2 + 36 \\mu + 50');
	assert.is(`${vars14[3].toCoordinates()}`, '\\left( \\frac{18}{7}, \\frac{15}{7}, - \\frac{12}{7} \\right)');
});
vectorsI('2015-2019', () => {
	//const vars15 = qn15();
	//assert.is(`${vars15[0]}`, '\\frac{3}{5} \\mathbf{a}');
	//assert.is(`${vars15[1]}`, '\\mathbf{r} = (1-\\mu) \\mathbf{a} + \\frac{5}{11} \\mu \\mathbf{b}');
	//assert.is(`${vars15[2]}`, '\\frac{9}{20} \\mathbf{a} + \\frac{1}{4} \\mathbf{b}');
	//assert.is(`${vars15[3]}`, '\\frac{11}{9}');
	const vars16 = qn16();
	assert.is(`${vars16[0]}`, '- \\frac{8}{9}');
	assert.is(`${vars16[1]}`, '\\frac{19}{18}');
	assert.is(`${vars16[2]}`, '\\frac{5}{9}');
	assert.is(`${vars16[3].toCartesianString()}`, '- 2 x + y + 2 z = 35');
	assert.is(`${vars16[4].toCartesianString()}`, '- 2 x + y + 2 z = - 37');
	assert.is(`${vars16[5]}`, '\\frac{9}{2}');
	const vars17 = qn17();
	assert.is(`${vars17[0]}`, '- \\frac{22}{5}');
	assert.is(`${vars17[1]}`, '14 \\left( \\lambda - \\frac{5}{4} \\right)^2 + \\frac{1}{8}');
	assert.is(`${vars17[2].toCoordinates()}`, '\\left( \\frac{3}{2}, \\frac{1}{2}, - 1 \\right)');
	assert.is(`${vars17[3]}`, '\\frac{1}{2} \\sqrt{10}');
});

vectorsI.run();

function qn07(variables?: { a?: Vector; b?: Vector; n?: Vector; lambda?: Fraction }): [Vector, string, SquareRoot] {
	let { a, b, lambda, n } = {
		a: new Vector(1, 2, 4),
		b: new Vector(-2, 3, 1),
		n: new Vector(3, -1, 2),
		lambda: new Fraction(-1, 2),
	};
	// set up
	const d = b.minus(a);
	const l = new Line(a, d);
	const x = l.point(lambda);
	const p = new Plane(n, { rhs: x.dot(n) });

	// solution working
	const xSolve = p.intersectLine(l) as Vector;
	const angle = p.angleTo(l);
	const distance = p.distanceTo(a);

	return [xSolve, angle, distance];
}

function qn08(variables?: {
	n1?: Vector;
	n2?: Vector;
	n3?: Vector;
	rhs1?: Fraction;
	rhs2?: Fraction;
	rhs3?: Fraction;
	b?: Vector;
}): [Vector, Line, Fraction, Fraction, Plane] {
	const { n1, n2, n3, rhs1, rhs2, rhs3, b } = {
		n1: new Vector(2, -5, 3),
		n2: new Vector(3, 2, -5),
		n3: new Vector(5, new Fraction(-209, 10), 17),
		rhs1: new Fraction(3),
		rhs2: new Fraction(-5),
		rhs3: new Fraction(166, 10),
		b: new Vector(1, -1, 3),
	};

	// set up
	const p1 = new Plane(n1, { rhs: rhs1 });
	const p2 = new Plane(n2, { rhs: rhs2 });
	const n3Unknown = new xVector(n3.x, '\\lambda', n3.z);
	const lambdaPlane = n3.y.isInteger() ? `${n3.y}` : `${n3.y.valueOf()}`;
	const muPlane = rhs3.isInteger() ? `${rhs3}` : `${rhs3.valueOf()}`;

	// solution working
	const p3Solve = new Plane(n3, { rhs: rhs3 });
	const lSolve = p1.intersectPlane(p2) as Line;
	const xSolve = p3Solve.intersectLine(lSolve) as Vector;
	const lambdaEqn = n3Unknown.dot(lSolve.d);
	const lambdaPoly = expToPoly(lambdaEqn);
	const lambdaSolve = solveLinear(lambdaPoly);
	const n3Solve = new Vector(n3.x, lambdaSolve, n3.z);
	const muSolve = lSolve.a.dot(n3Solve);
	const newP = new Plane(b, { mode: 'ptPtD', v2: lSolve.a, v3: lSolve.d });

	// answer
	return [xSolve, lSolve, lambdaSolve, muSolve, newP];
}

function qn14(variables?: {
	a?: Vector; // point on l
	nQ?: Vector; // normal vector of q
	dPrime?: Vector; // direction vector of m
	rhs?: Fraction; // rhs of plane p
	d?: Vector;
}): [Plane, Line, Expression, Vector] {
	// generate variables
	const { a, nQ, dPrime, rhs, d } = {
		a: new Vector(1, -1, 3),
		dPrime: new Vector(4, 1, 2),
		nQ: new Vector(-1, 2, 1),
		rhs: new Fraction(12),
		d: new Vector(2, -1, 4),
	};

	// set up qn/answers
	const n = nQ.cross(dPrime).simplify({ stretchable: true });
	const p = new Plane(n, { rhs });
	const l = new Line(a, d);

	// solution working
	const q = new Plane(a, { mode: 'ptDD', v2: d, v3: n });
	const m = p.intersectPlane(q) as Line;
	m.lambda = '\\mu';
	const exp1 = new Term(m.d.x, '\\mu').plus(m.a.minus(a).x).square() as Expression;
	const exp2 = new Term(m.d.y, '\\mu').plus(m.a.minus(a).y).square();
	const exp3 = new Term(m.d.z, '\\mu').plus(m.a.minus(a).z).square();
	const exp = exp1.plus(exp2).plus(exp3);
	const foot = m.footOfPerpendicular(a);

	return [q, m, exp, foot];
}

function qn16(variables?: {
	a1?: Vector;
	dp1?: Vector;
	dp2?: Vector;
	a2?: Vector;
	distance?: number;
	n?: Vector;
}): [Fraction, Fraction, Fraction, Plane, Plane, Fraction] {
	// setup
	const { a1, dp1, dp2, a2, distance, n } = {
		a1: new Vector(1, -3, 2),
		dp1: new Vector(1, 2, 0),
		dp2: new Vector(0, 4, -2),
		a2: new Vector(-1, 0, 1),
		n: new Vector(-2, 1, 2),
		distance: 12,
	};

	// question
	const a = dp2.x;
	const dp2Unknown = new xVector('a', dp2.y, dp2.z);
	const l1 = new Line(a1, dp1);
	const pString = `${l1}+\\mu${dp2Unknown}`;
	const diffVec = a2.minus(new Vector(a, a, a));
	const a2String = new xVector('a', 'a', 'a').plus(diffVec);

	// answer
	const [lambda, mu, t] = cramersFrac(
		dp1.x,
		dp2.x,
		n.x,
		a2.minus(a1).x,
		dp1.y,
		dp2.y,
		n.y,
		a2.minus(a1).y,
		dp1.z,
		dp2.z,
		n.z,
		a2.minus(a1).z,
	);
	const nSolve = dp1.cross(dp2).simplify({ stretchable: true });
	const rhs = a1.dot(nSolve);
	const rhs1 = rhs.plus(nSolve.magnitude().coeff.times(distance));
	const rhs2 = rhs.minus(nSolve.magnitude().coeff.times(distance));
	const p1 = new Plane(nSolve, { rhs: rhs1 });
	const p2 = new Plane(nSolve, { rhs: rhs2 });
	const nUnknown = dp2Unknown.cross(dp1);
	const dot = nUnknown.dot(n);
	const poly = expToPoly(dot);
	const aSolve = solveLinear(poly);

	return [lambda, mu, t, p1, p2, aSolve];
}

function qn17(variables?: { d?: Vector; p?: Vector; q?: Vector }): [Fraction, string, Vector, SquareRoot] {
	// setup
	const { d, p, q } = { d: new Vector(3, 1, -2), p: new Vector(1, 2, -1), q: new Vector(5, 7, -3) };

	// answer
	const pq = q.minus(p);
	// lambda d = p + mu (q - p)
	const [lambda, mu] = cramersFrac(d.x, pq.x.negative(), p.x, d.y, pq.y.negative(), p.y);
	const aSolve = d.z.times(lambda).minus(p.z).plus(p.z.times(mu)).divide(mu);
	const rUnknown = new xVector(new Term(d.x, '\\lambda'), new Term(d.y, '\\lambda'), new Term(d.z, '\\lambda'));
	const pr = rUnknown.minus(p);
	const qr = rUnknown.minus(q);
	const dot = pr.dot(qr);
	const poly = expToPoly(dot);
	const completedSquare = completeSquare(poly);
	const l = new Line(Vector.ZERO, d);
	const r = l.footOfPerpendicular(p);
	const length = l.distanceTo(p);

	return [aSolve, completedSquare, r, length];
}
