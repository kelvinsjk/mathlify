import {
	Vector,
	WorkingExpression,
	Expression,
	Polynomial,
	Plane,
	Line,
	BracketedTerm,
	Fraction,
	Term,
	toFraction,
} from 'mathlify';
import { display } from 'mathlifier';

/**
 * @returns a1b1 + a2b2 +a3b3 as a WorkingExpression
 *  */
export function dotProductWorking(v1: Vector, v2: Vector): WorkingExpression {
	return new WorkingExpression(v1.x.times(v2.x), v1.y.times(v2.y), v1.z.times(v2.z));
}

/**
 * @returns an array with workings for intersection between line and plane
 * step 0: line dot plane = rhs
 * step 1: n1(a1+lambda d1) + n2(a2+lambda d2) + n3(a3+lambda d3) = rhs
 * step 2: a + b lambda = rhs
 * step 3: b lambda = rhs-a
 * step 4: lambda = (rhs-a)/b
 * step 5: OA = sub lambda into line
 */
export function lineIntersectPlaneWorking(
	l: Line,
	p: Plane,
	ptName = 'X',
): ([WorkingExpression | Polynomial | Term, Fraction] | [string, string])[] {
	const term1 = new BracketedTerm(p.n.x, l.toCombinedString(1));
	const term2 = new BracketedTerm(p.n.y, l.toCombinedString(2));
	const term3 = new BracketedTerm(p.n.z, l.toCombinedString(3));
	const divisor = l.d.dot(p.n).isEqualTo(0) ? 1 : l.d.dot(p.n);
	const lambda = p.rhs.minus(l.a.dot(p.n)).divide(divisor);
	return [
		[`${l.toCombinedString()} \\cdot ${p.n}`, `${p.rhs}`],
		[new WorkingExpression(term1, term2, term3), p.rhs],
		[
			new Polynomial([l.a.dot(p.n), l.d.dot(p.n)], { variableAtom: '\\lambda', ascending: true }),
			p.rhs,
		],
		[new Term(l.d.dot(p.n), '\\lambda'), p.rhs.minus(l.a.dot(p.n))],
		[new Term(1, '\\lambda'), p.rhs.minus(l.a.dot(p.n)).divide(divisor)],
		[
			`\\overrightarrow{O${ptName}}`,
			`\\begin{pmatrix}
      ${new Expression(l.a.x, new Term(l.d.x, `(${lambda})`))} \\\\
      ${new Expression(l.a.y, new Term(l.d.y, `(${lambda})`))} \\\\
      ${new Expression(l.a.z, new Term(l.d.z, `(${lambda})`))}
    \\end{pmatrix}`,
		],
	];
}

export function lineIntersectPlaneWorkingV2(l: Line, p: Plane, ptName = 'X'): string[] {
	const term1 = new BracketedTerm(p.n.x, l.toCombinedString(1));
	const term2 = new BracketedTerm(p.n.y, l.toCombinedString(2));
	const term3 = new BracketedTerm(p.n.z, l.toCombinedString(3));
	const divisor = l.d.dot(p.n).isEqualTo(0) ? 1 : l.d.dot(p.n);
	const lambda = p.rhs.minus(l.a.dot(p.n)).divide(divisor);
	const lambdaName = l.lambda;
	const pt = p.intersect(l) as Vector;
	return [
		display(`${l.toCombinedString()} \\cdot ${p.n} = ${p.rhs}`),
		display(`${new WorkingExpression(term1, term2, term3)} = ${p.rhs}`),
		display(`\\begin{align*}
				${new Polynomial([l.a.dot(p.n), l.d.dot(p.n)], { variableAtom: lambdaName, ascending: true })} &= ${
			p.rhs
		} \\\\
				${new Term(l.d.dot(p.n), lambdaName)} &= ${p.rhs.minus(l.a.dot(p.n))} \\\\
				${new Term(1, lambdaName)} &= ${p.rhs.minus(l.a.dot(p.n)).divide(divisor)}
			\\end{align*}`),
		display(`\\begin{align*}
			\\overrightarrow{O${ptName}} &=
			\\begin{pmatrix}
      ${new Expression(l.a.x, new Term(l.d.x, `(${lambda})`))} \\\\
      ${new Expression(l.a.y, new Term(l.d.y, `(${lambda})`))} \\\\
      ${new Expression(l.a.z, new Term(l.d.z, `(${lambda})`))}
			\\end{pmatrix} \\\\
			&= ${pt}
		\\end{align*}`),
	];
}

