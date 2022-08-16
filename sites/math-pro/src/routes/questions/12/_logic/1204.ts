import type { AnswerObject, QuestionVariables } from '$lib/interfaces';
import { getNiceVec, Vector, getRandomInt, heads } from 'mathlify';
import {
	math,
	//display
} from 'mathlifier';

function a(variables?: {
	a?: Vector;
	b?: Vector;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	let a = variables?.a ?? getNiceVec();
	let b = variables?.b ?? getNiceVec();
	const variant = variables?.variant ?? getRandomInt(1, 2);
	while (a.isParallelTo(b) || a.isPerpendicularTo(b)) {
		a = variables?.a ?? getNiceVec();
		b = variables?.b ?? getNiceVec();
	}
	a.simplify({ stretchable: true });
	b.simplify({ stretchable: true });
	// question
	const qn =
		variant === 1
			? `${math('\\mathbf{a}')} onto ${math('\\mathbf{b}?')}`
			: `${math('\\mathbf{b}')} onto ${math('\\mathbf{a}?')}`;
	const body = `Given the vectors ${math(`\\mathbf{a}=${a}`)} and
		${math(`\\mathbf{b}=${b},`)} what is the length of projection of
    ${qn}
  `;
	// answer
	const ansVal =
		variant === 1
			? a.dot(b).divide(b.magnitude().coeff).abs()
			: b.dot(a).divide(a.magnitude().coeff).abs();
	const ans = math(`${ansVal} \\textrm{ units}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'fraction', value: ansVal, name: 'Your answer: ' }],
	};

	return [question, answer, qnVariables];
}

function b(variables?: {
	a?: Vector;
	b?: Vector;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	let a = variables?.a ?? getNiceVec();
	let b = variables?.b ?? getNiceVec();
	const variant = variables?.variant ?? getRandomInt(1, 2);
	while (a.isParallelTo(b) || a.isPerpendicularTo(b)) {
		a = variables?.a ?? getNiceVec();
		b = variables?.b ?? getNiceVec();
	}
	a.simplify({ stretchable: true });
	b.simplify({ stretchable: true });
	// question
	const qn =
		variant === 1
			? `${math('\\mathbf{a}')} onto ${math('\\mathbf{b}?')}`
			: `${math('\\mathbf{b}')} onto ${math('\\mathbf{a}?')}`;
	const body = `Given the vectors ${math(`\\mathbf{a}=${a}`)} and
		${math(`\\mathbf{b}=${b},`)} what is the projection vector of
    ${qn}
  `;
	// answer
	const ansVal =
		variant === 1
			? b.multiply(a.dot(b).divide(b.magnitude().coeff).divide(b.magnitude().coeff), {
					multiplyIntoCoeff: true,
			  })
			: a.multiply(b.dot(a).divide(a.magnitude().coeff).divide(a.magnitude().coeff), {
					multiplyIntoCoeff: true,
			  });
	const ans = math(`${ansVal}.`);

	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'vector', value: ansVal, name: 'Your answer: ' }],
	};

	return [question, answer, qnVariables];
}

function c(variables?: {
	a?: Vector;
	b?: Vector;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	let a = variables?.a ?? getNiceVec();
	let b = variables?.b ?? getNiceVec();
	const variant = variables?.variant ?? getRandomInt(1, 2);
	while (a.isParallelTo(b)) {
		a = variables?.a ?? getNiceVec();
		b = variables?.b ?? getNiceVec();
	}
	// question
	const qn =
		variant === 1
			? `${math('A')} to the line ${math('OB?')}`
			: `${math('B')} to the line ${math('OA?')}`;
	const body = `Given the points ${math(`${a.toCoordinates('A')}`)} and
		${math(`${b.toCoordinates('B')},`)} what is the perpendicular distance
		from the point
    ${qn}
  `;
	// answer
	const ansVal =
		variant === 1
			? a.cross(b).magnitude().divide(b.magnitude())
			: b.cross(a).magnitude().divide(a.magnitude());
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

function d(variables?: {
	qnCase?: number;
	swap?: boolean;
	variant?: number;
}): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const { qnCase, swap, variant } = {
		qnCase: getRandomInt(1, 3), // 1: projection, 2: perpendicular, 3: area
		swap: heads(),
		variant: getRandomInt(1, 2),
		...variables,
	};
	// question
	let body = `The points ${math('A')} and ${math('B')} have position
		vectors ${math('\\mathbf{a}')} and ${math('\\mathbf{b}')} respectively.
	`;
	let ans: string;
	let options: string[];
	let ansVal: number;
	if (variant === 1) {
		body += `<div class="top-margin">What is the geometric meaning of the expression `;
		if (qnCase === 1) {
			body += swap
				? math(`\\Big| \\mathbf{b} \\cdot \\mathbf{\\hat{a}} \\Big|?`)
				: math(`\\Big| \\mathbf{a} \\cdot \\mathbf{\\hat{b}} \\Big|?`);
			ans = `The length of projection of ${swap ? math('\\mathbf{b}') : math('\\mathbf{a}')} onto ${
				swap ? math('\\mathbf{a}.') : math('\\mathbf{b}.')
			}`;
			ansVal = swap ? 1 : 0;
		} else if (qnCase === 2) {
			body += swap
				? math(`\\Big| \\mathbf{b} \\times \\mathbf{\\hat{a}} \\Big|?`)
				: math(`\\Big| \\mathbf{a} \\times \\mathbf{\\hat{b}} \\Big|?`);
			ans = `The perpendicular distance from the point ${
				swap ? math('B') : math('A')
			} to the line ${swap ? math('OA.') : math('OB.')}`;
			ansVal = swap ? 3 : 2;
		} else {
			body += swap
				? math(`\\sqrt{1}{2} \\Big| \\mathbf{a} \\times \\mathbf{b} \\Big|?`)
				: math(`\\Big| \\mathbf{a} \\times \\mathbf{b} \\Big|?`);
			ans = `The area of the ${
				swap
					? `triangle ${math('OAB.')}`
					: `parallelogram formed by ${math('OA')} and ${math('OB.')}`
			}`;
			ansVal = swap ? 4 : 5;
		}
		body += `</div>`;
		options = [
			`The length of projection of ${math('\\mathbf{a}')} onto 
			${math('\\mathbf{b}.')}`,
			`The length of projection of ${math('\\mathbf{b}')} onto 
			${math('\\mathbf{a}.')}`,
			`The perpendicular distance from the point ${math('A')} to the line
			${math('OB.')}`,
			`The perpendicular distance from the point ${math('B')} to the line
			${math('OA.')}`,
			`The area of the triangle ${math('OAB.')}`,
			`The area of the parallelogram formed by ${math('OA')} and
			${math('OB.')}`,
		];
	} else {
		body += `<div class="top-margin">
			Write down an expression for the 
		`;
		if (qnCase === 1) {
			body += swap
				? `length of projection of ${math('\\mathbf{b}')} onto ${math('\\mathbf{a}.')}`
				: `length of projection of ${math('\\mathbf{a}')} onto ${math('\\mathbf{b}.')}`;
			ans = swap
				? math(`\\Big| \\mathbf{b} \\cdot \\mathbf{\\hat{a}} \\Big|.`)
				: math(`\\Big| \\mathbf{a} \\cdot \\mathbf{\\hat{b}} \\Big|.`);
			ansVal = swap ? 1 : 0;
		} else if (qnCase === 2) {
			body += swap
				? `perpendicular distance from ${math('B')} to the line ${math('OA.')}`
				: `perpendicular distance from ${math('A')} to the line ${math('OB.')}`;
			ans = swap
				? math(`\\Big| \\mathbf{b} \\times \\mathbf{\\hat{a}} \\Big|.`)
				: math(`\\Big| \\mathbf{a} \\times \\mathbf{\\hat{b}} \\Big|.`);
			ansVal = swap ? 3 : 2;
		} else {
			body += swap
				? `area of the triangle ${math('OAB.')}`
				: `area of the parallelogram formed by ${math('OA')} and ${math('OB.')}`;
			ans = swap
				? math(`\\sqrt{1}{2} \\Big| \\mathbf{a} \\times \\mathbf{b} \\Big|.`)
				: math(`\\Big| \\mathbf{a} \\times \\mathbf{b} \\Big|.`);
			ansVal = swap ? 4 : 5;
		}
		body += `</div>`;
		options = [
			math(`\\Big| \\mathbf{a} \\cdot \\mathbf{\\hat{b}} \\Big|.`),
			math(`\\Big| \\mathbf{b} \\cdot \\mathbf{\\hat{a}} \\Big|.`),
			math(`\\Big| \\mathbf{a} \\times \\mathbf{\\hat{b}} \\Big|.`),
			math(`\\Big| \\mathbf{b} \\times \\mathbf{\\hat{a}} \\Big|.`),
			math(`\\frac{1}{2} \\Big| \\mathbf{a} \\times \\mathbf{b} \\Big|.`),
			math(`\\Big| \\mathbf{a} \\times \\mathbf{b} \\Big|.`),
		];
	}
	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'mcq', value: ansVal, options, name: '' }],
	};

	return [question, answer, qnVariables];
}

function e(variables?: { variant?: number }): [AnswerObject, AnswerObject, QuestionVariables] {
	// set up
	const variant = variables?.variant ?? getRandomInt(1, 2);
	// question
	const body = `Under what conditions will
		${math(
			`\\mathbf{a} ${variant === 1 ? '\\cdot' : '\\times'} \\mathbf{b}= ${
				variant === 1 ? '0' : '\\mathbf{0}'
			}?`,
		)}
  `;
	const options = [
		math(`\\mathbf{a}=\\mathbf{0}`),
		math(`\\mathbf{b}=\\mathbf{0}`),
		math(`|\\mathbf{a}|=|\\mathbf{b}|`),
		`${math(`\\mathbf{a}`)} is a unit vector`,
		`${math(`\\mathbf{b}`)} is a unit vector`,
		`${math(`\\mathbf{a}`)} is parallel to ${math(`\\mathbf{b}`)}`,
		`${math(`\\mathbf{a}`)} is perpendicular to ${math(`\\mathbf{b}`)}`,
	];
	const ansArray = [0, 1, variant === 1 ? 6 : 5];
	// answer
	const ans =
		math(`\\mathbf{a}=\\mathbf{0}`) +
		` or ` +
		math(`\\mathbf{b}=\\mathbf{0}`) +
		` or 
		${math(`\\mathbf{a}`)} is ${variant === 1 ? 'perpendicular' : 'parallel'} to ${math(`\\mathbf{b}.`)}
	`;
	const question: AnswerObject = {
		body,
	};
	const answer: AnswerObject = {
		body: ans,
	};
	const qnVariables: QuestionVariables = {
		variant,
		answers: [{ type: 'multi', value: ansArray, options, name: '' }],
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
