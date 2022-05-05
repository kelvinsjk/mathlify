import { Polynomial, type Fraction } from 'mathlify';
import { ReciprocalTerm } from '../algebra/reciprocalTermClass';
import { shiftPolynomial } from '../polynomials';

/**
 * Method of difference working for 2 terms
 *
 * @returns [working, constant, ReciprocalTerms]
 */
export function modWorking2(
	terms: [ReciprocalTerm, ReciprocalTerm],
	start: number,
	end: string,
	cancelParams?: {
		downDirection?: boolean;
		offset?: 1 | 2;
	},
): [string, Fraction, ReciprocalTerm[]] {
	cancelParams = {
		downDirection: false,
		offset: 1,
		...cancelParams,
	};
	const cancel = (x: string) => (cancelParams.downDirection ? `\\bcancel{${x}}` : `\\cancel{${x}}`);
	const [t1, t2] = terms;
	const t11 = t1.subXAs(start),
		t12 = t2.subXAs(start);
	const t21 = t1.subXAs(start + 1),
		t22 = t2.subXAs(start + 1);
	const t31 = t1.subXAs(start + 2),
		t32 = t2.subXAs(start + 2);
	const nPoly1 = t1.variable.ascending
		? new Polynomial(t1.variable.coefficients, { ascending: true, variableAtom: end })
		: new Polynomial([...t1.variable.coefficients].reverse(), {
				ascending: false,
				variableAtom: end,
		  });
	const nPoly2 = t2.variable.ascending
		? new Polynomial(t2.variable.coefficients, { ascending: true, variableAtom: end })
		: new Polynomial([...t2.variable.coefficients].reverse(), {
				ascending: false,
				variableAtom: end,
		  });
	const tNMinus21 = new ReciprocalTerm(t1.coeff, shiftPolynomial(nPoly1, -2)),
		tNMinus22 = new ReciprocalTerm(t2.coeff, shiftPolynomial(nPoly2, -2));
	const tNMinus11 = new ReciprocalTerm(t1.coeff, shiftPolynomial(nPoly1, -1)),
		tNMinus12 = new ReciprocalTerm(t2.coeff, shiftPolynomial(nPoly2, -1));
	const tN1 = new ReciprocalTerm(t1.coeff, nPoly1),
		tN2 = new ReciprocalTerm(t2.coeff, nPoly2);
	const signOne = sign(t1.coeff);
	const signOneFirst = signFirst(t1.coeff);
	const signTwo = sign(t2.coeff);
	let row1 = `${signOneFirst} & `;
	let row2 = `${signOne} & `;
	let row3 = `${signOne} & `;
	let rowNMinus2 = `${signOne} & `;
	let rowNMinus1 = `${signOne} & `;
	let rowN = `${signOne} & `;
	let constant: Fraction;
	const finalTerms: ReciprocalTerm[] = [];
	if (cancelParams.downDirection) {
		row1 += `${cancel(`${t11.abs()}`)} &${signTwo}& ${t12.abs()}`;
		row2 +=
			cancelParams.offset === 2
				? `${cancel(`${t21.abs()}`)} &${signTwo}& ${t22.abs()}`
				: `${cancel(`${t21.abs()}`)} &${signTwo}& ${cancel(`${t22.abs()}`)}`;
		row3 += `${cancel(`${t31.abs()}`)} &${signTwo}& ${cancel(`${t32.abs()}`)}`;
		rowNMinus2 += `${cancel(`${tNMinus21.abs()}`)} &${signTwo}& ${cancel(`${tNMinus22.abs()}`)}`;
		rowNMinus1 +=
			cancelParams.offset === 2
				? `${tNMinus11.abs()} &${signTwo}& ${cancel(`${tNMinus12.abs()}`)}`
				: `${cancel(`${tNMinus11.abs()}`)} &${signTwo}& ${cancel(`${tNMinus12.abs()}`)}`;
		rowN += `${tN1.abs()} &${signTwo}& ${cancel(`${tN2.abs()}`)}`;
		constant = cancelParams.offset === 2 ? t12.plus(t22) : t12;
		finalTerms.push(tN1);
		if (cancelParams.offset === 2) {
			finalTerms.push(tNMinus11);
		}
	} else {
		row1 += `${t11.abs()} &${signTwo}& ${cancel(`${t12.abs()}`)}`;
		row2 +=
			cancelParams.offset === 2
				? `${t21.abs()} &${signTwo}& ${cancel(`${t22.abs()}`)}`
				: `${cancel(`${t21.abs()}`)} &${signTwo}& ${cancel(`${t22.abs()}`)}`;
		row3 += `${cancel(`${t31.abs()}`)} &${signTwo}& ${cancel(`${t32.abs()}`)}`;
		rowNMinus2 += `${cancel(`${tNMinus21.abs()}`)} &${signTwo}& ${cancel(`${tNMinus22.abs()}`)}`;
		rowNMinus1 +=
			cancelParams.offset === 2
				? `${cancel(`${tNMinus11.abs()}`)} &${signTwo}& ${tNMinus12.abs()}`
				: `${cancel(`${tNMinus11.abs()}`)} &${signTwo}& ${cancel(`${tNMinus12.abs()}`)}`;
		rowN += `${cancel(`${tN1.abs()}`)} &${signTwo}& ${tN2.abs()}`;
		constant = cancelParams.offset === 2 ? t11.plus(t21) : t11;
		finalTerms.push(tN2);
		if (cancelParams.offset === 2) {
			finalTerms.push(tNMinus12);
		}
	}
	return [
		`& = 
    \\def\\arraystretch{1.5}
    \\begin{array}{lclc}
      ${row1}      \\\\
      ${row2}      \\\\
      ${row3}      \\\\
      ${signOne} &  &  \\cdots  &                   \\\\
      ${rowNMinus2}     \\\\
      ${rowNMinus1}     \\\\
      ${rowN}             
    \\end{array} \\\\`,
		constant,
		finalTerms,
	];
}