/**
 * returns sqrt(x^2 + y^2 + z^2)
 */
export function magnitudeWorking(v: Vector): string {
	return `\\sqrt{${v.x.square()} + ${v.y.square()} + ${v.z.square()}}`;
}

/**
 * @returns an array with workings for angle
 * step 0: formula
 * step 1: sub in vectors
 * step 2: carry out dot product and magnitude calculations
 * step 3: sin/cos theta
 * step 4: theta
 *
 * @param v1Name defaults to d_1
 */
export function angleWorking(
	v1: Vector,
	v2: Vector,
	v1Name = 'd_1',
	v2Name = 'd_2',
	sineMode = false,
	thetaName = '\\theta',
	cosThetaMode = false,
): string[] {
	const trigFn = sineMode ? '\\sin' : '\\cos';
	const angle = v1.angle(v2, { sineMode, acute: true });
	return [
		`${display(
			`\\left|\\mathbf{${v1Name}} \\cdot \\mathbf{${v2Name}}\\right| = \\left| \\mathbf{${v1Name}} \\right| \\left| \\mathbf{${v2Name}} \\right| ${trigFn} ${thetaName}`,
		)}`,
		display(
			`\\begin{align*}
				\\left|${v1} \\cdot ${v2} \\right| 	&= \\left| ${v1} \\right| \\left| ${v2} \\right| ${trigFn} ${thetaName} \\\\
				\\left|${v1.dot(v2)} \\right| 			&= (${v1.magnitude()}) (${v2.magnitude()}) ${trigFn} ${thetaName}
			\\end{align*}`,
		),
		display(
			`\\begin{align*}
				${trigFn} ${thetaName} &= \\frac{${v1.dot(v2).abs()}}{(${v1.magnitude()})(${v2.magnitude()})} \\\\
				${cosThetaMode ? '' : `\\theta 					&= ${angle} \\; \\blacksquare`}
			\\end{align*}`,
		),
	];
}

/**
 * @param names defaults to ["A", "B", "F", "A'", 'd'] for names of pt, pt on line, foot, reflection, direction vector
 *
 * @returns an array with workings for foot of perpendicular to a line
 * step 0: BA = OA - OB
 * step 1: projection vector formula: BF = (BA dot dHat) dHat
 * step 2: OF - OB = sub in
 * step 3: OF = OB +
 * step 4: OF
 * step 4: ratio theorem: OF = (OA + OA')/2
 * step 5: OA' = 2OF - OA
 * step 6: sub in
 * step 7: OA'
 */
