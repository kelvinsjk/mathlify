import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import { getRandomVec, Vector, getRandomInt, Line, Fraction, Plane, getRandomPerp } from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	a1?: Vector;
	d1?: Vector;
	a2?: Vector;
	n1?: Vector;
	n2?: Vector;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const variant = variables?.variant ?? getRandomInt(1, 2);
	const a1 = variables?.a1 ?? getRandomVec({ nonzero: false });
	const d1 = variables?.d1 ?? getRandomVec();
	const l1 = new Line(a1, d1);
	const lambda = getRandomInt(-3, 3, { avoid: [0] });
	const a2 = variables?.a2 ?? l1.point(lambda);
	const n1 = variables?.n1 ?? getRandomVec({ simplify: true });
	let n2 = variables?.n2 ?? getRandomVec({ simplify: true, avoid: [n1], avoidParallel: true });
	while (n2.isPerpendicularTo(d1)) {
		n2 = getRandomVec({ simplify: true, avoid: [n1], avoidParallel: true });
	}
	const p1 = new Plane(n1, { mode: 'ptN', v2: a1 });
	const p2 = new Plane(n2, { mode: 'ptN', v2: a2 });
	// qn
	const body =
		variant === 1
			? `The line ${math('l')} and plane ${math('p')} are given by
		${display(`\\begin{align*}
			&l: ${l1}, \\; \\lambda \\in \\mathbb{R}, \\\\
			&p: ${p2}.
		\\end{align*}`)} Find the acute angle, ${math('\\theta,')} between the the line and the plane.`
			: `The planes ${math('p_1')} and ${math('p_2')} are given by
		${display(`\\begin{align*}
			&p_1: ${p1},\\\\
			&p_2: ${p2}.
		\\end{align*}`)} Find the acute angle, ${math('\\theta,')} between the two planes.`;
	// answer
	const angleString = variant === 1 ? p2.angleTo(l1) : p1.angleTo(p2);
	const angle = Number(angleString.replace('^\\circ', ''));
	const ansFrac = new Fraction(angle * 10, 10);
	const ans = math(`\\theta = ${angleString}`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [
			{ type: 'decimal', value: ansFrac, name: math('\\theta = '), units: math(`^\\circ`) },
		],
	};

	return [question, answer, qnVariables];
}

