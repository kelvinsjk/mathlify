import { getRandomInt } from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '7') {
		const a = getRandomInt(-5, 5, { avoid: [0] });
		const b = getRandomInt(-5, 5, { avoid: [0] });
		const k = getRandomInt(-9, 9, { avoid: [0] });
		varsPrimitive['a'] = a;
		varsPrimitive['b'] = b;
		varsPrimitive['k'] = k;
	}

	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				qn7: '2007 Paper 1 Question 3 Variant',
			},
		},
	};
}