/**
 * Method of difference working for 3 terms
 *
 * @returns [working, constant, ReciprocalTerms]
 */
export function modWorking3(
	terms: [ReciprocalTerm, ReciprocalTerm, ReciprocalTerm],
	start: number,
	end: string,
	cancelParams?: {
		downDirection?: boolean;
	},
): [string, Fraction, ReciprocalTerm[]] {
	cancelParams = {
		downDirection: false,
		...cancelParams,
	};
	const cancel = (x: string) => (cancelParams.downDirection ? `\\bcancel{${x}}` : `\\cancel{${x}}`);
	const [t1, t2, t3] = terms;
	const t11 = t1.subXAs(start),
		t12 = t2.subXAs(start),
		t13 = t3.subXAs(start);
	const t21 = t1.subXAs(start + 1),
		t22 = t2.subXAs(start + 1),
		t23 = t3.subXAs(start + 1);
	const t31 = t1.subXAs(start + 2),
		t32 = t2.subXAs(start + 2),
		t33 = t3.subXAs(start + 2);
	const nPoly1 = t1.variable.ascending
		? new Polynomial(t1.variable.coefficients, { ascending: true, variableAtom: end })
		: new Polynomial([...t1.variable.coefficients].reverse(), {
				ascending: false,
				variableAtom: end,
		  });
	const nPoly2 = t2.variable.ascending
		? new Polynomial(t2.variable.coefficients, { ascending: true, variableAtom: end })
		: new Polynomial([...t2.variable.coefficients].reverse(), {
				ascending: false,
				variableAtom: end,
		  });
	const nPoly3 = t3.variable.ascending
		? new Polynomial(t3.variable.coefficients, { ascending: true, variableAtom: end })
		: new Polynomial([...t3.variable.coefficients].reverse(), {
				ascending: false,
				variableAtom: end,
		  });
	const tNMinus21 = new ReciprocalTerm(t1.coeff, shiftPolynomial(nPoly1, -2)),
		tNMinus22 = new ReciprocalTerm(t2.coeff, shiftPolynomial(nPoly2, -2)),
		tNMinus23 = new ReciprocalTerm(t3.coeff, shiftPolynomial(nPoly3, -2));
	const tNMinus11 = new ReciprocalTerm(t1.coeff, shiftPolynomial(nPoly1, -1)),
		tNMinus12 = new ReciprocalTerm(t2.coeff, shiftPolynomial(nPoly2, -1)),
		tNMinus13 = new ReciprocalTerm(t3.coeff, shiftPolynomial(nPoly3, -1));
	const tN1 = new ReciprocalTerm(t1.coeff, nPoly1),
		tN2 = new ReciprocalTerm(t2.coeff, nPoly2),
		tN3 = new ReciprocalTerm(t3.coeff, nPoly3);
	const signOne = sign(t1.coeff);
	const signOneFirst = signFirst(t1.coeff);
	const signTwo = sign(t2.coeff);
	const signThree = sign(t3.coeff);
	let row1 = `${signOneFirst} & `;
	let row2 = `${signOne} & `;
	let row3 = `${signOne} & `;
	let rowNMinus2 = `${signOne} & `;
	let rowNMinus1 = `${signOne} & `;
	let rowN = `${signOne} & `;
	let constant: Fraction;
	const finalTerms: ReciprocalTerm[] = [];
	if (cancelParams.downDirection) {
		row1 += `${cancel(`${t11.abs()}`)} &${signTwo}& ${t12.abs()} &${signThree}& ${t13.abs()}`;
		row2 += `${cancel(`${t21.abs()}`)} &${signTwo}& ${cancel(
			`${t22.abs()}`,
		)} &${signThree}& ${t23.abs()}`;
		row3 += `${cancel(`${t31.abs()}`)} &${signTwo}& ${cancel(
			`${t32.abs()}`,
		)} &${signThree}& ${cancel(`${t33.abs()}`)}`;
		rowNMinus2 += `${cancel(`${tNMinus21.abs()}`)} &${signTwo}& ${cancel(
			`${tNMinus22.abs()}`,
		)} &${signThree}& ${cancel(`${tNMinus23.abs()}`)}`;
		rowNMinus1 += `${tNMinus11.abs()} &${signTwo}& ${cancel(
			`${tNMinus12.abs()}`,
		)} &${signThree}& ${cancel(`${tNMinus13.abs()}`)}`;
		rowN += `${tN1.abs()} &${signTwo}& ${tN2.abs()} &${signThree}& ${cancel(`${tN3.abs()}`)}`;
		constant = t12.plus(t22).plus(t23);
		finalTerms.push(tN1, tN2.plus(tNMinus11));
	} else {
		row1 += `${t11.abs()} &${signTwo}& ${t12.abs()} &${signThree}& ${cancel(`${t13.abs()}`)}`;
		row2 += `${t21.abs()} &${signTwo}& ${cancel(`${t22.abs()}`)} &${signThree}& ${cancel(
			`${t23.abs()}`,
		)}`;
		row3 += `${cancel(`${t31.abs()}`)} &${signTwo}& ${cancel(
			`${t32.abs()}`,
		)} &${signThree}& ${cancel(`${t33.abs()}`)}`;
		rowNMinus2 += `${cancel(`${tNMinus21.abs()}`)} &${signTwo}& ${cancel(
			`${tNMinus22.abs()}`,
		)} &${signThree}& ${cancel(`${tNMinus23.abs()}`)}`;
		rowNMinus1 += `${cancel(`${tNMinus11.abs()}`)} &${signTwo}& ${cancel(
			`${tNMinus12.abs()}`,
		)} &${signThree}& ${tNMinus13.abs()}`;
		rowN += `${cancel(`${tN1.abs()}`)} &${signTwo}& ${tN2.abs()} &${signThree}& ${tN3.abs()}`;
		constant = t11.plus(t21).plus(t12);
		finalTerms.push(tN2.plus(tNMinus13), tN3);
	}
	return [
		`\\def\\arraystretch{1.5}
    \\begin{array}{lclclc}
      ${row1}      \\\\
      ${row2}      \\\\
      ${row3}      \\\\
      ${signOne} &&&  \\cdots  &&                   \\\\
      ${rowNMinus2}     \\\\
      ${rowNMinus1}     \\\\
      ${rowN}             
    \\end{array}`,
		constant,
		finalTerms,
	];
}

function sign(x: Fraction): string {
	return x.isGreaterThan(0) ? '+' : '-';
}
function signFirst(x: Fraction): string {
	return x.isGreaterThan(0) ? '' : '-';
}
