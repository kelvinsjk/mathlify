import { heads, getRandomInt } from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const variant = getRandomInt(1, 2);
		const n = variant === 1 ? getRandomInt(2, 4) : getRandomInt(5, 9);
		varsPrimitive['variant'] = variant;
		varsPrimitive['n'] = n;
	} else if (qn === 'b') {
		varsPrimitive['x1'] = getRandomInt(-5, 5);
		varsPrimitive['y1'] = getRandomInt(1, 5) * (heads() ? -1 : 1);
		varsPrimitive['x2'] = getRandomInt(1, 5) * (heads() ? -1 : 1);
		varsPrimitive['y2'] = getRandomInt(1, 5) * (heads() ? -1 : 1);
	} else if (qn === 'c') {
		const variant = getRandomInt(1, 2);
		let { x1, y1 } = {
			x1: variant === 1 ? getRandomInt(-5, 5) : getRandomInt(1, 5) * (heads() ? -1 : 1),
			y1: variant === 1 ? getRandomInt(-5, 5) : getRandomInt(1, 5) * (heads() ? -1 : 1),
		};
		const { x2, y2 } = {
			x2: variant === 1 ? getRandomInt(1, 5) * (heads() ? -1 : 1) : 0,
			y2: variant === 1 ? getRandomInt(1, 5) * (heads() ? -1 : 1) : getRandomInt(1, 5),
		};
		while (x1 === 0 && y1 === 0) {
			x1 = variant === 1 ? getRandomInt(-5, 5) : getRandomInt(1, 5) * (heads() ? -1 : 1);
			y1 = variant === 1 ? getRandomInt(-5, 5) : getRandomInt(1, 5) * (heads() ? -1 : 1);
		}
		varsPrimitive['variant'] = variant;
		varsPrimitive['x1'] = x1;
		varsPrimitive['y1'] = y1;
		varsPrimitive['x2'] = x2;
		varsPrimitive['y2'] = y2;
	} else if (qn === 'd') {
		varsPrimitive['x'] = getRandomInt(1, 3) * (heads() ? -1 : 1);
		varsPrimitive['y'] = getRandomInt(1, 3) * (heads() ? -1 : 1);
		varsPrimitive['n'] = getRandomInt(2, 4);
	}

	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				a: 'Powers of i',
				b: 'Multiplication of Complex Numbers',
				c: 'Division of Complex Numbers',
				d: 'Powers of Complex Numbers',
			},
		},
	};
}
