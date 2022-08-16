import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomVec,
	Vector,
	getRandomInt,
	gcd,
	Fraction,
	uVector,
	Unknown,
	xVector,
	getNiceVec,
	Term,
	expToPoly,
	solveQuadratic,
} from 'mathlify';
import { math, display } from 'mathlifier';

function qn0(variables?: { a?: Vector; b?: Vector }): [AnswerObject, AnswerObject] {
	let { a, b } = variables || {};
	// set up
	if (a === undefined) {
		a = getNiceVec();
	}
	if (b === undefined) {
		b = getNiceVec();
	}
	while (b.isParallelTo(a)) {
		b = getNiceVec();
	}

	// construction
	const unknown = 'p';
	const pA = new xVector(
		new Unknown(a.x, { unknown }),
		new Unknown(a.y, { unknown }),
		new Unknown(a.z, { unknown }),
	);

	// question
	const body = `The position vectors ${math('\\mathbf{a}')} and
		${math('\\mathbf{b}')} are given by
		${display(`\\begin{align*} && a=${pA} \\\\ \\textrm{and} \\quad && b = ${b}, \\end{align*}`)}
		where ${math('p>0.')} It is given that ${math('|\\mathbf{a}| = |\\mathbf{b}|.')}
  `;
	const partI = `Find the exact value of ${math(`p.`)}`;
	const partII = `Evaluate ${math('(\\mathbf{a}+\\mathbf{b})\\cdot(\\mathbf{a}-\\mathbf{b}).')}`;

	// solution working
	const p = b.magnitude().divide(a.magnitude());

	// answer
	const ansI = math(`p = ${p}.`);
	const ansII = math(`(\\mathbf{a}+\\mathbf{b})\\cdot(\\mathbf{a}-\\mathbf{b}) = 0.`);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 3 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn2(variables?: {
	a?: Vector;
	b?: Vector;
	m1?: number;
	l2?: number;
	m2?: number;
}): [AnswerObject, AnswerObject] {
	let { a, b, m1, l2, m2 } = variables || {};
	// generate variables
	a = a ?? getRandomVec({ simplify: true, min: -2, max: 2 });
	b = b ?? getRandomVec({ simplify: true, min: -2, max: 2 });
	while (a.isParallelTo(b) || a.dot(b).isEqualTo(0)) {
		a = getRandomVec({ simplify: true, min: -2, max: 2 });
		b = getRandomVec({ simplify: true, min: -2, max: 2 });
	}
	if (a.dot(b).isGreaterThan(0)) {
		b = b.multiply(-1);
	}
	m1 = m1 ?? getRandomInt(1, 7);
	l2 = l2 ?? getRandomInt(1, 2);
	m2 = m2 ?? getRandomInt(1, 6, { avoid: [m1] });
	let c2 = a.multiply(l2).plus(b.multiply(m2));
	while (c2.dot(a).isEqualTo(0) || c2.dot(b).isEqualTo(0)) {
		l2++;
		c2 = a.multiply(l2).plus(b.multiply(m2));
	}

	// construct qn/answers
	const c1 = b.multiply(m1);
	const area = c1.cross(a).magnitude().divide(2);

	// typeset qn/answers
	const body = `Referred to the origin ${math(`O,`)} the points ${math('A')} and
		${math(`B`)} have position vectors ${math('\\mathbf{a}')} and
		${math(`\\mathbf{b}`)} such that
		${display(`\\begin{align*} \\mathbf{a} &= ${a.toIJKString()} \\\\
			\\textrm{and} \\quad \\mathbf{b} &= ${b.toIJKString()}. \\end{align*}
		`)}
		The point ${math('C')} has position vector ${math('\\mathbf{c}')} given by
		${math(`\\mathbf{c}=\\lambda \\mathbf{a}+\\mu \\mathbf{b},`)} where
		${math('\\lambda')} and ${math('\\mu')} are positive constants.
	`;
	const partI = `Given that the area of triangle ${math('OAC')} is ${math(`${area},`)} find ${math(
		'\\mu.',
	)}`;
	const partII = `Given instead that ${math(`\\mu = ${m2}`)} and that ${math(
		`OC = ${c2.magnitude()},`,
	)}
		find the possible coordinates of ${math('C.')}
	`;

	// solution working
	const lambda = new Term('\\lambda');
	const c3 = new xVector(
		lambda.times(a.x).plus(b.multiply(m2).x),
		lambda.times(a.y).plus(b.multiply(m2).y),
		lambda.times(a.z).plus(b.multiply(m2).z),
	);
	const quadratic = expToPoly(c3.magnitudeSquare().minus(c2.magnitudeSquare()));
	const roots = solveQuadratic(quadratic) as [Fraction, Fraction];
	const lambda2 = roots.filter((e) => !e.isEqualTo(l2))[0];
	//const quadratic = c3.magnitudeSquare().minus(c2.magnitudeSquare());
	//const A = quadratic.terms.filter((e) => e.variable === ' \\lambda^2')[0].coeff;
	//const C = quadratic.terms.filter((e) => e.variable === '')[0].coeff;
	//const productOfRoots = C.divide(A);
	//const lambda2 = productOfRoots.divide(l2);
	const c2b = c3.subIn(lambda2);

	// answer
	const ansI = math(`\\mu = ${m1}.`);
	const ansII = math(
		`{${c2.toCoordinates('C')}} \\allowbreak \\textrm{ or } \\allowbreak {${c2b.toCoordinates(
			'C',
		)}}.`,
		{ wrap: true },
	);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 4 },
			{ body: partII, marks: 4 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn3(variables?: { l?: number; m?: number }): [AnswerObject, AnswerObject] {
	// generate variables
	let { l, m } = { l: getRandomInt(1, 5), m: getRandomInt(1, 5), ...variables };
	const divisor = gcd(l, m);
	l = l / divisor;
	m = m / divisor;

	// construct qn/answers
	const lambda = new Unknown(new Fraction(2 * m, l + m), { unknown: '\\mu' });

	// typeset qn/answers
	const body = `The origin ${math(`O`)} and the points ${math('A, B')} and
		${math(`C`)} lie in the same plane, where ${math('\\overrightarrow{OA}=\\mathbf{a}, ')}
		${math('\\overrightarrow{OB}=\\mathbf{b} ')} and
		${math('\\overrightarrow{OC}=\\mathbf{c}.')}

		<div class="top-margin">
			The point ${math('N')} is on ${math('AC')} such that
			${math(`AN:NC = ${l}:${m}.`)}
		</div>
	`;
	const partI = `Write down the position vector of ${math('N')} in terms of ${math(
		`\\mathbf{a}`,
	)} and ${math('\\mathbf{c}.')}`;
	const partII = `It is given that ${math('\\mathbf{c}=\\lambda\\mathbf{a}+\\mu\\mathbf{b},')} 
		for positive constants ${math('\\lambda')} and ${math('\\mu.')} 
		<div class="top-margin">
			It also given that the area of triangle
			${math(`ONC`)} is equal to the area of triangle ${math(`OMC,`)} where ${math(
		'M',
	)} is the mid-point of ${math('OB.')} 
		</div>
		<div class="top-margin">
			By finding the areas of these
				triangles in terms of ${math('\\mathbf{a}')} and ${math('\\mathbf{b},')} find 
				${math('\\lambda')} in terms of ${math('\\mu.')}
		</div>
	`;

	// solution working
	const mA = new uVector('a', new Fraction(m, l + m));
	const lC = new uVector('c', new Fraction(l, l + m));
	const n = mA.plus(lC);
	// test run
	//const lambdaA = new uxVector('a', '\\lambda');
	//const muB = new uxVector('b', '\\mu');
	//const c = lambdaA.plus(muB);
	//const lA = new uxVector('a', new Unknown(new Fraction(l, l + m), { unknown: '\\lambda' }));
	//const lB = new uxVector('b', new Unknown(new Fraction(l, l + m), { unknown: '\\mu' }));
	//const n2 = lA.plus(lB).plus(mA);
	//const area1 = c.cross(n2);
	//const M = new uVector('b', new Fraction(1, 2));
	//const area2 = c.cross(M);

	// answer
	const ansI = math(`\\overrightarrow{ON} = ${n}.`);
	const ansII = math(`\\lambda = ${lambda}.`);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 1 },
			{ body: partII, marks: 5 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn4(variables?: { a?: Vector; axis?: number }): [AnswerObject, AnswerObject] {
	// generate variables
	const { a, axis } = {
		axis: getRandomInt(1, 3),
		a: getNiceVec().simplify({ stretchable: true }),
		...variables,
	};
	const axisName = axis === 1 ? 'x' : axis === 2 ? 'y' : 'z';
	const axisVec = axis === 1 ? Vector.I : axis === 2 ? Vector.J : Vector.K;

	// typeset qn/answers
	const partI = `Find a unit vector ${math('\\mathbf{n}')} such that ${display(
		`\\mathbf{n} \\times (${a.toIJKString()}) = \\mathbf{0}.`,
	)}`;
	const partII = `Find the cosine of the acute angle between
	${math(`${a.toIJKString()}`)} and the 
	${math(`${axisName}\\textrm{-}`)}axis.
	`;

	// solution working

	// answer
	const ansI = math(`\\mathbf{n} = \\displaystyle \\frac{1}{${a.magnitude()}} ${a}.`);
	const ansII = math(
		`\\cos \\theta = \\displaystyle ${a.dot(axisVec).abs().divide(a.magnitude().coeff)}.`,
	);

	const question: AnswerObject = {
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 1 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

export const qnLogics = {
	qn0,
	qn2,
	qn3,
	qn4,
};
