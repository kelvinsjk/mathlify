import { getRandomInt, heads } from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '1') {
		// set up
		const { k, quadrant, b } = {
			k: getRandomInt(1, 3),
			quadrant: getRandomInt(1, 4),
			b: getRandomInt(1, 2) * (heads() ? -2 : 4), //
		};
		varsPrimitive['k'] = k;
		varsPrimitive['quadrant'] = quadrant;
		varsPrimitive['b'] = b;
	} else if (qn === '2') {
		const { a, xUnknown } = {
			a: getRandomInt(-5, 5, { avoid: [0] }),
			xUnknown: heads(),
		};
		varsPrimitive['a'] = a;
		varsPrimitive['xUnknown'] = xUnknown;
	}

	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				qn1: '2011 Paper 1 Question 10 Variant',
				qn2: '2012 Paper 1 Question 6 Variant',
			},
		},
	};
}
