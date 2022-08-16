import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomVec,
	Vector,
	getRandomInt,
	Fraction,
	xVector,
	getNiceVec,
	Term,
	expToPoly,
	solveLinear,
	getRandomFrac,
	Line,
	Plane,
	getRandomPerp,
	cramersFrac,
	Expression,
} from 'mathlify';
import { math, display } from 'mathlifier';

function qn0(variables?: {
	pt?: Vector; // pt on line
	n?: Vector; // normal to plane
	k?: number; // d = k n
	rhs?: Fraction; // rhs of plane
	lambda?: number; // lambda to get A
}): [AnswerObject, AnswerObject] {
	// set up
	let { pt, n, k } = {
		pt: getRandomVec({ min: -10, max: 10 }),
		n: getRandomVec({ min: -3, max: 3, simplify: true }),
		k: getRandomInt(-3, 3, { avoid: [0] }),
		...variables,
	};
	let d = n.multiply(k);
	let l = new Line(pt, d);
	while (l.distanceTo(Vector.ZERO).valueOf() <= 1) {
		// so that part iv answer >= 1
		pt = getRandomVec({ min: -10, max: 10 });
		n = getRandomVec({ min: -3, max: 3, simplify: true });
		k = getRandomInt(-3, 3, { avoid: [0] });
		d = n.multiply(k);
		l = new Line(pt, d);
	}
	const lambda1 = getRandomFrac({ numRange: [-3, 3], denRange: [1, 2], avoid: [0] });
	const x = l.point(lambda1);
	const rhs = variables?.rhs ?? x.dot(n);
	const p = new Plane(n, { rhs });
	const avoid = lambda1.isInteger() ? [lambda1.num, 0] : [0];
	const lambda = variables?.lambda ?? getRandomInt(-5, 5, { avoid });
	const a = l.point(lambda);

	// construction

	// question
	const body = `The line ${math('l')} has equation
		${display(`${l.toCartesianString()},`)}
		and the plane ${math('p')} has equation
		${display(`${p.toCartesianString()}.`)}
  `;
	const partI = `Show that ${math('l')} is perpendicular to ${math(`p.`)}`;
	const partII = `Find the coordinates of the point of intersection of ${math('l')} and ${math(
		'p.',
	)}`;
	const partIII = `Show that the point ${math('A')} with coordiantes ${math(a.toCoordinates())}
		lies on ${math('l.')}
		<div class="top-margin">
			Find the coordinates of the point ${math('B')} which is the mirror image of ${math('A')} in ${math(
		'p.',
	)}
		</div>
		`;
	const partIV = `Find the area of triangle ${math('OAB,')} where
		${math('O')} is the origin, giving your answer to the nearest whole number.`;

	// solution working
	const xSolve = p.intersectLine(l) as Vector;
	const b = p.pointReflection(a);
	const area = a.cross(b).magnitude().divide(2);
	let areaString = `\\textrm{Area} = ${area.toFixed(0)}`;
	areaString += ` \\textrm{ units}^2`;

	// answer
	const ansI = `The direction vector of ${math('l')} is parallel to the normal vector of ${math(
		'p.',
	)}`;
	const ansII = math(`${xSolve.toCoordinates()}.`);
	const ansIII = math(`${b.toCoordinates('B')}.`);
	const ansIV = math(`${areaString}.`, { wrap: true });

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 4 },
			{ body: partIII, marks: 3 },
			{ body: partIV, marks: 3 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }, { body: ansIV }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn1(variables?: {
	pt1?: Vector; // pt on plane
	pt2?: Vector; // pt on plane
	pt3?: Vector; // pt on plane
	a1?: Vector; // pt on l1
	d1?: Vector; // direction of l1
	a2?: Vector; // pt on l2
	d2?: Vector; // direction of l2
}): [AnswerObject, AnswerObject] {
	// set up
	// generate simple plane
	const aGen = getRandomVec({ min: -2, max: 2 });
	const dGen1 = getRandomVec({ min: -2, max: 2, simplify: true });
	const dGen2 = getRandomVec({
		min: -2,
		max: 2,
		simplify: true,
		avoid: [dGen1],
		avoidParallel: true,
	});
	// get pts 1, 2, 3 by getting parameters
	const s1 = getRandomInt(-5, 5);
	const t1 = getRandomInt(-5, 5);
	const pt1 = variables?.pt1 ?? aGen.plus(dGen1.multiply(s1)).plus(dGen2.multiply(t1));
	let s2 = getRandomInt(-5, 5);
	let t2 = getRandomInt(-5, 5);
	let pt2 = variables?.pt2 ?? aGen.plus(dGen1.multiply(s2)).plus(dGen2.multiply(t2));
	while (pt1.isEqualTo(pt2)) {
		s2 = getRandomInt(-5, 5);
		t2 = getRandomInt(-5, 5);
		pt2 = aGen.plus(dGen1.multiply(s2)).plus(dGen2.multiply(t2));
	}
	const lGen = new Line(pt1, pt2, { twoPointsMode: true });
	let s3 = getRandomInt(-5, 5);
	let t3 = getRandomInt(-5, 5);
	let pt3 = variables?.pt3 ?? aGen.plus(dGen1.multiply(s3)).plus(dGen2.multiply(t3));
	while (lGen.contains(pt3)) {
		s3 = getRandomInt(-5, 5);
		t3 = getRandomInt(-5, 5);
		pt3 = aGen.plus(dGen1.multiply(s3)).plus(dGen2.multiply(t3));
	}
	const p = new Plane(pt1, { mode: 'ptPtPt', v2: pt2, v3: pt3 });
	// generate l1 which lies in p
	let s4 = getRandomInt(-5, 5);
	let t4 = getRandomInt(-5, 5);
	let a1 = variables?.a1 ?? aGen.plus(dGen1.multiply(s4)).plus(dGen2.multiply(t4));
	while (pt1.isEqualTo(a1) || pt2.isEqualTo(a1) || pt3.isEqualTo(a1)) {
		s4 = getRandomInt(-5, 5);
		t4 = getRandomInt(-5, 5);
		a1 = aGen.plus(dGen1.multiply(s4)).plus(dGen2.multiply(t4));
	}
	const d1 = variables?.d1 ?? getRandomPerp(p.n, { simplify: true });
	const l1 = new Line(a1, d1);
	// generate l2 (non-parallel, non-perpendicular to p) which intersects l1
	let d2 = variables?.d2 ?? getRandomVec({ min: -7, max: 7, simplify: true });
	// z must be non-zero to find unknown k. x,y non-zero for simplicity
	const d1XY = new Vector(d1.x, d1.y);
	let d2XY = new Vector(d2.x, d2.y);
	while (
		d2.z.isEqualTo(0) ||
		d2.x.isEqualTo(0) ||
		d2.y.isEqualTo(0) ||
		d2.isParallelTo(p.n) ||
		d2.isPerpendicularTo(p.n) ||
		d2XY.isParallelTo(d1XY)
	) {
		d2 = getRandomVec({ min: -7, max: 7, simplify: true });
		d2XY = new Vector(d2.x, d2.y);
	}
	const lambda = getRandomInt(-5, 5, { avoid: [0] });
	const mu = getRandomInt(-5, 5, { avoid: [0] });
	const a2 = variables?.a2 ?? l1.point(lambda).minus(d2.multiply(mu));
	const l2 = new Line(a2, d2);

	// construction
	const xNum = new Term('x').minus(a2.x);
	const yNum = new Term('y').minus(a2.y);
	const zNum = new Term('z').minus(a2.z);
	const p2Unknown = `\\frac{${xNum}}{${d2.x}} = \\frac{${yNum}}{${d2.y}} = \\frac{${zNum}}{k}`;

	// question
	const body = `The plane ${math('p')} passes through the points with coordinates
		${math(pt1.toCoordinates() + ',')} ${math(pt2.toCoordinates())} ${math(pt3.toCoordinates() + '.')}
  `;
	const partI = `Find a cartesian equation of ${math(`p.`)}`;
	const uplevel = `The line ${math('l_1')} has equation
		${display(`${l1.toCartesianString()}`)}
		and the line ${math('l_2')} has equation
		${display(`${p2Unknown},`)}
		where ${math(`k`)} is a constant. It is given that ${math('l_1')} and ${math('l_2')} intersect.
	`;
	const partII = `Find the value of ${math('k.')}`;
	const partIII = `Show that ${math('l_1')} lies in ${math('p')}
		and find the coordinates of the point at which ${math('l_2')} intersects ${math('p.')}
		`;
	const partIV = `Find the acute angle between ${math('l_2')} and ${math('p.')}`;

	// solution working
	const xSolve = p.intersectLine(l2) as Vector;
	const [lambdaSolve, muSolve] = cramersFrac(
		d1.x,
		d2.x.negative(),
		a2.x.minus(a1.x),
		d1.y,
		d2.y.negative(),
		a2.y.minus(a1.y),
	);
	const k = a1.z.plus(lambdaSolve.times(d1.z)).minus(a2.z).divide(muSolve);
	const angle = p.angleTo(l2);

	// answer
	const ansI = math(`${p.toCartesianString()}.`);
	const ansII = math(`k = ${k}.`);
	const ansIII = math(`${xSolve.toCoordinates()}.`);
	const ansIV = math(`\\theta = ${angle}.`);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 4 },
			{ body: partII, marks: 4, uplevel },
			{ body: partIII, marks: 4 },
			{ body: partIV, marks: 3 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }, { body: ansIV }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn2(variables?: { a?: Vector; b?: Vector; c?: Vector }): [AnswerObject, AnswerObject] {
	// generate variables
	const a = variables?.a ?? getRandomVec({ min: -9, max: 9 });
	const d = getRandomVec({ min: -2, max: 2, simplify: true });
	const lambda1 = getRandomInt(-9, 9, { avoid: [0, 1, -1] });
	const b = variables?.b ?? a.plus(d.multiply(lambda1));
	const l = new Line(a, b, { twoPointsMode: true });
	const lambda2 = Math.sign(lambda1) * getRandomInt(1, Math.abs(lambda1) - 1);
	const n = l.point(lambda2);
	const perp = getRandomPerp(l.d, { min: -2, max: 2, simplify: true });
	const mu = getRandomInt(-4, 4, { avoid: [0] });
	const c = variables?.c ?? n.plus(perp.multiply(mu));

	// construct qn/answers

	// typeset qn/answers
	const partI = `Find a vector equation of the line through the points ${math('A')}
		and ${math('B')} with position vectors ${math(`${a.toIJKString()}`)} and
		${math(`${b.toIJKString()}`)} respectively.`;
	const partII = `The perpendicular to this line from the point ${math('C')}
		with position vector ${math(`${c.toIJKString()}`)} meets the line at the point ${math('N.')}
		Find the position vector of ${math('N')} and the ratio ${math('AN:NB.')}	
	`;
	const partIII = `Find the cartesian equation of the line which is a reflection of the line
		${math('AC')} in the line ${math('AB.')}`;

	// solution working
	const nSolve = l.footOfPerpendicular(c);
	const an = nSolve.minus(a);
	const nb = b.minus(nSolve);
	const ratio = nb.x.isEqualTo(0)
		? nb.y.isEqualTo(0)
			? an.z.divide(nb.z)
			: an.y.divide(nb.y)
		: an.x.divide(nb.x);
	const cPrime = l.pointReflection(c);
	const lPrime = new Line(a, cPrime, { twoPointsMode: true });

	// answer
	const ansI = math(`l: {${l}}, \\allowbreak \\; \\lambda \\in \\mathbb{R}.`, { wrap: true });
	const ansII = `${math(`\\overrightarrow{ON} = ${nSolve}.`)}<br>
		${math(`AN:NB = ${Math.abs(ratio.num)}: ${ratio.den}.`)}`;
	const ansIII = math(`\\displaystyle ${lPrime.toCartesianString()}.`, { wrap: true });

	const question: AnswerObject = {
		parts: [
			{ body: partI, marks: 3 },
			{ body: partII, marks: 5 },
			{ body: partIII, marks: 4 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn3(variables?: {
	n1?: Vector;
	n2?: Vector;
	rhs1?: number;
	rhs2?: number;
	aX?: number;
	aY?: number;
}): [AnswerObject, AnswerObject] {
	// generate variables
	const n1 = variables?.n1 ?? getNiceVec({ max: 9 });
	let n2 = variables?.n2 ?? getNiceVec({ max: 9 });
	// ensure two answers for c
	while (
		n1.isParallelTo(n2) ||
		n1.isPerpendicularTo(n2) ||
		n1.multiply(n2.magnitude().coeff).plus(n2.multiply(n1.magnitude().coeff)).z.isEqualTo(0) ||
		n1.multiply(n2.magnitude().coeff).minus(n2.multiply(n1.magnitude().coeff)).z.isEqualTo(0)
	) {
		n2 = getNiceVec({ max: 9 });
	}
	const rhs1 = variables?.rhs1 ?? getRandomInt(-5, 5);
	const rhs2 = variables?.rhs2 ?? getRandomInt(-5, 5, { avoid: [0] });
	const aX = variables?.aX ?? getRandomInt(-5, 5);
	const aY = variables?.aY ?? getRandomInt(-5, 5);

	// construct qn
	const p1 = new Plane(n1, { rhs: rhs1 });
	const p2 = new Plane(n2, { rhs: rhs2 });
	const a = `A \\left( ${aX}, ${aY}, c \\right)`;

	// typeset qn/answers
	const body = `The planes ${math('p_1')} and ${math('p_2')} has equations
		${math(`${p1}`)} and ${math(`${p2}`)} respectively, and meet in the line
		${math('l.')}`;
	const partI = `Find the acute angle between ${math('p_1')} and ${math('p_2.')}`;
	const partII = `Find a vector equation for ${math('l.')}`;
	const partIII = `The point ${math(a)} is equidistanct from ${math('p_1')} and
		${math('p_2.')} Calculate the two possible values of ${math('c.')}`;

	// solution working
	const angle = p1.angleTo(p2);
	const l = p1.intersectPlane(p2) as Line;
	const pt1 = p1.point();
	const pt2 = p2.point();
	const aUnknown = new xVector(aX, aY, 'c');
	const distance1 = aUnknown.minus(pt1).dot(n1.hat());
	const distance2 = aUnknown.minus(pt2).dot(n2.hat());
	const eqn1 = expToPoly(distance1.minus(distance2));
	const c1 = solveLinear(eqn1);
	const eqn2 = expToPoly(distance1.plus(distance2));
	const c2 = solveLinear(eqn2);

	// answer
	const ansI = math(`\\theta = ${angle}.`);
	const ansII = math(`l: {${l}}, \\allowbreak \\; \\lambda \\in \\mathbb{R}.`, { wrap: true });
	const ansIII = `${math(`c=${c1}`)} or ${math(`c=${c2}.`)}`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 3 },
			{ body: partII, marks: 4 },
			{ body: partIII, marks: 6 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn4(variables?: {
	a?: Vector; // point on l
	nQ?: Vector; // normal vector of q
	dPrime?: Vector; // direction vector of m
	rhs?: Fraction; // rhs of plane p
	d?: Vector;
}): [AnswerObject, AnswerObject] {
	// generate variables
	// normal and direction vectors
	let dPrime = variables?.dPrime ?? getRandomVec({ min: -4, max: 4, simplify: true });
	while (dPrime.magnitudeSquare().isGreaterThan(21)) {
		dPrime = getRandomVec({ min: -4, max: 4, simplify: true });
	}
	const nQ = variables?.nQ ?? getRandomPerp(dPrime);
	// intersection pt
	const x = getRandomInt(-6, 6, { avoid: [0] });
	const y = getRandomInt(-5, 5, { avoid: [0] });
	const xVec = new Vector(x, y);
	const n = nQ.cross(dPrime).simplify({ stretchable: true });
	const rhs = variables?.rhs ?? xVec.dot(n);
	let d = variables?.d ?? getRandomPerp(nQ);
	while (d.isParallelTo(n) || d.isParallelTo(dPrime)) {
		d = getRandomPerp(nQ);
	}
	const a = variables?.a ?? xVec.plus(d);

	// set up qn/answers
	const p = new Plane(n, { rhs });
	const l = new Line(a, d);

	// typeset qn/answers
	const body = `Planes ${math('p')} and ${math('q')} are perpendicular. Plane
		${math('p')} has equation ${math(`${p.toCartesianString()}.`)} Plane ${math('q')}
		constains the line ${math('l')} with equation
		${math(`\\displaystyle ${l.toCartesianString()}.`)}
		The point ${math('A')} on ${math('l')} has coordinates ${math(`${a.toCoordinates()}.`)}`;
	const partI = `Find a cartesian equation of ${math('q.')}`;
	const partII = `Find a vector equation of the line ${math('m')} where ${math('p')}
		and ${math('q')} meet.`;
	const partIII = `${math('B')} is a general point on ${math(
		'm.',
	)} Find an expression for the square of the
		distance ${math('AB.')}
		<div class="top-margin">
			Hence, or otherwise, find the coordinates of the point on ${math('m')} that is nearest to ${math(
		'A.',
	)}
		</div>
	`;

	// solution working
	const q = new Plane(a, { mode: 'ptDD', v2: d, v3: n });
	const m = p.intersectPlane(q) as Line;
	m.lambda = '\\mu';
	const exp1 = new Term(m.d.x, '\\mu').plus(m.a.minus(a).x).square() as Expression;
	const exp2 = new Term(m.d.y, '\\mu').plus(m.a.minus(a).y).square();
	const exp3 = new Term(m.d.z, '\\mu').plus(m.a.minus(a).z).square();
	const exp = exp1.plus(exp2).plus(exp3);
	const poly = expToPoly(exp);
	const foot = m.footOfPerpendicular(a);

	// answer
	const ansI = math(`q: ${q.toCartesianString()}.`);
	const ansII = math(`m: {${m}}, \\allowbreak \\; \\mu \\in \\mathbb{R}.`, { wrap: true });
	const ansIII = `${math(`${poly}.`)}
		<div class="top-margin">
			${math(`${foot.toCoordinates()}.`)}
		</div>
	`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 4 },
			{ body: partII, marks: 4 },
			{ body: partIII, marks: 5 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

export const qnLogics = {
	qn0,
	qn1,
	qn2,
	qn3,
	qn4,
};
