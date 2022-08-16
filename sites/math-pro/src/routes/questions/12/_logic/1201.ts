import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import { getRandomVec, Vector, getNiceVec, getRandomInt, heads, gcd } from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	x?: number;
	y?: number;
	z?: number;
	ijkMode?: boolean;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { ijkMode, x, y, z } = {
		ijkMode: heads(),
		...variables,
	};
	const a =
		x === undefined || y === undefined || z === undefined
			? getRandomVec({ nonzero: true })
			: new Vector(x, y, z);
	const body = `The vector ${math(`\\mathbf{a}`)} is given by 
    ${display(`\\mathbf{a}=${ijkMode ? a.toIJKString() : a}`)}
    What is ${math(`|\\mathbf{a}|?`)}
  `;
	const ans = math(`|\\mathbf{a}| = ${a.magnitude()}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'sqrt', value: a.magnitude(), name: 'Your answer: ' }],
	};

	return [question, answer, qnVariables];
}

function b(variables?: {
	variant?: number;
	a?: Vector;
	ijkMode?: boolean;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { ijkMode, variant, a } = {
		ijkMode: heads(),
		variant: getRandomInt(1, 2),
		a: getNiceVec(),
		...variables,
	};

	const ansVec = a.divide(a.magnitude().coeff);

	const a2Vec = new Vector(ansVec.x, ansVec.y);
	const a2IJK = a2Vec.isZero() ? `p \\mathbf{k}` : `${a2Vec.toIJKString()} + p \\mathbf{k}`;
	const a2 = `\\begin{pmatrix} ${ansVec.x} \\\\ ${ansVec.y} \\\\ p \\end{pmatrix}`;

	let body: string, ans: string;

	if (variant === 1) {
		body = `Find ${math(`\\mathbf{\\hat{a}},`)} the unit vector in the direction of
			${display(`\\mathbf{a} = ${ijkMode ? a.toIJKString() : a}.`)}
		`;
		ans = math(`\\mathbf{\\hat{a}} = ${ansVec}`);
	} else {
		body = `Given that the vector
			${display(`\\mathbf{a} = ${ijkMode ? a2IJK : a2}`)}
			is a unit vector, find ${math(`p`)} such that
			${math(`p\\geq 0.`)}
		`;
		ans = ansVec.z.isEqualTo(0) ? math(`p=0`) : math(`p = ${ansVec.z.abs()}.`);
	}

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
				? { type: 'vector', value: ansVec, name: math(`\\hat{a}= `) }
				: { type: 'fraction', value: ansVec.z.abs(), name: math(`p= `) },
		],
	};

	return [question, answer, qnVariables];
}

function c(variables?: {
	variant?: number;
	a?: Vector;
	k?: number;
	ijkMode?: boolean;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	let { variant, a, k, ijkMode } = variables || {};
	// generate variables
	ijkMode = ijkMode ?? heads();
	variant = variant ?? getRandomInt(1, 2);
	a = a ?? getRandomVec({ simplify: true });
	while (a.x.isEqualTo(0)) {
		a = getRandomVec({ simplify: true });
	}
	k = k ?? getRandomInt(-9, 9, { avoid: [0, 1] });

	// construct qn/answers
	const ansVec = a.multiply(k);
	const a2Vec = new Vector(ansVec.x);
	const a2IJK = a2Vec.isZero()
		? `p \\mathbf{j} + q \\mathbf{k}`
		: `${a2Vec.toIJKString()} + p \\mathbf{j} + q \\mathbf{k}`;
	const a2 = `\\begin{pmatrix} ${ansVec.x} \\\\ p \\\\ q \\end{pmatrix}`;
	const v2DisplayQn = ijkMode
		? `\\begin{align*} && ${a2IJK} \\\\ \\textrm{and} \\quad && ${a.toIJKString()} \\end{align*}`
		: `${a2} \\quad \\textrm{ and } \\quad ${a}`;

	let body: string, ans: string;

	if (variant === 1) {
		body = `Find a vector ${math(`\\mathbf{a}`)} that is parallel to
			${display(`\\mathbf{b} = ${ijkMode ? a.toIJKString() : a}`)}
		such that ${math('\\mathbf{a}\\neq \\mathbf{b}.')}`;
		ans = math(`\\mathbf{a} = ${ansVec}`);
	} else {
		body = `Given that the vectors
			${display(v2DisplayQn)}
			are parallel, find ${math('p')} and ${math(`q.`)}
		`;
		ans = math(`p=${ansVec.y},`) + `<br>` + math(`p = ${ansVec.z}.`);
	}

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers:
			variant === 1
				? [{ type: 'vector', value: a, name: math(`\\mathbf{a}= `), specialCase: 'parallel' }]
				: [
						{ type: 'integer', value: ansVec.y, name: math(`p=`) },
						{ type: 'integer', value: ansVec.z, name: math(`q=`) },
				  ],
	};

	return [question, answer, qnVariables];
}

function d(variables?: {
	variant?: number;
	a?: Vector;
	b?: Vector;
	ijkMode?: boolean;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	let { variant, a, b, ijkMode } = variables || {};
	// generate variables
	ijkMode = ijkMode ?? heads();
	variant = variant ?? getRandomInt(1, 2);
	a = a ?? getRandomVec();
	b = b ?? getRandomVec();
	while (a.isParallelTo(b)) {
		b = getRandomVec();
	}

	// construct qn/answers
	const ab = b.minus(a);

	// typeset
	let body: string, ans: string;
	if (variant === 1) {
		body = `Given the points `;
		if (ijkMode) {
			body += `${math(a.toCoordinates('A'))} and ${math(`${b.toCoordinates('B')}, `)} `;
		} else {
			body += `${math(`A`)} and ${math(`B`)} with position vectors ${math(`${a}`)} and
			${math(`${b}`)} respectively, `;
		}
		body += `find the vector ${math(`\\overrightarrow{AB}.`)}`;
		ans = math(`\\overrightarrow{AB} = ${ab}.`);
	} else {
		body = `Given the point `;
		if (ijkMode) {
			body += `${math(a.toCoordinates('A'))} `;
		} else {
			body += `${math(`A`)} with position vector ${math(`${a}`)} `;
		}
		body += `and ${math(`\\overrightarrow{AB}=${ab},`)} find the coordinates of ${math('B.')}`;
		ans = math(`${b.toCoordinates('B')}.`);
	}

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
				? { type: 'vector', value: ab, name: math(`\\overrightarrow{AB} = `) }
				: { type: 'coordinates', value: b, name: math(`B`) },
		],
	};

	return [question, answer, qnVariables];
}

function e(variables?: {
	a?: Vector;
	b?: Vector;
	k?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	let { a, b, k } = variables || {};
	// generate variables
	a = a ?? getRandomVec({ simplify: true });
	b = b ?? getRandomVec({ simplify: true });
	while (a.x.isEqualTo(b.x)) {
		a = getRandomVec({ simplify: true });
		b = getRandomVec({ simplify: true });
	}
	k = k ?? getRandomInt(-9, 9, { avoid: [0, 1] });

	// construct qn/answers
	const c = b.minus(a).multiply(k).plus(a);
	const cUnknown = `C\\left(${c.x}, p, q \\right)`;

	// typeset qn/answers
	const body = `Given that the points ${math(`${a.toCoordinates('A')},`)}
		${math(`${b.toCoordinates('B')}`)} and
		${math(cUnknown)} are collinear, find ${math(`p`)} and ${math(`q.`)}`;
	const ans = `${math(`p=${c.y}, \\; q=${c.z}`)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [
			{ type: 'integer', value: c.y, name: math(`p= `) },
			{ type: 'integer', value: c.z, name: math(`q= `) },
		],
	};

	return [question, answer, qnVariables];
}

