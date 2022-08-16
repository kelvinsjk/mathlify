import {
	getRandomVec,
	getRandomInt,
	Vector,
	getNiceVec,
	Line,
	getRandomPerp,
	Fraction,
	getRandomFrac,
	cramersFrac,
	shuffle,
	Plane,
} from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '5') {
		const [a, d, p] = generateQn5();
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['d'] = JSON.stringify(d);
		varsJSON['p'] = JSON.stringify(p);
	} else if (qn === '6') {
		const a1 = getRandomVec();
		const a2 = getRandomVec();
		const distance = getRandomInt(1, 12);
		const n = getNiceVec({ max: 9 });
		let dp1 = getRandomPerp(n);
		while (dp1.z.times(n.y).minus(dp1.y.times(n.z)).isEqualTo(0)) {
			dp1 = getRandomPerp(n);
		}
		let dp2 = getRandomPerp(n);
		while (dp1.isParallelTo(dp2)) {
			dp2 = getRandomPerp(n);
		}
		varsJSON['a1'] = JSON.stringify(a1);
		varsJSON['a2'] = JSON.stringify(a2);
		varsPrimitive['distance'] = distance;
		varsJSON['dp1'] = JSON.stringify(dp1);
		varsJSON['dp2'] = JSON.stringify(dp2);
		varsJSON['n'] = JSON.stringify(n);
	} else if (qn === '7') {
		const { d, p, q } = generateQn7();
		varsJSON['d'] = JSON.stringify(d);
		varsJSON['p'] = JSON.stringify(p);
		varsJSON['q'] = JSON.stringify(q);
	} else if (qn === '8') {
		const x = getRandomInt(2, 5);
		const y = getRandomInt(2, 5);
		const zs = shuffle([0, 1, 2]);
		const v1 = new Vector(x, y, zs[0]);
		const v2 = new Vector(x, -y, zs[1]);
		const v3 = new Vector(-x, y, zs[2]);
		const vs = shuffle([v1, v2, v3]);
		varsJSON['a'] = JSON.stringify(vs[0]);
		varsJSON['b'] = JSON.stringify(vs[1]);
		varsJSON['c'] = JSON.stringify(vs[2]);
		varsPrimitive['eZ'] = getRandomInt(4, 10);
	} else if (qn === '9') {
		const { p, n, s, d, rhs1, rhs2 } = generateQn9();
		varsJSON['p'] = JSON.stringify(p);
		varsJSON['n'] = JSON.stringify(n);
		varsJSON['s'] = JSON.stringify(s);
		varsJSON['d'] = JSON.stringify(d);
		varsPrimitive['rhs1'] = rhs1;
		varsPrimitive['rhs2'] = rhs2;
	}

	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				qn5: '2015 Paper 2 Question 2 Variant',
				qn6: '2016 Paper 1 Question 11 Variant',
				qn7: '2017 Paper 1 Question 10 Variant',
				qn8: '2018 Paper 2 Question 3 Variant',
				qn9: '2019 Paper 1 Question 12 Variant',
			},
		},
	};
}

function generateQn5(): [Vector, Vector, Vector] {
	const a = getRandomVec();
	let d = getNiceVec({ max: 7 });
	while (d.isParallelTo(Vector.I)) {
		d = getNiceVec({ max: 7 });
	}
	const l = new Line(a, d);
	let p = getRandomVec({ min: -6, max: 6 });
	while (l.contains(p)) {
		p = getRandomVec({ min: -6, max: 6 });
	}
	const lambda = p.minus(a).dot(d).divide(d.magnitudeSquare());
	if (lambda.den > 9) {
		return generateQn5();
	}
	return [a, d, p];
}

