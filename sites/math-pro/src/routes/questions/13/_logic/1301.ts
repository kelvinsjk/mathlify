import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import { getRandomVec, Vector, getRandomLine, getRandomInt, heads, Line } from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	a?: Vector;
	b?: Vector;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { variant } = {
		variant: getRandomInt(1, 2),
		...variables,
	};
	const a = variables?.a ?? getRandomVec({ nonzero: false });
	let b = variables?.b ?? getRandomVec({ nonzero: false });
	while (a.isEqualTo(b)) {
		b = getRandomVec({ nonzero: false });
	}
	const l = new Line(a, b, { twoPointsMode: true });
	const d = l.d;
	const body =
		variant === 1
			? `Find the equation of the line passing through the points ${math(
					`${a.toCoordinates('P')}`,
			  )} and 
		${math(`${b.toCoordinates('Q')}.`)}`
			: `Find the equation of the line passing through the point ${math(
					`${a.toCoordinates('P')}`,
			  )} and
		parallel to the vector ${math(`${d}.`)}`;

	const ans = math(`{l: ${l}}, \\; \\allowbreak {\\lambda \\in \\mathbb{R}}.`, { wrap: true });

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'line', value: l, name: math('l: ') }],
	};

	return [question, answer, qnVariables];
}

function b(variables?: {
	a?: Vector;
	d?: Vector;
	p?: Vector;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { a, d } = {
		...variables,
	};
	let { p } = {
		p: getRandomVec({ nonzero: false }),
		...variables,
	};
	const l =
		a === undefined || d === undefined || (d instanceof Vector && d.isZero())
			? getRandomLine({ lambda: '\\mu' })
			: new Line(a, d, { lambda: '\\mu' });
	while (l.contains(p)) {
		p = getRandomVec({ nonzero: false });
	}
	const l2 = new Line(p, l.d);
	const body = `Find the equation of the line that is parallel to 
		${display(`l_2: ${l}, \\; \\mu \\in \\mathbb{R}`)}
		and passes through the point ${math(`${p.toCoordinates('P')}.`)}`;
	const ans = math(`{l: ${l2}}, \\; \\allowbreak {\\lambda \\in \\mathbb{R}}.`, { wrap: true });

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'line', value: l2, name: math('l: ') }],
	};

	return [question, answer, qnVariables];
}

function c(variables?: {
	variant?: number;
	a?: Vector;
	d?: Vector;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { variant, a, d, pos } = {
		variant: getRandomInt(1, 2),
		pos: getRandomInt(1, 3),
		...variables,
	};
	// generate variables
	let l = a === undefined || d === undefined ? getRandomLine() : new Line(a, d);
	if (variant === 2) {
		// force a zero direction vector component
		if (!l.d.x.isEqualTo(0) && !l.d.y.isEqualTo(0) && !l.d.z.isEqualTo(0)) {
			if (pos === 1) {
				l = new Line(l.a, new Vector(0, l.d.y, l.d.z));
			} else {
				l =
					pos === 2
						? new Line(l.a, new Vector(l.d.x, 0, l.d.z))
						: new Line(l.a, new Vector(l.d.x, l.d.y, 0));
			}
		}
	}

	// construct qn/answers
	const body = `Given the line ${math('l')} with
		cartesian equation
		${display(`${l.toCartesianString()},`)}
		convert the equation of ${math('l')} into vector form.
	`;
	const ans = math(`{l: ${l}}, \\; \\allowbreak {\\lambda \\in \\mathbb{R}}.`, { wrap: true });

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'line', value: l, name: math('l: ') }],
	};

	return [question, answer, qnVariables];
}

function d(variables?: {
	a?: Vector;
	p?: Vector;
	d?: Vector;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { a, d } = {
		...variables,
	};
	const l = a === undefined || d === undefined ? getRandomLine() : new Line(a, d);
	const translation = [
		Vector.J.multiply(getRandomInt(-3, 3, { avoid: [0] })),
		Vector.I.multiply(getRandomInt(-3, 3, { avoid: [0] })),
		Vector.K.multiply(getRandomInt(-3, 3, { avoid: [0] })),
	][getRandomInt(0, 2)];
	const p =
		variables?.p ?? heads()
			? heads()
				? getRandomVec({ nonzero: false })
				: l.point(getRandomInt(-3, 3, { avoid: [0] })).plus(translation)
			: l.point(getRandomInt(-3, 3, { avoid: [0] }));

	const body = `Given the point ${math(`${p.toCoordinates('P')}`)} and the line
		${display(`l: ${l}, \\; \\lambda \\in \\mathbb{R},`)}
		does ${math(`${p.toCoordinates('P')}`)} lie on ${math(`l?`)}`;
	const ans = l.contains(p)
		? 'Yes, the point lies on the line.'
		: 'No, the point does not lie on the line.';

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'mcq', value: l.contains(p) ? 0 : 1, options: ['Yes', 'No'] }],
	};

	return [question, answer, qnVariables];
}

export const qnLogics = {
	a,
	b,
	c,
	d,
};
