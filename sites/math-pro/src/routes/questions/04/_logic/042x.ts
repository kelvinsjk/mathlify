import type { AnswerObject } from '$lib/interfaces';
import {
	getRandomInt,
	Fraction,
	AP,
	GP,
	getRandomFrac,
	NthRoot,
	heads,
	solveGpSNNumber,
} from 'mathlify';
import { math, display } from 'mathlifier';

function qn0(variables?: {
	a?: number;
	d?: Fraction;
	nAP1?: number;
	nAP2?: number;
	nAPStart?: number;
	nAPEnd?: number;
	rDen?: number; // r = (x-1)/x
	percentage?: number; // 75%-99%
}): [AnswerObject, AnswerObject] {
	// generate variables
	const { a, d, nAPStart, rDen, percentage } = {
		a: getRandomInt(1, 9),
		d: getRandomFrac({ avoid: [0], denRange: [1, 5] }),
		nAPStart: getRandomInt(2, 8) * 10 + 1,
		rDen: getRandomInt(3, 9),
		percentage: getRandomInt(75, 99),
		...variables,
	};
	const multipleMax = Math.floor(6 / d.den);
	const multiple = getRandomInt(1, multipleMax);
	const nAP1 = variables?.nAP1 ?? multiple * d.den + 1;
	const { nAP2, nAPEnd } = {
		nAP2: getRandomInt(10, 50, { avoid: [nAP1] }),
		nAPEnd: getRandomInt(Math.floor(nAPStart / 10) + 1, 10) * 10,
		...variables,
	};

	// construct qn
	const ap = new AP(a, d);
	const suffix = nAP1 === 1 ? 'st' : nAP1 === 2 ? 'nd' : nAP1 === 3 ? 'rd' : 'th';
	const n2End = nAP2 % 10;
	const suffix2 = n2End === 1 ? 'st' : n2End === 2 ? 'nd' : n2End === 3 ? 'rd' : 'th';
	const r = new Fraction(rDen - 1, rDen);
	const gp = new GP(a, r);
	const uNGP = gp.u(nAP1);
	const uNString = `${uNGP.valueOf()}`.length < 7 ? `${uNGP.valueOf()}` : `${uNGP}`;
	const sum = gp.SInfty().times(percentage).divide(100);
	const sNString = `${sum.valueOf()}`.length < 5 ? `${sum.valueOf()}` : `${sum}`;
	const rString = `${r.valueOf()}`.length < 4 ? `${r.valueOf()}^n` : `\\left(${r}\\right)^n`;
	const complement = 100 - percentage;

	// typeset qn
	const partA = `The 1st term of an arithmetic series is ${math(`${a}`)}
		and the ${nAP1}${suffix} term is ${math(`${ap.u(nAP1)}.`)}`;
	const partAI = `Find the ${nAP2}${suffix2} term of the series.`;
	const partAII = `Find the sum of the ${nAPStart}st term to the ${nAPEnd}th term inclusive
		of the series.`;
	const partB = `The 1st term of a geometric series is ${math(`${a}`)} and the
		${nAP1}${suffix} term is ${math(uNString)} where the common ratio is positive.`;
	const partBI = `Find the sum to infinity of the series.`;
	const partBII = `Given that the sum of the first ${math('n')} terms is
		greater than ${math(sNString)}, show that
		${display(`${rString} < ${complement / 100}.`)}
		Hence find the smallest possible value of ${math('n.')}`;

	// solution working
	const dAns = ap
		.u(nAP1)
		.minus(a)
		.divide(nAP1 - 1);
	const apAns = new AP(a, dAns);
	const uNAns = apAns.u(nAP2);
	const aIIAns = apAns.S(nAPEnd).minus(apAns.S(nAPStart - 1));
	const rNMinus1 = uNGP.divide(a);
	const rAns = new NthRoot(nAP1 - 1, rNMinus1).coeff;
	const gpAns = new GP(a, rAns);
	const nAns = Math.ceil(Math.log(complement / 100) / Math.log(rAns.valueOf()));

	const dens = {
		1: false,
		2: true,
		3: false,
		4: true,
		5: true,
		6: false,
		7: false,
		8: true,
		9: false,
		10: true,
	};

	// answer
	const ansAI = math(`u_{${nAP2}} = ${uNAns}${dens[uNAns.den] ? `=${uNAns.valueOf()}` : ``}.`);
	const ansAII = math(`${aIIAns}${dens[aIIAns.den] ? `=${aIIAns.valueOf()}` : ``}.`);
	const ansBI = math(`S_\\infty = ${gpAns.SInfty()}.`);
	const ansBII = math(`\\textrm{Smallest } n=${nAns}.`);

	const question: AnswerObject = {
		parts: [
			{
				body: partA,
				parts: [
					{ body: partAI, marks: 2 },
					{ body: partAII, marks: 3 },
				],
			},
			{
				body: partB,
				parts: [
					{ body: partBI, marks: 2 },
					{ body: partBII, marks: 5 },
				],
			},
		],
	};
	const answer: AnswerObject = {
		parts: [
			{ parts: [{ body: ansAI }, { body: ansAII }] },
			{ parts: [{ body: ansBI }, { body: ansBII }] },
		],
	};

	return [question, answer];
}

