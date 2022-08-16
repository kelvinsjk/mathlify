import type { AnswerObject } from '$lib/interfaces';
import { getRandomInt, Polynomial, Fraction, AP, GP, solveQuadratic, gcd } from 'mathlify';
import {
	math,
	//display
} from 'mathlifier';

function qn7(variables?: { m?: number; n?: number; k?: number }): [AnswerObject, AnswerObject] {
	// generate variables
	const { m } = {
		m: getRandomInt(3, 9),
		...variables,
	};
	let { n, k } = { ...variables };
	n = n || getRandomInt(m + 1, 2 * m - 2);
	const dFrac = new Fraction(n - 2 * m + 1, Math.pow(m - 1, 2));
	const d = dFrac.valueOf();
	const kMax = Math.floor((Math.floor(-1 / d) / 2) * (1 - d));
	k = k || getRandomInt(2, kMax);
	// construct qn
	const a = m - 1,
		b = -n + 1,
		c = n - m;
	const divisor = gcd(a, b, c);
	const poly = new Polynomial([a / divisor, b / divisor, c / divisor], { unknown: 'r' });
	const eqn = `${poly}=0.`;
	const position = {
		3: 'third',
		4: 'fourth',
		5: 'fifth',
		6: 'sixth',
		7: 'seventh',
		8: 'eighth',
		9: 'ninth',
		10: 'tenth',
		11: 'eleventh',
		12: 'twelfth',
		13: 'thirteenth',
		14: 'fourteenth',
		15: 'fiveteenth',
		16: 'sixteenth',
	};

	// typeset qn
	const body = `A geometric series has common ratio ${math(`r,`)}
		and an arithmetic series has first term ${math(`a`)} and common difference ${math(`d,`)}
		where ${math(`a`)} and ${math(`d`)} are non-zero. The first three terms of the geometric series
		are equal to the first, ${position[m]} and ${
		position[n]
	} terms respectively of the arithmetic series.`;
	const partI = `Show that ${math(eqn)}`;
	const partII = `Deduce that the geometric series is convergent and find, in terms of ${math(
		'a,',
	)} the sum to infinity.`;
	const partIII = `The sum of the first ${math(
		'n',
	)} terms of the arithmetic series is denoted by ${math('S.')} Given that 
		${math('a>0,')} find the set of possible values of ${math(`n`)} for which ${math(
		'S',
	)} exceeds ${math(`${k}a.`)}`;

	// solution working
	const [rAns] = solveQuadratic(poly) as [Fraction, Fraction];
	const sInf = rAns.negative().plus(1).reciprocal();
	const dAns = rAns.minus(1).divide(m - 1);
	// part iii
	// n/2 (2a + (n-1)d) > ka
	// n (2 + nd - d ) > 2k
	// 2n + dn^2 - dn > 2k
	// dn^2 + (2-d)n - 2k > 0
	const nPoly = new Polynomial([dAns, dAns.negative().plus(2), -2 * k]);
	const [n1, n2] = solveQuadratic(nPoly);
	const lower = Math.ceil(n1.valueOf());
	const upper = Math.floor(n2.valueOf());

	// answer
	const ansII = `Since ${math(`-1 < r = ${rAns} < 1,`)} the geometric series is convergent.
		<br>${math(`S_{\\infty} = ${sInf}a.`)}`;
	const ansIII = math(`\\{ n \\in \\mathbb{Z}: ${lower} \\leq n \\leq ${upper} \\}.`);

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 4 },
			{ body: partII, marks: 5 },
			{ body: partIII, marks: 5 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [
			{ body: ansII, partNo: 2 },
			{ body: ansIII, partNo: 3 },
		],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn8(variables?: {
	startingAmount: number;
	percentage1: number;
	percentage2: number;
	xTimes: number;
	years: number;
}): [AnswerObject, AnswerObject] {
	// generate variables
	const startingAmounts = [10, 20, 50, 100];
	const xTimesArray = [50, 100, 200, 500];
	const { startingAmount, percentage1, percentage2, xTimes, years } = {
		startingAmount: startingAmounts[getRandomInt(0, startingAmounts.length - 1)],
		percentage1: getRandomInt(1, 5) * 10,
		xTimes: xTimesArray[getRandomInt(0, xTimesArray.length - 1)],
		percentage2: getRandomInt(1, 5),
		years: getRandomInt(1, 5),
		...variables,
	};
	// construct qn
	const additional = (startingAmount * percentage1) / 100;
	const ap = new AP(startingAmount, additional);
	const finalAmount = startingAmount * xTimes;
	const r = Fraction.ONE.plus(new Fraction(percentage2, 100));
	const gp = new GP(r.times(startingAmount), r);

	// typeset qn
	const partI = `Alex saves ${math(`\\$${startingAmount}`)} on 1 January 2021.
		On the first day of each subsequent month, she saves ${math(`\\$${additional}`)}
		more than in the previous month, so that she saves ${math(`\\$${ap.u(2)}`)} on
		1 February 2021, ${math(`\\$${ap.u(3)}`)} on 1 March 2021, and so on.
		<br>On what date will she first have saved over ${math(`\\$${finalAmount}`)} in total?`;
	const partII = `Brie puts ${math(`\\$${startingAmount}`)} on 1 January 2021 into an investment
		account which pays compound interest at a rate of ${math(`${percentage2}\\%`)} per month
		on the last day of each month. She puts a further ${math(`\\$${startingAmount}`)} into the account
		on the first day of each subsequent month.`;
	const partIIA = `How much compound interest has her original ${math(`\\$${startingAmount}`)}
		earned at the end of ${math(`${years}`)} years?`;
	const partIIB = `How much in total is in the account at the end of ${math(`${years}`)} years?`;
	const partIIC = `After how many complete months will the total in the account first exceed
		${math(`\\$${finalAmount}?`)}`;

	// solution working
	// part i
	const poly = ap.sNPoly().minus(finalAmount);
	const roots = solveQuadratic(poly);
	const n = Math.ceil(roots[1].valueOf()) - 1;
	const year = Math.floor(n / 12);
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
	const yearAns = 2021 + year;
	// part ii a
	const interest = gp.u(years * 12).minus(startingAmount);
	// part ii b
	const total = gp.S(years * 12);
	// part ii c
	const num = r.minus(1).times(xTimes).divide(r).plus(1);
	const n2 = Math.ceil(Math.log(num.valueOf()) / Math.log(r.valueOf()));

	// answer
	const ansI = `1 ${month} ${yearAns}.`;
	const ansIIA = math(`\\$${interest.toFixed(2)}.`);
	const ansIIB = math(`\\$${total.toFixed(2)}.`);
	const ansIIC = math(`${n2}`) + ` complete months.`;

	const question: AnswerObject = {
		parts: [
			{ body: partI, marks: 5 },
			{
				body: partII,
				parts: [
					{ body: partIIA, marks: 2 },
					{ body: partIIB, marks: 3 },
					{ body: partIIC, marks: 4 },
				],
				partLabelType: 'alpha',
			},
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [
			{ body: ansI },
			{ parts: [{ body: ansIIA }, { body: ansIIB }, { body: ansIIC }], partLabelType: 'alpha' },
		],
		partLabelType: 'roman',
	};

	return [question, answer];
}

function qn9(variables?: {
	start?: number;
	divisor?: number;
	k?: number;
}): [AnswerObject, AnswerObject] {
	// generate variables
	const divisors = [4, 9, 25];
	const { divisor, k } = {
		divisor: divisors[getRandomInt(0, divisors.length - 1)],
		k: getRandomInt(7, 16),
		...variables,
	};
	let start = variables?.start;
	if (start === undefined) {
		start =
			divisor === 4
				? getRandomInt(3, 12) * divisor
				: divisor === 9
				? getRandomInt(3, 9) * divisor
				: getRandomInt(2, 4) * divisor;
	}
	// construct qn
	const middle = k + 1;
	const final = start / divisor;
	const n = 2 * k + 1;
	const lastDigit = n % 10;
	const suffix = lastDigit === 1 ? 'st' : lastDigit === 2 ? 'nd' : lastDigit === 3 ? 'rd' : 'th';
	const lastDigit2 = middle % 10;
	const suffix2 =
		lastDigit2 === 1 ? 'st' : lastDigit2 === 2 ? 'nd' : lastDigit2 === 3 ? 'rd' : 'th';
	const r = Math.pow(1 / divisor, 1 / (n - 1));
	const sInf = start / (1 - r);
	const upperBound = Math.ceil(sInf);

	// typeset qn
	const body = `Two sets of toys, ${math('A')} and ${math('B,')}
		consist of wooden blocks of decreasing lengths.`;
	const partI = `The first block of toy set ${math('A')} has length
		${math(`${start} \\textrm{ cm}`)} and the lengths of the blocks form a
		geometric progression. The ${math(`${n} \\textrm{${suffix}}`)}
		block has length ${math(`${final} \\textrm{ cm}.`)}
		<br>Show that the total length of all the blocks must be less than
		${math(`${upperBound} \\textrm{cm,}`)} no matter how many
		blocks there are.
	`;
	const uplevel = `Toy set ${math('B')} consists of only ${math(`${n}`)}
		blocks which are identical to the first ${math(`${n}`)} blocks of toy set ${math('A.')}`;
	const partII = `Find the toal length, ${math('L \\textrm{cm},')} of
		all the blocks of toy set ${math('B')} and the length of the ${math(
		`${middle} \\textrm{${suffix2}}`,
	)}
		block.`;
	const partIII = `Unfortunately, the manufacterer misunderstands
		the instructions and constructs toy set ${math('B')} wrongly, so that the
		lengths of the blocks are in arithmetic progression with common difference
		${math('d \\textrm{ cm}.')} 
		<br>If the total length of the ${math(`${n}`)}
		blocks is still ${math('L \\textrm{ cm}')} and the length of the
		${math(`${n} \\textrm{${suffix}}`)} block is still
		${math(`${final} \\textrm{ cm,}`)} find the value of
		${math('d')} and the length of the longest block.`;

	// solution working
	const rHalfN = new Fraction(1, Math.sqrt(divisor));
	const uMiddle = rHalfN.times(start);
	const L = (start * (1 - Math.pow(r, n))) / (1 - r);
	// part iii
	const a = (2 * L) / n - final;
	const d = (final - a) / (n - 1);

	// answer
	const ansII =
		math(`L = ${L.toPrecision(3)} \\textrm{ cm}.`) +
		`<br>${math(`u_{${middle}} = ${uMiddle} \\textrm{ cm}.`)}`;
	const ansIII =
		math(`d = ${d.toPrecision(3)} \\textrm{ cm}.`) +
		`<br>Length of longest block ${math(`= ${a.toPrecision(3)} \\textrm{ cm}.`)}`;

	const question: AnswerObject = {
		body,
		parts: [
			{ body: partI, marks: 4 },
			{ body: partII, marks: 3, uplevel },
			{ body: partIII, marks: 4 },
		],
		partLabelType: 'roman',
	};
	const answer: AnswerObject = {
		parts: [
			{ body: ansII, partNo: 2 },
			{ body: ansIII, partNo: 3 },
		],
		partLabelType: 'roman',
	};

	return [question, answer];
}

export const qnLogics = {
	qn7,
	qn8,
	qn9,
};
