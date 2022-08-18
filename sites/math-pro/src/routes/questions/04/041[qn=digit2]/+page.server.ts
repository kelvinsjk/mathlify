import { getRandomInt, Fraction, Polynomial, sample, bisection } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '7') {
		const [a, k, n, multiple] = generateQ7Vars();
		varsPrimitive['a'] = a;
		varsPrimitive['k'] = k;
		varsPrimitive['n'] = n;
		varsPrimitive['multiple'] = multiple;
	} else if (qn === '6') {
		const { m1, m2a, m3a, n1, n2a, n3a } = {
			m1: getRandomInt(2, 6),
			m2a: getRandomInt(1, 3) * 2 - 1,
			m3a: getRandomInt(1, 5) * 2 + 1,
			n1: getRandomInt(1, 5),
			n2a: getRandomInt(3, 7),
			n3a: getRandomInt(2, 4),
		};
		varsPrimitive['m1'] = m1;
		varsPrimitive['m2a'] = m2a;
		varsPrimitive['m3a'] = m3a;
		varsPrimitive['n1'] = n1;
		varsPrimitive['n2a'] = n2a;
		varsPrimitive['n3a'] = n3a;
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
		const bases = [2, 3, getRandomInt(5, 9)];
		const { base, terms, n2 } = {
			base: sample(bases),
			terms: getRandomInt(2, 4),
			n2: getRandomInt(7, 15),
		};
		const exponent = base === 2 ? getRandomInt(3, 6) : base === 3 ? getRandomInt(2, 4) : 2;
		const rand = getRandomInt(1, 9);
		const sum = terms === 4 ? rand * 2 : terms === 3 ? rand * 3 : rand;
		varsPrimitive['base'] = base;
		varsPrimitive['exponent'] = exponent;
		varsPrimitive['sum'] = sum;
		varsPrimitive['terms'] = terms;
		varsPrimitive['n2'] = n2;
	} else if (qn === '5') {
		const times = [5, 6, 7, 8, 9, 10]; // over t/4 hours
		// generate variables
		const t1 = sample(times);
		const t2 = sample(times.filter((e) => e !== t1));
		const [tA] = t1 < t2 ? [t1, t2] : [t2, t1];
		const maxAdds = {
			5: 1,
			6: 2,
			7: 3,
			8: 3,
			9: 4,
		};
		const max = maxAdds[tA];
		const d = getRandomInt(1, max);
		const r1 = getRandomInt(1, max);
		varsPrimitive['t1'] = t1;
		varsPrimitive['t2'] = t2;
		varsPrimitive['r1'] = r1;
		varsPrimitive['d'] = d;
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			qn5: '2015 Paper 1 Question 8 Variant',
			qn6: '2016 Paper 1 Question 4 Variant',
			qn7: '2017 Paper 2 Question 2 Variant',
			qn8: '2018 Paper 1 Question 11 Variant',
			qn9: '2019 Paper 1 Question 8 Variant',
		},
	};
}

function generateQ7Vars(): [number, number, number, number] {
	const { a, n } = {
		a: getRandomInt(1, 9),
		n: getRandomInt(4, 10) * 2 - 1,
	};
	const k = getRandomInt(n + 1, 99); // S_n = ka
	const rN = new Polynomial([1], { degree: n, unknown: 'r' });
	const poly = rN.plus(new Polynomial([-k, k - 1], { unknown: 'r' }));
	if (poly.subInNumber(1.01) > 0) {
		return generateQ7Vars();
	}
	const r = bisection((x: number) => poly.subInNumber(x), 1.01, 100);
	if (r < 1.05) {
		return generateQ7Vars();
	}
	const d = new Fraction(2 * k * a, n).minus(2 * a).divide(n - 1);
	const multiples = [50, 100, 200];
	let multiple = sample(multiples);
	while (a * Math.pow(r, 100) <= multiple * (a + (100 - 1) * d.valueOf())) {
		multiple = multiple % 2 === 0 ? multiple / 2 : multiple - 1;
	}
	return [a, k, n, multiple];
}
