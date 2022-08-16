import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomVec,
	Vector,
	getRandomInt,
	Line,
	Plane,
	getRandomPerp,
	getRandomPerps,
} from 'mathlify';
import { math, display } from 'mathlifier';

function qn0(variables?: { d1?: Vector; d2?: Vector; n2?: Vector }): [AnswerObject, AnswerObject] {
	// set up
	const n = getRandomVec({ simplify: true });
	const d1 = variables?.d1 ?? getRandomPerp(n);
	const d2 = variables?.d2 ?? getRandomPerp(n, { avoid: [d1] });
	const n2 =
		variables?.n2 ??
		getRandomVec({
			min: -6,
			max: 6,
			simplify: true,
			avoid: [n],
			avoidParallel: true,
			avoidPerp: true,
		});
	const p2 = new Plane(n2, { rhs: 0 });

	// typeset
	const body = `A plane ${math('\\pi_1')} contains two vectors ${math(`${d1}`)} and
		${math(`${d2}.`)}`;
	const partI = `Find a vector normal to ${math(`\\pi_1.`)}`;
	const uplevel = `A plane ${math('\\pi_2')} has equation ${math(`${p2.toCartesianString()}.`)}`;
	const partII = `Find the acute angle between ${math('\\pi_1')} and ${math('\\pi_2.')}`;

	// answer
	const p1 = new Plane(Vector.ZERO, { mode: 'ptDD', v2: d1, v3: d2 });
	const angle = p1.angleTo(p2);
	const nSolve = d1.cross(d2).simplify({ stretchable: true });

	// typeset
	const ansI = `${math(`\\mathbf{n}_1=${nSolve}.`)}`;
	const ansII = `${math(`\\theta=${angle}.`)}`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, uplevel, marks: 2 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn1(variables?: {
	a1?: Vector;
	a2?: Vector;
	d1?: Vector;
	d2?: Vector;
	b?: Vector;
}): [AnswerObject, AnswerObject] {
	// setup
	const [dGen1, dGen2] = getRandomPerps();
	const { d1, d2, a1 } = {
		a1: getRandomVec(),
		d1: dGen1,
		d2: dGen2,
		...variables,
	};
	const l1 = new Line(a1, d1);
	const b = variables?.b ?? getRandomVec({ avoidLine: l1 });
	const lambda = getRandomInt(-3, 3, { avoid: [0] });
	const k = getRandomInt(-3, 3, { avoid: [0] });
	const mu = getRandomInt(-3, 3, { avoid: [0] });
	const n = d1.cross(d2).simplify({ stretchable: true });
	const a2 =
		variables?.a2 ?? a1.plus(d1.multiply(lambda)).plus(d2.multiply(k)).plus(n.multiply(mu));

	// question
	const l2 = new Line(a2, d2);

	// typeset
	const body = `The line ${math('l_1')} and ${math('l_2')} have equations
		${display(`\\begin{align*}
			& \\mathbf{r}_1 = ${l1.a} + \\lambda ${l1.d} \\quad \\textrm{and} \\\\
			& \\mathbf{r}_2 = ${l2.a} + \\mu ${l2.d}		
		\\end{align*}`)}
		respectively, where ${math('\\lambda')} and ${math('\\mu')} are parameters.
  `;
	const partA = `Find a cartesian equation of the plane containing ${math('l_1')} and the point
		${math(`${b.toCoordinates()}.`)}`;
	const partB = `Show that ${math('l_1')} is perpendicular to ${math('l_2.')}`;
	const partCI = `Find the values of ${math('\\lambda')} and ${math('\\mu')} such that
		${math('\\mathbf{r}_1 - \\mathbf{r}_2')} is perpendicular to both ${math('l_1')} and
		${math('l_2.')}
		<div class="top-margin">
			State the position vectors of the points where the common perpendicular
			meets ${math('l_1')} and ${math('l_2.')}
		</div>`;

	const partCII = `Find the length of this common perpendicular.`;

	// answer
	const p = new Plane(b, { mode: 'ptPtD', v2: l1.a, v3: l1.d });
	// r1-r2 = a1-a2 + lambda d1 - mu d2
	// d1 perpendicular to d2
	const lambdaSolve = a2.minus(a1).dot(d1).divide(d1.magnitudeSquare());
	const muSolve = a1.minus(a2).dot(d2).divide(d2.magnitudeSquare());
	const pt1 = l1.point(lambdaSolve);
	const pt2 = l2.point(muSolve);
	const length = pt1.minus(pt2).magnitude();
	const approxVal = !length.isRational() ? `\\approx ${length.toPrecision(3)}` : '';

	// typeset
	const ansA = `${math(`${p.toCartesianString()}.`)}`;
	const ansB = `${math(`\\mathbf{d}_1 \\cdot \\mathbf{d}_2 = 0`)} so ${math(`l_1`)} is
		perpendicular to ${math(`l_2.`)}`;
	const ansCI = `${math(`\\lambda = ${lambdaSolve}, `)} ${math(`\\mu = ${muSolve}.`)}
		<div class="top-margin">
			Position vectors of required points: ${math(`${pt1}`)} and ${math(`${pt2}.`)}
		</div>
	`;
	const ansCII = math(`${length}${approxVal} \\textrm{ units}.`, { wrap: true });

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partA, marks: 4 },
			{ body: partB, marks: 2 },
			{
				parts: [
					{ body: partCI, marks: 6 },
					{ body: partCII, marks: 2 },
				],
			},
		],
	};

	const answer: AnswerObject = {
		parts: [
			{ body: ansA },
			{ body: ansB },
			{
				parts: [{ body: ansCI }, { body: ansCII }],
			},
		],
	};
	return [question, answer];
}
export const qnLogics = {
	qn0,
	qn1,
};
