//import { Polynomial } from 'mathlify';
//import { bisection, cubicRoot } from 'mathlify/numerical';
import { writeFileSync } from 'node:fs';

let count = 0;

// f(x) = ln (cx + a) + b
// we want two roots to ln (cx + a) + b = x
// consider x - (b + ln (cx + a)) = 0
// the turning point for this occurs at xMid = (c - a) / c
// want the roots between -5 and 5
// so we want signs at x1, xMid to be different, and xMid, x2 to be different
// the current code gives 45 combinations that satisfy the above criteria

const coeffs: { a: number; b: number; c: number }[] = [];
const vars = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
for (const c of [1, 2, 3, 4]) {
	for (const a of vars) {
		for (const b of vars) {
			const f = (x: number) => x - (Math.log(c * x + a) + b);
			const x1 = Math.max(-5, -a / c + 0.1);
			const x2 = 5;
			const xMid = (c - a) / c; // turning point in the
			count++;
			if (f(x1) * f(xMid) < 0 && f(xMid) * f(x2) < 0) {
				coeffs.push({ a, b, c });
			}
		}
	}
}
console.log(coeffs.length, count);
writeFileSync('./src/content/learn/h2/fns/02-inverse/05-log-coeffs.json', JSON.stringify(coeffs));

//for (const { a, b, c } of coeffs) {
//	const g = (x: number) => (Math.exp(x - b) - a) / c - x;
//	const x1 = -5;
//	const x2 = 5;
//	const xMid = (c - a) / c;
//	const root1 = bisection(g, x1, xMid);
//	const root2 = bisection(g, xMid, x2);
//	console.log(root1, root2, a, b, c);
//}

//const cs = {
//	1: [1],
//	2: [1, 2],
//	3: [1, 2],
//	4: [1, 2, 3],
//};
//const ds = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
//for (const [c, bArr] of Object.entries(cs)) {
//	for (const b of bArr) {
//		for (const d of ds) {
//			count = count + 2;
//			const poly1 = new Polynomial([1, b, Number(c) - 1, d]);
//			const root1 = cubicRoot(poly1);
//			const poly2 = new Polynomial([1, -b, Number(c), d]);
//			const root2 = cubicRoot(poly2);
//			console.log(`${root1}, ${root2}`);
//		}
//	}
//}
