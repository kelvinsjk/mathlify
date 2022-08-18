import {
	getRandomVec,
	getRandomInt,
	getRandomFrac,
	heads,
	Fraction,
	Vector,
	Line,
	Plane,
} from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === '7') {
		const a = getRandomVec({ simplify: true });
		const b = getRandomVec({ simplify: true, avoid: [a] });
		const d = b.minus(a);
		const n = getRandomVec({ simplify: true, avoid: [d], avoidParallel: true, avoidPerp: true });
		const lambda = getRandomFrac({ numRange: [-3, 3], denRange: [1, 2], avoid: [0, 1] });
		varsJSON['lambda'] = JSON.stringify(lambda);
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
		varsJSON['n'] = JSON.stringify(n);
	} else if (qn === '8') {
		const denom = getRandomInt(1, 12);
		const num = getRandomInt(1, denom) * (heads() ? 1 : -1);
		const lambdaLine = new Fraction(num, denom);
		const a = getRandomVec({ min: -2, max: 2 });
		const dX = getRandomInt(-2, 2, { avoid: [0] });
		const dY = getRandomInt(-2, 2, { avoid: [0] });
		const dZ = getRandomInt(-2, 2, { avoid: [0] });
		const d = new Vector(dX, dY, dZ, { stretchable: true });
		const l = new Line(a, d);
		const x = l.point(lambdaLine);
		let b = getRandomVec();
		while (l.contains(b)) {
			b = getRandomVec();
		}
		// plane 1
		const d2 = getRandomVec({ avoid: [d], avoidParallel: true });
		const n1 = d.cross(d2);
		const rhs1 = a.dot(n1);
		// plane 2
		const d3 = getRandomVec({ avoid: [n1], avoidPerp: true });
		const n2 = d.cross(d3);
		const rhs2 = a.dot(n2);
		// plane 3
		const nX = getRandomInt(-6, 6, { avoid: [0] });
		const nZ = getRandomInt(-18, 18, { avoid: [0] });
		let numY = getRandomInt(-210, 210, { avoid: [0] });
		let n3Ten = new Vector(nX * 10, numY, nZ * 10);
		let dot = x.multiply(denom).dot(n3Ten);
		while (dot.num % denom !== 0) {
			numY = numY === -1 ? 1 : numY + 1;
			n3Ten = new Vector(nX * 10, numY, nZ * 10);
			dot = x.multiply(denom).dot(n3Ten);
		}
		const n3 = n3Ten.divide(10);
		const rhs3 = x.dot(n3);
		varsJSON['n1'] = JSON.stringify(n1);
		varsJSON['n2'] = JSON.stringify(n2);
		varsJSON['n3'] = JSON.stringify(n3);
		varsJSON['rhs1'] = JSON.stringify(rhs1);
		varsJSON['rhs2'] = JSON.stringify(rhs2);
		varsJSON['rhs3'] = JSON.stringify(rhs3);
	} else if (qn === '9') {
		const n1 = getRandomVec({ min: -3, max: 3, simplify: true });
		const n2 = getRandomVec({ min: -3, max: 3, simplify: true, avoid: [n1], avoidParallel: true });
		const rhs1 = getRandomInt(-3, 3, { avoid: [0] });
		const rhs2 = getRandomInt(-3, 3, { avoid: [0] });
		let a = getRandomVec({ min: -3, max: 3, nonzero: false });
		const p1 = new Plane(n1, { rhs: rhs1 });
		const p2 = new Plane(n2, { rhs: rhs2 });
		while (p1.contains(a) || p2.contains(a)) {
			a = getRandomVec({ min: -3, max: 3, nonzero: false });
		}
		varsJSON['n1'] = JSON.stringify(n1);
		varsJSON['n2'] = JSON.stringify(n2);
		varsJSON['a'] = JSON.stringify(a);
		varsPrimitive['rhs1'] = rhs1;
		varsPrimitive['rhs2'] = rhs2;
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			qn7: '2007 Paper 1 Question 8 Variant',
			qn8: '2008 Paper 1 Question 11 Variant',
			qn9: '2009 Paper 1 Question 10 Variant',
		},
	};
}
