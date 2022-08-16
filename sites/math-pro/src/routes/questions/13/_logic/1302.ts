import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import { getRandomVec, Vector, getRandomPerps, getRandomInt, Line, Fraction } from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	a1?: Vector;
	d1?: Vector;
	a2?: Vector;
	d2?: Vector;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const a1 = variables?.a1 ?? getRandomVec({ nonzero: false });
	const d1 = variables?.d1 ?? getRandomVec({ simplify: true });
	const l1 = new Line(a1, d1);
	const lambda = getRandomInt(-3, 3, { avoid: [0] });
	const mu = getRandomInt(-3, 3, { avoid: [0] });
	const d2 = variables?.d2 ?? getRandomVec({ avoid: [d1], avoidParallel: true, simplify: true });
	const a2 = variables?.a2 ?? l1.point(lambda).minus(d2.multiply(mu));
	const l2 = new Line(a2, d2, { lambda: '\\mu' });
	// qn
	const body = `The lines ${math('l_1')} and ${math('l_2')} are given by
		${display(`\\begin{align*}
			&l_1: ${l1}, \\; \\lambda \\in \\mathbb{R}, \\\\
			&l_2: ${l2}, \\; \\mu \\in \\mathbb{R}.
		\\end{align*}`)} Find the acute angle between the two lines.`;
	// answer
	const angleString = l1.angleTo(l2);
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
	d2?: Vector;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const a1 = variables?.a1 ?? getRandomVec({ nonzero: false });
	const d1 = variables?.d1 ?? getRandomVec({ simplify: true });
	const l1 = new Line(a1, d1);
	const lambda = getRandomInt(-3, 3, { avoid: [0] });
	const mu = getRandomInt(-3, 3, { avoid: [0] });
	const d2 = variables?.d2 ?? getRandomVec({ avoid: [d1], avoidParallel: true, simplify: true });
	const a2 = variables?.a2 ?? l1.point(lambda).minus(d2.multiply(mu));
	const l2 = new Line(a2, d2, { lambda: '\\mu' });
	// qn
	const body = `The lines ${math('l_1')} and ${math('l_2')} are given by
		${display(`\\begin{align*}
			&l_1: ${l1}, \\; \\lambda \\in \\mathbb{R}, \\\\
			&l_2: ${l2}, \\; \\mu \\in \\mathbb{R}.
		\\end{align*}`)}
		Find the coordinates of the point of intersection between the two lines.`;
	// answer
	const pt = l1.intersect(l2) as Vector;
	const ans = math(`${pt.toCoordinates()}`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'coordinates', value: pt, name: 'Your answer: ' }],
	};

	return [question, answer, qnVariables];
}

