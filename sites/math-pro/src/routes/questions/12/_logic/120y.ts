import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomVec,
	Vector,
	getRandomInt,
	gcd,
	Fraction,
	heads,
	getRandomPerps,
	getNiceVec,
	getRandomPerp,
} from 'mathlify';
import { math, display } from 'mathlifier';

function qn7(variables?: {
	a?: Vector;
	b?: Vector;
	c?: Vector;
	lambda?: number;
	mu?: number;
}): [AnswerObject, AnswerObject] {
	let { a, b, c, lambda, mu } = variables || {};
	// set up
	if (a === undefined || b === undefined) {
		[a, b] = getRandomPerps();
	}
	c = c ?? getRandomVec({ nonzero: true });
	if (lambda === undefined || mu === undefined) {
		lambda = getRandomInt(1, 4);
		mu = getRandomInt(1, 4);
		while (lambda + mu > 5) {
			lambda = getRandomInt(1, 4);
			mu = getRandomInt(1, 4);
		}
	}
	const b2Vec = new Vector(b.x, b.y);
	const b2 = b2Vec.isZero() ? `p \\mathbf{k}` : `${b2Vec.toIJKString()} + p \\mathbf{k}`;

	// question
	const body = `Referred to the origin ${math('O,')} the position vectors of the points
		${math('A')} and ${math('B')} are 
    ${display(`\\begin{align*}
			&&	${a.toIJKString()} \\\\
			\\textrm{ and } \\quad && ${b2}
		\\end{align*}`)}
		respectively.
  `;
	const partI = `Find the value of ${math('p.')}`;
	const partII = `Find the position vector of the point ${math('M')} on the line segment ${math(
		'AB',
	)}
		such that ${math(`AM:MB = ${lambda}:${mu}.`)}`;
	const partIII = `The point ${math('C')} has position vector ${math(`${c.toIJKString()}.`)} Use a
	vector product to find the exact area of triangle ${math('OAC.')}`;

	// solution working
	const m = a
		.multiply(mu)
		.plus(b.multiply(lambda))
		.multiply(new Fraction(1, mu + lambda))
		.simplify();
	const area = a.cross(c).magnitude().divide(2);

	// answer
	const ansI = math(`p = ${b.z}.`);
	const ansII = math(`\\overrightarrow{OM} = ${m}.`);
	const ansIII = math(`\\textrm{Area} = ${area} \\textrm{ units}^2.`);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 3 },
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

function qn8(variables?: { a?: Vector; b?: Vector }): [AnswerObject, AnswerObject] {
	let { a, b } = variables || {};
	// set up
	if (a === undefined) {
		a = getRandomVec();
	}
	if (b === undefined) {
		b = getRandomVec();
	}
	while (b.isParallelTo(a)) {
		b = getRandomVec();
	}

	// question
	const body = `Points ${math('O,A, B')} are such that
		${math(`\\overrightarrow{OA}=${a.toIJKString()}`)} and 
		${math(`\\overrightarrow{OB}=${b.toIJKString()}, `)} and 
		the point ${math('P')} is such that ${math('OAPB')} is a 
		parallelogram.
  `;
	const partI = `Find ${math(`\\overrightarrow{OP}.`)}`;
	const partII = `Find the size of angle ${math('AOB.')}`;
	const partIII = `Find the exact area of the parallelogram ${math('OAPB.')}`;

	// solution working
	const p = a.plus(b);
	const angle = a.angleTo(b);
	const area = a.cross(b).magnitude();

	// answer
	const ansI = math(`\\overrightarrow{OP} = ${p}.`);
	const ansII = math(`\\textrm{Angle} = ${angle}.`);
	const ansIII = math(`\\textrm{Area} = ${area} \\textrm{ units}^2.`, { wrap: true });

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 1 },
			{ body: partII, marks: 3 },
			{ body: partIII, marks: 2 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn9(variables?: {
	p1?: Vector;
	k?: number;
	q?: Vector;
	l?: number;
	m?: number;
}): [AnswerObject, AnswerObject] {
	// set up
	const p1Candidate = getNiceVec().simplify({ stretchable: false });
	const { p1, k, q } = {
		p1: p1Candidate,
		k: getRandomInt(1, 2),
		q: getRandomPerp(p1Candidate, { min: -9, max: 9, simplify: true }).multiply(heads() ? -1 : 1),
		...variables,
	};
	let { l, m } = {
		l: getRandomInt(1, 3),
		m: getRandomInt(1, 3),
		...variables,
	};
	const divisor = gcd(l, m);
	l /= divisor;
	m /= divisor;
	// question
	const p = p1.multiply(k);
	const a = p.minus(q.multiply(l));
	const b = p.plus(q.multiply(m));
	const body = `Relative to the origin ${math('O,')} two points ${math('A')}
		and ${math('B')} have position vectors given by
		${math(`\\mathbf{a}=${a.toIJKString()}`)} and 
		${math(`\\mathbf{b}=${b.toIJKString()} `)} respectively.
  `;
	const partI = `The point ${math('P')} divides the line ${math('AB')}
		in the ratio ${math(`${l}:${m}.`)} Find the coordinates of
		${math('P.')}
	`;
	const partII = `Explain why ${math('AB')} and ${math('OP')} are perpendicular.`;
	const partIII = `The vector
		${math('\\mathbf{c}')} is a unit vector in the direction of
		${math(`\\overrightarrow{OP}.`)} Write ${math(`\\mathbf{c}`)} as a
		column vector.
	`;
	const partIV = `Find the area of triangle ${math('OAP.')}`;

	// solution working
	const c = p.divide(p.magnitude().coeff, { multiplyIntoCoeff: true }).simplify();
	const area = a.cross(p).magnitude().divide(2);
	const approxArea = !area.isRational() ? `\\approx ${area.toPrecision(3)}` : '';

	// answer
	const ansI = math(`${p.toCoordinates('P')}.`);
	const ansII = math(`\\overrightarrow{OA}\\cdot\\overrightarrow{OP}=0.`);
	const ansIII = math(`\\mathbf{c}=${c}`);
	const ansIV = math(`\\textrm{Area} = ${area}${approxArea} \\textrm{ units}^2.`, { wrap: true });

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 2 },
			{ body: partIII, marks: 1 },
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

export const qnLogics = {
	qn7,
	qn8,
	qn9,
};
