import { Fraction, getRandomInt, heads, getRandomAngle } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const [k, positive] = generateQnA();
		varsPrimitive['positive'] = positive;
		varsJSON['k'] = JSON.stringify(k);
	} else if (qn === 'b') {
		const { a, positive } = {
			a: getRandomInt(1, 3) * (heads() ? 1 : -1),
			positive: heads(),
		};
		const den = getRandomInt(2, 3);
		const num = getRandomInt(1, den - 1) * (heads() ? 1 : -1);
		const b = new Fraction(num, den);
		varsPrimitive['a'] = a;
		varsPrimitive['positive'] = positive;
		varsJSON['b'] = JSON.stringify(b);
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: '2021 Paper 1 Question 4 Variant',
			b: '2021 Paper 2 Question 1 Variant',
		},
	};
}

function generateQnA(): [Fraction, boolean] {
	const { k, positive } = {
		k: getRandomAngle(),
		positive: heads(),
	};
	if (k.abs().isEqualTo(new Fraction(2, 3))) {
		return generateQnA();
	}
	return [k, positive];
}