function f(variables?: {
	a?: Vector;
	b?: Vector;
	lambda?: number;
	mu?: number;
	total?: boolean;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	let { a, b, lambda, mu, total, variant } = variables || {};
	// generate variables
	a = a ?? getRandomVec({ simplify: true });
	b = b ?? getRandomVec({ simplify: true });
	while (a.isParallelTo(b)) {
		a = getRandomVec({ simplify: true });
		b = getRandomVec({ simplify: true });
	}
	lambda = getRandomInt(1, 5);
	mu = getRandomInt(1, 5);
	const divisor = gcd(lambda, mu);
	lambda = lambda / divisor;
	mu = mu / divisor;
	total = heads();
	variant = getRandomInt(1, 2);

	// construct qn/answers
	const p =
		variant === 1
			? a
					.multiply(mu)
					.plus(b.multiply(lambda))
					.divide(lambda + mu)
			: a
					.multiply(mu)
					.minus(b.multiply(lambda + mu))
					.divide(-lambda);
	let ratio: string;
	if (variant === 1) {
		ratio = total ? `AP : AB = ${lambda} : ${lambda + mu}.` : `AP : PB = ${lambda} : ${mu}.`;
	} else {
		ratio = total ? `AB : AP = ${lambda} : ${lambda + mu}.` : `AB : BP = ${lambda} : ${mu}.`;
	}

	// typeset qn/answers
	const body = `The coordinates of the points ${math('A')} and ${math('B')} are given by
		${math(`${a.toCoordinates('A')}`)} and 
		${math(`${b.toCoordinates('B')}.`)}
		
		<div class="top-margin">The point ${math(`P`)} lies on
		${math(`AB`)} ${variant === 1 ? '' : 'produced'} such that 
		${math(ratio)} Find the coordinates of ${math(`P.`)}</div>`;
	const ans = `${math(`${p.toCoordinates('P')}.`)}`;

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'coordinates', value: p, name: math(`P`) }],
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
