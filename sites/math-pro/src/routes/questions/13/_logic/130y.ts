import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomVec,
	Vector,
	getRandomInt,
	Fraction,
	heads,
	getRandomFrac,
	Line,
	Plane,
	xVector,
	expToPoly,
	solveLinear,
	Term,
} from 'mathlify';
import { math, display } from 'mathlifier';

function qn7(variables?: {
	a?: Vector;
	b?: Vector;
	n?: Vector;
	lambda?: Fraction;
}): [AnswerObject, AnswerObject] {
	let { a, b, lambda, n } = {
		...variables,
	};
	// set up: variables
	a = a ?? getRandomVec({ simplify: true });
	b = b ?? getRandomVec({ simplify: true, avoid: [a] });
	const d = b.minus(a);
	n = n ?? getRandomVec({ simplify: true, avoid: [d], avoidParallel: true, avoidPerp: true });
	lambda = lambda ?? getRandomFrac({ numRange: [-3, 3], denRange: [1, 2], avoid: [0, 1] });
	// set up
	const l = new Line(a, d);
	const x = l.point(lambda);
	const p = new Plane(n, { rhs: x.dot(n) });

	// question
	const body = `The line ${math('l')} passes through the points ${math('A')}
		and ${math('B')} with coordinates ${math(a.toCoordinates())} and
		${math(b.toCoordinates())} respectively. The plane ${math('p')} has equation
		${math(p.toCartesianString() + '.')} Find
  `;
	const partI = `The coordiantes of the point of intersection of ${math('l')} and ${math('p,')}`;
	const partII = `The acute angle between ${math('l')} and ${math('p,')}`;
	const partIII = `The perpendicular distance from ${math('A')} to ${math('p.')}`;

	// solution working
	const xSolve = p.intersectLine(l) as Vector;
	const angle = p.angleTo(l);
	const distance = p.distanceTo(a);
	const approxVal = !distance.isRational() ? `\\approx ${distance.toPrecision(3)}` : '';

	// answer
	const ansI = math(`${xSolve.toCoordinates()}.`);
	const ansII = math(`\\theta = ${angle}.`);
	const ansIII = math(`${distance}${approxVal} \\textrm{ units}.`, { wrap: true });

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 5 },
			{ body: partII, marks: 3 },
			{ body: partIII, marks: 3 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn8(variables?: {
	n1?: Vector;
	n2?: Vector;
	n3?: Vector;
	rhs1?: Fraction;
	rhs2?: Fraction;
	rhs3?: Fraction;
	b?: Vector;
}): [AnswerObject, AnswerObject] {
	// line of intersection
	const denom = getRandomInt(1, 12);
	const num = getRandomInt(1, denom) * (heads() ? 1 : -1);
	const lambdaLine = new Fraction(num, denom);
	const a = getRandomVec({ min: -2, max: 2 });
	const dX = getRandomInt(-2, 2, { avoid: [0] });
	const dY = getRandomInt(-2, 2, { avoid: [0] });
	const dZ = getRandomInt(-2, 2, { avoid: [0] });
	const d = new Vector(dX, dY, dZ, { stretchable: true });
	const l = new Line(a, d);
	const x = l.point(lambdaLine);
	let b = variables?.b ?? getRandomVec();
	while (l.contains(b)) {
		b = getRandomVec();
	}
	// plane 1
	const d2 = getRandomVec({ avoid: [d], avoidParallel: true });
	const n1 = variables?.n1 ?? d.cross(d2);
	const rhs1 = variables?.rhs1 ?? a.dot(n1);
	// plane 2
	const d3 = getRandomVec({ avoid: [n1], avoidPerp: true });
	const n2 = variables?.n2 ?? d.cross(d3);
	const rhs2 = variables?.rhs2 ?? a.dot(n2);
	// plane 3
	const nX = getRandomInt(-6, 6, { avoid: [0] });
	const nZ = getRandomInt(-18, 18, { avoid: [0] });
	let numY = getRandomInt(-210, 210, { avoid: [0] });
	let n3Ten = new Vector(nX * 10, numY, nZ * 10);
	let dot = x.multiply(denom).dot(n3Ten);
	while (dot.num % denom !== 0 || n3Ten.dot(d).isEqualTo(0)) {
		numY = numY === -1 ? 1 : numY + 1;
		n3Ten = new Vector(nX * 10, numY, nZ * 10);
		dot = x.multiply(denom).dot(n3Ten);
	}
	const n3 = variables?.n3 ?? n3Ten.divide(10);
	const rhs3 = variables?.rhs3 ?? x.dot(n3);

	// set up
	const p1 = new Plane(n1, { rhs: rhs1 });
	const p2 = new Plane(n2, { rhs: rhs2 });
	const n3Unknown = new xVector(n3.x, '\\lambda', n3.z);
	const lambdaPlane = n3.y.isInteger() ? `${n3.y}` : `${n3.y.valueOf()}`;
	const muPlane = rhs3.isInteger() ? `${rhs3}` : `${rhs3.valueOf()}`;

	// plane alignment set up
	const xTerm1 = new Term(n1.x, 'x');
	const ySign1 = n1.y.isLessThan(0) ? '\\,-\\,' : '\\,+\\,';
	const yTerm1 = new Term(n1.y.abs(), 'y');
	const zSign1 = n1.z.isLessThan(0) ? '\\,-\\,' : '\\,+\\,';
	const zTerm1 = new Term(n1.z.abs(), 'z');
	const xTerm2 = new Term(n2.x, 'x');
	const ySign2 = n2.y.isLessThan(0) ? '\\,-\\,' : '\\,+\\,';
	const yTerm2 = new Term(n2.y.abs(), 'y');
	const zSign2 = n2.z.isLessThan(0) ? '\\,-\\,' : '\\,+\\,';
	const zTerm2 = new Term(n2.z.abs(), 'z');
	const xTerm3 = new Term(n3.x, 'x');
	const ySign3 = '\\,+\\,';
	const yString3 = `\\lambda y`;
	const zSign3 = n3.z.isLessThan(0) ? '\\,-\\,' : '\\,+\\,';
	const zTerm3 = new Term(n3.z.abs(), 'z');
	const xString1 = `${xTerm1}` === '0' ? '' : `${xTerm1}`;
	const yString1 = `${yTerm1}` === '0' ? '' : `${yTerm1}`;
	const zString1 = `${zTerm1}` === '0' ? '' : `${zTerm1}`;
	const xString2 = `${xTerm2}` === '0' ? '' : `${xTerm2}`;
	const yString2 = `${yTerm2}` === '0' ? '' : `${yTerm2}`;
	const zString2 = `${zTerm2}` === '0' ? '' : `${zTerm2}`;
	const xString3 = `${xTerm3}` === '0' ? '' : `${xTerm3}`;
	const zString3 = `${zTerm3}` === '0' ? '' : `${zTerm3}`;
	const displayString = `
		${xString1} & ${ySign1} & ${yString1} & ${zSign1} & ${zString1} & = ${rhs1}, \\\\
		${xString2} & ${ySign2} & ${yString2} & ${zSign2} & ${zString2} & = ${rhs2}, \\\\
		${xString3} & ${ySign3} & ${yString3} & ${zSign3} & ${zString3} & = \\mu,
	`;

	// question
	const body = `The equations of three planes ${math('p_1, ')}
		${math('p_2, ')} ${math('p_3 ')} are
		${display(`
		\\begin{alignat*}{6}
			${displayString}			
		\\end{alignat*}`)}
		respectively, where
		${math(`\\lambda`)} and 
		${math(`\\mu`)} are constants.

		<div class="top-margin">
			When ${math(`\\lambda=${lambdaPlane}`)} and
			${math(`\\mu = ${muPlane},`)} find the coordinates of the point at which the three planes meet.
		</div>
  `;
	const partI = `Find a vector equation of ${math(`l.`)}`;
	const partII = `Given that ${math('l')} lies in ${math('p_3,')} find ${math(
		'\\lambda',
	)} and ${math('\\mu.')}`;
	const partIII = `Given instead that ${math('l')} and ${math(
		'p_3',
	)} have no point in common, what can be
		said about the values of ${math('\\lambda')} and ${math('\\mu.')}`;
	const partIV = `Find the cartesian equation of the plane which contains ${math('l')}
		and the point ${math(`${b.toCoordinates()}.`)}`;

	// solution working
	const p3Solve = new Plane(n3, { rhs: rhs3 });
	const lSolve = p1.intersectPlane(p2) as Line;
	const xSolve = p3Solve.intersectLine(lSolve) as Vector;
	const lambdaEqn = n3Unknown.dot(lSolve.d);
	const lambdaPoly = expToPoly(lambdaEqn);
	const lambdaSolve = solveLinear(lambdaPoly);
	const n3Solve = new Vector(n3.x, lambdaSolve, n3.z);
	const muSolve = lSolve.a.dot(n3Solve);
	const newP = new Plane(b, { mode: 'ptPtD', v2: lSolve.a, v3: lSolve.d });

	// answer
	const ansI = math(`l: {${lSolve}}, \\allowbreak \\; \\lambda \\in \\mathbb{R}.`, { wrap: true });
	const ansII = `${math(`\\lambda = ${lambdaSolve}, `)} ${math(`\\mu = ${muSolve}.`)}`;
	const ansIII = `${math(`\\lambda = ${lambdaSolve}, `)} ${math(
		`\\mu \\neq ${muSolve}, \\mu \\in \\mathbb{R}.`,
	)}`;
	const ansIV = math(`${newP.toCartesianString()}.`);

	const question: AnswerObject = {
		body,
		marks: 2,
		parts: [
			{
				body: partI,
				marks: 4,
				uplevel: `The planes ${math('p_1')} and ${math('p_2')} intersect in a line ${math('l.')}`,
			},
			{ body: partII, marks: 3 },
			{ body: partIII, marks: 2 },
			{ body: partIV, marks: 4 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		body: math(`${xSolve.toCoordinates()}.`),
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }, { body: ansIV }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn9(variables?: {
	n1?: Vector;
	n2?: Vector;
	rhs1?: number;
	rhs2?: number;
	a?: Vector;
}): [AnswerObject, AnswerObject] {
	// set up
	const n1 = variables?.n1 ?? getRandomVec({ min: -3, max: 3, simplify: true });
	const n2 =
		variables?.n2 ??
		getRandomVec({ min: -3, max: 3, simplify: true, avoid: [n1], avoidParallel: true });
	const rhs1 = variables?.rhs1 ?? getRandomInt(-3, 3, { avoid: [0] });
	const rhs2 = variables?.rhs2 ?? getRandomInt(-3, 3, { avoid: [0] });
	let a = variables?.a ?? getRandomVec({ min: -3, max: 3, nonzero: false });
	const p1 = new Plane(n1, { rhs: rhs1 });
	const p2 = new Plane(n2, { rhs: rhs2 });
	while (p1.contains(a) || p2.contains(a)) {
		a = getRandomVec({ min: -3, max: 3, nonzero: false });
	}
	// question
	const body = `The planes ${math('p_1')} and
		${math('p_2')} have equations
		${math(`${p1}`)} and ${math(`${p2}`)} respectively, and meet in a line
		${math('l.')}
  `;
	const partI = `Find the acute angle between ${math('p_1')}
		and ${math(`p_2.`)}`;
	const partII = `Find a vector equation of ${math('l.')}`;
	const exp1 = new Term(n1.x, 'x').plus(new Term(n1.y, 'y')).plus(new Term(n1.z, 'z')).minus(rhs1);
	const exp2 = new Term(n2.x, 'x').plus(new Term(n2.y, 'y')).plus(new Term(n2.z, 'z')).minus(rhs2);
	const partIII = `The plane ${math('p_3')} has equation
		${display(`{${exp1}} + {k(${exp2})} = 0.`)}
		Explain why
		${math('l')} lies in ${math('p_3')} for any constant ${math('k.')}
		<div class="top-margin">
			Hence, or otherwise, find a cartesian equation of the plane in which both ${math('l')} and
			the point ${math(`${a.toCoordinates()}`)} lie.
		</div>
	`;

	// solution working
	const angle = p1.angleTo(p2);
	const l = p1.intersectPlane(p2) as Line;
	const p3 = new Plane(a, { mode: 'ptPtD', v2: l.a, v3: l.d });

	// answer
	const ansI = math(`\\theta = ${angle}.`);
	const ansII = math(`l: {${l}}, \\allowbreak \\; \\lambda \\in \\mathbb{R}.`, { wrap: true });
	const ansIII = math(`${p3.toCartesianString()}`);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 3 },
			{ body: partII, marks: 4 },
			{ body: partIII, marks: 5 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

export const qnLogics = {
	qn7,
	qn8,
	qn9,
};
