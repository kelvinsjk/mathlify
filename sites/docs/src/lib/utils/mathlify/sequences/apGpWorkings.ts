import type { Polynomial, Term } from 'mathlify';
import { Fraction } from 'mathlify';
import { solveQuadratic } from '../polynomials';
import { AP, GP } from './apGp';

/**
 * typeset working for
 * u_n = formula
 * = (sub in a,d,n)
 * = simplify
 */
export function apUNWorking(ap: AP, n: number | string): string {
	const lastLine = typeof n === 'string' ? ap.uN(n) : ap.uN().subXAs(n);
	return `u_{${n}} &= ${AP.uNFormula()} \\\\
    &= ${ap.a} + \\left( ${n} - 1 \\right) ${ap.d} \\\\
    &= ${lastLine}`;
}

/**
 * typeset working for
 * S_n = formula
 * = (sub in a,d,n)
 * = simplify
 *
 * @returns [working, answer]
 */
export function apSNWorking(ap: AP, n: number | string): [string, Polynomial | Fraction] {
	const lastLine = typeof n === 'string' ? ap.sN(n) : ap.sN().subXAs(n);
	const formula = typeof n === 'string' ? AP.sNFormula({ n }) : AP.sNFormula();
	const working = `S_{${n}} &= ${formula} \\\\
    &= \\frac{${n}}{2} \\Big( 2(${ap.a}) + (${n}-1)(${ap.d})  \\Big) \\\\
  &= ${lastLine}`;
	return [working, lastLine];
}

/**
 * typeset working for eqn/inequality with AP S_n
 * @returns [[working:string, roots:string], [n1:number, n2:number]. ]
 */
export function apSNEqnWorking(
	ap: AP,
	rhs: number | Fraction,
	sign = '=',
): [[string, string, string], [number, number]] {
	const poly = ap.sN().minus(rhs);
	const [n1Prime, n2Prime] = solveQuadratic(poly);
	let n1: number, n2: number;
	let lastLine1 = '';
	let lastLine2 = '';
	if (sign === '>' || sign === '\\geq') {
		n1 = Math.floor(n1Prime.valueOf());
		n2 = Math.ceil(n2Prime.valueOf());
		const oppSign = sign === '>' ? '<' : '\\leq';
		lastLine1 = `n${oppSign} ${n1Prime.toPrecision(4)}`;
		lastLine2 = `n${sign} ${n2Prime.toPrecision(4)}`;
	} else if (sign === '<' || sign === '\\leq') {
		n1 = Math.ceil(n1Prime.valueOf());
		n2 = Math.floor(n2Prime.valueOf());
		lastLine1 = `${n1Prime.toPrecision(4)} ${sign} n ${sign} ${n2Prime.toPrecision(4)}`;
	} else {
		n1 = Math.round(n1Prime.valueOf());
		n2 = Math.round(n2Prime.valueOf());
		lastLine1 = `n = ${n1Prime.toPrecision(4)}`;
		lastLine2 = `n = ${n2Prime.toPrecision(4)}`;
	}
	const working = `S_n ${sign} ${rhs} \\\\
		${AP.sNFormula()} ${sign} ${rhs} \\\\
    \\frac{n}{2} \\Big( 2(${ap.a}) + \\left( n - 1 \\right) \\left(${
		ap.d
	}\\right) \\Big) ${sign} ${rhs} \\\\
    ${poly} ${sign} 0 
  `;
	return [
		[working, lastLine1, lastLine2],
		[n1, n2],
	];
}

/**
 * typeset working for
 * u_n = formula
 * = (sub in a,r,n)
 * = simplify
 */
export function gpUNWorking(gp: GP, n: number | string): string {
	const lastLine = typeof n === 'string' ? gp.uN(n) : gp.uNAt(n);
	return `u_{${n}} &= ${GP.uNFormula()} \\\\
    &= ${gp.a} \\left( ${gp.r} \\right)^{${n}-1} \\\\
    &= ${lastLine}`;
}

/**
 * typeset working for
 * S_n = formula
 * = (sub in a,d,n)
 * = simplify
 *
 * @returns [working, answer]
 */
export function gpSNWorking(gp: GP, n: number | string): [string, Term | Fraction] {
	const lastLine = typeof n === 'string' ? gp.sN(n) : gp.sNAt(n);
	const formula =
		typeof n === 'string'
			? GP.sNFormula({ n, rFirst: gp.r.abs().isGreaterThan(1) })
			: GP.sNFormula({ rFirst: gp.r.abs().isGreaterThan(1) });
	const working = `S_{${n}} &= ${formula} \\\\
    &= \\frac{${gp.a}\\Big( ${
		gp.r.abs().isLessThan(1)
			? `1-\\left(${gp.r}\\right)^{${n}}`
			: `\\left(${gp.r}\\right)^{${n}} - 1`
	} \\Big)}{${gp.r.abs().isLessThan(1) ? `1-${gp.r}` : `${gp.r}-1`}} \\\\
  &= ${lastLine}`;
	return [working, lastLine];
}

/**
 * typeset working for eqn/inequality with GP S_n
 * @returns [[working:string], n:number] ]
 */
export function gpSNEqnWorking(gp: GP, rhs: number | Fraction, sign = '='): [[string], number] {
	// a(1-r^n)/(1-r) = rhs
	// 1-r^n = rhs*(1-r)/a
	const rhs2 = Fraction.ONE.minus(gp.r).times(rhs).divide(gp.a);
	// r^n = 1-...
	const rhs3 = Fraction.ONE.minus(rhs2);
	// n ln r = ln(rhs3)
	// n = ln(rhs3)/ln(r)
	const nPrime = Math.log(rhs3.valueOf()) / Math.log(gp.r.valueOf());
	let n = Math.round(nPrime);
	let working: string;
	const rFirst = !gp.r.isLessThan(1);
	if (rFirst) {
		working = `S_n ${sign} ${rhs} \\\\
      ${GP.sNFormula({ rFirst })} ${sign} ${rhs} \\\\
      \\frac{${gp.a}\\Big( \\left(${gp.r}\\right)^n - 1 \\Big)}{${gp.r}-1} ${sign} ${rhs} \\\\
      \\left(${gp.r}\\right)^n - 1 ${sign} ${rhs2.negative()} \\\\
      n \\ln ${gp.r} ${sign} \\ln ${rhs3} \\\\
      n ${sign} \\frac{\\ln ${rhs3}}{\\ln ${gp.r}} \\\\
    n ${sign} ${nPrime}`;
		n = sign === '>' || sign === '\\geq' ? Math.ceil(nPrime) : Math.floor(nPrime);
	} else {
		const oppSigns = { '>': '<', '\\geq': '\\leq', '<': '>', '\\leq': '\\geq', '=': '=' };
		const oppSign = oppSigns[sign];
		working = `S_n ${sign} ${rhs} \\\\
      ${GP.sNFormula({ rFirst })} ${sign} ${rhs} \\\\
      \\frac{${gp.a}\\Big( 1 - \\left(${gp.r}\\right)^n \\Big)}{1-${gp.r}} ${sign} ${rhs} \\\\
      \\left(${gp.r}\\right)^n - 1 ${sign} ${rhs2} \\\\
      n \\ln ${gp.r} ${sign} \\ln ${rhs3} \\\\
      n ${oppSign} \\frac{\\ln ${rhs3}}{\\ln ${gp.r}} \\\\
    n ${oppSign} ${nPrime}`;
		n = sign === '>' || sign === '\\geq' ? Math.floor(nPrime) : Math.ceil(nPrime);
	}
	return [[working], n];
}
