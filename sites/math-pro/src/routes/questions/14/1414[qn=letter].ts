import { getRandomInt, getRandomAngle, heads } from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const x2 = getRandomInt(2, 3) * (heads() ? 1 : -1);
		const x1 = heads() ? 1 : -1;
		const [x1Actual, x2Actual] = heads() ? [x1, x2] : [x2, x1];
		const { x, y, n1, n2, real } = {
			x: x1Actual,
			y: x2Actual,
			n1: getRandomInt(2, 3),
			n2: getRandomInt(1, 3),
			real: heads(),
		};
		varsPrimitive['x'] = x;
		varsPrimitive['y'] = y;
		varsPrimitive['n1'] = n1;
		varsPrimitive['n2'] = n2;
		varsPrimitive['real'] = real;
	} else if (qn === 'b') {
		const { k, divide, positive } = {
			k: getRandomAngle(),
			divide: heads(),
			positive: heads(),
		};
		const n = getRandomInt(4, 8);
		varsPrimitive['n'] = n;
		varsPrimitive['divide'] = divide;
		varsPrimitive['positive'] = positive;
		varsJSON['k'] = JSON.stringify(k);
	}

	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				a: '2014 Paper 1 Question 5 Variant',
				b: '2014 Paper 2 Question 2 Variant',
			},
		},
	};
}
