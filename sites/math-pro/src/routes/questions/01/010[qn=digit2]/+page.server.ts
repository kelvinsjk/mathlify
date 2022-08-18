import { getRandomInt, Fraction, sample } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '9') {
		const dens = [1, 2, 2, 3];
		const den = sample(dens);
		const aDefault =
			den === 1
				? new Fraction(getRandomInt(1, 3))
				: den === 2
				? new Fraction(getRandomInt(1, 3) * 2 - 1, 2)
				: new Fraction(getRandomInt(1, 8, { avoid: [3, 6] }), 3);
		const bDefault =
			den === 1
				? new Fraction(getRandomInt(-9, 9, { avoid: [0] }))
				: den === 2
				? new Fraction(getRandomInt(-10, 9) * 2 + 1, 2)
				: aDefault.num % 3 === 1
				? new Fraction(getRandomInt(-7, 6) * 3 + 2, 3)
				: new Fraction(getRandomInt(-6, 7) * 3 + 1, 3);
		const { a, b, c } = {
			a: aDefault,
			b: bDefault,
			c: getRandomInt(1, 19),
		};
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
		varsPrimitive['c'] = c;
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			qn9: '2009 Paper 1 Question 1 Variant',
		},
	};
}
