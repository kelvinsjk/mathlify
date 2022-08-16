import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import {
	getRandomVec,
	Vector,
	heads,
	getRandomInt,
	Line,
	Fraction,
	Plane,
	getRandomPerp,
} from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	a?: Vector;
	n?: Vector;
	b?: Vector;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const variant = variables?.variant ?? getRandomInt(1, 2);
	const a = variables?.a ?? getRandomVec({ nonzero: false });
	const n = variables?.n ?? getRandomVec();
	const b = variables?.b ?? getRandomVec({ nonzero: false });
	const l = new Line(a, n);
	const p = new Plane(n, { mode: 'ptN', v2: b });
	// qn
	const body =
		variant === 1
			? `The plane ${math('p')} is given by
		${display(`
			p: ${p},
		`)}
		Find the equation of the line ${math('l')} that is perpendicular to ${math('p')}
		and contains the point ${math(`${a.toCoordinates('A')}.`)}`
			: `The line ${math('l')} is given by
		${display(`
			l: ${l},
		`)}
		Find the equation of the plane ${math('p')} that is perpendicular to ${math('l')}
		and contains the point ${math(`${b.toCoordinates('B')}.`)}`;
	// answer
	const ans =
		variant === 1
			? math(`{l: ${l}}, \\; \\allowbreak {\\lambda \\in \\mathbb{R}}.`, { wrap: true })
			: math(`p: ${p}.`);

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
				? { type: 'line', value: l, name: math('l: ') }
				: { type: 'plane', value: p, name: math('p: ') },
		],
	};

	return [question, answer, qnVariables];
}

function b(variables?: {
	a1?: Vector;
	d1?: Vector;
	d2?: Vector;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const variant = variables?.variant ?? getRandomInt(1, 2);
	const a1 = variables?.a1 ?? getRandomVec({ nonzero: false });
	const d1 = variables?.d1 ?? getRandomVec({ simplify: true });
	const l1 = new Line(a1, d1);
	const d2 = variables?.d2 ?? getRandomVec({ avoid: [d1], avoidParallel: true, simplify: true });
	const l2 = new Line(a1, d2, { lambda: '\\mu' });
	// qn
	const body =
		variant === 1
			? `Find the equation of the plane ${math('p')} that contains the point
		${math(`${a1.toCoordinates('A')}`)} and is parallel to the vectors
		${math(`${d1}`)} and ${math(`${d2}.`)}`
			: `The lines ${math('l_1')} and ${math('l_2')} are given by
		${display(`\\begin{align*}
			&l_1: ${l1}, \\; \\lambda \\in \\mathbb{R}, \\\\
			&l_2: ${l2}, \\; \\mu \\in \\mathbb{R}.
		\\end{align*}`)}
		Find the equation of the plane ${math('p')} containing both ${math('l_1')} and
		${math('l_2.')}`;

	// answer
	const p = new Plane(a1, { mode: 'ptDD', v2: d1, v3: d2 });
	const ans = math(`p: ${p}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'plane', value: p, name: math('p: ') }],
	};

	return [question, answer, qnVariables];
}

function c(variables?: {
	a1?: Vector;
	d1?: Vector;
	a2?: Vector;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const variant = variables?.variant ?? getRandomInt(1, 2);
	const a1 = variables?.a1 ?? getRandomVec({ nonzero: false });
	const d1 = variables?.d1 ?? getRandomVec();
	const l1 = new Line(a1, d1);
	let a2 = variables?.a2 ?? getRandomVec({ nonzero: false });
	while (l1.contains(a2)) {
		a2 = getRandomVec({ nonzero: false });
	}
	const n = a2.minus(a1).simplify({ stretchable: true });
	const p1 = new Plane(n, { mode: 'ptN', v2: a1 });
	// qn
	const body =
		variant === 1
			? `The line ${math('l')} is given by
		${display(`
			l: ${l1}, \\; \\lambda \\in \\mathbb{R}.
		`)}
		Find the equation of the plane ${math('p')} containing both ${math('l')} and the point
		${math(`${a2.toCoordinates('A')}.`)}`
			: `The line ${math('l')} and the plane ${math('p_1')} are given by
		${display(`\\begin{align*}
			&l: ${l1}, \\; \\lambda \\in \\mathbb{R}, \\\\
			&p_1: ${p1}.
		\\end{align*}`)}
		Find the equation of the plane ${math('p')} that contains ${math('l_1')} and is perpendicular to
		${math('p_1.')}`;

	// answer
	const p = new Plane(a1, { mode: 'ptPtD', v2: a2, v3: d1 });
	const ans = math(`p: ${p}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'plane', value: p, name: math('p: ') }],
	};

	return [question, answer, qnVariables];
}

