import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomVec,
	Vector,
	getRandomInt,
	gcd,
	Fraction,
	uxVector,
	uVector,
	Unknown,
	xVector,
	heads,
	SquareRoot,
	cramersFrac,
} from 'mathlify';
import { math, display } from 'mathlifier';

function qn5(variables?: {
	l1?: number;
	m1?: number;
	l2?: number;
	m2?: number;
}): [AnswerObject, AnswerObject] {
	// set up
	let { l1, l2, m1, m2 } = {
		l1: getRandomInt(1, 5),
		m1: getRandomInt(1, 5),
		l2: getRandomInt(1, 9),
		m2: getRandomInt(1, 9),
		...variables,
	};
	const divisor1 = gcd(l1, m1);
	const divisor2 = gcd(l2, m2);
	[l1, m1] = [l1 / divisor1, m1 / divisor1];
	[l2, m2] = [l2 / divisor2, m2 / divisor2];

	// question
	const f1 = new Fraction(l1, l1 + m1);
	const f2 = new Fraction(l2, l2 + m2);
	const f1A = new uxVector('a', new Unknown(f1, { unknown: '\\lambda' }));
	const f2B = new uxVector('b', new Unknown(f2, { unknown: '\\mu' }));
	const bcVec = `\\mathbf{r} = ${f1A} + (1-\\lambda) \\mathbf{b}`;
	const adVec = `\\mathbf{r} = (1-\\mu) \\mathbf{a} + ${f2B}`;
	// typeset
	const body = `Referred to the origin ${math('O,')} points
		${math('A')} and ${math('B')} have position vectors
		${math('\\mathbf{a}')} and ${math('\\mathbf{b}')} respectively.
		<div class="top-margin">
		Point ${math('C')} lies on ${math('OA,')} between ${math('O')} and ${math('A,')}
		such that ${math(`OC:CA = ${l1}:${m1}.`)}
		</div>
		<div class="top-margin">
		Point ${math('D')} lies on ${math('OB,')} between ${math('O')} and ${math('B,')}
		such that ${math(`OD:DB = ${l2}:${m2}.`)}
		</div>
  `;
	const partI = `Find the position vectors
		${math('\\overrightarrow{OC}')} and ${math('\\overrightarrow{OD},')}
		giving your answers in terms of ${math('\\mathbf{a}')} and ${math('\\mathbf{b}.')}
	`;
	const partII = `Show that the vector equation of the line ${math('BC')}
		can be written as ${display(`${bcVec},`)} where ${math('\\lambda')} is a
		parameter. 
		<div class="top-margin">
		Find in a similar form the vector equation of the line ${math('AD')}
		in terms of a parameter ${math('\\mu.')}
		</div>
	`;
	const partIII = `Find, in terms of ${math('\\mathbf{a}')} and ${math('\\mathbf{b},')}
		the position vector of the point ${math('E')} where the lines ${math('BC')} and ${math('AD')}
		meet and find the ratio ${math('AE:ED.')}	
	`;

	// answer
	const c = new uVector('a', f1);
	const d = new uVector('b', f2);
	const [lambda, mu] = cramersFrac(f1, 1, 1, 1, f2, 1);
	const a1 = f1A.subIn(lambda);
	const b1 = new uVector('b', lambda.negative().plus(1));
	const e = a1.plus(b1);
	const ratio = mu.divide(mu.negative().plus(1));
	// typeset
	const partIAns = `${math(`\\overrightarrow{OC}=${c},`)}
		<br>${math(`\\overrightarrow{OD}=${d}.`)}	
	`;
	const partIIAns = `${math(`l_{AD}: ${adVec}.`)}`;
	const partIIIAns = `${math(`\\overrightarrow{OE} = ${e},`)}
		<br>${math(`AE:ED = ${ratio.num} : ${ratio.den}.`)}`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 3 },
			{ body: partIII, marks: 5 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: partIAns }, { body: partIIAns }, { body: partIIIAns }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn6(variables?: { u?: Vector }): [AnswerObject, AnswerObject] {
	// setup
	let { u } = {
		u: getRandomVec({ simplify: true }),
		...variables,
	};
	while (u.y.isEqualTo(0)) {
		u = getRandomVec({ simplify: true });
	}

	// question
	const v = new xVector('a', 0, 'b');
	const vIJK = `a\\mathbf{i} + b \\mathbf{k}`;
	// typeset
	const body = `The vectors ${math(`\\mathbf{u}`)} and ${math(`\\mathbf{v}`)} are 
		given by ${math(`\\mathbf{u} = ${u.toIJKString()}`)} and ${math(`\\mathbf{v} = ${vIJK},`)}
		where ${math('a')} and ${math('b')} are constants.
  `;
	const partI = `Find 
		${math(`(\\mathbf{u} + \\mathbf{v})\\times(\\mathbf{u} - \\mathbf{v})`)}
		in terms of ${math('a')} and ${math('b.')}
	`;
	const partII = `Given that the ${math('\\mathbf{i}\\textrm{-}')}
		and ${math('\\mathbf{k}\\textrm{-}')}components of the answer to part (i) are
		equal, express ${math(`(\\mathbf{u} + \\mathbf{v})\\times(\\mathbf{u} - \\mathbf{v})`)}
		in terms of ${math('a')} only.
		<div class="top-margin">
			Hence find, in exact form, the possible values of ${math('a')} for which
			${math(`(\\mathbf{u} + \\mathbf{v})\\times(\\mathbf{u} - \\mathbf{v})`)}
			is a unit vector.
		</div>
	`;
	const partIII = `Given instead that
		${math(`(\\mathbf{u} + \\mathbf{v})\\cdot(\\mathbf{u} - \\mathbf{v})=0,`)}
		find the numerical value of ${math('|\\mathbf{v}|.')}
	`;

	// answer
	const vector = v.plus(u).cross(v.negative().plus(u));
	const v2 = new xVector('a', 0, new Unknown(-1, { unknown: 'a' }));
	const vector2 = v2.plus(u).cross(v2.negative().plus(u));
	const v3 = new Vector(1, 0, -1);
	const vector3 = v3.plus(u).cross(v3.negative().plus(u));
	const a = vector3.magnitude().reciprocal();
	// typeset
	const partIAns = math(`${vector}.`);
	const partIIAns = `
		${math(`${vector2},`)}
		<br>${math(`a=\\pm${a}.`)}
	`;
	const partIIIAns = math(`|\\mathbf{v}| = ${u.magnitude()}.`);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 4 },
			{ body: partIII, marks: 2 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: partIAns }, { body: partIIAns }, { body: partIIIAns }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn8(variables?: {
	l?: number;
	m?: number;
	modB?: number;
	sixtyDegrees?: boolean;
}): [AnswerObject, AnswerObject] {
	// set up
	const { modB, sixtyDegrees } = {
		modB: getRandomInt(2, 5),
		sixtyDegrees: heads(),
		...variables,
	};
	let l = variables?.l ?? getRandomInt(1, 5);
	let m = variables?.m ?? getRandomInt(1, 5);
	const divisor = gcd(l, m);
	l = l / divisor;
	m = m / divisor;

	// question
	const lB = new uVector('b', l);
	const mA = new uVector('a', m);
	const mC = new uVector('c', m);
	//const lbMinusMA = lB.minus(mC);
	//const dot = lbMinusMA.dot(lbMinusMA);
	// typeset
	const body = `Vectors ${math(`\\mathbf{a}, \\mathbf{b}`)} and ${math(`\\mathbf{c}`)} are such that
		${math(`\\mathbf{a} \\neq \\mathbf{0}`)} and ${math(
		`\\mathbf{a} \\times ${lB} = ${mA} \\times \\mathbf{c}`,
	)}
  `;
	const partI = `Show that ${math(`${lB}-${mC}=\\lambda \\mathbf{a}, `)} where ${math(
		'\\lambda',
	)} is a constant.`;
	const partII = `It is now given that ${math('\\mathbf{a}')} and ${math(
		`\\mathbf{c}`,
	)} are unit vectors, that the modulus of
		${math(`\\mathbf{b}`)} is ${math(`${modB}`)} and the angle between ${math(
		`\\mathbf{b}`,
	)} and ${math(`\\mathbf{c}`)} is 
		${math(`${sixtyDegrees ? '60' : '120'}^\\circ`)}.
		<div class="top-margin">
			Using a suitable scalar product, find exactly the two possible values of ${math('\\lambda.')}
		</div>
	`;

	// answer
	const sign = sixtyDegrees ? -1 : 1;
	const lambda = new SquareRoot(l * l * modB * modB + l * m * modB * sign + m * m);
	const ans = math(`\\lambda = \\pm ${lambda}.`);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 5 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		body: ans,
	};

	return [question, answer];
}

