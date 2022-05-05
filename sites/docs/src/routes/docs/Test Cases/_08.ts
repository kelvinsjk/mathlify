import { math } from 'mathlifier';
import { PowerFn, PolynomialFn } from '../../../lib/utils/mathlify/calculus';
import { Fraction, getRandomInt, NthRoot } from 'mathlify';

export function p1q1(): [string, string, string] {
	const [ans1] = p1q1Qn({ n: 2, b: 2, k: 1 });
	const [ans2, [n, b, k]] = p1q1Qn();
	const qn = `The area of the region bounded by the curve ${math(`y=x^${n}, `)}
    the lines ${math(`x=${k}, `)} ${math(`x=${b}`)} and the ${math(`x\\textrm{-}`)}axis
    is equal to the area of the region bounded by the curve, the lines ${math(`y=a,`)}
    ${math(`y=${Math.pow(b, n)}`)} and the ${math(`y\\textrm{-}`)}axis, where
    ${math(`a < ${Math.pow(b, n)}.`)} Find the value of ${math(`a.`)}
  `;
	return [ans1, qn, ans2];
}

function p1q1Qn(variables?: {
	n?: number;
	b?: number;
	k?: number;
}): [string, [number, number, number]] {
	// setup
	const bMax: { [key: number]: number } = {
		2: 9,
		3: 4,
		4: 3,
		5: 2,
		6: 2
	};
	const n = variables?.n ?? getRandomInt(2, 6);
	const b = variables?.b ?? getRandomInt(2, bMax[n]);
	const k = variables?.k ?? getRandomInt(1, b - 1);

	// calculation
	const xN = new PolynomialFn([1], { degree: n });
	// area 1
	const area1 = xN.definiteIntegral(k, b);
	// area 2
	const fY = new PowerFn(new Fraction(1, n));
	const integralY = fY.integral() as PowerFn;
	const y2 = integralY.subXAs(Math.pow(b, n)) as Fraction;
	const aPowerNPlus1 = y2
		.minus(area1)
		.times(n + 1)
		.divide(n)
		.pow(n);
	const a = new NthRoot(n + 1, aPowerNPlus1);
	console.log(`${aPowerNPlus1}, ${a.radicand}, ${a.radicand.valueOf()}`);
	if (a.isRational()) {
		console.log('case 1', n, b, k);
		return [math(`a=${a}`), [n, b, k]];
	} else if (a.radicand.isInteger()) {
		console.log('case 2', n, b, k);
		return [math(`a=${a} \\approx ${a.toPrecision(3)}`), [n, b, k]];
	} else if (a.radicand.abs().num < 1000 && a.radicand.den < 1000) {
		console.log('case 3', n, b, k);
		return [math(`a=${a} \\approx ${a.toPrecision(3)}`), [n, b, k]];
	} else {
		console.log('case 4', n, b, k);
		return [math(`a=${a.toPrecision(3)}`), [n, b, k]];
	}
}