function c(variables?: {
	a?: Vector;
	b?: Vector;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// generate variables
	const a = variables?.a ?? getRandomVec({ nonzero: false });
	const b = variables?.b ?? getRandomVec({ nonzero: false, avoid: [a] });
	// construct qn
	const body = `Find the distance between the points 
		${math(a.toCoordinates('A'))}
		and ${math(b.toCoordinates('B') + '.')}
	`;
	// construct answer
	const ab = b.minus(a);
	const ansVal = ab.magnitude();
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
	a?: Vector;
	b?: Vector;
	d?: Vector;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// generate variables
	const variant = variables?.variant ?? getRandomInt(1, 2);
	const a = variables?.a ?? getRandomVec({ nonzero: false });
	const b = variables?.b ?? getRandomVec({ avoid: [a] });
	const ab = b.minus(a);
	const d = variables?.d ?? getRandomVec({ avoid: [ab], avoidParallel: true, simplify: true });
	const l1 = new Line(a, d);
	const l2 = new Line(b, d, { lambda: '\\mu' });
	// construct qn
	const body =
		variant === 1
			? `The lines ${math('l_1')} and ${math('l_2')} are given by
			${display(`\\begin{align*}
				&l_1: ${l1}, \\; \\lambda \\in \\mathbb{R}, \\\\
				&l_2: ${l2}, \\; \\mu \\in \\mathbb{R}.
			\\end{align*}`)}
			Find the perpendicular distance between the two lines.`
			: `The line ${math('l')} is given by
			${display(`
				l_1: ${l1}, \\; \\lambda \\in \\mathbb{R}.
			`)}
			Find the perpendicular distance between the line and the point ${math(b.toCoordinates('B') + '.')}`;
	// construct answer
	const ansVal = l1.distanceTo(l2);
	const approxVal = !ansVal.isRational() ? `\\approx ${ansVal.toPrecision(3)}` : '';
	const ans = math(`${ansVal}${approxVal} \\textrm{ units}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'sqrt', value: ansVal, name: 'Your answer: ', approx: true }],
	};

	return [question, answer, qnVariables];
}

function e(variables?: {
	a?: Vector;
	b?: Vector;
	d?: Vector;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// generate variables
	const variant = variables?.variant ?? getRandomInt(1, 2);
	const a = variables?.a ?? getRandomVec({ nonzero: false });
	let d: Vector, n: Vector, b: Vector;
	if (variables?.d && variables?.b) {
		d = variables.d;
		b = variables.b;
	} else {
		[d, n] = getRandomPerps();
		const lambda = getRandomInt(-3, 3, { avoid: [0] });
		const mu = getRandomInt(-3, 3, { avoid: [0] });
		b = a.plus(d.multiply(lambda)).plus(n.multiply(mu));
	}
	const l = new Line(a, d);
	// construct qn
	let body = `The line ${math('l')} is given by
			${display(`
				l: ${l}, \\; \\lambda \\in \\mathbb{R}.
			`)}
			Find the `;
	body +=
		variant === 1
			? `coordinates of the foot of perpendicular, ${math('F,')} from the point ${math(
					`${b.toCoordinates('B')}`,
			  )}
			to the line ${math('l.')}`
			: `coordinates of the point, ${math("B',")} obtained when the point ${math(
					`${b.toCoordinates('B')}`,
			  )}
			is reflected in the line ${math('l.')}`;
	// construct answer
	const ansVec = variant === 1 ? l.footOfPerpendicular(b) : l.pointReflection(b);
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

function f(variables?: {
	a1?: Vector;
	d1?: Vector;
	a2?: Vector;
	d2?: Vector;
	relationship?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const relationship = variables?.relationship ?? getRandomInt(1, 3); // 1: parallel, 2: intersecting, 3: skew
	const a1 = variables?.a1 ?? getRandomVec({ nonzero: false });
	const d1 = variables?.d1 ?? getRandomVec({ simplify: true });
	const l1 = new Line(a1, d1);
	let a2: Vector, d2: Vector;
	if (variables?.a2 && variables?.d2) {
		a2 = variables.a2;
		d2 = variables.d2;
	} else {
		if (relationship === 1) {
			// parallel
			d2 = d1.multiply(getRandomInt(-3, 3, { avoid: [0] }));
			a2 = getRandomVec({ nonzero: false, avoid: [a1] });
			while (l1.contains(a2)) {
				a2 = getRandomVec({ nonzero: false, avoid: [a1] });
			}
		} else if (relationship === 2) {
			// intersection
			const lambda = getRandomInt(-3, 3, { avoid: [0] });
			const mu = getRandomInt(-3, 3, { avoid: [0] });
			d2 = getRandomVec({ avoid: [d1], avoidParallel: true, simplify: true });
			a2 = l1.point(lambda).minus(d2.multiply(mu));
		} else {
			// skew
			a2 = getRandomVec({ nonzero: false, avoid: [a1] });
			d2 = getRandomVec({ avoid: [d1], avoidParallel: true, simplify: true });
			let l2 = new Line(a2, d2);
			while (!l2.isSkewTo(l1)) {
				a2 = getRandomVec({ nonzero: false, avoid: [a1] });
				d2 = getRandomVec({ avoid: [d1], avoidParallel: true, simplify: true });
				l2 = new Line(a2, d2);
			}
		}
	}
	const l2 = new Line(a2, d2, { lambda: '\\mu' });
	// qn
	const body = `The lines ${math('l_1')} and ${math('l_2')} are given by
		${display(`\\begin{align*}
			&l_1: ${l1}, \\; \\lambda \\in \\mathbb{R}, \\\\
			&l_2: ${l2}, \\; \\mu \\in \\mathbb{R}.
		\\end{align*}`)}
		What is the relationship between the two lines?`;
	// answer
	const ans =
		relationship === 1
			? `${math('l_1')} is parallel to ${math('l_2.')}`
			: relationship === 2
			? `${math('l_1')} intersects ${math('l_2')} at a unique point`
			: `${math('l_1')} and ${math('l_2')} are skew lines (non-parallel and non-intersecting).`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [
			{ type: 'mcq', value: relationship, options: ['Same', 'Parallel', 'Intersecting', 'Skew'] },
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
