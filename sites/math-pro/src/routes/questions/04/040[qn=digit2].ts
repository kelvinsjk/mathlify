import { getRandomInt, Fraction } from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '7') {
		const { m } = {
			m: getRandomInt(3, 9),
		};
		const n = getRandomInt(m + 1, 2 * m - 2);
		const dFrac = new Fraction(n - 2 * m + 1, Math.pow(m - 1, 2));
		const d = dFrac.valueOf();
		const kMax = Math.floor((Math.floor(-1 / d) / 2) * (1 + d));
		const k = getRandomInt(2, kMax);
		varsPrimitive['m'] = m;
		varsPrimitive['k'] = k;
		varsPrimitive['n'] = n;
	} else if (qn === '8') {
		const startingAmounts = [10, 20, 50, 100];
		const xTimesArray = [50, 100, 200, 500];
		const { startingAmount, percentage1, percentage2, xTimes, years } = {
			startingAmount: startingAmounts[getRandomInt(0, startingAmounts.length - 1)],
			percentage1: getRandomInt(1, 5) * 10,
			xTimes: xTimesArray[getRandomInt(0, xTimesArray.length - 1)],
			percentage2: getRandomInt(1, 5),
			years: getRandomInt(1, 5),
		};
		varsPrimitive['startingAmount'] = startingAmount;
		varsPrimitive['percentage1'] = percentage1;
		varsPrimitive['percentage2'] = percentage2;
		varsPrimitive['years'] = years;
		varsPrimitive['xTimes'] = xTimes;
	} else if (qn === '9') {
		const divisors = [4, 9, 25];
		const { divisor, k } = {
			divisor: divisors[getRandomInt(0, divisors.length - 1)],
			k: getRandomInt(7, 16),
		};
		const start =
			divisor === 4
				? getRandomInt(3, 12) * divisor
				: divisor === 9
				? getRandomInt(3, 9) * divisor
				: getRandomInt(2, 4) * divisor;
		varsPrimitive['divisor'] = divisor;
		varsPrimitive['start'] = start;
		varsPrimitive['k'] = k;
	}

	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				qn7: '2007 Paper 1 Question 10 Variant',
				qn8: '2008 Paper 1 Question 10 Variant',
				qn9: '2009 Paper 1 Question 8 Variant',
			},
		},
	};
}
