import { getRandomInt, getRandomInts, Fraction, heads } from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '5') {
		const { divideCase, real } = {
			divideCase: getRandomInt(1, 3), // 1: w2/w*, 2: w*/w2, 3: w*w2
			real: heads(),
		};
		varsPrimitive['divideCase'] = divideCase;
		varsPrimitive['real'] = real;
	} else if (qn === '6') {
		const x1Gen = getRandomInt(-5, 5, { avoid: [0] });
		const y1Gen = getRandomInt(-5, 5, { avoid: [0] });
		const { x1, y1, x2, y2, a, z3, positive } = {
			x1: x1Gen,
			y1: y1Gen,
			x2: getRandomInt(-5, 5, { avoid: [0, x1Gen, -x1Gen] }),
			y2: getRandomInt(-5, 5, { avoid: [0, y1Gen, -y1Gen] }),
			a: getRandomInt(1, 4),
			positive: heads(),
			z3: getRandomInt(-5, 5, { avoid: [0] }),
		};
		varsPrimitive['x1'] = x1;
		varsPrimitive['y1'] = y1;
		varsPrimitive['x2'] = x2;
		varsPrimitive['y2'] = y2;
		varsPrimitive['a'] = a;
		varsPrimitive['z3'] = z3;
		varsPrimitive['positive'] = positive;
	} else if (qn === '7') {
		const pair = getRandomInts(2, 2, 5);
		const { alphaCase, quadrant1, positiveBeta, quadrant2, x, y } = {
			alphaCase: getRandomInt(1, 3),
			quadrant1: getRandomInt(1, 4),
			positiveBeta: heads(),
			quadrant2: getRandomInt(1, 4),
			x: pair[0] * (heads() ? 1 : -1),
			y: pair[1],
		};
		varsPrimitive['alphaCase'] = alphaCase;
		varsPrimitive['quadrant1'] = quadrant1;
		varsPrimitive['positiveBeta'] = positiveBeta;
		varsPrimitive['quadrant2'] = quadrant2;
		varsPrimitive['x'] = x;
		varsPrimitive['y'] = y;
	} else if (qn === '8') {
		const x3Den = getRandomInt(2, 4);
		const x3Num = getRandomInt(1, x3Den) * (heads() ? 1 : -1);
		const { x1, y1, x3, k } = {
			x3: new Fraction(x3Num, x3Den),
			x1: getRandomInt(-4, 4, { avoid: [0] }),
			y1: getRandomInt(-4, 4, { avoid: [0] }),
			k: getRandomInt(1, 5) * (heads() ? 1 : -1),
		};
		varsJSON['x3'] = JSON.stringify(x3);
		varsPrimitive['x1'] = x1;
		varsPrimitive['y1'] = y1;
		varsPrimitive['k'] = k;
	}

	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				qn5: '2015 Paper 1 Question 9 Variant',
				qn6: '2016 Paper 1 Question 7 Variant',
				qn7: '2017 Paper 1 Question 8 Variant',
				qn8: '2018 Paper 2 Question 2 Variant',
			},
		},
	};
}
