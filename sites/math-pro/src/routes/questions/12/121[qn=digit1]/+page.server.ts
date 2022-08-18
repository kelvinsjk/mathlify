import {
	getRandomVec,
	getRandomInt,
	getNiceVec,
	//Vector
} from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '0') {
		const a = getNiceVec();
		let b = getNiceVec();
		while (a.isParallelTo(b)) {
			b = getNiceVec();
		}
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
	} else if (qn === '2') {
		let a = getRandomVec({ simplify: true, min: -2, max: 2 });
		let b = getRandomVec({ simplify: true, min: -2, max: 2 });
		while (a.isParallelTo(b)) {
			a = getRandomVec({ simplify: true, min: -2, max: 2 });
			b = getRandomVec({ simplify: true, min: -2, max: 2 });
		}
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
		varsPrimitive['m1'] = getRandomInt(1, 7);
		varsPrimitive['m2'] = getRandomInt(1, 6, { avoid: [varsPrimitive['m1']] });
		varsPrimitive['l2'] = getRandomInt(1, 2);
	} else if (qn === '3') {
		varsPrimitive['l'] = getRandomInt(1, 5);
		varsPrimitive['m'] = getRandomInt(1, 5);
	} else if (qn === '4') {
		const a = getNiceVec().simplify({ stretchable: true });
		varsJSON['a'] = JSON.stringify(a);
		varsPrimitive['axis'] = getRandomInt(1, 3);
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			qn0: '2010 Paper 1 Question 1 Variant',
			qn2: '2012 Paper 1 Question 5 Variant',
			qn3: '2013 Paper 1 Question 6 Variant',
			qn4: '2014 Paper 1 Question 3 Variant',
		},
	};
}
