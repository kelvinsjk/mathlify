import { Fraction, getRandomInt, heads, Angle, getRandomAngle } from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const [k1, k2, k3, real] = generateQnA();
		varsPrimitive['real'] = real;
		varsJSON['k1'] = JSON.stringify(k1);
		varsJSON['k2'] = JSON.stringify(k2);
		varsJSON['k3'] = JSON.stringify(k3);
	} else if (qn === 'b') {
		const { c, x, y } = {
			c: getRandomInt(1, 2) * (heads() ? 2 : -2),
			x: getRandomInt(-5, 5, { avoid: [0] }),
			y: getRandomInt(-5, 5, { avoid: [0] }),
		};
		const k =
			Math.abs(c) === 2 ? getRandomInt(-4, 4, { avoid: [0] }) : getRandomInt(-2, 2, { avoid: [0] });
		varsPrimitive['k'] = k;
		varsPrimitive['c'] = c;
		varsPrimitive['x'] = x;
		varsPrimitive['y'] = y;
	}

	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				a: '2020 Paper 1 Question 4 Variant',
				b: '2020 Paper 1 Question 6 Variant',
			},
		},
	};
}

function generateQnA(): [Fraction, Fraction, Fraction, boolean] {
	const { k1, real } = {
		k1: getRandomAngle(),
		real: heads(),
	};
	let k2 = getRandomAngle();
	while (k2.isEqualTo(k1)) {
		k2 = getRandomAngle();
	}
	let k3 = getRandomAngle();
	while (k3.isEqualTo(k1) || k3.isEqualTo(k2)) {
		k3 = getRandomAngle();
	}
	// set up: variables
	const theta1 = new Angle(k1);
	const theta2 = new Angle(k2);
	const theta3 = new Angle(k3);
	if (theta1.minus(theta2).minus(theta3).k.den <= 2) {
		return generateQnA();
	}
	return [k1, k2, k3, real];
}
