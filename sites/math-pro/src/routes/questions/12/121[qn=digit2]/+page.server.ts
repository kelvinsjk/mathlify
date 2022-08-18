import {
	getRandomVec,
	getRandomInt,
	heads,
	//Vector
} from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '5') {
		varsPrimitive['l1'] = getRandomInt(1, 5);
		varsPrimitive['m1'] = getRandomInt(1, 5);
		varsPrimitive['l2'] = getRandomInt(1, 9);
		varsPrimitive['m2'] = getRandomInt(1, 9);
		//varsPrimitive['l1'] = 3;
		//varsPrimitive['m1'] = 2;
		//varsPrimitive['l2'] = 5;
		//varsPrimitive['m2'] = 6;
	} else if (qn === '6') {
		let u = getRandomVec({ simplify: true });
		while (u.y.isEqualTo(0)) {
			u = getRandomVec({ simplify: true });
		}
		//u = new Vector(2, -1, 2);
		varsJSON['u'] = JSON.stringify(u);
	} else if (qn === '8') {
		varsPrimitive['l'] = getRandomInt(1, 5);
		varsPrimitive['m'] = getRandomInt(1, 5);
		varsPrimitive['modB'] = getRandomInt(2, 5);
		varsPrimitive['sixtyDegrees'] = heads();
		//varsPrimitive['l'] = 3;
		//varsPrimitive['m'] = 2;
		//varsPrimitive['modB'] = 4;
		//varsPrimitive['sixtyDegrees'] = true;
	} else if (qn === '9') {
		const l1 = getRandomInt(2, 5);
		const m1 = getRandomInt(2, 5);
		const min1 = (l1 + m1 - 1) / m1;
		const min = Number.isInteger(min1) ? min1 + 1 : Math.ceil(min1);
		const l2 = getRandomInt(min, min + 4);
		varsPrimitive['l1'] = l1;
		varsPrimitive['m1'] = m1;
		varsPrimitive['l2'] = l2;
		//varsPrimitive['l1'] = 2;
		//varsPrimitive['m1'] = 4;
		//varsPrimitive['l2'] = 5;
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			qn5: '2015 Paper 1 Question 7 Variant',
			qn6: '2016 Paper 1 Question 5 Variant',
			qn8: '2018 Paper 1 Question 6 Variant',
			qn9: '2019 Paper 2 Question 5 Variant',
		},
	};
}
