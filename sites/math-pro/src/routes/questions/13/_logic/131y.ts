import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomVec,
	Vector,
	getRandomInt,
	Fraction,
	xVector,
	SquareRoot,
	cramersFrac,
	Line,
	getNiceVec,
	Term,
	expToPoly,
	solveQuadratic,
	Plane,
	getRandomPerp,
	solveLinear,
	getRandomFrac,
	completeSquare,
	shuffle,
} from 'mathlify';
import { math, display } from 'mathlifier';

function qn5(variables?: { a?: Vector; d?: Vector; p?: Vector }): [AnswerObject, AnswerObject] {
	// set up
	const a = variables?.a ?? getRandomVec();
	let d = variables?.d ?? getNiceVec({ max: 7 });
	while (d.isParallelTo(Vector.I)) {
		d = getNiceVec({ max: 7 });
	}
	const l = new Line(a, d);
	let p = variables?.p ?? getRandomVec({ min: -6, max: 6 });
	while (l.contains(p)) {
		p = getRandomVec({ min: -6, max: 6 });
	}
	const lambda = p.minus(a).dot(d).divide(d.magnitudeSquare());
	if (lambda.den > 9) {
		return qn5(variables);
	}
	let lambdaPlus: Fraction;
	if (lambda.isInteger()) {
		lambdaPlus = lambda.plus(1);
	} else {
		lambdaPlus = lambda.ceil();
	}
	const b = a.plus(d.multiply(lambdaPlus));
	const distance = p.minus(b).magnitude();

	// typeset
	const body = `The line ${math('L')} has equation
		${display(`${l.toIJKString()}.`)}
  `;
	const partI = `Find the acute angle between ${math('L')} and the ${math('x')}-axis.`;
	const uplevel = `The point ${math('P')} has position vector ${math(`${p.toIJKString()}.`)}`;
	const partII = `Find the points on ${math('L')} which are a distance of ${math(`${distance}`)}
		from ${math('P.')}
		<div class="top-margin">
			Hence or otherwise find the point on ${math('L')} which is closest to ${math('P.')}
		</div>
	`;
	const partIII = `Find a cartesian equation of the plane that includes the line ${math(
		'L',
	)} and the point
	${math('P.')}`;

	// answer
	const angle = l.angleTo(Vector.I);
	const lambdaD = new xVector(
		new Term(d.x, '\\lambda'),
		new Term(d.y, '\\lambda'),
		new Term(d.z, '\\lambda'),
	);
	const bp = lambdaD.plus(a).minus(p);
	const bpMagnitudeSquare = bp.magnitudeSquare();
	const eqn = bpMagnitudeSquare.minus(p.minus(b).magnitudeSquare());
	const poly = expToPoly(eqn);
	const [lambda1, lambda2] = solveQuadratic(poly);
	const b1 = l.point(lambda1);
	const b2 = l.point(lambda2);
	const f = b1.plus(b2).divide(2);
	const plane = new Plane(p, { mode: 'ptPtD', v2: l.a, v3: l.d });

	// typeset
	const partIAns = `${math(`\\theta=${angle}.`)}`;
	const partIIAns = `${math(`${b1.toCoordinates()}`)} and ${math(`${b2.toCoordinates()}.`)}
		<div class="top-margin">
			${math(`${f.toCoordinates()}.`)}
		</div>
	`;
	const partIIIAns = `${math(`${plane.toCartesianString()}.`)}`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, uplevel, marks: 5 },
			{ body: partIII, marks: 3 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: partIAns }, { body: partIIAns }, { body: partIIIAns }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn6(variables?: {
	a1?: Vector;
	dp1?: Vector;
	dp2?: Vector;
	a2?: Vector;
	distance?: number;
	n?: Vector;
}): [AnswerObject, AnswerObject] {
	// setup
	const { a1, a2, distance, n } = {
		a1: getRandomVec(),
		a2: getRandomVec(),
		distance: getRandomInt(1, 12),
		n: getNiceVec({ max: 9 }),
		...variables,
	};
	let dp1 = variables?.dp1 ?? getRandomPerp(n);
	while (dp1.z.times(n.y).minus(dp1.y.times(n.z)).isEqualTo(0)) {
		dp1 = getRandomPerp(n);
	}
	let dp2 = variables?.dp2 ?? getRandomPerp(n);
	while (dp1.isParallelTo(dp2)) {
		dp2 = getRandomPerp(n);
	}

	// question
	const a = dp2.x;
	const dp2Unknown = new xVector('a', dp2.y, dp2.z);
	const l1 = new Line(a1, dp1);
	const pString = `${l1}+\\mu${dp2Unknown}`;
	const diffVec = a2.minus(new Vector(a, a, a));
	const a2String = new xVector('a', 'a', 'a').plus(diffVec);

	// typeset
	const body = `The plane ${math('p')} has equation 
		${display(`${pString},`)} and the line ${math(`l`)} has equation
		${display(`\\mathbf{r}=${a2String}+t${n},`)}
		where ${math('a')} is a constant and ${math('\\lambda, \\mu')} and
		${math('t')} are parameters.
  `;
	const partI = `In the case where ${math(`a=${a},`)}`;
	const partIA = `Show that ${math('l')} is perpendicular to ${math('p')} and find the values of
		${math('\\lambda, \\mu')} and ${math('t')} which give the coordinates of the point at which ${math(
		'l',
	)}
		and ${math('p')} intersect,`;
	const partIB = `find the cartesian equations of the planes such that the perpendicular distance from each
	plane to ${math('p')} is ${math(`${distance}.`)}`;
	const partII = `Find the value of ${math('a')} such that ${math('l')} and
		${math('p')} do not meet in a unique point.`;

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

	// typeset
	const partIAAns = `${math(`\\lambda = ${lambda}, `)} ${math(`\\mu = ${mu}, `)} ${math(
		`t=${t}.`,
	)}`;
	const partIBAns = `${math(`${p1.toCartesianString()},`)}<br>${math(
		`${p2.toCartesianString()}.`,
	)}`;
	const partIIAns = `${math(`a=${aSolve}.`)}`;

	const question: AnswerObject = {
		body,
		parts: [
			{
				body: partI,
				parts: [
					{ body: partIA, marks: 5 },
					{ body: partIB, marks: 5 },
				],
				partLabelType: 'alpha',
			},
			{ body: partII, marks: 3 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [
			{ parts: [{ body: partIAAns }, { body: partIBAns }], partLabelType: 'alpha' },
			{ body: partIIAns },
		],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn7(variables?: { d?: Vector; p?: Vector; q?: Vector }): [AnswerObject, AnswerObject] {
	// setup
	const { d, p, q } = {
		...generateVarsQ7(),
		...variables,
	};

	// question
	const qUnknown = new xVector(q.x, q.y, 'a');

	// typeset
	const body = `Some engineers are installing water pipes at a site. Points ${math(`(x,y,z)`)}
		are defined relative to a main outlet at ${math(`(0,0,0), `)} where units are kilometres. Pipes
		are laid in striahgt lines and the width of the pipes can be neglected.
		<div class="top-margin">
			An existing water pipe ${math('W')} starts at the main outlet and goes in the direction
			${math(`${d}.`)} A new water pipe is installed which passes throuhg points 
			${math(`${p.toCoordinates('P')}`)} and ${math(`${qUnknown.toCoordinates('Q')}.`)}
		</div>
  `;
	const partI = `Find the value of ${math('a')} for which ${math(`W`)} and the new pipe will meet.`;
	const uplevel = `To ensure that the pipes do not meet, the engineers use ${math(`a=${q.z}.`)}
		The engineers wish to connect each of the points ${math('P')} and ${math('Q')} to a point
		${math(`R`)} on ${math('W.')}
	`;
	const partII = `The engineers wish to reduce the length of the pipes required and believe in order to do this that
		angle ${math(`PRQ`)} should be ${math(`90^\\circ.`)} Show that this is not possible.`;
	const partIII = `The engineers discover that the ground between ${math('P')}
		and ${math(`R`)} is difficult to drill through and now decide to make the length of ${math(
		'PR',
	)} as small as possible.
		Find the coordinates of ${math('R')} in this case and the exact minimum length.
	`;

	// answer
	const pq = q.minus(p);
	// lambda d = p + mu (q - p)
	const [lambda, mu] = cramersFrac(d.x, pq.x.negative(), p.x, d.y, pq.y.negative(), p.y);
	const aSolve = d.z.times(lambda).minus(p.z).plus(p.z.times(mu)).divide(mu);
	const rUnknown = new xVector(
		new Term(d.x, '\\lambda'),
		new Term(d.y, '\\lambda'),
		new Term(d.z, '\\lambda'),
	);
	const pr = rUnknown.minus(p);
	const qr = rUnknown.minus(q);
	const dot = pr.dot(qr);
	const poly = expToPoly(dot);
	const completedSquare = completeSquare(poly);
	const l = new Line(Vector.ZERO, d);
	const r = l.footOfPerpendicular(p);
	const length = l.distanceTo(p);

	// typeset
	const partIAns = `${math(`a = ${aSolve}.`)}`;
	const partIIAns = `${math(
		`\\overrightarrow{PR}\\cdot\\overrightarrow{QR} \\allowbreak {= ${completedSquare}} \\allowbreak {> 0 \\quad \\forall \\lambda \\in \\mathbb{R}.}`,
		{ wrap: true },
	)}<br>
		Hence ${math(`\\overrightarrow{PR}\\cdot\\overrightarrow{QR} \\neq 0`)} and angle ${math(
		'PQR',
	)} is never
		${math(`90^\\circ.`)}
	`;
	const partIIIAns = `${math(`${r.toCoordinates('R')}.`)}<br>Minimum length ${math(
		`= ${length} \\textrm{ km}.`,
	)}`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 4 },
			{ body: partII, marks: 4, uplevel },
			{ body: partIII, marks: 5 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: partIAns }, { body: partIIAns }, { body: partIIIAns }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn8(variables?: {
	a?: Vector;
	b?: Vector;
	c?: Vector;
	eZ?: number;
}): [AnswerObject, AnswerObject] {
	// set up
	const x = getRandomInt(2, 5);
	const y = getRandomInt(2, 5);
	const zs = shuffle([0, 1, 2]);
	const v1 = new Vector(x, y, zs[0]);
	const v2 = new Vector(x, -y, zs[1]);
	const v3 = new Vector(-x, y, zs[2]);
	const vs = shuffle([v1, v2, v3]);
	const { a, b, c, eZ } = {
		a: vs[0],
		b: vs[1],
		c: vs[2],
		eZ: getRandomInt(4, 10),
		...variables,
	};
	const e = new Vector(0, 0, eZ);

	// question

	// typeset
	const body = `An oblique pyramid has a plane base ${math('ABCD')} in the shape of a parallelogram.
		The coordinates of ${math('A, B')} and ${math('C')} are ${math(`${a.toCoordinates()}, `)}
		${math(`${b.toCoordinates()}`)} and ${math(
		`${c.toCoordinates()}`,
	)} respectively. The apex of the pyramid is at
		${math(`${e.toCoordinates('E')}.`)}
  `;
	const partI = `Find the coordinates of ${math(`D.`)}`;
	const partII = `Find the cartesian equation of face ${math(`BCE.`)}`;
	const partIII = `Find the angle between face ${math(`BCE`)} and the base of the pyramid.`;
	const partIV = `Find the shortest distance from the midpoint of edge ${math(`AD`)} to face ${math(
		`BCE.`,
	)}`;

	// answer working
	const d = a.plus(c).minus(b);
	const bce = new Plane(b, { mode: 'ptPtPt', v2: c, v3: e });
	const base = new Plane(a, { mode: 'ptPtPt', v2: b, v3: c });
	const angle = bce.angleTo(base);
	const mid = a.plus(d).divide(2);
	const distance = bce.distanceTo(mid);
	const approxVal = !distance.isRational() ? `\\approx ${distance.toPrecision(3)}` : '';

	// typeset answer
	const ansI = math(`${d.toCoordinates('D')}.`);
	const ansII = math(`${bce.toCartesianString()}.`);
	const ansIII = math(`\\theta = ${angle}.`);
	const ansIV = math(`${distance}${approxVal} \\textrm{ units}.`, { wrap: true });

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 1 },
			{ body: partII, marks: 3 },
			{ body: partIII, marks: 3 },
			{ body: partIV, marks: 5 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }, { body: ansIV }],
	};

	return [question, answer];
}

function qn9(variables?: {
	n?: Vector;
	d?: Vector;
	p?: Vector;
	s?: Vector;
	rhs1?: Fraction;
	rhs2?: Fraction;
}): [AnswerObject, AnswerObject] {
	// set up
	const { n, d, p, s, rhs1, rhs2 } = {
		...generateVarsQ9(),
		...variables,
	};

	// question
	const p1 = new Plane(n, { rhs: rhs1 });
	const p2 = new Plane(n, { rhs: rhs2 });

	// typeset
	const body = `A ray of light passes from air into a material made into a rectangular prism.
		The ray of light is sent in direction ${math(`${d}`)} from a light source at point ${math('P')}
		with coordinates ${math(`${p.toCoordinates()}.`)}
		<div class="top-margin">
			The prisim is placed so that the ray of light passes through the prism, entering at the point
			${math('Q')} and emerging at the point ${math('R')} and is picked up by a sensor at point ${math(
		'S',
	)}
			with coordinates ${math(`${s.toCoordinates()}.`)}
		</div>
		<div class="top-margin">
			The acute angle between ${math('PQ')} and the normal to the top of the prism at ${math('Q')} is
			${math(`\\theta`)} and the acute angle between ${math('QR')} and the same normal is ${math(
		'\\beta.',
	)}
		</div>
		<div class="top-margin">
			It is given that the top of the prism is a part of the plane ${math(`${p1.toCartesianString()},`)}
			and that the base of the prism is a part of the plane ${math(
				`${p2.toCartesianString()}.`,
			)} It is also
			given that the ray of light along ${math('PQ')} is parallel to the ray of light along ${math('RS')}
			so that ${math('P,Q,R')} and ${math('S')} lie in the same plane.
		</div>
  `;
	const partI = `Find the exact coordinates of ${math('Q')} and ${math('R.')}`;
	const partII = `Find the values of ${math('\\cos \\theta')} and ${math('\\cos \\beta.')}`;
	const partIII = `Find the thickness of the prism measured in the direction of the normal at ${math(
		'Q.',
	)}`;
	const uplevel = `Snell's law states that ${math(`\\sin \\theta = k \\sin \\beta,`)}
		where ${math('k')} is a constant called the refractive index.`;
	const partIV = `Find ${math('k')} for the material of the prism.`;
	const partV = `What can be said about the value of ${math('k')} for a material for which ${math(
		'\\beta > \\theta',
	)}`;

	// answer
	const l1 = new Line(p, d);
	const l2 = new Line(s, d);
	const q = p1.intersectLine(l1) as Vector;
	const r = p2.intersectLine(l2) as Vector;
	const cosTheta = new SquareRoot(d.dot(n).square()).divide(d.magnitude()).divide(n.magnitude());
	const qr = r.minus(q);
	const cosBeta = new SquareRoot(qr.dot(n).square()).divide(qr.magnitude()).divide(n.magnitude());
	const approxCosTheta = !cosTheta.isRational() ? `\\; \\approx ${cosTheta.toPrecision(3)}` : '';
	const approxCosBeta = !cosBeta.isRational() ? `\\; \\approx ${cosBeta.toPrecision(3)}` : '';
	const thickness = p1.distanceTo(p2);
	const approxThickness = !thickness.isRational() ? `\\; \\approx ${thickness.toPrecision(3)}` : '';
	const theta = Math.acos(cosTheta.valueOf());
	const beta = Math.acos(cosBeta.valueOf());
	const k = Math.sin(theta) / Math.sin(beta);

	// typeset
	const ansI = `${math(`${q.toCoordinates('Q')}, `)} ${math(`${r.toCoordinates('R')}.`)}`;
	const ansII = `${math(`{\\cos \\theta = ${cosTheta}} \\allowbreak {${approxCosTheta}}.`, {
		wrap: true,
	})}
		<br>${math(`{\\cos \\beta = ${cosBeta}} \\allowbreak {${approxCosBeta}}.`, {
			wrap: true,
		})}
	`;
	const ansIII = `Thickness ${math(
		`= ${thickness} \\allowbreak {${approxThickness}} \\textrm{ units}.`,
		{
			wrap: true,
		},
	)}`;
	const ansIV = `${math(`k = ${k.toPrecision(3)}.`)}`;
	const ansV = `${math(`k < 1.`)}`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 5 },
			{ body: partII, marks: 3 },
			{ body: partIII, marks: 3 },
			{ body: partIV, uplevel, marks: 1 },
			{ body: partV, marks: 1 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }, { body: ansIV }, { body: ansV }],
		partLabelType: 'roman',
	};
	return [question, answer];
}

