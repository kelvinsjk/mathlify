import { getRandomInt, heads, getRandomFrac } from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '0') {
		// set up
		const { a, d, nAPStart, rDen, percentage } = {
			a: getRandomInt(1, 9),
			d: getRandomFrac({ avoid: [0] }),
			nAPStart: getRandomInt(2, 8) * 10 + 1,
			rDen: getRandomInt(3, 9),
			percentage: getRandomInt(75, 99),
		};
		const multipleMax = Math.floor(6 / d.den);
		const multiple = getRandomInt(1, multipleMax);
		const nAP1 = multiple * d.den + 1;
		const { nAP2, nAPEnd } = {
			nAP2: getRandomInt(10, 50, { avoid: [nAP1] }),
			nAPEnd: getRandomInt(Math.floor(nAPStart / 10) + 1, 10) * 10,
		};
		varsPrimitive['a'] = a;
		varsJSON['d'] = JSON.stringify(d);
		varsPrimitive['nAP1'] = nAP1;
		varsPrimitive['nAP2'] = nAP2;
		varsPrimitive['nAPStart'] = nAPStart;
		varsPrimitive['nAPEnd'] = nAPEnd;
		varsPrimitive['rDen'] = rDen;
		varsPrimitive['percentage'] = percentage;
	} else if (qn === '1') {
		const { a, xUnknown } = {
			a: getRandomInt(-5, 5, { avoid: [0] }),
			xUnknown: heads(),
		};
		varsPrimitive['a'] = a;
		varsPrimitive['xUnknown'] = xUnknown;
	}

	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				qn0: '2020 Paper 1 Question 8 Variant',
				qn1: '2021 Paper 2 Question 4 Variant',
			},
		},
	};
}
