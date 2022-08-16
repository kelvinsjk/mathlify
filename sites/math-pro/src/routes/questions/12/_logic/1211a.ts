import type { AnswerObject } from '$lib/interfaces';
import { uVector, getRandomInt, Fraction, BasicTerm } from 'mathlify';
import {
	math,
	//display
} from 'mathlifier';

export default function qnLogic(variables?: {
	l1?: number;
	m1?: number;
	l2?: number;
	m2?: number;
}): [AnswerObject, AnswerObject] {
	let { l1, m1, l2, m2 } = variables || {};
	// set up
	if (l1 === undefined || m1 === undefined) {
		l1 = getRandomInt(1, 4);
		m1 = getRandomInt(1, 4);
		while (l1 + m1 > 5) {
			l1 = getRandomInt(1, 4);
			m1 = getRandomInt(1, 4);
		}
	}
	if (l2 === undefined || m2 === undefined) {
		l2 = getRandomInt(1, 4);
		m2 = getRandomInt(1, 4);
		while (l2 + m2 > 5) {
			l2 = getRandomInt(1, 4);
			m2 = getRandomInt(1, 4);
		}
	}

	// construction
	const p = new uVector('a', new Fraction(l1, l1 + m1));
	const q = new uVector('b', new Fraction(l2, l2 + m2));
	const m = p.multiply(new Fraction(1, 2)).plus(q.multiply(new Fraction(1, 2)));
	const cross = m.cross(p).multiply(new Fraction(1, 2));
	const k = cross.vectors[0].coeff;
	const area = new BasicTerm(k.abs(), `\\left| ${cross.vectors[0].variable} \\right|`);

	// question
	const body = `Referred to the origin ${math('O, ')} the points ${math('A')} and
		${math('B')} are such that ${math(`\\overrightarrow{OA}=\\mathbf{a}`)} and
		${math(`\\overrightarrow{OB}=\\mathbf{b}.`)} The point ${math('P')} on
		${math(`OA`)} is such that ${math(`OP:PA=${l1}:${m1},`)} and the point
		${math('Q')} on ${math(`OB`)} is such that ${math(`OQ:QB=${l2}:${m2}.`)}
		The mid-point of ${math('PQ')} is ${math('M.')}
		
		<div class="top-margin">
			Find ${math('\\overrightarrow{OM}')} in terms of ${math('\\mathbf{a}')} and
			${math('\\mathbf{b}')} and show that the area of triangle ${math('OMP')} can be
			written as ${math('k|\\mathbf{a}\\times \\mathbf{b}|,')} where ${math('k')}
			is a constant to be found.
		</div>
  `;

	// answer
	const ans =
		math(`\\overrightarrow{OM} = ${m}`) +
		`<br>
		${math(`\\textrm{Area} = ${area}`)}`;

	const question: AnswerObject = {
		body,
		marks: 6,
	};
	const answer: AnswerObject = {
		body: ans,
	};

	return [question, answer];
}
