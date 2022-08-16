import { getRandomInt, heads } from 'mathlify';
import { generate0112, generate0113 } from './_logic/011x';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean | number[] } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '2') {
		// set up
		const { a1, a2, a3 } = generate0112();
		const { coeffs, xs } = {
			coeffs: [...a1, ...a2, ...a3],
			xs: [getRandomInt(100, 200) * 5, getRandomInt(140, 240) * 5, getRandomInt(600, 1100)],
		};
		varsPrimitive['coeffs'] = coeffs;
		varsPrimitive['xs'] = xs;
	} else if (qn === '3') {
		const { b, c, e, can } = {
			...generate0113(),
			can: heads(),
		};
		varsPrimitive['b'] = b;
		varsPrimitive['c'] = c;
		varsPrimitive['e'] = e;
		varsPrimitive['can'] = can;
	}

	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				qn2: '2012 Paper 1 Question 1 Variant',
				qn3: '2013 Paper 1 Question 2 Variant',
			},
		},
	};
}
