import { getNiceVec, heads, getRandomInt } from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a' || qn === 'b' || qn === 'c') {
		let a = getNiceVec();
		let b = getNiceVec();
		while (a.isParallelTo(b) || a.isPerpendicularTo(b)) {
			a = getNiceVec();
			b = getNiceVec();
		}
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'd' || qn === 'e') {
		varsPrimitive['qnCase'] = getRandomInt(1, 3);
		varsPrimitive['swap'] = heads();
		varsPrimitive['variant'] = getRandomInt(1, 2);
	}
	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				a: 'Lengths of Projection',
				b: 'Projection Vectors',
				c: 'Perpendicular Distances',
				d: 'Geometric Interpretations I',
				e: 'Geometric Interpretations II',
			},
		},
	};
}
