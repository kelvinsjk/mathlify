import { getRandomInt, heads, factorPairs, shuffle } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		varsPrimitive['variant'] = getRandomInt(1, 2);
		varsPrimitive['x1'] = getRandomInt(1, 5) * (heads() ? -1 : 1);
		varsPrimitive['y1'] = getRandomInt(1, 5) * (heads() ? -1 : 1);
		varsPrimitive['x2'] = getRandomInt(1, 5) * (heads() ? -1 : 1);
		varsPrimitive['y2'] = getRandomInt(1, 5) * (heads() ? -1 : 1);
		varsPrimitive['x3'] = getRandomInt(1, 5) * (heads() ? -1 : 1);
		varsPrimitive['y3'] = getRandomInt(1, 5) * (heads() ? -1 : 1);
	} else if (qn === 'b') {
		const { b, k, zVar } = {
			b: getRandomInt(1, 3) * (heads() ? -2 : 2),
			k: getRandomInt(1, 4) * 2,
			zVar: getRandomInt(1, 2),
		};
		const ac = b * b + (k * k) / 4;
		const factors = factorPairs(ac).filter((pair) => pair[0] % 2 !== 0 || pair[1] % 2 !== 0); // guaranteed to be non-empty because of the factor pair [1, ac]
		const factor = shuffle(factors[getRandomInt(0, factors.length - 1)]);
		let a: number, c: number;
		if (b > 0 && heads()) {
			a = -factor[0];
			c = -factor[1];
		} else {
			a = factor[0];
			c = factor[1];
		}
		varsPrimitive['a'] = a;
		varsPrimitive['b'] = b;
		varsPrimitive['c'] = c;
		varsPrimitive['k'] = k;
		varsPrimitive['zVar'] = zVar;
	} else if (qn === 'c') {
		const variant = getRandomInt(1, 2);
		const x = getRandomInt(1, 5) * (heads() ? -1 : 1);
		const { y, k, positive } = {
			y: getRandomInt(1, 5) * (heads() ? -1 : 1),
			k: variant === 1 ? -2 * x : getRandomInt(-9, 9, { avoid: [0, -1] }),
			positive: heads(),
		};
		varsPrimitive['variant'] = variant;
		varsPrimitive['x'] = x;
		varsPrimitive['y'] = y;
		varsPrimitive['k'] = k;
		varsPrimitive['positive'] = positive;
	} else if (qn === 'd') {
		const { x, real } = {
			x: getRandomInt(1, 9) * (heads() ? -1 : 1),
			real: heads(),
		};
		const y = getRandomInt(-9, 9, { avoid: [0, x] });
		varsPrimitive['x'] = x;
		varsPrimitive['y'] = y;
		varsPrimitive['real'] = real;
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: 'Solving Linear Equations involving Complex Numbers',
			b: 'Solving Quadratic Equations with Complex Roots',
			c: 'Comparing Real and Imaginary Parts',
			d: 'Real and Purely Imaginary Numbers',
		},
	};
}