function b(variables?: {
	a1?: Vector;
	d1?: Vector;
	a2?: Vector;
	n2?: Vector;
	n1?: Vector;
	rhs?: Fraction;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	// set up
	const variant = variables?.variant ?? getRandomInt(1, 2);
	const a1 = variables?.a1 ?? getRandomVec({ nonzero: false });
	const d1 = variables?.d1 ?? getRandomVec();
	const l1 = new Line(a1, d1);
	const lambda = getRandomInt(-3, 3, { avoid: [0] });
	const a2 = variables?.a2 ?? variant === 1 ? l1.point(lambda) : getRandomVec({ nonzero: false });
	const n1 = variables?.n1 ?? getRandomVec({ simplify: true });
	let n2 = variables?.n2 ?? getRandomVec({ simplify: true, avoid: [n1], avoidParallel: true });
	while (n2.isPerpendicularTo(d1)) {
		n2 = getRandomVec({ simplify: true, avoid: [n1], avoidParallel: true });
	}
	const p1 = new Plane(n1, { mode: 'ptN', v2: a1 });
	const rhs = variables?.rhs ?? getRandomInt(-5, 5);
	const p2 = variant === 1 ? new Plane(n2, { mode: 'ptN', v2: a2 }) : new Plane(n2, { rhs });
	// qn
	const body =
		variant === 1
			? `The line ${math('l')} and plane ${math('p')} are given by
		${display(`\\begin{align*}
			&l: ${l1}, \\; \\lambda \\in \\mathbb{R}, \\\\
			&p: ${p2}.
		\\end{align*}`)} Find the coordinates of the point of intersection between the the line and the plane.`
			: `The planes ${math('p_1')} and ${math('p_2')} are given by
		${display(`\\begin{align*}
			&p_1: ${p1},\\\\
			&p_2: ${p2}.
		\\end{align*}`)} Find the equation of the line of intersection, ${math(
					'l,',
			  )} between the two planes.`;
	// answer
	const pt = p2.intersectLine(l1) as Vector;
	const line = p2.intersectPlane(p1);
	const ans =
		variant === 1
			? math(`${pt.toCoordinates()}.`)
			: math(`l: ${line}, \\; \\lambda \\in \\mathbb{R}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [
			variant === 1
				? { type: 'coordinates', value: pt, name: 'Your answer: ' }
				: { type: 'line', value: line, name: 'l: ' },
		],
	};

	return [question, answer, qnVariables];
}

function c(variables?: {
	a?: Vector;
	b?: Vector;
	n?: Vector;
	type?: number;
	d?: Vector;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// generate variables
	const type = variables?.type ?? getRandomInt(1, 3);
	const a = variables?.a ?? getRandomVec({ nonzero: false });
	const n = variables?.n ?? getRandomVec({ simplify: true });
	const d = variables?.d ?? getRandomPerp(n);
	const p = new Plane(n, { mode: 'ptN', v2: a });
	let b = variables?.b ?? getRandomVec({ avoid: [a] });
	while (p.contains(b)) {
		b = getRandomVec({ avoid: [a] });
	}
	// construct qn
	let body: string;
	if (type === 1) {
		body = `The plane ${math('p')} is given by
			${display(`
				p: ${p}.
			`)}
		Find the perpendicular distance between the point
		${math(`${b.toCoordinates('A')}`)} and the plane.`;
	} else if (type === 2) {
		const l = new Line(b, d);
		body = `The line ${math('l')} and plane ${math('p')} are given by
			${display(`\\begin{align*}
				&l: ${l}, \\; \\lambda \\in \\mathbb{R}, \\\\
				&p: ${p}.
			\\end{align*}`)}
		Find the perpendicular distance between
		${math(`l`)} and ${math('p.')}`;
	} else {
		const p2 = new Plane(n, { rhs: b.dot(n) });
		body = `The planes ${math('p_1')} and ${math('p_2')} are given by
			${display(`\\begin{align*}
				&p_1: ${p}, \\\\
				&p_2: ${p2}.
			\\end{align*}`)}
		Find the perpendicular distance between
		${math(`p_1`)} and ${math('p_2.')}`;
	}
	// construct answer
	const ansVal = p.distanceTo(b);
	const approxVal = !ansVal.isRational() ? `\\approx ${ansVal.toPrecision(3)}` : '';
	const ans = math(`${ansVal}${approxVal} \\textrm{ units}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'sqrt', value: ansVal, name: 'Your answer: ', approx: true }],
	};

	return [question, answer, qnVariables];
}

function d(variables?: {
	f?: Vector;
	b?: Vector;
	n?: Vector;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// generate variables
	const variant = variables?.variant ?? getRandomInt(1, 2);
	const f = variables?.f ?? getRandomVec({ nonzero: false });
	const n = variables?.n ?? getRandomVec({ simplify: true });
	const lambda = getRandomInt(-3, 3);
	const b = variables?.b ?? f.plus(n.multiply(lambda));
	const p = new Plane(n, { mode: 'ptN', v2: f });
	// construct qn
	let body = `The line ${math('p')} is given by
			${display(`
				p: ${p}.
			`)}
			Find the `;
	body +=
		variant === 1
			? `coordinates of the foot of perpendicular, ${math('F,')} from the point ${math(
					`${b.toCoordinates('B')}`,
			  )}
			to the plane ${math('p.')}`
			: `coordinates of the point, ${math("B',")} obtained when the point ${math(
					`${b.toCoordinates('B')}`,
			  )}
			is reflected in the plane ${math('p.')}`;
	// construct answer
	const ansVec = variant === 1 ? p.footOfPerpendicular(b) : p.pointReflection(b);
	const ansName = variant === 1 ? 'F' : "B'";
	const ans = math(`${ansVec.toCoordinates(ansName)}`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'coordinates', value: ansVec, name: math(`${ansName}`) }],
	};

	return [question, answer, qnVariables];
}

