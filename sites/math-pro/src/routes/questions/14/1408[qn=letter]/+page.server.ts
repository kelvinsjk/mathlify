import { getRandomInt, heads } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const x = getRandomInt(-2, 2, { avoid: [0] });
		const k = getRandomInt(-2, 3) * 2 - 1; // z3 = k/2
		// if |x|=1, y = 2,3,5,6,7. if |x|=2, y = 2,3,5.
		let y = Math.abs(x) === 1 ? getRandomInt(2, 6) : getRandomInt(2, 4);
		if (y > 3) {
			// 4,5,6 -> 5,6,7
			y = y + 1;
		}
		varsPrimitive['x'] = x;
		varsPrimitive['y'] = y;
		varsPrimitive['k'] = k;
	} else if (qn === 'b') {
		const wOnTop = heads();
		const condition = getRandomInt(1, 4); // 1: real and postive, 2: real and negative, 3: real, 4: imaginary
		const n =
			condition === 1
				? getRandomInt(2, 8)
				: condition === 2
				? getRandomInt(2, 5)
				: condition === 3
				? getRandomInt(2, 4)
				: getRandomInt(2, 3);
		varsPrimitive['wOnTop'] = wOnTop;
		varsPrimitive['condition'] = condition;
		varsPrimitive['n'] = n;
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: '2008 Paper 1 Question 8 Variant',
			b: '2008 Paper 2 Question 3 Variant',
		},
	};
}
