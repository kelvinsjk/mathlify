import { getRandomInt, heads, Complex } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		varsPrimitive['variant'] = getRandomInt(1, 2);
		varsPrimitive['x'] = getRandomInt(1, 4) * (heads() ? -1 : 1);
		varsPrimitive['y'] = getRandomInt(1, 4) * (heads() ? -1 : 1);
		varsPrimitive['z3'] = getRandomInt(1, 3) * (heads() ? -1 : 1);
	} else if (qn === 'b') {
		const variant = getRandomInt(1, 2);
		let x1: number, y1: number, x2: number, y2: number;
		if (variant === 1) {
			x1 = getRandomInt(1, 4) * (heads() ? -1 : 1);
			y1 = getRandomInt(1, 4) * (heads() ? -1 : 1);
			x2 = getRandomInt(1, 5) * (heads() ? -1 : 1);
			y2 = getRandomInt(1, 5) * (heads() ? -1 : 1);
			const alpha = new Complex(x1, y1);
			let beta = new Complex(x2, y2);
			while (alpha.isEqualTo(beta) || alpha.times(beta).isReal() || alpha.plus(beta).isReal()) {
				x2 = getRandomInt(1, 5) * (heads() ? -1 : 1);
				y2 = getRandomInt(1, 5) * (heads() ? -1 : 1);
				beta = new Complex(x2, y2);
			}
		} else {
			x1 = getRandomInt(1, 2) * (heads() ? -1 : 1);
			y1 = getRandomInt(1, 2) * (heads() ? -1 : 1);
			x2 = getRandomInt(1, 2) * (heads() ? -1 : 1);
			y2 = getRandomInt(1, 2) * (heads() ? -1 : 1);
			const alpha = new Complex(x1, y1);
			let beta = new Complex(x2, y2);
			while (alpha.isEqualTo(beta) || alpha.times(beta).isReal() || alpha.plus(beta).isReal()) {
				x2 = getRandomInt(1, 2) * (heads() ? -1 : 1);
				y2 = getRandomInt(1, 2) * (heads() ? -1 : 1);
				beta = new Complex(x2, y2);
			}
		}
		varsPrimitive['variant'] = variant;
		varsPrimitive['x1'] = x1;
		varsPrimitive['y1'] = y1;
		varsPrimitive['x2'] = x2;
		varsPrimitive['y2'] = y2;
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: 'Conjugate Root Theorem',
			b: 'Solving Equations Using Sum/Product of Roots',
		},
	};
}