function e(variables?: {
	a?: Vector;
	d?: Vector;
	n?: Vector;
	rhs?: Fraction;
	relationship?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const relationship = variables?.relationship ?? getRandomInt(1, 3); // 1: intersecting, 2: in, 3: parallel
	const a = variables?.a ?? getRandomVec({ nonzero: false });
	const d = variables?.d ?? getRandomVec({ simplify: true });
	let n: Vector;
	if (variables?.n) {
		n = variables.n;
	} else {
		if (relationship === 1) {
			// intersecting
			n = getRandomVec({ simplify: true });
			while (n.isParallelTo(d)) {
				n = getRandomVec({ simplify: true });
			}
		} else {
			// in
			n = getRandomPerp(d);
		}
	}
	const l = new Line(a, d);
	const rhs =
		variables?.rhs ?? relationship === 3
			? a.dot(n).plus(getRandomInt(-3, 3, { avoid: [0] }))
			: a.dot(n);
	const p = new Plane(n, { rhs });
	// qn
	const body = `The line ${math('l')} and the plane ${math('p')} are given by
		${display(`\\begin{align*}
			&l: ${l}, \\; \\lambda \\in \\mathbb{R}, \\\\
			&p: ${p}.
		\\end{align*}`)}
		What is the relationship between the line and the plane?`;
	// answer
	const ans =
		relationship === 1
			? `${math('l')} intersects ${math('p')} at exactly one point.`
			: relationship === 2
			? `${math('l')} lies in ${math('p.')}`
			: `${math('l')} is parallel to (but not in) ${math('p.')}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [
			{
				type: 'mcq',
				value: relationship - 1,
				options: [
					'Intersect at exactly one point',
					'Line lies in plane',
					'Line is parallel to (but not in) plane',
				],
			},
		],
	};

	return [question, answer, qnVariables];
}
function f(variables?: {
	n1?: Vector;
	n2?: Vector;
	rhs1?: number;
	rhs2?: number;
	k?: number;
	relationship?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const relationship = variables?.relationship ?? getRandomInt(1, 3); // 1: same, 2: parallel, 3: intersecting
	const n1 = variables?.n1 ?? getRandomVec({ simplify: true });
	const n2 = variables?.n2 ?? getRandomVec({ simplify: true, avoid: [n1], avoidParallel: true });
	const rhs1 = variables?.rhs1 ?? getRandomInt(-9, 9);
	const rhs2 = variables?.rhs2 ?? getRandomInt(-9, 9, { avoid: [rhs1] });
	const k = variables?.k ?? getRandomInt(-9, 9, { avoid: [0] });
	const p1 = new Plane(n1, { rhs: rhs1 });
	let p2: Plane;
	if (relationship === 1) {
		// same plane
		p2 = new Plane(n1.multiply(k), { rhs: rhs1 * k });
	} else if (relationship === 2) {
		// parallel
		p2 = new Plane(n1, { rhs: rhs2 });
	} else {
		// intersecting
		p2 = new Plane(n2, { rhs: rhs2 });
	}
	// qn
	const body = `The planes ${math('p_1')} and ${math('p_2')} are given by
		${display(`\\begin{align*}
			&p_1: ${p1}, \\\\
			&p_2: ${p2}.
		\\end{align*}`)}
		What is the relationship between the two planes?`;
	// answer
	const ans =
		relationship === 1
			? `${math('p_1')} and ${math('p_2')} are the same plane.`
			: relationship === 2
			? `${math('p_1')} and ${math('p_2')} are parallel (but not the same).`
			: `${math('p_1')} and ${math('p_2')} intersect in a line.`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [
			{
				type: 'mcq',
				value: relationship - 1,
				options: ['Same plane', 'Parallel planes', 'Intersect in a line'],
			},
		],
	};

	return [question, answer, qnVariables];
}

export const qnLogics = {
	a,
	b,
	c,
	d,
	e,
	f,
};