function d(variables?: {
	a1?: Vector;
	a2?: Vector;
	a3?: Vector;
	a4?: Vector;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const variant = variables?.variant ?? getRandomInt(1, 2);
	const a1 = variables?.a1 ?? getRandomVec({ nonzero: false });
	const a2 = variables?.a2 ?? getRandomVec({ nonzero: false, avoid: [a1] });
	const l1 = new Line(a1, a2, { twoPointsMode: true });
	let a3 = variables?.a3 ?? getRandomVec({ nonzero: false, avoid: [a1, a2] });
	while (l1.contains(a3)) {
		a3 = getRandomVec({ nonzero: false, avoid: [a1, a2] });
	}
	const p1 = new Plane(a1, { mode: 'ptPtPt', v2: a2, v3: a3 });
	let a4 = variables?.a4 ?? getRandomVec({ nonzero: false, avoid: [a1, a2, a3] });
	while (p1.contains(a4)) {
		a4 = getRandomVec({ nonzero: false, avoid: [a1, a2, a3] });
	}
	const p2 = new Plane(p1.n, { mode: 'ptN', v2: a4 });
	// qn
	const body =
		variant === 1
			? `Find the equation of the plane ${math('p')} containing the points
			${math(`${a1.toCoordinates('A')},`)}
			${math(`${a2.toCoordinates('B')},`)} 
			and ${math(`${a3.toCoordinates('C')}.`)}`
			: `The plane ${math('p_1')} is given by
			${display(`p_1: ${p2}.`)}
			Find the equation of the plane ${math('p')} that is parallel to ${math('p_1')}
			and contains the point 
			${math(`${a1.toCoordinates('A')}.`)}
			`;

	// answer
	const ans = math(`p: ${p1}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'plane', value: p1, name: math('p: ') }],
	};

	return [question, answer, qnVariables];
}

function e(variables?: {
	a1?: Vector;
	d1?: Vector;
	d2?: Vector;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const variant = variables?.variant ?? getRandomInt(1, 2);
	const a1 = variables?.a1 ?? getRandomVec({ nonzero: false });
	const n = getRandomVec({ simplify: true });
	const d1 = variables?.d1 ?? getRandomPerp(n, { simplify: true });
	let d2 = variables?.d2 ?? getRandomPerp(n, { simplify: true });
	while (d1.isEqualTo(d2)) {
		d2 = getRandomPerp(n, { simplify: true });
	}
	const l1 = new Line(a1, d1);
	const p = new Plane(a1, { mode: 'ptDD', v2: d1, v3: d2 });
	// qn
	const body =
		variant === 1
			? `Plane ${math('p')} is given by the equation
		${display(`p: ${l1} + \\mu ${d2}, \\; \\lambda,\\mu \\in \\mathbb{R}.`)}
			Express the equation of the plane ${math('p')} in scalar product form 
			${math('\\mathbf{r}\\cdot \\mathbf{n} = k.')}`
			: `Plane ${math('p')} is given by the cartesian equation
		${math(`${p.toCartesianString()}.`)}
			Express the equation of the plane ${math('p')} in scalar product form 
			${math('\\mathbf{r}\\cdot \\mathbf{n} = k.')}`;

	// answer
	const ans = math(`p: ${p}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'plane', value: p, name: math('p: ') }],
	};

	return [question, answer, qnVariables];
}

function f(variables?: {
	a?: Vector;
	n?: Vector;
	rhs?: Fraction;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { a, n, variant } = {
		variant: getRandomInt(1, 2),
		a: getRandomVec({ nonzero: false }),
		n: getRandomVec({ simplify: true }),
		...variables,
	};
	const rhs =
		variables?.rhs ?? heads() ? a.dot(n) : a.dot(n).plus(getRandomInt(-3, 3, { avoid: [0] }));
	const p = new Plane(n, { rhs });

	const body =
		variant === 1
			? `Given the point ${math(`${a.toCoordinates('A')}`)} and the plane
			${display(`p: ${p},`)}
			does ${math(`A`)} lie in ${math(`p?`)}`
			: `Given the plane ${display(`p: ${p},`)}
			find the coordinates of a point (any point) on ${math('p.')}`;
	const ans =
		variant === 1
			? p.contains(a)
				? 'Yes, the point lies in the plane.'
				: 'No, the point does not lie in the plane.'
			: math(`${p.point()}.`);

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
				? { type: 'mcq', value: p.contains(a) ? 0 : 1, options: ['Yes', 'No'] }
				: { type: 'coordinates', value: p, specialCase: 'plane' },
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
