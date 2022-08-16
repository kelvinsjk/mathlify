import type { AnswerObject } from '$lib/interfaces';
import { Vector, getNiceVec, getRandomVec, xVector, Unknown } from 'mathlify';
import { math, display } from 'mathlifier';

export default function qnLogic(variables?: {
	a?: Vector;
	b?: Vector;
}): [AnswerObject, AnswerObject] {
	let { a, b } = variables || {};
	// set up
	a = a ?? getNiceVec();
	b = b ?? getRandomVec({ simplify: true });
	while (a.isParallelTo(b)) {
		b = getRandomVec({ simplify: true });
	}

	// construction
	const unknown = 'p';
	const pA = new xVector(
		new Unknown(a.x, { unknown }),
		new Unknown(a.y, { unknown }),
		new Unknown(a.z, { unknown }),
	);
	const p = a.magnitude().reciprocal();
	const cross = a.cross(b).multiply(p.coeff).simplify();

	// qn
	const body = `The vectors ${math('\\mathbf{a}')} and ${math('\\mathbf{b}')} are given by
		${display(`\\begin{align*}
			&&	\\mathbf{a} = ${pA} \\\\
			\\textrm{ and } \\quad && b = ${b},
		\\end{align*}`)}
		where ${math('p')} is a positive constant. Given that ${math('\\mathbf{a}')}
		is a unit vector,`;
	const partA = `find the exact value of ${math('p,')}`;
	const partB = `give a geometrical interpretation of ${math(
		'\\left|\\mathbf{a}\\cdot \\mathbf{b}\\right|,',
	)}`;
	const partC = `evaluate ${math('\\mathbf{a}\\times\\mathbf{b}.')}`;
	// answer
	const ansA = math(`p=${p}.`);
	const ansB = `It represents the length of projection of ${math('\\mathbf{b}')} onto ${math(
		'\\mathbf{a}.',
	)}`;
	const ansC = math(`${cross}.`);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partA, marks: 2 },
			{ body: partB, marks: 1 },
			{ body: partC, marks: 2 },
		],
	};
	const answer: AnswerObject = {
		parts: [{ body: ansA }, { body: ansB }, { body: ansC }],
	};

	return [question, answer];
}
