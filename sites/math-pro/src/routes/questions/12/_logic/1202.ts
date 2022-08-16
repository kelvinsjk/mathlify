import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import { getRandomVec, Vector, getRandomPerps, getRandomInt, Fraction } from 'mathlify';
import { math, display } from 'mathlifier';

function a(variables?: {
	a?: Vector;
	b?: Vector;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { a, b } = {
		a: getRandomVec({ nonzero: false }),
		b: getRandomVec({ nonzero: false }),
		...variables,
	};
	const body = `What is
    ${display(`${a} \\cdot ${b}?`)}
  `;
	const ans = math(`${a.dot(b)}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'integer', value: a.dot(b), name: 'Your answer: ' }],
	};

	return [question, answer, qnVariables];
}

function b(variables?: {
	a?: Vector;
	b?: Vector;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const perps = getRandomPerps();
	const { a, b } = {
		a: perps[0],
		b: perps[1],
		...variables,
	};
	const bQn = `\\begin{pmatrix}p\\\\${b.y}\\\\${b.z}\\end{pmatrix}`;
	const body = `Given that the vectors ${math(`${a}`)} and ${math(`${bQn}`)} are perpendicular,
		what is the value of ${math('p?')}
  `;
	const ans = math(`p=${b.x}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'integer', value: b.x, name: math(`p= `) }],
	};

	return [question, answer, qnVariables];
}

function c(variables?: {
	a?: Vector;
	b?: Vector;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	let { a, b } = {
		a: getRandomVec({ nonzero: false }),
		b: getRandomVec({ nonzero: false }),
		...variables,
	};
	while (a.isEqualTo(b)) {
		a = getRandomVec({ nonzero: false });
		b = getRandomVec({ nonzero: false });
	}
	const body = `Given the points ${math(`${a.toCoordinates('A')}`)} and ${math(
		`${b.toCoordinates('B')},`,
	)}
		what is ${math('\\angle AOB?')}
  `;
	const ans = math(`\\angle AOB = ${a.angleTo(b)}.`);
	const ansFloat =
		(Math.acos(a.dot(b).valueOf() / (a.magnitude().valueOf() * b.magnitude().valueOf())) /
			Math.PI) *
		180;
	const ansVal = new Fraction(Math.round(ansFloat * 10), 10);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		answers: [{ type: 'fraction', value: ansVal, name: math(`\\theta^\\circ = `) }],
	};

	return [question, answer, qnVariables];
}

function d(variables?: {
	variant?: number;
	a?: Vector;
	b?: Vector;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	const { a, b, variant } = {
		variant: getRandomInt(1, 2),
		a: getRandomVec({ nonzero: false }),
		b: getRandomVec({ nonzero: false }),
		...variables,
	};
	const body =
		variant === 1
			? `What is ${display(`${a} \\times ${b}?`)}`
			: `Find a vector perpendicular to both ${math(`${a}`)} and ${math(`${b}`)}.`;
	const ans =
		variant === 1 ? math(`${a.cross(b)}.`) : math(`${a.cross(b).simplify({ stretchable: true })}`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [
			{ type: 'vector', value: a.cross(b), name: 'Your answer: ', parallel: variant === 2 },
		],
	};

	return [question, answer, qnVariables];
}
function e(variables?: {
	a?: Vector;
	b?: Vector;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	let a = variables?.a ?? getRandomVec({ nonzero: false });
	let b = variables?.b ?? getRandomVec({ nonzero: false });
	const variant = variables?.variant ?? getRandomInt(1, 2);
	while (a.isParallelTo(b)) {
		a = getRandomVec({ nonzero: false });
		b = getRandomVec({ nonzero: false });
	}
	const body = `Given the points ${math(`${a.toCoordinates('A')}`)} and ${math(
		`${b.toCoordinates('B')},`,
	)}
		what is area of the 
		${
			variant === 1
				? `triangle ${math('OAB?')}`
				: `parallelogram formed by ${math('OA')} and ${math('OB?')}`
		}
  `;
	const area = variant === 1 ? a.cross(b).magnitude().divide(2) : a.cross(b).magnitude();
	let areaString = `\\textrm{Area} = ${area}`;
	if (area.radicand.isGreaterThan(100)) {
		areaString += `\\approx ${area.toPrecision(3)}`;
	}
	areaString += ` \\textrm{ units}^2`;
	const ans = math(`${areaString}.`, { wrap: true });

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'sqrt', value: area, name: math(`\\textrm{Area } =`), approx: true }],
	};

	return [question, answer, qnVariables];
}

export const qnLogics = {
	a,
	b,
	c,
	d,
	e,
};
