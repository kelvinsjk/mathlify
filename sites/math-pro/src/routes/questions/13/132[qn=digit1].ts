import { getRandomVec, getRandomInt, Line, getRandomPerp, getRandomPerps } from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '0') {
		const n = getRandomVec({ simplify: true });
		const d1 = getRandomPerp(n);
		const d2 = getRandomPerp(n, { avoid: [d1] });
		const n2 = getRandomVec({
			min: -6,
			max: 6,
			simplify: true,
			avoid: [n],
			avoidParallel: true,
			avoidPerp: true,
		});

		varsJSON['d1'] = JSON.stringify(d1);
		varsJSON['d2'] = JSON.stringify(d2);
		varsJSON['n2'] = JSON.stringify(n2);
	} else if (qn === '1') {
		const [d1, d2] = getRandomPerps();
		const a1 = getRandomVec();
		const l1 = new Line(a1, d1);
		const b = getRandomVec({ avoidLine: l1 });
		const lambda = getRandomInt(-3, 3, { avoid: [0] });
		const k = getRandomInt(-3, 3, { avoid: [0] });
		const mu = getRandomInt(-3, 3, { avoid: [0] });
		const n = d1.cross(d2).simplify({ stretchable: true });
		const a2 = a1.plus(d1.multiply(lambda)).plus(d2.multiply(k)).plus(n.multiply(mu));
		varsJSON['d1'] = JSON.stringify(d1);
		varsJSON['d2'] = JSON.stringify(d2);
		varsJSON['a1'] = JSON.stringify(a1);
		varsJSON['a2'] = JSON.stringify(a2);
		varsJSON['b'] = JSON.stringify(b);
	}

	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				qn0: '2020 Paper 1 Question 1 Variant',
				qn1: '2021 Paper 1 Question 8 Variant',
			},
		},
	};
}
