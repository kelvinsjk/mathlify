import { getRandomInt, sample, getRandomFrac, heads } from 'mathlify';
import { generate } from '../_logic/011y';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '5') {
		const times = [5, 6, 7, 8, 9, 10]; // over t/4 hours
		const t1 = sample(times);
		const t2 = sample(times.filter((e) => e !== t1));
		const [tA] = t1 < t2 ? [t1, t2] : [t2, t1];
		const maxAdds = {
			5: 1,
			6: 2,
			7: 3,
			8: 3,
			9: 4,
		};
		const max = maxAdds[tA];
		const d = getRandomInt(1, max);
		const r1 = getRandomInt(1, max);
		varsPrimitive['t1'] = t2;
		varsPrimitive['t2'] = t1;
		varsPrimitive['r1'] = r1;
		varsPrimitive['d'] = d;
	} else if (qn === '6') {
		const { root1, a, b, lessThan } = {
			root1: getRandomInt(-3, 3),
			a: getRandomInt(1, 5),
			b: getRandomInt(-5, 5),
			lessThan: heads(),
		};
		const root3 = getRandomInt(-5, 5, { avoid: [root1] });
		const root2 = getRandomFrac({ avoid: [root1, root3] });
		varsPrimitive['root1'] = root1;
		varsJSON['root2'] = JSON.stringify(root2);
		varsPrimitive['root3'] = root3;
		varsPrimitive['a'] = a;
		varsPrimitive['b'] = b;
		varsPrimitive['lessThan'] = lessThan;
	} else if (qn === '8') {
		const { a, b, c, d, lessThan } = {
			...generate(),
		};
		varsPrimitive['a'] = a;
		varsPrimitive['b'] = b;
		varsPrimitive['c'] = c;
		varsPrimitive['d'] = d;
		varsPrimitive['lessThan'] = lessThan;
	} else if (qn === '9') {
		const { base, lessThan, equality } = {
			base: getRandomInt(2, 4), // 4 represent 'e'
			lessThan: heads(),
			equality: heads(),
		};
		let c: number, k: number;
		if (base === 2) {
			k = getRandomInt(1, 5);
			const cs = [3, 6, 5, 12, 10];
			c = cs[k - 1];
			if (k === 5) {
				k = 6;
			}
		} else if (base === 3) {
			k = 3;
			c = 6;
		} else {
			k = getRandomInt(1, 9);
			c = getRandomInt(k + 1, 10);
		}
		varsPrimitive['base'] = base;
		varsPrimitive['lessThan'] = lessThan;
		varsPrimitive['equality'] = equality;
		varsPrimitive['k'] = k;
		varsPrimitive['c'] = c;
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			qn5: '2015 Paper 1 Question 1 Variant',
			qn6: '2016 Paper 1 Question 1 Variant',
			qn8: '2018 Paper 1 Question 4 Variant',
			qn9: '2019 Paper 1 Question 4 Variant',
		},
	};
}
