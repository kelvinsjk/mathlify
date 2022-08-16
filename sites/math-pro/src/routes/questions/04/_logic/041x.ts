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
} from 'mathlify';
import { math, display } from 'mathlifier';

function qn0(variables?: { a?: number; b?: number }): [AnswerObject, AnswerObject] {
	// generate variables
	const { a, b } = {
		a: getRandomInt(1, 5),
		b: getRandomInt(-5, 5),
		...variables,
	};
	// construct qn
	const anPlusB = new Polynomial([a, b], { unknown: 'n' });

	// typeset qn
	const body = `The sum, ${math('S_n,')} of the first ${math('n')} terms of a sequence
		${math('u_1,')} ${math('u_2,')} ${math('u_3, \\ldots')} is given by
		${display(`S_n = n(${anPlusB}+c,)`)}
		where ${math('c')} is a constant.
	`;
	const partI = `Find ${math('u_n')} in terms of ${math('c')} and ${math('n.')}`;
	const partII = `Prove that the sequence is arithmetic.`;

	// solution working
	const sN = anPlusB.times('n');
	const sNMinus1 = sN.replaceXWith(new Polynomial([1, -1], { unknown: 'n' }));
	const uN = sN.minus(sNMinus1);
	const uNMinus1 = uN.replaceXWith(new Polynomial([1, -1], { unknown: 'n' }));
	const d = uN.minus(uNMinus1);

	// answer
	const ansI = math(`u_n = ${uN}+c.`);
	const ansII = `Since ${math(`u_n - u_{n-1} = ${d}`)} which is a constant, the
		sequence is arithmetic.`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 3 },
			{ body: partII, marks: 2 },
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
	start?: number;
	end?: number;
	n?: number;
	d?: number;
	den?: number;
	percentageCase?: number;
	num?: number;
}): [AnswerObject, AnswerObject] {
	// generate variables
	const { start, end, d, den, percentageCase, n } = {
		start: getRandomInt(200, 300),
		end: getRandomInt(1, 3) * 5,
		d: getRandomInt(5, 9),
		den: getRandomInt(2, 9),
		percentageCase: getRandomInt(0, 2),
		n: getRandomInt(5, 15),
		...variables,
	};
	const num = variables?.num ?? getRandomInt(1, den - 1);
	// construct qn
	const ap = new AP(start, -d);
	const r = new Fraction(num, den);
	const percentages = [90, 95, 99];
	const percentage = percentages[percentageCase];
	const gp = new GP(start, r);

	// typeset qn
	const partI = `A company is digging a tunnel. Using machine ${math('A,')} the
		distance dug on the first day is ${math(`${start}`)} metres. On each subsequent
		day, the distance dug is ${math(`${d}`)} metres less than on the previous day.
		Digging continues daily up to and including the day when a distance of less than
		${math(`${end}`)} metres is dug. What is the distance dug on the ${math(`${n}\\textrm{th}`)}
		day, and what is the total distance dug when drilling is completed?
	`;
	const partII = `Using machine ${math('B,')} the distance dug on the first day is also
		${math(`${start}`)} metres. On each subsequent day, the distance dug is ${math(`${r}`)} of
		the distance dug on the previous day. How many days does it take for the distance dug to
		exceed ${math(`${percentage}\\%`)} of the theoretical maximum distance?`;

	// solution working
	const uN = ap.u(n);
	const uNPoly = ap.uNPoly().minus(end);
	const nEnd = Math.ceil(solveLinear(uNPoly).valueOf());
	const total = ap.S(nEnd);
	// part ii
	const days = solveGpSN(gp, gp.SInfty().times(percentage).divide(100));

	// answer
	const ansI =
		math(`u_{${n}} = ${uN} \\textrm{ metres}.`) +
		`<br>Total distance = ${math(`${total} \\textrm{ metres}.`)}`;
	const ansII = math(`${days}`) + ` days.`;

	const question: AnswerObject = {
		parts: [
			{ body: partI, marks: 6 },
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

function qn2(variables?: {
	startingAmount: number;
	percentage1: number;
	percentage2: number;
	xTimes: number;
}): [AnswerObject, AnswerObject] {
	// generate variables
	const startingAmounts = [100, 200, 500, 1000];
	const percentages1 = [5, 10, 20];
	const xTimesArray = [20, 50, 100];
	const { startingAmount, percentage1, percentage2, xTimes } = {
		startingAmount: startingAmounts[getRandomInt(0, startingAmounts.length - 1)],
		percentage1: percentages1[getRandomInt(0, percentages1.length - 1)],
		percentage2: getRandomInt(1, 10),
		xTimes: xTimesArray[getRandomInt(0, xTimesArray.length - 1)],
		...variables,
	};
	const dates = {
		20: '2 December 2001',
		50: '2 December 2003',
		100: '2 December 2005',
	};
	const date = dates[xTimes];
	// construct qn
	const additional = (startingAmount * percentage1) / 100;
	const ap = new AP(startingAmount, additional);
	const finalAmount = startingAmount * xTimes;
	const percentage = percentage2 / 10;
	const r = Fraction.ONE.plus(new Fraction(percentage2, 1000));
	const gp = new GP(r.times(startingAmount), r);

	// typeset qn
	const body = `On 1 January 2001 Amy put ${math(`\\$${startingAmount}`)} into a bank account,
		and on the first day of each subsequent month she put in ${math(`\\$${additional}`)}
		more than in the previous month. Thus on 1 February she put in ${math(`\\$${ap.u(2)}`)} into
		the account and on 1 March she put in ${math(`\\$${ap.u(3)}`)} into the account, and so on.
		The account pays no interest.
	`;
	const partI = `On what date did the value of Amy's account first become greater than ${math(
		`\\$${finalAmount}?`,
	)}`;
	const uplevel = `On 1 January 2001 Bob put ${math(
		`\\$${startingAmount}`,
	)} into an investment account, and on the
		first day of each subsequent month he put another ${math(
			`\\$${startingAmount}`,
		)} into the account. The
		interest rate was ${math(`${percentage}\\%`)} per month, so that on the last day of each month the
		amount int the account on that day was increased by ${math(`${percentage}\\%.`)}
	`;
	const partII = `Use the formula for the sum of a geometric progression to find an expression for the value
		of Bob's account on the last day of the ${math(
			`n\\textrm{th}`,
		)} month (where January 2001 was the 1st month,
		February 2001 was the 2nd month, and so on). Hence find in which month the value of Bob's account first became
		greater than ${math(`\\$${finalAmount}.`)}`;
	const partIII = `Bob wanted the value of his account to be ${math(
		`\\$${finalAmount}`,
	)} on ${date}.
		What interest rate per month, applied from January 2001, would acheve this?
	`;

	// solution working
	// part i
	const poly = ap.sNPoly().minus(finalAmount);
	const roots = solveQuadratic(poly);
	const n = Math.ceil(roots[1].valueOf()) - 1;
	const years = Math.floor(n / 12);
	const months = n % 12;
	const monthNames = [
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
	const month = monthNames[months];
	const year = 2001 + years;
	// part ii
	const k = gp.a.divide(gp.r.minus(1));
	const n2 = solveGpSN(gp, finalAmount) - 1;
	const years2 = Math.floor(n2 / 12);
	const months2 = n2 % 12;
	const month2 = monthNames[months2];
	const year2 = 2001 + years2;
	// part iii
	const n3s = {
		20: 12,
		50: 36,
		100: 60,
	};
	const n3 = n3s[xTimes];
	const eqn = (x: number) => startingAmount * x * (Math.pow(x, n3) - 1) - finalAmount * x * (x - 1);
	const r3 = bisection(eqn, 1.000001, 2);
	const ansPercentage = (r3 - 1) * 100;
	// answer
	const ansI = `1 ${month} ${year}.`;
	const ansII =
		math(`${k}\\left( ${gp.r.valueOf()}^n - 1 \\right).`) +
		`<br>${math(`n=${n2 + 1}.`)}
		<br>${month2} ${year2}.`;
	const ansIII = math(`${ansPercentage.toPrecision(3)}\\%.`);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 5 },
			{ body: partII, marks: 5, uplevel },
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

function qn3(variables?: { x?: number; y?: number; z?: number }): [AnswerObject, AnswerObject] {
	// generate variables
	const { x } = {
		x: getRandomInt(6, 8),
		...variables,
	};
	let { y, z } = { ...variables };
	let r: Fraction;
	const yzSets: [number, number, Fraction][] = [
		[1, -1, new Fraction(2, 3)],
		[-2, 1, new Fraction(3, 4)],
		[-3, 1, new Fraction(3, 8)],
		[1, -2, new Fraction(2, 9)],
		[2, -2, new Fraction(4, 9)],
		[3, -2, new Fraction(8, 9)],
	];
	if (y === undefined || z === undefined) {
		[y, z, r] = yzSets[getRandomInt(0, yzSets.length - 1)];
	} else {
		r = Fraction.ONE;
		if (y > 0) {
			r = r.times(Math.pow(2, y));
		} else {
			r = r.divide(Math.pow(2, -y));
		}
		if (z > 0) {
			r = r.times(Math.pow(3, z));
		} else {
			r = r.divide(Math.pow(3, -z));
		}
	}

	// construct qn
	const a = Math.pow(2, x);
	const gp = new GP(a, r);
	const sInf = Math.ceil(gp.SInfty().valueOf());
	const sN = Math.floor(gp.SInfty().valueOf() / 10) * 10;

	// typeset qn
	const body = `Charlie is cutting off pieces of rope from a long roll of rope. The first piece he cuts
		off is ${math(`${gp.a}`)} cm long and each successive piece is ${math(`${gp.r}`)} as long as the 
		preceding piece.
	`;
	const partI = `The length of the ${math(`n\\textrm{th}`)} piece of the rope is ${math(`p`)} cm.
		Show that ${display(`
			\\ln p = (An +B) \\ln 2 + (Cn+D) \\ln 3,
		`)} for constants ${math(`A,B,C`)} and ${math('D')} to be determined.`;
	const partII = `Show that the total length of string cut off can never be greater than
		${math(`${sInf}`)} cm.`;
	const partIII = `How many pieces must be cut off before the total length cut off is greater than
		${math(`${sN}`)} cm?`;

	// solution working
	// part i
	const A = y,
		B = -y + x,
		C = z,
		D = -z;
	// part iii
	const n = solveGpSN(gp, sN);

	// answer
	const ansI = `${math(`A=${A},`)} ${math(`B=${B},`)} ${math(`C=${C},`)} ${math(`D=${D}.`)}`;
	const ansIII = math(`${n}`) + ' pieces.';

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 3 },
			{ body: partII, marks: 2 },
			{ body: partIII, marks: 4 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansIII, partNo: 3 }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn4(variables?: {
	base?: number;
	stageNo?: number;
	distance1?: number;
	r?: number;
	distance2?: number;
}): [AnswerObject, AnswerObject] {
	// generate variables
	const { base, stageNo, distance1, distance2 } = {
		base: getRandomInt(2, 5),
		stageNo: getRandomInt(1, 5) * 10,
		distance1: getRandomInt(3, 7),
		distance2: getRandomInt(3, 7) * 2,
		...variables,
	};
	const rRandom = base === 2 ? getRandomInt(2, 4) : base === 3 ? getRandomInt(2, 3) : 2;
	const r = variables?.r ?? rRandom;

	// construct qn
	const a1a2 = base * r - base;
	const a2a3 = base * r * r - base - a1a2;

	// typeset qn
	const body = `In a training exercise, athletes run from a starting point ${math('O')}
		to and from a series of points, ${math(`A_1,`)} ${math(`A_2,`)} ${math(`A_3, \\ldots,`)}
		increasingly far away in a straight line. In the exercise, athletes start at ${math('O')}
		and run stage ${math('1')} from ${math(`O`)} to ${math('A_1')} and back to ${math('O,')}
		then stage ${math('2')} from ${math('O')} to ${math('A_2')} and back to ${math('O,')}
		and so on.
	`;
	const partI = `In Version ${math(
		'1',
	)} of the exercise, the distance between adjacent points are all
		${math(`${base}`)} m.`;
	const partIA = `Find the distance run by an athlete who completes the first ${math(
		`${stageNo}`,
	)} stages
		of Version ${math('1')} of the exercise.`;
	const partIB = `Write down an expression for the distance run by an athlete who completes ${math(
		'n',
	)}
		stages of Version ${math('1.')}
		<br>Hence find the least number of stages that the athlete needs to complete to run at least
		${math(`${distance1}`)} km.`;
	const partII = `In Version ${math(
		'2',
	)} of the exercise, the distance between the points are such that
		${math(`OA_1 = ${base}`)} m, ${math(`A_1A_2 = ${a1a2}`)} m, ${math(`A_2A_3 = ${a2a3}`)} m and 
		${math(`A_{n}A_{n+1}=${r}A_{n-1}A_n.`)}
		<div class="top-margin"> Write down an expression for the distance run by an athlete who completes ${math(
			'n',
		)} stages
		of Version ${math('2.')}
		<br>Hence find the distance from ${math('O,')} and the direction of travel, of the athlete after he
		has run exactly ${math(`${distance2}`)} km, using Version ${math('2.')}</div>`;

	// solution working
	// part i
	const ap = new AP(base * 2, base * 2);
	const sN = ap.S(stageNo);
	const sNPoly = ap.sNPoly();
	const eqn = sNPoly.minus(distance1 * 1000);
	const n1 = Math.ceil(solveQuadratic(eqn)[1].valueOf());
	// part ii
	const gp = new GP(base * 2, r);
	const n2 = solveGpSN(gp, distance2 * 1000, { moreThan: false });
	const distanceLeft = distance2 * 1000 - gp.S(n2).valueOf();
	const uNPlus1 = gp.S(n2 + 1).valueOf();
	const away = distanceLeft < uNPlus1 / 2;
	const distanceAway = away ? distanceLeft : uNPlus1 - distanceLeft;

	// answer
	const ansIA = math(`${sN} \\textrm{ m.}`);
	const ansIB = `${math(`${sNPoly}.`)}<br>Least ${math(`n=${n1}.`)}`;
	const ansII = `${math(`${n2}`)} stages.<br>${math(`${distanceAway}`)} m from ${math(`O,`)}
		and travelling ${away ? 'away from' : 'towards'} ${math(`O.`)}`;

	const question: AnswerObject = {
		body,
		parts: [
			{
				body: partI,
				parts: [
					{ body: partIA, marks: 2 },
					{ body: partIB, marks: 4 },
				],
				partLabelType: 'alpha',
			},
			{ body: partII, marks: 5 },
		],
		partLabelType: 'roman',
	};

	const answer: AnswerObject = {
		parts: [{ parts: [{ body: ansIA }, { body: ansIB }], partLabelType: 'alpha' }, { body: ansII }],
		partLabelType: 'roman',
	};

	return [question, answer];
}

export const qnLogics = {
	qn0,
	qn1,
	qn2,
	qn3,
	qn4,
};