function qn1(variables?: {
	start?: number;
	end?: number;
	isSwim?: boolean;
	minutes?: number;
}): [AnswerObject, AnswerObject] {
	// generate variables
	const { start, end, isSwim, minutes } = {
		start: getRandomInt(4, 6) * 5,
		end: getRandomInt(7, 9) * 5,
		isSwim: heads(),
		minutes: getRandomInt(7, 11),
		...variables,
	};
	// construct qn
	const n = 10;
	const d = new Fraction(start - end, n - 1);
	const ap = new AP(end, d);
	const r = Math.pow(end / start, 1 / (n - 1));
	const club = isSwim ? 'swimming school' : 'gym';
	const pool = isSwim ? 'swimming pool' : 'straight running track';
	const swim = isSwim ? 'swim' : 'run';
	const length = isSwim ? 35 : 100;

	// typeset qn
	const body = `A ${club} has three training courses: Apex course, Cheetah course
		and Guerilla course. In each of the programme, members ${swim} 10 lengths of a ${pool}.
		Length 1 is done away from the starting point, length 2 towards the starting point, length 3 away
		from the starting point, and so on.
		<div style="margin-top:1em">
			For the Apex course, the time taken to ${swim} the first length is ${math(`${end}`)}
			seconds and the time taken to ${swim} the last length is ${math(`${start}`)} seconds. The
			times taken for each of the ${math(`${n}`)} lengths are in arithmetic progression.
		</div>`;
	const partA = `Find the total time taken to ${swim} ${math(`${n}`)} lengths in the Apex course.`;
	const uplevel = `In the Cheetah course, the time taken to ${swim} each of the ${math(
		`${n}`,
	)} lengths
		is constant at ${math(`${start}`)} seconds.
		<div class="top-margin">
			In the Guerilla course, the time taken to ${swim} the first length is ${math(`${start}`)} seconds
			and the time taken to ${swim} the last length is ${math(`${end}`)} seconds. The times taken
			for each of the ${math(`${n}`)} lengths are in geometric progression.
		</div>
		<div class="top-margin">
			Ellie ${swim}s ${math(`${n * 3}`)} lengths. She first ${swim}s ${math(
		`${n}`,
	)} lengths at the Apex course,
			followed by ${math(`${n}`)} lengths at the Cheetah course and finally ${math(
		`${n}`,
	)} lengths at the Guerilla course.
		</div>
		<div class="top-margin">
			Each length of the ${pool} is ${math(`${length} \\textrm{ m}.`)}
		</div>`;
	const partB = `Find Ellie's average speed for her ${swim} of ${math(`${n * 3}`)} lengths.`;
	const partC = `Determine whether, exactly ${math(
		`${minutes}`,
	)} minutes after she starts to ${swim},
		Ellie is ${swim}${isSwim ? 'ming' : 'ning'} away from or towards her starting point.`;

	// solution working
	const apTime = ap.S(n);
	const cTime = n * start;
	const gpTime = GP.S(start, r, n);
	const speed = (n * 3 * length) / (apTime.valueOf() + gpTime + cTime);
	// part iii
	// qn designed guaranteed to finish Apex: start checking from
	let away: string;
	if (minutes * 60 < apTime.valueOf() + cTime) {
		// doing Cheetah course
		const timeLeft = minutes * 60 - apTime.valueOf();
		const currentLap = Math.ceil(timeLeft / start);
		away = currentLap % 2 === 1 ? 'away from' : 'towards';
	} else {
		// doing Guerilla course
		const timeLeft = minutes * 60 - apTime.valueOf() + cTime;
		const currentLap = solveGpSNNumber(start, r, timeLeft);
		away = currentLap % 2 === 1 ? 'away from' : 'towards';
	}

	// answer
	const ansI = math(`${apTime} \\textrm{ s}`);
	const ansII = math(`${speed.toPrecision(3)} \\textrm{ m/s}`);
	const ansIII = `Ellie is ${swim}${isSwim ? 'ming' : 'ning'} ${away} her starting point.`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partA, marks: 2 },
			{ body: partB, marks: 5, uplevel },
			{ body: partC, marks: 2 },
		],
	};
	const answer: AnswerObject = {
		parts: [{ body: ansI }, { body: ansII }, { body: ansIII }],
	};

	return [question, answer];
}

export const qnLogics = {
	qn0,
	qn1,
};
