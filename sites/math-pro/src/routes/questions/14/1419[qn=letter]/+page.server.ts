import { getRandomInt, heads } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const { x, y, x3 } = {
			x: getRandomInt(-4, 4, { avoid: [0] }),
			y: getRandomInt(-4, 4, { avoid: [0] }),
			x3: getRandomInt(-3, 3, { avoid: [0] }),
		};
		varsPrimitive['x'] = x;
		varsPrimitive['y'] = y;
		varsPrimitive['x3'] = x3;
	} else if (qn === 'b') {
		const { k, real } = {
			k: getRandomInt(2, 4) * (heads() ? 1 : -1),
			real: heads(),
		};
		varsPrimitive['k'] = k;
		varsPrimitive['real'] = real;
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: '2019 Paper 1 Question 1 Variant',
			b: '2019 Paper 1 Question 9ii Variant',
		},
	};
}
