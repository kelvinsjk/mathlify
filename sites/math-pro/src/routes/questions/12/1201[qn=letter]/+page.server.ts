import { heads, getRandomVec, getRandomInt, getNiceVec } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		let x = getRandomInt(-5, 5);
		let y = getRandomInt(-5, 5);
		let z = getRandomInt(-5, 5);
		while (x === 0 && y === 0 && z === 0) {
			x = getRandomInt(-5, 5);
			y = getRandomInt(-5, 5);
			z = getRandomInt(-5, 5);
		}
		varsPrimitive['x'] = x;
		varsPrimitive['y'] = y;
		varsPrimitive['z'] = z;
		varsPrimitive['ijkMode'] = heads();
	} else if (qn === 'b') {
		const a = getNiceVec();
		varsJSON['a'] = JSON.stringify(a);
		varsPrimitive['ijkMode'] = heads();
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'c') {
		let a = getRandomVec({ simplify: true });
		while (a.x.isEqualTo(0)) {
			a = getRandomVec({ simplify: true });
		}
		varsJSON['a'] = JSON.stringify(a);
		varsPrimitive['k'] = getRandomInt(-9, 9, { avoid: [0, 1] });
		varsPrimitive['ijkMode'] = heads();
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'd') {
		const a = getRandomVec();
		let b = getRandomVec();
		while (a.isParallelTo(b)) {
			b = getRandomVec();
		}
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
		varsPrimitive['ijkMode'] = heads();
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'e') {
		let a = getRandomVec({ simplify: true });
		let b = getRandomVec({ simplify: true });
		while (a.x.isEqualTo(b.x)) {
			a = getRandomVec({ simplify: true });
			b = getRandomVec({ simplify: true });
		}
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
		varsPrimitive['k'] = getRandomInt(-9, 9, { avoid: [0, 1] });
	} else if (qn === 'f') {
		let a = getRandomVec({ simplify: true });
		let b = getRandomVec({ simplify: true });
		while (a.isParallelTo(b)) {
			a = getRandomVec({ simplify: true });
			b = getRandomVec({ simplify: true });
		}
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
		varsPrimitive['lambda'] = getRandomInt(1, 5);
		varsPrimitive['mu'] = getRandomInt(1, 5);
		varsPrimitive['total'] = heads();
		varsPrimitive['variant'] = getRandomInt(1, 2);
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: 'Vector Magnitude',
			b: 'Unit Vectors',
			c: 'Parallel Vectors',
			d: 'Position Vectors',
			e: 'Collinear Points',
			f: 'Ratio Theorem',
		},
	};
}
