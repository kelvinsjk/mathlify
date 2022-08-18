import {
	getRandomVec,
	getRandomInt,
	getRandomFrac,
	getNiceVec,
	Vector,
	Line,
	Plane,
	getRandomPerp,
} from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '0') {
		// set up
		let { pt, n, k } = {
			pt: getRandomVec({ min: -10, max: 10 }),
			n: getRandomVec({ min: -3, max: 3, simplify: true }),
			k: getRandomInt(-3, 3, { avoid: [0] }),
		};
		let d = n.multiply(k);
		let l = new Line(pt, d);
		while (l.distanceTo(Vector.ZERO).valueOf() <= 1) {
			// so that part iv answer >= 1
			pt = getRandomVec({ min: -10, max: 10 });
			n = getRandomVec({ min: -3, max: 3, simplify: true });
			k = getRandomInt(-3, 3, { avoid: [0] });
			d = n.multiply(k);
			l = new Line(pt, d);
		}
		const lambda1 = getRandomFrac({ numRange: [-3, 3], denRange: [1, 2], avoid: [0] });
		const x = l.point(lambda1);
		const rhs = x.dot(n);
		const avoid = lambda1.isInteger() ? [lambda1.num, 0] : [0];
		const lambda = getRandomInt(-5, 5, { avoid });

		varsJSON['pt'] = JSON.stringify(pt);
		varsJSON['n'] = JSON.stringify(n);
		varsJSON['rhs'] = JSON.stringify(rhs);
		varsPrimitive['k'] = k;
		varsPrimitive['lambda'] = lambda;
	} else if (qn === '1') {
		const aGen = getRandomVec({ min: -2, max: 2 });
		const dGen1 = getRandomVec({ min: -2, max: 2, simplify: true });
		const dGen2 = getRandomVec({
			min: -2,
			max: 2,
			simplify: true,
			avoid: [dGen1],
			avoidParallel: true,
		});
		// get pts 1, 2, 3 by getting parameters
		const s1 = getRandomInt(-5, 5);
		const t1 = getRandomInt(-5, 5);
		const pt1 = aGen.plus(dGen1.multiply(s1)).plus(dGen2.multiply(t1));
		let s2 = getRandomInt(-5, 5);
		let t2 = getRandomInt(-5, 5);
		let pt2 = aGen.plus(dGen1.multiply(s2)).plus(dGen2.multiply(t2));
		while (pt1.isEqualTo(pt2)) {
			s2 = getRandomInt(-5, 5);
			t2 = getRandomInt(-5, 5);
			pt2 = aGen.plus(dGen1.multiply(s2)).plus(dGen2.multiply(t2));
		}
		const lGen = new Line(pt1, dGen1);
		let s3 = getRandomInt(-5, 5);
		let t3 = getRandomInt(-5, 5);
		let pt3 = aGen.plus(dGen1.multiply(s3)).plus(dGen2.multiply(t3));
		while (lGen.contains(pt3)) {
			s3 = getRandomInt(-5, 5);
			t3 = getRandomInt(-5, 5);
			pt3 = aGen.plus(dGen1.multiply(s3)).plus(dGen2.multiply(t3));
		}
		const p = new Plane(pt1, { mode: 'ptPtPt', v2: pt2, v3: pt3 });
		// generate l1 which lies in p
		let s4 = getRandomInt(-5, 5);
		let t4 = getRandomInt(-5, 5);
		let a1 = aGen.plus(dGen1.multiply(s4)).plus(dGen2.multiply(t4));
		while (pt1.isEqualTo(a1) || pt2.isEqualTo(a1) || pt3.isEqualTo(a1)) {
			s4 = getRandomInt(-5, 5);
			t4 = getRandomInt(-5, 5);
			a1 = aGen.plus(dGen1.multiply(s4)).plus(dGen2.multiply(t4));
		}
		const d1 = getRandomPerp(p.n, { simplify: true });
		const l1 = new Line(a1, d1);
		// generate l2 (non-parallel, non-perpendicular to p) which intersects l1
		let d2 = getRandomVec({ min: -7, max: 7, simplify: true });
		const d1XY = new Vector(d1.x, d1.y);
		let d2XY = new Vector(d2.x, d2.y);
		// z must be non-zero to find unknown k. x,y non-zero for simplicity
		while (
			d2.z.isEqualTo(0) ||
			d2.x.isEqualTo(0) ||
			d2.y.isEqualTo(0) ||
			d2.isParallelTo(p.n) ||
			d2.isPerpendicularTo(p.n) ||
			d2XY.isParallelTo(d1XY)
		) {
			d2 = getRandomVec({ min: -7, max: 7, simplify: true });
			d2XY = new Vector(d2.x, d2.y);
		}
		const lambda = getRandomInt(-5, 5, { avoid: [0] });
		const mu = getRandomInt(-5, 5, { avoid: [0] });
		const a2 = l1.point(lambda).minus(d2.multiply(mu));
		varsJSON['pt1'] = JSON.stringify(pt1);
		varsJSON['pt2'] = JSON.stringify(pt2);
		varsJSON['pt3'] = JSON.stringify(pt3);
		varsJSON['a1'] = JSON.stringify(a1);
		varsJSON['a2'] = JSON.stringify(a2);
		varsJSON['d1'] = JSON.stringify(d1);
		varsJSON['d2'] = JSON.stringify(d2);
	} else if (qn === '2') {
		const a = getRandomVec({ min: -9, max: 9 });
		const d = getRandomVec({ min: -2, max: 2, simplify: true });
		const lambda1 = getRandomInt(-9, 9, { avoid: [0, 1, -1] });
		const b = a.plus(d.multiply(lambda1));
		const l = new Line(a, b, { twoPointsMode: true });
		const lambda2 = Math.sign(lambda1) * getRandomInt(1, Math.abs(lambda1) - 1);
		const n = l.point(lambda2);
		const perp = getRandomPerp(l.d, { min: -2, max: 2, simplify: true });
		const mu = getRandomInt(-4, 4, { avoid: [0] });
		const c = n.plus(perp.multiply(mu));
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
		varsJSON['c'] = JSON.stringify(c);
	} else if (qn === '3') {
		const n1 = getNiceVec({ max: 9 });
		let n2 = getNiceVec({ max: 9 });
		// ensure two answers for c
		while (
			n1.isParallelTo(n2) ||
			n1.isPerpendicularTo(n2) ||
			n1.multiply(n2.magnitude().coeff).plus(n2.multiply(n1.magnitude().coeff)).z.isEqualTo(0) ||
			n1.multiply(n2.magnitude().coeff).minus(n2.multiply(n1.magnitude().coeff)).z.isEqualTo(0)
		) {
			n2 = getNiceVec({ max: 7 });
		}
		const rhs1 = getRandomInt(-5, 5);
		const rhs2 = getRandomInt(-5, 5, { avoid: [0] });
		const aX = getRandomInt(-5, 5);
		const aY = getRandomInt(-5, 5);
		varsJSON['n1'] = JSON.stringify(n1);
		varsJSON['n2'] = JSON.stringify(n2);
		varsPrimitive['rhs1'] = rhs1;
		varsPrimitive['rhs2'] = rhs2;
		varsPrimitive['aX'] = aX;
		varsPrimitive['aY'] = aY;
	} else if (qn === '4') {
		let dPrime = getRandomVec({ min: -4, max: 4, simplify: true });
		while (dPrime.magnitudeSquare().isGreaterThan(21)) {
			dPrime = getRandomVec({ min: -4, max: 4, simplify: true });
		}
		const nQ = getRandomPerp(dPrime);
		// intersection pt
		const x = getRandomInt(-6, 6, { avoid: [0] });
		const y = getRandomInt(-5, 5, { avoid: [0] });
		const xVec = new Vector(x, y);
		const n = nQ.cross(dPrime).simplify({ stretchable: true });
		const rhs = xVec.dot(n);
		let d = getRandomPerp(nQ);
		while (d.isParallelTo(n) || d.isParallelTo(dPrime)) {
			d = getRandomPerp(nQ);
		}
		const a = xVec.plus(d);
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['dPrime'] = JSON.stringify(dPrime);
		varsJSON['nQ'] = JSON.stringify(nQ);
		varsJSON['rhs'] = JSON.stringify(rhs);
		varsJSON['d'] = JSON.stringify(d);
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			qn0: '2010 Paper 1 Question 10 Variant',
			qn1: '2011 Paper 1 Question 11 Variant',
			qn2: '2012 Paper 1 Question 9 Variant',
			qn3: '2013 Paper 2 Question 4 Variant',
			qn4: '2014 Paper 1 Question 9 Variant',
		},
	};
}