export const qnLogics = {
	qn5,
	qn6,
	qn7,
	qn8,
	qn9,
};

function generateVarsQ7(): { d: Vector; p: Vector; q: Vector } {
	let d = getRandomVec({ min: -3, max: 3, simplify: true });
	while (d.x.isEqualTo(0) && d.y.isEqualTo(0)) {
		d = getRandomVec({ min: -3, max: 3, simplify: true });
	}
	// foot of perpendicular (to generate p)
	const n = getRandomPerp(d);
	const lambda = getRandomFrac({ numRange: [-3, 3], denRange: [1, 2], avoid: [0] });
	const r = d.multiply(lambda);
	// ensure p has integral components
	const p =
		r.x.den === 2 || r.y.den === 2 || r.z.den === 2
			? r.plus(n.multiply(new Fraction(1, 2)))
			: r.plus(n);
	if (p.x.den === 2 || p.y.den === 2 || p.z.den === 2) {
		return generateVarsQ7();
	}
	// generate q
	let q = getRandomVec({ min: -7, max: 7, avoid: [p, d], avoidParallel: true });
	let pq = q.minus(p);
	//const l1 = new Line(Vector.ZERO, d);
	//let l2 = new Line(p, pq);
	// ensure lambda, mu can be solved
	while (d.x.times(pq.y.negative()).minus(d.y.times(pq.x.negative())).isEqualTo(0)) {
		q = getRandomVec({ min: -7, max: 7, avoid: [p, d], avoidParallel: true });
		pq = q.minus(p);
		//l2 = new Line(p, pq);
	}
	const [lambda1, mu1] = cramersFrac(d.x, pq.x.negative(), p.x, d.y, pq.y.negative(), p.y);
	if (mu1.isEqualTo(0)) {
		return generateVarsQ7();
	}
	// ensure 90 degrees is not possible
	const det = d
		.dot(p)
		.plus(d.dot(q))
		.square()
		.minus(d.magnitudeSquare().times(4).times(p.dot(q)));
	if (det.isAtLeast(0)) {
		return generateVarsQ7();
	}
	// ensure lines don't meet
	const aAvoid = lambda1.times(d.z).minus(p.z).plus(p.z.times(mu1)).divide(mu1);
	if (aAvoid.isEqualTo(q.z)) {
		return generateVarsQ7();
	}

	return { d, p, q };
}