export function footOfPerpendicularLineWorking(
	pt: Vector,
	l: Line,
	names: [string, string, string, string, string] = ['A', 'B', 'F', "A'", 'd'],
): string[] {
	const [A, B, F, APrime, dName] = names;
	const OA = `\\overrightarrow{O${A}}`;
	const OB = `\\overrightarrow{O${B}}`;
	const OF = `\\overrightarrow{O${F}}`;
	const BF = `\\overrightarrow{${B}${F}}`;
	const BA = `\\overrightarrow{${B}${A}}`;
	const OAPrime = `\\overrightarrow{O${APrime}}`;
	const dHat = `\\mathbf{\\hat{${dName}}}`;
	const projectionVector = l.d
		.multiply(pt.minus(l.a).dot(l.d))
		.multiply(l.d.magnitudeSquare().reciprocal());
	return [
		`${BA} = ${OA} - ${OB} = ${pt.minus(l.a)}`,
		`${BF} = \\left(\\mathbf{${BA}} \\cdot ${dHat}\\right) ${dHat}`,
		`${OF}${l.a.isEqualTo(Vector.ZERO) ? '' : `-${OB}`} = \\left( \\frac{${pt.minus(l.a)} \\cdot ${
			l.d
		}}{\\left| ${l.d} \\right|} \\right) \\frac{${l.d}}{\\left| ${l.d} \\right|}`,
		`${OF} = ${l.a.isEqualTo(Vector.ZERO) ? '' : `${l.a} + `} \\frac{${pt
			.minus(l.a)
			.dot(l.d)}}{${l.d.magnitudeSquare()}} ${l.d}`,
		`${OF} = ${l.a.plus(projectionVector)}`,
		`${OF} = \\frac{${OA}+${OAPrime}}{2}`,
		`${OAPrime} = 2${OF} - ${OA}`,
		`${OAPrime} = 2${l.a.plus(projectionVector)} - ${pt}`,
		`${OAPrime} = ${l.a.plus(projectionVector).multiply(2).minus(pt)}`,
	];
}

/**
 * @returns typeset working for finding vector AB
 */
export function OAMinusOBWorking(
	OA: Vector,
	OB: Vector,
	names: [string, string] = ['A', 'B'],
	simplify = true,
): string {
	const AB = OB.minus(OA);
	const ABPrime = AB.clone().simplify();
	return `${display(`\\begin{align*}
	\\overrightarrow{${names[0]}${names[1]}} &= \\overrightarrow{O${names[1]}} - \\overrightarrow{O${
		names[0]
	}} \\\\
	&= ${AB} \\\\
	${AB.coeff.isEqualTo(ABPrime.coeff) || !simplify ? '' : `&= ${ABPrime}`}
\\end{align*}`)}`;
}

/**
 * @return typeset working for finding normal vector
 *
 * @param names default to ['n', '\\mathbf{d_1}', '\\mathbf{d_2}']
 */
export function normalWorking(
	d1: Vector,
	d2: Vector,
	names: [string, string, string] = ['n', '\\mathbf{d_1}', '\\mathbf{d_2}'],
): string {
	const n = d1.cross(d2);
	const nSimplified = n.clone().simplify();
	const [nName, d1Name, d2Name] = names;
	return display(`\\begin{align*}
	\\mathbf{${nName}} &=  ${d1Name} \\times ${d2Name} \\\\
	&= ${d1} \\times ${d2} \\\\
	&= ${n} \\\\
	${n.coeff.isEqualTo(nSimplified.coeff) ? '' : `&= ${nSimplified}`}
\\end{align*}`);
}

/**
 * @return typeset working for finding equation of plane
 *
 * @param names default to ['n', '\\mathbf{d_1}', '\\mathbf{d_2}']
 */
export function planeEqnWorking(n: Vector, a: Vector, aName = ''): string {
	return display(`\\begin{align*}
	\\mathbf{r} \\cdot \\mathbf{n} &= \\mathbf{a} \\cdot \\mathbf{n} \\\\
	${aName ? `\\mathbf{r} \\cdot \\mathbf{n} &= ${aName} \\cdot \\mathbf{n} \\\\` : ''} 
	\\mathbf{r} \\cdot ${n} &= ${a} \\cdot ${n} \\\\
	&= ${a.dot(n)}
\\end{align*}`);
}

/**
 * typeset pmatrix
 */
export function pMatrix(a: string | number, b: string | number, c: string | number): string {
	return `\\begin{pmatrix}${a}\\\\${b}\\\\${c}\\end{pmatrix}`;
}

/**
 * typesets
 * cross product of (k1 a + l1 b) and (k2 a + l2 b)
 */
