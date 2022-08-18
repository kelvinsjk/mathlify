import { heads, getRandomInt, getRandomFrac, Fraction } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const { a, r, variant } = {
			a: getRandomInt(-3, 3, { avoid: [0] }),
			r: getRandomFrac({ numRange: [-3, 3], denRange: [1, 3], avoid: [0, 1, -1] }),
			variant: getRandomInt(1, 2),
		};
		varsPrimitive['variant'] = variant;
		varsPrimitive['a'] = a;
		varsJSON['r'] = JSON.stringify(r);
	} else if (qn === 'b') {
		const { a, r, convergentWording } = {
			a: getRandomInt(-9, 9),
			r: getRandomFrac({ avoid: [0] }),
			convergentWording: heads(),
		};
		varsPrimitive['a'] = a;
		varsPrimitive['convergentWording'] = convergentWording;
		varsJSON['r'] = JSON.stringify(r);
	} else if (qn === 'c') {
		const { rDen, a } = {
			a: getRandomInt(-9, 9, { avoid: [0] }),
			rDen: getRandomInt(2, 9),
		};
		const rNum = getRandomInt(-(rDen - 1), rDen - 1, { avoid: [0] });
		const r = new Fraction(rNum, rDen);
		varsPrimitive['a'] = a;
		varsJSON['r'] = JSON.stringify(r);
	} else if (qn === 'd') {
		const { rPercent } = {
			rPercent: getRandomInt(80, 99),
		};
		const kPercent = getRandomInt(
			Math.floor(Math.pow(rPercent / 100, 20) * 100),
			Math.floor(Math.pow(rPercent / 100, 10) * 100),
		);
		varsPrimitive['rPercent'] = rPercent;
		varsPrimitive['kPercent'] = kPercent;
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: 'GP I',
			b: 'GP II',
			c: 'GP III',
			d: 'GP IV',
		},
	};
}
