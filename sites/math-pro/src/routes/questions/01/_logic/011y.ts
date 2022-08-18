import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomInt,
	Polynomial,
	Fraction,
	solveQuadratic,
	sample,
	heads,
	Rational,
	solveRational,
	getRandomFrac,
	factorize,
	solveQuadraticSurd,
} from 'mathlify';
import { math, display } from 'mathlifier';

function qn5(variables?: {
	t1?: number;
	t2?: number;
	d?: number;
	r1?: number;
}): [AnswerObject, AnswerObject] {
	const times = [5, 6, 7, 8, 9, 10]; // over t/4 hours
	// generate variables
	const t1 = variables?.t1 ?? sample(times);
	const t2 = variables?.t2 ?? sample(times.filter((e) => e !== t1));
	const [tA, tB] = t1 < t2 ? [t1, t2] : [t2, t1];
	const maxAdds = {
		5: 1,
		6: 2,
		7: 3,
		8: 3,
		9: 4,
	};
	const max = maxAdds[tA];
	const d = variables?.d ?? getRandomInt(1, max);
	const r1 = variables?.r1 ?? getRandomInt(1, max);

	// construct qn
	const lap = 400;
	const laps = 50;
	const distance = (laps * lap) / 1000;
	const hour1 = Math.floor(tA / 4);
	const hour2 = Math.floor(tB / 4);
	const fraction1 = tA % 4;
	const fraction2 = tB % 4;
	const fractionString1 = fraction1 === 0 ? '' : `${new Fraction(fraction1, 4)}`;
	const fractionString2 = fraction2 === 0 ? '' : `${new Fraction(fraction2, 4)}`;
	const time1 = math(`${hour1}${fractionString1} \\textrm{ hours}`);
	const time2 = math(`${hour2}${fractionString2} \\textrm{ hours}`);

	// typeset qn
	const body = `An athlete trains for an upcoming marathon by running 
		${math(`${distance} \\textrm{ km}`)} consisting of
		${math(`${laps}`)} laps around a circular track of length
		${math(`${lap} \\textrm{ m}.`)} He aims to complete the distance in between
		${time1} and ${time2} inclusive.
	`;
	const partI = `In Version ${math('A')} of the training programme, he runs the first lap in
		${math(`T \\textrm{ seconds}`)} and each subsequent lap takes
		${math(`${d} \\textrm{ seconds}`)} longer than the previous lap. Find the
		set of value of ${math(`T`)} which will enable him to complete the distance
		within the required time interval.`;
	const partII = `In Version ${math('B')} of the training programme, he runs the first lap in
		${math(`t \\textrm{ seconds}`)} and each subsequent lap takes
		${math(`${r1}\\%`)} more than the time for the previous lap. Find the
		set of value of ${math(`t`)} which will enable him to complete the distance
		within the required time interval.`;
	const partIII = `Assuming he completes the ${math(`${distance} \\textrm{ km}`)}
		run in exactly ${time1} using both training programme, find the difference in
		his lap times for his ${math(`${laps}\\textrm{th}`)} laps, giving your answer
		to the nearest second.`;

	// solution working
	// part i
	const k1 = (tA * 3600) / 4;
	const k2 = (tB * 3600) / 4;
	const a11 = ((2 * k1) / laps - (laps - 1) * d) / 2;
	const a12 = ((2 * k2) / laps - (laps - 1) * d) / 2;
	// part ii
	const r = (100 + r1) / 100;
	const a21 = (k1 * (r - 1)) / (Math.pow(r, laps) - 1);
	const a21Rounded = Math.ceil(((k1 * (r - 1)) / (Math.pow(r, laps) - 1)) * 10) / 10;
	const a22 = Math.floor(((k2 * (r - 1)) / (Math.pow(r, laps) - 1)) * 10) / 10;
	// part iii
	const uN1 = a11 + (laps - 1) * d;
	const uN2 = a21 * Math.pow(r, laps - 1);
	const difference = Math.abs(uN1 - uN2);

	// answer
	const ansI = math(
		`\\{ T \\in \\mathbb{R}: \\allowbreak {${a11.toPrecision(3)} \\leq T \\leq ${a12.toPrecision(
			3,
		)} \\}.}`,
		{ wrap: true },
	);
	const ansII = math(
		`\\{ t \\in \\mathbb{R}: \\allowbreak {${a21Rounded.toPrecision(
			3,
		)} \\leq t \\leq ${a22.toPrecision(3)} \\}.}`,
		{ wrap: true },
	);
	const ansIII = math(`${Math.round(difference)} \\textrm{ s}.`);

	const question: AnswerObject = {
		body,
		parts: [
			{
				body: partI,
				marks: 4,
			},
			{ body: partII, marks: 4 },
			{ body: partIII, marks: 3 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [
			{
				body: ansI,
			},
			{ body: ansII },
			{ body: ansIII },
		],
		partLabelType: 'roman',
	};

	return [question, answer];
}

// (x-r1)(x-r2) / (x-r3) < 0
// lhs < rhs
function qn6(variables?: {
	root1?: number;
	root2?: Fraction;
	root3?: number;
	a?: number;
	b?: number;
	lessThan?: boolean;
}): [AnswerObject, AnswerObject] {
	// generate variables
	const { root1, a, b, lessThan } = {
		root1: getRandomInt(-3, 3),
		a: getRandomInt(1, 5),
		b: getRandomInt(-5, 5),
		lessThan: heads(),
		...variables,
	};
	const root3 = variables?.root3 ?? getRandomInt(-5, 5, { avoid: [root1] });
	const root2 = variables?.root2 ?? getRandomFrac({ avoid: [root1, root3] });

	// construct qn
	const rhs = new Polynomial([a, b]);
	const rationalNum = new Polynomial([1, -root1]).times(new Polynomial([root2.den, -root2.num]));
	const rationalDen = new Polynomial([1, -root3]);
	const rational = new Rational(rationalNum, rationalDen);
	const lhs = rational.plus(rhs);
	const sign = lessThan ? '<' : '>';
	const rhsString = b === 0 ? `${rhs}` : `(${rhs})`;

	// typeset qn
	const partI = `Express ${math(`\\displaystyle ${lhs} - ${rhsString}`)}
		as a single simplified fraction.
	`;
	const partII = `Hence without using a calculator,
		solve the inequality
		${display(`${lhs} ${sign} ${rhs}`)}
	`;

	// solution working
	const soln = solveRational(lhs, rhs, { lessThan });

	// answer
	const ansI = math(`${lhs.minus(rhs)}.`);
	const ansII = `${math(`${soln.combinedAnswer}`)}`;

	const question: AnswerObject = {
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 3 },
		],
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
	};

	return [question, answer];
}