function generateQn7(): { d: Vector; p: Vector; q: Vector } {
	let d = getRandomVec({ min: -3, max: 3, simplify: true });
	while (d.x.isEqualTo(0) && d.y.isEqualTo(0)) {
		d = getRandomVec({ min: -3, max: 3, simplify: true });
	}
	// foot of perpendicular (to generate p)
	const n = getRandomPerp(d);
	const lambda = getRandomFrac({ numRange: [-3, 3], denRange: [1, 2], avoid: [0] });
	const r = d.multiply(lambda);
	// ensure p has integral components
	const p =
		r.x.den === 2 || r.y.den === 2 || r.z.den === 2
			? r.plus(n.multiply(new Fraction(1, 2)))
			: r.plus(n);
	if (p.x.den === 2 || p.y.den === 2 || p.z.den === 2) {
		return generateQn7();
	}
	// generate q
	let q = getRandomVec({ min: -7, max: 7, avoid: [p, d], avoidParallel: true });
	let pq = q.minus(p);
	//const l1 = new Line(Vector.ZERO, d);
	//let l2 = new Line(p, pq);
	// ensure lambda, mu can be solved
	while (d.x.times(pq.y.negative()).minus(d.y.times(pq.x.negative())).isEqualTo(0)) {
		q = getRandomVec({ min: -7, max: 7, avoid: [p, d], avoidParallel: true });
		pq = q.minus(p);
		//l2 = new Line(p, pq);
	}
	const [lambda1, mu1] = cramersFrac(d.x, pq.x.negative(), p.x, d.y, pq.y.negative(), p.y);
	if (mu1.isEqualTo(0)) {
		return generateQn7();
	}
	// ensure 90 degrees is not possible
	const det = d
		.dot(p)
		.plus(d.dot(q))
		.square()
		.minus(d.magnitudeSquare().times(4).times(p.dot(q)));
	if (det.isAtLeast(0)) {
		return generateQn7();
	}
	// ensure lines don't meet
	const aAvoid = lambda1.times(d.z).minus(p.z).plus(p.z.times(mu1)).divide(mu1);
	if (aAvoid.isEqualTo(q.z)) {
		return generateQn7();
	}

	return { d, p, q };
}

function generateQn9(): {
	n: Vector;
	d: Vector;
	p: Vector;
	s: Vector;
	rhs1: number;
	rhs2: number;
} {
	const p = getRandomVec();
	const n = getRandomVec({ min: -2, max: 2, simplify: true });
	let d = getRandomVec({ min: -6, max: 6, simplify: true, avoid: [n], avoidPerp: true });
	if (d.dot(n).isGreaterThan(0)) {
		d = d.negative();
	}
	const lambda = getRandomInt(1, 5);
	const mu = getRandomInt(-5, -1);
	const s = p.plus(d.multiply(lambda)).plus(n.multiply(mu));
	const rhsP = p.dot(n);
	const rhsS = s.dot(n);
	let rhs1: number;
	let rhs2: number;
	if (rhsP.isLessThan(rhsS)) {
		const rhsFloor = rhsP.plus(1).num;
		const rhsCeil = rhsS.minus(1).num;
		if (rhsCeil - rhsFloor < 1) {
			return generateQn9();
		}
		const rhsA = getRandomInt(rhsFloor, rhsCeil);
		const rhsB = getRandomInt(rhsFloor, rhsCeil, { avoid: [rhsA] });
		rhs1 = Math.min(rhsA, rhsB);
		rhs2 = Math.max(rhsA, rhsB);
	} else {
		const rhsFloor = rhsS.plus(1).num;
		const rhsCeil = rhsP.minus(1).num;
		if (rhsCeil - rhsFloor < 1) {
			return generateQn9();
		}
		const rhsA = getRandomInt(rhsFloor, rhsCeil);
		const rhsB = getRandomInt(rhsFloor, rhsCeil, { avoid: [rhsA] });
		rhs2 = Math.min(rhsA, rhsB);
		rhs1 = Math.max(rhsA, rhsB);
	}
	const p1 = new Plane(n, { rhs: rhs1 });
	const p2 = new Plane(n, { rhs: rhs2 });

	const l1 = new Line(p, d);
	const l2 = new Line(s, d);
	const lambda1 = p1.intersectLineParam(l1);
	const mu1 = p2.intersectLineParam(l2);
	const q = p1.intersect(l1) as Vector;
	const r = p2.intersect(l2) as Vector;
	const qr = r.minus(q);
	const theta = Number(d.angleTo(n, { acute: true }).replace('^\\circ', ''));
	const beta = Number(qr.angleTo(n, { acute: true }).replace('^\\circ', ''));
	const k = Math.sin(theta) / Math.sin(beta);
	if (lambda1.den > 12 || mu1.den > 12 || theta <= beta || qr.isParallelTo(n) || k > 38.5) {
		return generateQn9();
	}
	return { p, n, s, d, rhs1, rhs2 };
}
