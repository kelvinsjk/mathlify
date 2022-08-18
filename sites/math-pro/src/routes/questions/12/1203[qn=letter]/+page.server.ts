import { heads, getRandomInt } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		varsPrimitive['a'] = getRandomInt(1, 9);
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'b') {
		varsPrimitive['a'] = getRandomInt(2, 9);
		varsPrimitive['variant'] = getRandomInt(1, 2);
		varsPrimitive['angle1'] = heads();
	} else if (qn === 'c') {
		varsPrimitive['a'] = getRandomInt(2, 5);
		varsPrimitive['l1'] = getRandomInt(1, 5);
		varsPrimitive['m1'] = getRandomInt(-5, 5, { avoid: [0] });
		varsPrimitive['l2'] = getRandomInt(1, 5);
		varsPrimitive['m2'] = getRandomInt(-5, 5);
		varsPrimitive['variant'] = getRandomInt(1, 2);
		varsPrimitive['angle1'] = heads();
	} else if (qn === 'd') {
		varsPrimitive['l'] = getRandomInt(1, 5);
		varsPrimitive['m'] = getRandomInt(1, 5);
		varsPrimitive['pos1'] = heads();
		varsPrimitive['pos2'] = heads();
		varsPrimitive['plus'] = heads();
		varsPrimitive['swap'] = heads();
		varsPrimitive['variant'] = getRandomInt(1, 2);
	}
	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: 'Algebra I',
			b: 'Algebra II',
			c: 'Algebra III',
			d: 'Algebra IV',
		},
	};
}
