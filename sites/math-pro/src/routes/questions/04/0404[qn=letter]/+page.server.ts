import { getRandomInt, getRandomFrac, Fraction } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const { a, d, n } = {
			a: getRandomInt(-9, 9),
			d: getRandomInt(-5, 5, { avoid: [0] }),
			n: getRandomInt(9, 20),
		};
		varsPrimitive['n'] = n;
		varsPrimitive['a'] = a;
		varsPrimitive['d'] = d;
	} else if (qn === 'b') {
		const { r, n } = {
			r: getRandomFrac({ numRange: [1, 3], denRange: [1, 3], avoid: [0, 1, -1] }),
			n: getRandomInt(5, 6),
		};
		varsPrimitive['n'] = n;
		varsJSON['r'] = JSON.stringify(r);
	} else if (qn === 'c') {
		const { rDen } = {
			rDen: getRandomInt(2, 9),
		};
		const rNum = getRandomInt(-(rDen - 1), rDen - 1, { avoid: [0] });
		const r = new Fraction(rNum, rDen);
		varsJSON['r'] = JSON.stringify(r);
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: 'Sigma I',
			b: 'Sigma II',
			c: 'Sigma III',
		},
	};
}