export function crossProductWorking(
	coeffs1: (Fraction | number)[],
	coeffs2: (Fraction | number)[],
	v1 = 'a',
	v2 = 'b',
	modulusMode = false,
): [string, Fraction] {
	const coeffsFrac1 = coeffs1.map((e) => toFraction(e));
	const coeffsFrac2 = coeffs2.map((e) => toFraction(e));
	const brackets1 = !coeffsFrac1.some((f) => f.isEqualTo(0));
	const brackets2 = !coeffsFrac2.some((f) => f.isEqualTo(0));
	const u = new Expression(
		new Term(coeffsFrac1[0], `\\mathbf{${v1}}`),
		new Term(coeffsFrac1[1], `\\mathbf{${v2}}`),
	);
	const v = new Expression(
		new Term(coeffsFrac2[0], `\\mathbf{${v1}}`),
		new Term(coeffsFrac2[1], `\\mathbf{${v2}}`),
	);
	const uCrossU = new Term(
		coeffsFrac1[0].times(coeffsFrac2[0]),
		`\\mathbf{${v1}} \\times \\mathbf{${v1}}`,
	);
	const uCrossV = new Term(
		coeffsFrac1[0].times(coeffsFrac2[1]),
		`\\mathbf{${v1}} \\times \\mathbf{${v2}}`,
	);
	const vCrossU = new Term(
		coeffsFrac2[0].times(coeffsFrac1[1]),
		`\\mathbf{${v2}} \\times \\mathbf{${v1}}`,
	);
	const vCrossUPrime = new Term(
		coeffsFrac2[0].times(coeffsFrac1[1]).negative(),
		`\\mathbf{${v1}} \\times \\mathbf{${v2}}`,
	);
	const vCrossV = new Term(
		coeffsFrac2[1].times(coeffsFrac1[1]),
		`\\mathbf{${v2}} \\times \\mathbf{${v2}}`,
	);
	const expandedForm = new Expression(uCrossU, uCrossV, vCrossU, vCrossV);
	let thirdLine: WorkingExpression;
	if (coeffsFrac1[0].isEqualTo(0)) {
		thirdLine = new WorkingExpression(vCrossUPrime, `\\mathbf{0}`);
	} else if (coeffsFrac1[1].isEqualTo(0)) {
		thirdLine = new WorkingExpression(`\\mathbf{0}`, uCrossV);
	} else if (coeffsFrac2[0].isEqualTo(0)) {
		thirdLine = new WorkingExpression(uCrossV, `\\mathbf{0}`);
	} else if (coeffsFrac2[1].isEqualTo(0)) {
		thirdLine = new WorkingExpression(`\\mathbf{0}`, vCrossU);
	} else {
		thirdLine = new WorkingExpression(`\\mathbf{0}`, uCrossV, vCrossUPrime, `\\mathbf{0}`);
	}
	const finalAns = new Term(
		uCrossV.coeff.minus(vCrossU.coeff),
		`\\mathbf{${v1}} \\times \\mathbf{${v2}}`,
	);
	return [
		`${modulusMode ? `\\left| ` : ''} ${brackets1 ? '\\left(' : ''}${u}${
			brackets1 ? '\\right)' : ''
		} \\times ${brackets2 ? '\\left(' : ''}${v}${brackets2 ? '\\right)' : ''} ${
			modulusMode ? `\\right| ` : ''
		} \\\\
		&= ${modulusMode ? `\\left| ` : ''} ${expandedForm} ${modulusMode ? `\\right| ` : ''} \\\\
		&= ${modulusMode ? `\\left| ` : ''} ${thirdLine} ${modulusMode ? `\\right| ` : ''} \\\\
	&= ${modulusMode ? `\\left| ` : ''} ${finalAns} ${modulusMode ? `\\right| ` : ''}`,
		finalAns.coeff,
	];
}
