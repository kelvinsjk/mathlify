import { getRandomInt, sample, getRandomFrac } from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const { a, r, d, variant } = {
			a: getRandomInt(1, 9, { avoid: [0] }),
			d: getRandomInt(-4, 4, { avoid: [0] }) * 2,
			r: getRandomFrac({ numRange: [1, 3], denRange: [1, 3], avoid: [0, 1, -1] }),
			variant: getRandomInt(1, 2),
		};
		varsPrimitive['variant'] = variant;
		varsPrimitive['a'] = a;
		varsPrimitive['d'] = d;
		varsJSON['r'] = JSON.stringify(r);
	} else if (qn === 'b') {
		const { a, r, d, variant } = {
			a: getRandomInt(-9, 9),
			r: getRandomFrac({ avoid: [0, 1, -1] }).abs(),
			d: getRandomInt(1, 9, { avoid: [0] }) * 2,
			variant: getRandomInt(1, 2),
		};
		varsPrimitive['a'] = a;
		varsPrimitive['d'] = d;
		varsPrimitive['variant'] = variant;
		varsJSON['r'] = JSON.stringify(r);
	} else if (qn === 'c') {
		const as = [10, 20, 50, 100, 200, 500];
		const { a, rPercent, n } = {
			a: sample(as),
			rPercent: getRandomInt(1, 10),
			n: getRandomInt(2, 6) * 5,
		};
		varsPrimitive['a'] = a;
		varsPrimitive['rPercent'] = rPercent;
		varsPrimitive['n'] = n;
	}

	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				a: 'Sums and Terms',
				b: 'Proofs',
				c: 'GP Application',
			},
		},
	};
}
