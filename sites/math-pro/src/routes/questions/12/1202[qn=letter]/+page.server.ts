import { getRandomVec, getRandomPerps, getRandomInt } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a' || qn === 'c' || qn === 'd') {
		varsPrimitive['variant'] = getRandomInt(1, 2);
		varsJSON['a'] = JSON.stringify(getRandomVec({ nonzero: false }));
		varsJSON['b'] = JSON.stringify(getRandomVec({ nonzero: false }));
	} else if (qn === 'b') {
		const perps = getRandomPerps();
		varsJSON['a'] = JSON.stringify(perps[0]);
		varsJSON['b'] = JSON.stringify(perps[1]);
	} else if (qn === 'e') {
		varsJSON['a'] = JSON.stringify(getRandomVec({ nonzero: false }));
		varsJSON['b'] = JSON.stringify(getRandomVec({ nonzero: false }));
		varsPrimitive['variant'] = getRandomInt(1, 2);
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: 'Scalar (Dot) Product',
			b: 'Perpendicular Vectors',
			c: 'Angle Between Vectors',
			d: 'Vector (Cross) Products',
			e: 'Area of Triangles and Parallelograms',
		},
	};
}