function qn8(variables?: {
	a?: number;
	b?: number;
	c?: number;
	d?: number;
	lessThan?: boolean;
}): [AnswerObject, AnswerObject] {
	// set up variables
	const { a, b, c, d, lessThan } = {
		...generate(),
		...variables,
	};
	// set up question
	const quadratic = new Polynomial([a, b, c]);
	const linear = new Polynomial([-c, d], { ascending: true });
	const sign = lessThan ? '<' : '>';

	// typeset
	const partI = `Find the exact roots of the equation
		${display(`|${quadratic}| = ${linear}`)}
	`;
	const partII = `On the same axes, sketch the curves with equations
		${math(`y=|${quadratic}|`)}
		and ${math(`y=${linear}.`)}
		<div class="top-margin">
			Hence solve the inequality
			${display(`|${quadratic}| ${sign} ${linear}.`)}
		</div>
		`;

	// answer working
	const [x1, x4] = solveQuadraticSurd(quadratic.minus(linear));
	const [x2, x3] = solveQuadraticSurd(quadratic.plus(linear));
	const inequality1 = lessThan ? `${math(`${x1} < x < ${x2} `)}` : `${math(`x < ${x1},`)}`;
	const inequality2 = lessThan ? `${math(`${x3} < x < ${x4}.`)}` : `${math(`${x2} < x < ${x3}`)}`;
	const inequality3 = `${math(`x > ${x4}.`)}`;

	// typeset answer
	const ansI = `${math(`{x=${x1}, ${x4}, ${x2}}`, {
		wrap: true,
	})}
		or ${math(`${x3}.`)}`;
	const ansII = lessThan
		? `${inequality1} or ${inequality2}`
		: `<div style="overflow-x: auto;">${inequality1}${inequality2} or ${inequality3}</div>`;

	const question: AnswerObject = {
		parts: [
			{ body: partI, marks: 4 },
			{ body: partII, marks: 4 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
	};

	return [question, answer];
}

// | base^x - c | < k
function qn9(variables?: {
	base?: number;
	c?: number;
	k?: number;
	lessThan?: boolean;
	equality?: boolean;
}): [AnswerObject, AnswerObject] {
	// set up Variables
	const { base, lessThan, equality } = {
		base: getRandomInt(2, 4), // 4 represent 'e'
		lessThan: heads(),
		equality: heads(),
		...variables,
	};
	let cDefault: number, kDefault: number;
	if (base === 2) {
		kDefault = getRandomInt(1, 5);
		const cs = [3, 6, 5, 12, 10];
		cDefault = cs[kDefault - 1];
		if (kDefault === 5) {
			kDefault = 6;
		}
	} else if (base === 3) {
		kDefault = 3;
		cDefault = 6;
	} else {
		kDefault = getRandomInt(1, 9);
		cDefault = getRandomInt(kDefault + 1, 10);
	}
	const { c, k } = {
		c: cDefault,
		k: kDefault,
		...variables,
	};

	// set up qn
	const baseString = base === 2 ? '2' : base === 3 ? '3' : '\\mathrm{e}';
	const y = `\\left| ${baseString}^x - ${c} \\right|`;
	const sign = equality ? (lessThan ? '\\leq ' : '\\geq ') : lessThan ? '<' : '>';

	// typeset
	const partI = `Sketch the graph of
		${math(`y=${y},`)} giving the exact values of any points
		where the curve meets the axes.
	`;
	const partII = `Without using a calculator, and showing all your
		working, find the exact interval, or intervals, for which
		${math(`${y} ${sign} ${k}.`)}
		Give your answer in its simplest form.
	`;

	// answer working
	const yIntercept = `${math(`\\left( 0, ${Math.abs(1 - c)} \\right).`)}`;
	const xIntercept =
		base === 4
			? `${math(`\\left( \\ln ${c} , 0 \\right)`)}`
			: `${math(`\\left( \\frac{\\ln ${c}}{\\ln ${base}}, 0 \\right)`)}`;
	// part ii
	let x1: string | number, x2: string | number;
	if (base === 2) {
		const x1s = [1, 2, 1, 3, 2];
		const x2s = [2, 3, 3, 4, 4];
		const index = k === 6 ? 4 : k - 1;
		[x1, x2] = [x1s[index], x2s[index]];
	} else if (base === 3) {
		x1 = 1;
		x2 = 2;
	} else {
		x1 = lnTypeset(c - k);
		x2 = lnTypeset(c + k);
	}
	const sign2 = equality ? '\\leq ' : '<'; // sign2 only valid for more than

	// typeset answer
	const ansI = `${xIntercept}, ${yIntercept}`;
	const ansII = lessThan
		? `${math(`${x1} ${sign} x ${sign} ${x2}.`)}`
		: `${math(`x ${sign2} ${x1}`)} or ${math(`x ${sign} ${x2}.`)}`;

	const question: AnswerObject = {
		parts: [
			{ body: partI, marks: 3 },
			{ body: partII, marks: 3 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }],
	};

	return [question, answer];
}

export const qnLogics = {
	qn5,
	qn6,
	qn8,
	qn9,
};

export function generate(): {
	a: number;
	b: number;
	c: number;
	d: number;
	lessThan: boolean;
} {
	let a = getRandomInt(1, 2, { avoid: [0] });
	let b = getRandomInt(1, 9, { avoid: [0] });
	let c = getRandomInt(-9, a === 1 ? -1 : -2, { avoid: [0] });
	({
		factors: [a, b, c],
	} = factorize(a, b, c));
	const [x1Frac] = solveQuadratic(new Polynomial([a, b, c]));
	const x1 = x1Frac.valueOf();
	const xMin = -b / 2 / a;
	const left = Math.ceil(x1 + 0.01);
	const right = Math.floor(xMin - 0.01);
	let x2 = getRandomInt(left, right, { avoid: [0] });
	let y2 = a * x2 * x2 + b * x2 + c;
	if (c === y2) {
		if (right - left > 0) {
			x2 = getRandomInt(left, right, { avoid: [0, x2] });
		}
		y2 = a * x2 * x2 + b * x2 + c;
	}
	if (c === y2) {
		return generate();
	}
	let d = (c - y2) / x2;
	if (heads()) {
		b = -b;
		d = -d;
	}
	return { a, b, c, d, lessThan: heads() };
}

function lnTypeset(x: number): string {
	if (x === 1) {
		return `0`;
	} else if (x === 4) {
		return `2 \\ln 2`;
	} else if (x === 8) {
		return `3 \\ln 2`;
	} else if (x === 9) {
		return `2 \\ln 3`;
	} else {
		return `\\ln ${x}`;
	}
}