function qn9(variables?: { l1?: number; m1?: number; l2?: number }): [AnswerObject, AnswerObject] {
	// set up
	const l1 = variables?.l1 ?? getRandomInt(2, 5);
	const m1 = variables?.m1 ?? getRandomInt(2, 5);
	const min1 = (l1 + m1 - 1) / m1;
	const min = Number.isInteger(min1) ? min1 + 1 : Math.ceil(min1);
	const l2 = variables?.l2 ?? getRandomInt(min, min + 4);

	// question
	const l1a = new uVector('a', l1);
	const m1b = new uVector('b', m1);
	const b = new uVector('b');
	const l2a = new uVector('a', l2);
	const c = l1a.plus(m1b);
	const d = b.plus(l2a);
	// typeset
	const body = `With reference to the origin ${math('O, ')} the points
		${math('A,B,C ')} and ${math('D')} are such that
		${math('\\overrightarrow{OA}=\\mathbf{a}, ')}
		${math('\\overrightarrow{OB}=\\mathbf{b}, ')}
		${math(`\\overrightarrow{OC}=${c} `)}
		and ${math(`\\overrightarrow{OD}=${d}.`)}
		<div class="top-margin">
			The lines ${math('BD')} and ${math('AC')} cross at ${math('X.')}
		</div>
  `;
	const partI = `Express
		${math('\\overrightarrow{OX}')}
		in terms of ${math('\\mathbf{a}')} and ${math('\\mathbf{b}.')}
	`;
	const uplevel = `The point ${math('Y')}
		lies on ${math('CD')} and is such that the points
		${math('O,X ')} and ${math('Y')} are collinear.`;
	const partII = `Express ${math('OY')}
			in terms of ${math('\\mathbf{a}')} and ${math('\\mathbf{b}')}
			and find the ratio ${math('OX:OY.')}
	`;

	// answer
	const lambda = new Fraction(1, m1);
	const muL2 = lambda.negative().plus(1).plus(lambda.times(l1));
	const muL2A = new uVector('a', muL2);
	const x = muL2A.plus(b);
	const [k, nu] = cramersFrac(muL2, l1 - l2, l1, 1, m1 - 1, m1);
	const ratio = `OX:OY = ${k.den} : ${k.num}`;
	const yA = new uVector('a', nu.times(l2 - l1).plus(l1));
	const yB = new uVector('b', nu.times(1 - m1).plus(m1));
	const y = yA.plus(yB);
	// typeset
	const partIAns = `${math(`\\overrightarrow{OX}=${x}.`)}`;
	const partIIAns = `${math(`\\overrightarrow{OY}: ${y}.`)}
		<br>${math(`${ratio}.`)}	
	`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 4 },
			{ body: partII, uplevel, marks: 6 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: partIAns }, { body: partIIAns }],
		partLabelType: 'roman',
	};
	return [question, answer];
}

export const qnLogics = {
	qn5,
	qn6,
	qn8,
	qn9,
};
