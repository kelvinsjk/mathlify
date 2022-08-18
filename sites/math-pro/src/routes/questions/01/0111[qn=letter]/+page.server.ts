import { getRandomInt, heads, cramers } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean | number[] } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const { b, d, numPositive, lessThan } = {
			b: getRandomInt(-6, 6, { avoid: [0] }),
			d: getRandomInt(-9, 9),
			numPositive: heads(),
			lessThan: heads(),
		};
		const c = getRandomInt(Math.ceil((b * b + 1) / 4), 10);
		const e = getRandomInt(-9, 9, { avoid: [d] });
		varsPrimitive['b'] = b;
		varsPrimitive['c'] = c;
		varsPrimitive['d'] = d;
		varsPrimitive['e'] = e;
		varsPrimitive['lessThan'] = lessThan;
		varsPrimitive['numPositive'] = numPositive;
	} else if (qn === 'b') {
		const [a1, b1, c1] = [
			// *1000
			getRandomInt(100, 999),
			getRandomInt(200, 1999) * (heads() ? 1 : -1),
			getRandomInt(100, 4999) * (heads() ? 1 : -1),
		];
		const xs1 = [
			// *10
			getRandomInt(-29, -5),
			getRandomInt(5, 25),
			getRandomInt(26, 49),
		];
		const ys1 = xs1.map((x) => Math.round((a1 * x * x) / 10000 + (b1 * x) / 1000 + c1 / 100) / 10);
		const xSquared = xs1.map((x) => (x * x) / 100);
		const coeffsDefault = cramers(
			xSquared[0],
			xs1[0] / 10,
			1,
			ys1[0],
			xSquared[1],
			xs1[1] / 10,
			1,
			ys1[1],
			xSquared[2],
			xs1[2] / 10,
			1,
			ys1[2],
		);
		const { coeffs, xs } = {
			coeffs: coeffsDefault,
			xs: xs1,
		};
		varsPrimitive['coeffs'] = coeffs;
		varsPrimitive['xs'] = xs;
		varsPrimitive['isIncreasing'] = heads();
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: '2011 Paper 1 Question 1 Variant',
			b: '2011 Paper 1 Question 2 Variant',
		},
	};
}
