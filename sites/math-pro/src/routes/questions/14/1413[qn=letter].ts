import { getRandomInt, getRandomAngle } from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const { x, y, a, b } = {
			x: getRandomInt(-3, 3, { avoid: [0] }),
			y: getRandomInt(-3, 3, { avoid: [0] }),
			a: getRandomInt(-60, 60, { avoid: [0] }),
			b: getRandomInt(1, 27),
		};
		varsPrimitive['x'] = x;
		varsPrimitive['y'] = y;
		varsPrimitive['a'] = a;
		varsPrimitive['b'] = b;
	} else if (qn === 'b') {
		const { k, n } = {
			k: getRandomAngle(),
			n: getRandomInt(4, 12),
		};
		varsPrimitive['n'] = n;
		varsJSON['k'] = JSON.stringify(k);
	}

	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				a: '2013 Paper 1 Question 4 Variant',
				b: '2013 Paper 1 Question 8 Variant',
			},
		},
	};
}
