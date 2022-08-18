import { getRandomInt, heads } from 'mathlify';
import { generate } from '../_logic/0107';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean | number[] } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const { a, k, lessThan } = {
			a: getRandomInt(-9, 9, { avoid: [0] }),
			k: getRandomInt(-3, 3, { avoid: [0] }),
			lessThan: heads(),
		};
		const b = getRandomInt(-9, 9, { avoid: [0, a] });
		const c = getRandomInt(-9, 9, { avoid: [0, a, b] });
		const d = getRandomInt(-3, 3, { avoid: [0, a, b, c] });
		varsPrimitive['k'] = k;
		varsPrimitive['a'] = a;
		varsPrimitive['b'] = b;
		varsPrimitive['c'] = c;
		varsPrimitive['d'] = d;
		varsPrimitive['lessThan'] = lessThan;
	} else if (qn === 'b') {
		// generate variables
		const { xs: xsDefault, a1, a2, a3, a4 } = generate();
		const { coeffs, xs } = {
			xs: xsDefault,
			coeffs: [...a1, ...a2, ...a3, ...a4],
		};
		varsPrimitive['coeffs'] = coeffs;
		varsPrimitive['xs'] = xs;
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: '2007 Paper 1 Question 1 Variant',
			b: '2007 Paper 2 Question 1 Variant',
		},
	};
}
