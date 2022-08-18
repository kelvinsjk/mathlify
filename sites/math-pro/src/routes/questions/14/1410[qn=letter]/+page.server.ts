import { getRandomInts, getRandomAngle } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const { k1 } = {
			k1: getRandomAngle(),
		};
		const k2 = getRandomAngle({ avoid: [k1] });
		varsJSON['k1'] = JSON.stringify(k1);
		varsJSON['k2'] = JSON.stringify(k2);
	} else if (qn === 'b') {
		const randomPair1 = getRandomInts(2, -5, 5, { avoid: [0] });
		const randomPair2 = getRandomInts(2, -4, 4, { avoid: [0] });
		const randomPair3 = getRandomInts(2, -3, 3, { avoid: [0] });
		const { x1, y1, x2, y2, x3, x4 } = {
			x1: randomPair1[0],
			y1: randomPair1[1],
			x2: randomPair2[0],
			y2: randomPair2[1],
			x3: randomPair3[0],
			x4: randomPair3[1],
		};
		varsPrimitive['x1'] = x1;
		varsPrimitive['y1'] = y1;
		varsPrimitive['x2'] = x2;
		varsPrimitive['y2'] = y2;
		varsPrimitive['x3'] = x3;
		varsPrimitive['x4'] = x4;
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: '2010 Paper 1 Question 8 Variant',
			b: '2010 Paper 2 Question 1 Variant',
		},
	};
}
