import { getRandomVec, getRandomInt, Vector, Line, Plane, getRandomPerp, Fraction } from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const a1 = getRandomVec({ nonzero: false });
		const d1 = getRandomVec();
		const l1 = new Line(a1, d1);
		const lambda = getRandomInt(-3, 3, { avoid: [0] });
		const a2 = l1.point(lambda);
		const n1 = getRandomVec({ simplify: true });
		let n2 = getRandomVec({ simplify: true, avoid: [n1], avoidParallel: true });
		while (n2.isPerpendicularTo(d1)) {
			n2 = getRandomVec({ simplify: true, avoid: [n1], avoidParallel: true });
		}
		varsJSON['a1'] = JSON.stringify(a1);
		varsJSON['d1'] = JSON.stringify(d1);
		varsJSON['a2'] = JSON.stringify(a2);
		varsJSON['n2'] = JSON.stringify(n2);
		varsJSON['n1'] = JSON.stringify(n1);
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'b') {
		const a1 = getRandomVec({ nonzero: false });
		const d1 = getRandomVec();
		const l1 = new Line(a1, d1);
		const lambda = getRandomInt(-3, 3, { avoid: [0] });
		const a2 = l1.point(lambda);
		const n1 = getRandomVec({ simplify: true });
		let n2 = getRandomVec({ simplify: true, avoid: [n1], avoidParallel: true });
		while (n2.isPerpendicularTo(d1)) {
			n2 = getRandomVec({ simplify: true, avoid: [n1], avoidParallel: true });
		}
		const rhs = new Fraction(getRandomInt(-5, 5));
		varsJSON['a1'] = JSON.stringify(a1);
		varsJSON['d1'] = JSON.stringify(d1);
		varsJSON['a2'] = JSON.stringify(a2);
		varsJSON['n2'] = JSON.stringify(n2);
		varsJSON['n1'] = JSON.stringify(n1);
		varsJSON['rhs'] = JSON.stringify(rhs);
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'c') {
		const a = getRandomVec({ nonzero: false });
		const n = getRandomVec({ simplify: true });
		const d = getRandomPerp(n);
		const p = new Plane(n, { mode: 'ptN', v2: a });
		let b = getRandomVec({ avoid: [a] });
		while (p.contains(b)) {
			b = getRandomVec({ avoid: [a] });
		}
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
		varsJSON['n'] = JSON.stringify(n);
		varsJSON['d'] = JSON.stringify(d);
		varsPrimitive['type'] = getRandomInt(1, 3);
	} else if (qn === 'd') {
		const f = getRandomVec({ nonzero: false });
		const n = getRandomVec({ simplify: true });
		const lambda = getRandomInt(-3, 3);
		const b = f.plus(n.multiply(lambda));
		varsJSON['f'] = JSON.stringify(f);
		varsJSON['b'] = JSON.stringify(b);
		varsJSON['n'] = JSON.stringify(n);
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'e') {
		const a = getRandomVec({ nonzero: false });
		const d = getRandomVec({ simplify: true });
		const relationship = getRandomInt(1, 3);
		let n: Vector;
		if (relationship === 1) {
			// intersecting
			n = getRandomVec({ simplify: true });
			while (n.isParallelTo(d)) {
				n = getRandomVec({ simplify: true });
			}
		} else {
			// in
			n = getRandomPerp(d);
		}
		const rhs = relationship === 3 ? a.dot(n).plus(getRandomInt(-3, 3, { avoid: [0] })) : a.dot(n);
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['d'] = JSON.stringify(d);
		varsJSON['n'] = JSON.stringify(n);
		varsJSON['rhs'] = JSON.stringify(rhs);
		varsPrimitive['relationship'] = relationship;
	} else if (qn === 'f') {
		const relationship = getRandomInt(1, 3); // 1: same, 2: parallel, 3: intersecting
		const n1 = getRandomVec({ simplify: true });
		const n2 = getRandomVec({ simplify: true, avoid: [n1], avoidParallel: true });
		const rhs1 = getRandomInt(-9, 9);
		const rhs2 = getRandomInt(-9, 9, { avoid: [rhs1] });
		const k = getRandomInt(-9, 9, { avoid: [0] });
		varsJSON['n1'] = JSON.stringify(n1);
		varsJSON['n2'] = JSON.stringify(n2);
		varsPrimitive['rhs1'] = rhs1;
		varsPrimitive['rhs2'] = rhs2;
		varsPrimitive['k'] = k;
		varsPrimitive['relationship'] = relationship;
	}

	return {
		body: {
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
		},
	};
}
