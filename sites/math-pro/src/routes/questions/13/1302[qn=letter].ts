import { getRandomVec, getRandomInt, Line, getRandomPerps, Vector } from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a' || qn === 'b') {
		const a1 = getRandomVec({ nonzero: false });
		const d1 = getRandomVec({ simplify: true });
		const l1 = new Line(a1, d1);
		const lambda = getRandomInt(-3, 3, { avoid: [0] });
		const mu = getRandomInt(-3, 3, { avoid: [0] });
		const d2 = getRandomVec({ avoid: [d1], avoidParallel: true, simplify: true });
		const a2 = l1.point(lambda).minus(d2.multiply(mu));
		varsJSON['a1'] = JSON.stringify(a1);
		varsJSON['d1'] = JSON.stringify(d1);
		varsJSON['a2'] = JSON.stringify(a2);
		varsJSON['d2'] = JSON.stringify(d2);
	} else if (qn === 'c') {
		const a = getRandomVec({ nonzero: false });
		const b = getRandomVec({ nonzero: false, avoid: [a] });
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
	} else if (qn === 'd') {
		const a = getRandomVec({ nonzero: false });
		const b = getRandomVec({ avoid: [a] });
		const ab = b.minus(a);
		const d = getRandomVec({ avoid: [ab], avoidParallel: true, simplify: true });
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
		varsJSON['d'] = JSON.stringify(d);
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'e') {
		const a = getRandomVec({ nonzero: false });
		const [d, n] = getRandomPerps();
		const lambda = getRandomInt(-3, 3, { avoid: [0] });
		const mu = getRandomInt(-3, 3, { avoid: [0] });
		const b = a.plus(d.multiply(lambda)).plus(n.multiply(mu));
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
		varsJSON['d'] = JSON.stringify(d);
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'f') {
		const a1 = getRandomVec({ nonzero: false });
		const d1 = getRandomVec({ simplify: true });
		const l1 = new Line(a1, d1);
		const variant = getRandomInt(1, 3);
		let a2: Vector, d2: Vector;
		if (variant === 1) {
			// parallel
			d2 = d1.multiply(getRandomInt(-3, 3, { avoid: [0] }));
			a2 = getRandomVec({ nonzero: false, avoid: [a1] });
			while (l1.contains(a2)) {
				a2 = getRandomVec({ nonzero: false, avoid: [a1] });
			}
		} else if (variant === 2) {
			// intersection
			const lambda = getRandomInt(-3, 3, { avoid: [0] });
			const mu = getRandomInt(-3, 3, { avoid: [0] });
			d2 = getRandomVec({ avoid: [d1], avoidParallel: true, simplify: true });
			a2 = l1.point(lambda).minus(d2.multiply(mu));
		} else {
			// skew
			a2 = getRandomVec({ nonzero: false, avoid: [a1] });
			d2 = getRandomVec({ avoid: [d1], avoidParallel: true, simplify: true });
			let l2 = new Line(a2, d2);
			while (!l2.isSkewTo(l1)) {
				a2 = getRandomVec({ nonzero: false, avoid: [a1] });
				d2 = getRandomVec({ avoid: [d1], avoidParallel: true, simplify: true });
				l2 = new Line(a2, d2);
			}
		}
		varsJSON['a1'] = JSON.stringify(a1);
		varsJSON['d1'] = JSON.stringify(d1);
		varsJSON['a2'] = JSON.stringify(a2);
		varsJSON['d2'] = JSON.stringify(d2);
		varsPrimitive['relationship'] = variant;
	}

	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				a: 'Angle between Lines',
				b: 'Point of Intersection of Lines',
				c: 'Distance between Points',
				d: 'Perpendicular Distance between Lines',
				e: 'Foot of Perpendicular and Reflection in Lines',
				f: 'Relationship between Lines',
			},
		},
	};
}