function generateVarsQ9(): {
	n: Vector;
	d: Vector;
	p: Vector;
	s: Vector;
	rhs1: number;
	rhs2: number;
} {
	const p = getRandomVec();
	const n = getRandomVec({ min: -2, max: 2, simplify: true });
	let d = getRandomVec({ min: -6, max: 6, simplify: true, avoid: [n], avoidPerp: true });
	if (d.dot(n).isGreaterThan(0)) {
		d = d.negative();
	}
	const lambda = getRandomInt(1, 5);
	const mu = getRandomInt(-5, -1);
	const s = p.plus(d.multiply(lambda)).plus(n.multiply(mu));
	const rhsP = p.dot(n);
	const rhsS = s.dot(n);
	let rhs1: number;
	let rhs2: number;
	if (rhsP.isLessThan(rhsS)) {
		const rhsFloor = rhsP.plus(1).num;
		const rhsCeil = rhsS.minus(1).num;
		if (rhsCeil - rhsFloor < 1) {
			return generateVarsQ9();
		}
		const rhsA = getRandomInt(rhsFloor, rhsCeil);
		const rhsB = getRandomInt(rhsFloor, rhsCeil, { avoid: [rhsA] });
		rhs1 = Math.min(rhsA, rhsB);
		rhs2 = Math.max(rhsA, rhsB);
	} else {
		const rhsFloor = rhsS.plus(1).num;
		const rhsCeil = rhsP.minus(1).num;
		if (rhsCeil - rhsFloor < 1) {
			return generateVarsQ9();
		}
		const rhsA = getRandomInt(rhsFloor, rhsCeil);
		const rhsB = getRandomInt(rhsFloor, rhsCeil, { avoid: [rhsA] });
		rhs2 = Math.min(rhsA, rhsB);
		rhs1 = Math.max(rhsA, rhsB);
	}
	const p1 = new Plane(n, { rhs: rhs1 });
	const p2 = new Plane(n, { rhs: rhs2 });

	const l1 = new Line(p, d);
	const l2 = new Line(s, d);
	const lambda1 = p1.intersectLineParam(l1);
	const mu1 = p2.intersectLineParam(l2);
	const q = p1.intersect(l1) as Vector;
	const r = p2.intersect(l2) as Vector;
	const qr = r.minus(q);
	const theta = Number(d.angleTo(n, { acute: true }).replace('^\\circ', ''));
	const beta = Number(qr.angleTo(n, { acute: true }).replace('^\\circ', ''));
	const k = Math.sin(theta) / Math.sin(beta);
	if (lambda1.den > 12 || mu1.den > 12 || theta <= beta || k > 38.5 || k < 1.01) {
		// record refractive index: 38.6 https://physicsworld.com/a/metamaterial-breaks-refraction-record/
		return generateVarsQ9();
	}
	return { p, n, s, d, rhs1, rhs2 };
}
