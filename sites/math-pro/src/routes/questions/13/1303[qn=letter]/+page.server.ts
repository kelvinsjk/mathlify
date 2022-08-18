import { getRandomVec, getRandomInt, Line, Plane, heads } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const a = getRandomVec({ nonzero: false });
		const n = getRandomVec();
		const b = getRandomVec({ nonzero: false });
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
		varsJSON['n'] = JSON.stringify(n);
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'b') {
		const a1 = getRandomVec({ nonzero: false });
		const d1 = getRandomVec({ simplify: true });
		const d2 = getRandomVec({ avoid: [d1], avoidParallel: true, simplify: true });
		varsJSON['a1'] = JSON.stringify(a1);
		varsJSON['d1'] = JSON.stringify(d1);
		varsJSON['d2'] = JSON.stringify(d2);
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'c') {
		const a1 = getRandomVec({ nonzero: false });
		const d1 = getRandomVec();
		const l1 = new Line(a1, d1);
		let a2 = getRandomVec({ nonzero: false });
		while (l1.contains(a2)) {
			a2 = getRandomVec({ nonzero: false });
		}
		varsJSON['a1'] = JSON.stringify(a1);
		varsJSON['a2'] = JSON.stringify(a2);
		varsJSON['d1'] = JSON.stringify(d1);
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'd') {
		const a1 = getRandomVec({ nonzero: false });
		const a2 = getRandomVec({ nonzero: false, avoid: [a1] });
		const l1 = new Line(a1, a2, { twoPointsMode: true });
		let a3 = getRandomVec({ nonzero: false, avoid: [a1, a2] });
		while (l1.contains(a3)) {
			a3 = getRandomVec({ nonzero: false, avoid: [a1, a2] });
		}
		const p1 = new Plane(a1, { mode: 'ptPtPt', v2: a2, v3: a3 });
		let a4 = getRandomVec({ nonzero: false, avoid: [a1, a2, a3] });
		while (p1.contains(a4)) {
			a4 = getRandomVec({ nonzero: false, avoid: [a1, a2, a3] });
		}
		varsJSON['a1'] = JSON.stringify(a1);
		varsJSON['a2'] = JSON.stringify(a2);
		varsJSON['a3'] = JSON.stringify(a3);
		varsJSON['a4'] = JSON.stringify(a4);
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'e') {
		const a1 = getRandomVec({ nonzero: false });
		const d1 = getRandomVec({ simplify: true });
		const d2 = getRandomVec({ avoid: [d1], avoidParallel: true, simplify: true });
		varsJSON['a1'] = JSON.stringify(a1);
		varsJSON['d1'] = JSON.stringify(d1);
		varsJSON['d2'] = JSON.stringify(d2);
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'f') {
		const a = getRandomVec({ nonzero: false });
		const n = getRandomVec({ simplify: true });
		const rhs = heads() ? a.dot(n) : a.dot(n).plus(getRandomInt(-3, 3, { avoid: [0] }));
		varsPrimitive['variant'] = getRandomInt(1, 2);
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['n'] = JSON.stringify(n);
		varsJSON['rhs'] = JSON.stringify(rhs);
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: 'Equation of a Plane from the Normal Vector',
			b: 'Equation of a Plane from Direction Vectors',
			c: 'Equation of a Plane from III',
			d: 'Equation of a Plane from IV',
			e: 'Cartesian and Vector Equation of a Plane',
			f: 'Relationship between a Point and a Plane',
		},
	};
}
