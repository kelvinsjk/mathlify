import {
	getRandomVec,
	getRandomInt,
	getRandomPerps,
	getNiceVec,
	getRandomPerp,
	heads,
} from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '7') {
		const [a, b] = getRandomPerps();
		const c = getRandomVec({ nonzero: true });
		let lambda = getRandomInt(1, 4);
		let mu = getRandomInt(1, 4);
		while (lambda + mu > 5) {
			lambda = getRandomInt(1, 4);
			mu = getRandomInt(1, 4);
		}
		varsPrimitive['lambda'] = lambda;
		varsPrimitive['mu'] = mu;
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
		varsJSON['c'] = JSON.stringify(c);
	} else if (qn === '8') {
		const a = getRandomVec();
		let b = getRandomVec();
		while (a.isParallelTo(b)) {
			b = getRandomVec();
		}
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
	} else if (qn === '9') {
		const p1 = getNiceVec().simplify({ stretchable: false });
		const q = getRandomPerp(p1, { min: -9, max: 9, simplify: true }).multiply(heads() ? -1 : 1);
		varsJSON['p1'] = JSON.stringify(p1);
		varsJSON['q'] = JSON.stringify(q);
		varsPrimitive['k'] = getRandomInt(1, 2);
		varsPrimitive['l'] = getRandomInt(1, 3);
		varsPrimitive['m'] = getRandomInt(1, 3);
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			qn7: '2007 Paper 1 Question 6 Variant',
			qn8: '2008 Paper 1 Question 3 Variant',
			qn9: '2009 Paper 2 Question 2 Variant',
		},
	};
}
