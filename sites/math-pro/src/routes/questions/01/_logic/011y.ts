import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomInt,
	Polynomial,
	Fraction,
	AP,
	GP,
	solveQuadratic,
	solveGpSN,
	bisection,
	solveLinear,
	sample,
	heads,
	cramers,
	Rational,
	solveRational,
	getRandomFrac,
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
		run in exactly ${time1} using both traininig programme, find the difference in
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

	// typeset qn
	const partI = `Express ${math(`\\displaystyle ${lhs} - (${rhs})`)}
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

function qn7(variables?: {
	a?: number;
	k?: number;
	n?: number;
	multiple?: number;
}): [AnswerObject, AnswerObject] {
	// generate variables
	const { a, n } = {
		a: getRandomInt(1, 9),
		n: getRandomInt(4, 10) * 2 - 1,
		...variables,
	};
	const k = variables?.k ?? getRandomInt(n + 1, 99); // S_n = ka
	const rN = new Polynomial([1], { degree: n, unknown: 'r' });
	const poly = rN.plus(new Polynomial([-k, k - 1], { unknown: 'r' }));
	if (poly.subInNumber(1.01) > 0) {
		return qn7();
	}
	const r = bisection((x: number) => poly.subInNumber(x), 1.01, 100);
	if (r < 1.05) {
		return qn7();
	}
	const d = new Fraction(2 * k * a, n).minus(2 * a).divide(n - 1);
	const multiples = [50, 100, 200];
	let multiple = variables?.multiple ?? sample(multiples);
	while (a * Math.pow(r, 100) <= multiple * (a + (100 - 1) * d.valueOf())) {
		multiple = multiple % 2 === 0 ? multiple / 2 : multiple - 1;
	}
	// construct qn

	// typeset qn
	const body = `An arithmetic progression has first term ${math(`${a}.`)}
		The sum of the first ${math(`${n}`)} terms of the progression is
		${math(`${k * a}.`)}
	`;
	const partI = `Find the common difference.`;
	const uplevel = `A geometric progression has first term ${math(`${a}`)}
		and common ratio ${math(`r.`)} The sum of the first
		${math(`${n}`)} terms of the progression is ${math(`${k * a}.`)}`;
	const partII = `Show that ${math(`${poly}=0.`)}
		<div class="top-margin">
			Show that the common ratio cannot be ${math(`1`)}
			even though ${math(`r=1`)} is a root of this equation. Find the possible values of the common ratio.
		</div>`;
	const partIII = `It is given that the common ratio of the geometric progression is positive, and that the
		${math(`n\\textrm{th}`)} term of this geometric progression is more than
		${math(`${multiple}`)} times the ${math(`n\\textrm{th}`)} term of the arithmetic progression.
		<div class="top-margin">
			Write down an inequality, and hence find the smallest possible value of ${math('n.')}
		</div>`;

	// solution working
	const linear = new Polynomial([n - 1, new Fraction(k * a * 2, n).negative().plus(2 * a)]);
	const dSolve = solveLinear(linear);
	const r2 = bisection((x: number) => poly.subInNumber(x), -100, 0);
	const nSolve = Math.ceil(
		bisection(
			(x: number) => a * Math.pow(r, x - 1) - multiple * (a + (x - 1) * d.valueOf()),
			1.9,
			100,
		),
	);

	// answer
	const ansI = math(`d = ${dSolve}.`);
	const ansII = `If ${math(`r=1,`)} the geometric progression will be a constant sequence
		${math(`${a},${a},\\ldots`)} with the sum of ${math(`${n}`)} terms 
		${math(`${n} \\times ${a} = ${n * a} \\neq ${k * a}.`)} Hence the common ratio cannot be ${math(
		`1`,
	)} even
		though ${math(`r=1`)} is a root of the equation.
		<div class="top-margin">
			${math(`r=${r2.toPrecision(3)}`)} or ${math(`r=${r.toPrecision(3)}.`)}
		</div>
		`;
	const ansIII = `${math(
		`${a}(${r.toPrecision(3)})^{n-1} > ${multiple}\\Big( ${a} + ${d}(n-1) \\Big).`,
	)}
			<br>Smallest possible ${math(`n=${nSolve}.`)}
	`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 2 },
			{ body: partII, marks: 4, uplevel },
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
	monthly?: number;
	a1?: number;
	a2?: number;
	multiple1?: number;
	multiple2?: number;
	n?: number;
}): [AnswerObject, AnswerObject] {
	const monthlys = [50, 100, 200, 500];
	// generate variables
	const { monthly, a1, a2, multiple1, multiple2, n } = {
		monthly: sample(monthlys),
		a1: getRandomInt(1, 9),
		a2: getRandomInt(2, 4) * 5,
		multiple1: getRandomInt(2, 5) * 10,
		multiple2: getRandomInt(26, 30),
		n: getRandomInt(4, 6) * 12,
		...variables,
	};

	// construct qn

	// typeset qn
	const body = `Caleb invests his money with Company C, which allows him to invest ${math(
		`\\$${monthly}`,
	)}
		into a savings account on the first day of every month. At the end of each month, the total in the
		account is increased by ${math(`a\\%.`)}	
	`;
	const partI = `It is given that ${math(`a=0.${a1}.`)}`;
	const partIA = `Caleb invests ${math(`\\$${monthly}`)} on 1 January 2021. Write down how much this
		${math(`\\$${monthly}`)} is worth at the end of 31 December 2021.`;
	const partIB = `Caleb invests ${math(
		`\\$${monthly}`,
	)} on the first day of each of the 12 months of 
		2021. Find the total amount in the account at the end of 31 December 2021.`;
	const partIC = `Caleb continues to invest ${math(
		`\\$${monthly}`,
	)} on the first day of each month. Find
		the month in which the total in the acount will first exceed ${math(
			`\\$${monthly * multiple1}.`,
		)} Explain
		whether this occurs on the first or last day of the month.`;
	const uplevel = `Deliah invests her money with Company D, which allows her to invest ${math(
		`\\$${monthly}`,
	)}
		on the first day of each month. Each ${math(
			`\\$${monthly}`,
		)} invested earns a fixed bonus of ${math(`\\$b`)}
		at the end of every month for which it has been in the account. The accumulated bonuses do not earn any further bonus.`;
	const partIIA = `Find, in terms of ${math(`b,`)} how much ${math(
		`\\$${monthly}`,
	)} invested on 1 January 2021 will be worth
		at the end of 31 December 2021.`;
	const partIIB = `Deliah invests ${math(
		`\\$${monthly}`,
	)} on the first day of each of the 24 months in 2021 and 2022. Find the value of ${math(`b`)} such
		that the total value of all the investments including bonuses, is worth
		${math(`\\$${monthly * multiple2}`)} at the end of 31 December 2022.`;
	const uplevel2 = `It is given instead that
	<strong>${math(`a=${a2 / 10}`)}</strong> for Company C.`;
	const partIII = `Find the value of ${math(`b`)} for Company D such that investing with both
		Company C and Company D will result in the same 
		total value at the end of the ${math(`${n}\\textrm{th}`)} month.`;

	// solution working
	// part i
	const r = new Fraction(1000 + a1, 1000);
	const gp = new GP(r.times(monthly), r);
	const nSolve = solveGpSN(gp, monthly * multiple1);
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	const month = months[(nSolve - 1) % 12];
	const year = 2021 + Math.floor((nSolve - 1) / 12);
	const start = gp.S(nSolve).divide(r).valueOf() > monthly * multiple1 ? 'First' : 'Last';
	// part ii
	const ap = new AP(1, 1);
	const sum = ap.S(24);
	const linear = new Polynomial([sum, 24 * monthly - multiple2 * monthly]);
	const bSolve = solveLinear(linear);
	// part iii
	const r2 = new Fraction(1000 + a2, 1000);
	const gp2 = new GP(r2.times(monthly), r2);
	const linear2 = new Polynomial([
		ap.S(n),
		gp2
			.S(n)
			.minus(monthly * n)
			.negative(),
	]);
	const bSolve2 = solveLinear(linear2);

	// answer
	const ansIA = math(`\\$${gp.u(12).toFixed(2)}.`);
	const ansIB = math(`\\$${gp.S(12).toFixed(2)}.`);
	const ansIC = math(`n=${nSolve}.`) + `<br>${start} day of ${month} ${year}.`;
	const ansIIA = math(`\\$(${monthly}+12b)`);
	const ansIIB = math(`b=${bSolve}.`);
	const ansIII = math(`b=${bSolve2.toFixed(2)}.`);

	const question: AnswerObject = {
		body,
		parts: [
			{
				body: partI,
				parts: [
					{ body: partIA, marks: 1 },
					{ body: partIB, marks: 3 },
					{ body: partIC, marks: 5 },
				],
				partLabelType: 'alpha',
			},
			{
				parts: [
					{ body: partIIA, marks: 1, uplevel },
					{ body: partIIB, marks: 3 },
				],
				partLabelType: 'alpha',
			},
			{ body: partIII, marks: 3, uplevel: uplevel2 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [
			{
				parts: [
					{ body: ansIA, marks: 1 },
					{ body: ansIB, marks: 3 },
					{ body: ansIC, marks: 5 },
				],
			},
			{
				parts: [
					{ body: ansIIA, marks: 1 },
					{ body: ansIIB, marks: 3 },
				],
			},
			{ body: ansIII, marks: 3 },
		],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn9(variables?: {
	base?: number;
	exponent?: number;
	terms?: number;
	n2?: number;
	sum?: number;
}): [AnswerObject, AnswerObject] {
	// generate variables
	const bases = [2, 3, getRandomInt(5, 9)];
	const { base, terms, n2 } = {
		base: sample(bases),
		terms: getRandomInt(2, 4),
		n2: getRandomInt(7, 15),
		...variables,
	};
	const defaultExponent = base === 2 ? getRandomInt(3, 6) : base === 3 ? getRandomInt(2, 4) : 2;
	const exponent = variables?.exponent ?? defaultExponent;
	const rand = getRandomInt(1, 9);
	const defaultSum = terms === 4 ? rand * 2 : terms === 3 ? rand * 3 : rand;
	const sum = variables?.sum ?? defaultSum;

	// construct qn
	const n = Math.pow(base, exponent);
	const negative = terms === 4 ? 'negative' : 'non-zero';
	const termNos = ['two', 'three', 'four'];
	const termNo = termNos[terms - 2];

	// typeset qn
	const partA = `An arithmetic series has first term ${math(`a`)}
		and common difference ${math(`2a,`)} where
		${math(`a \\neq 0.`)} A geometric series has first term ${math(`a`)}
		and common ratio ${math(`${base}.`)} The ${math(`k\\textrm{th}`)}
		term of the geometric series is equal to the sum of the first ${math(`${n}`)} terms
		of the arithmetic series. Find the value of ${math(`k.`)}`;
	const partB = `The first term of an arithmetic series is ${negative}. The sum of the first
		${termNo} terms of the series is ${math(`${sum}`)} and the product of the first
		${termNo} terms of the series is ${math(`0.`)} Find the ${math(`${n2}\\textrm{th}`)}
		term of the series.`;

	// solution working
	// part i
	const k = exponent * 2 + 1;
	// part ii
	let uN: number;
	if (terms === 4) {
		const [a, d] = cramers(4, 6, sum, 1, 1, 0);
		uN = a + (n2 - 1) * d;
	} else if (terms === 3) {
		const [a, d] = cramers(3, 3, sum, 1, 2, 0);
		uN = a + (n2 - 1) * d;
	} else {
		const [a, d] = cramers(2, 1, sum, 1, 1, 0);
		uN = a + (n2 - 1) * d;
	}

	// answer
	const ansA = math(`k=${k}.`);
	const ansB = math(`u_{${n2}} = ${uN}.`);

	const question: AnswerObject = {
		parts: [
			{ body: partA, marks: 3 },
			{ body: partB, marks: 4 },
		],
	};
	const answer: AnswerObject = {
		parts: [
			{ body: ansA, marks: 3 },
			{ body: ansB, marks: 4 },
		],
	};

	return [question, answer];
}

export const qnLogics = {
	qn5,
	qn6,
	qn7,
	qn8,
	qn9,
};
