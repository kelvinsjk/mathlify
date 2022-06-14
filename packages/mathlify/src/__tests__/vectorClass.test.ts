import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Fraction, Vector, JSONParse } from '../index';

const vectorClass = suite('vector class');

vectorClass('simplify and expand', () => {
	const fiveI = new Vector(5);
	assert.equal([fiveI.coeff.valueOf(), fiveI.x.valueOf()], [1, 5]);
	fiveI.simplify();
	assert.equal([fiveI.coeff.valueOf(), fiveI.x.valueOf()], [5, 1]);
	fiveI.simplify({ stretchable: true });
	assert.equal([fiveI.coeff.valueOf(), fiveI.x.valueOf()], [1, 1]);

	const twoITwoJTwoK = new Vector(1, 1, 1, { coeff: 2 });
	assert.equal([twoITwoJTwoK.coeff.valueOf(), twoITwoJTwoK.x.valueOf()], [2, 1]);
	const twoITwoJTwoKV2 = twoITwoJTwoK.expand();
	assert.equal([twoITwoJTwoKV2.coeff.valueOf(), twoITwoJTwoKV2.x.valueOf()], [1, 2]);

	// simplify negative
	const minusTwoIMinusJ = new Vector(-2, -1);
	assert.equal(
		[minusTwoIMinusJ.coeff.valueOf(), minusTwoIMinusJ.x.valueOf(), minusTwoIMinusJ.y.valueOf()],
		[1, -2, -1],
	);
	minusTwoIMinusJ.simplify();
	assert.equal([minusTwoIMinusJ.coeff.valueOf(), minusTwoIMinusJ.x.valueOf(), minusTwoIMinusJ.y.valueOf()], [-1, 2, 1]);

	const negativeTwoIFourJSixKNonSimplified = new Vector(-2, 4, 6);
	const negativeTwoIFourJSixKSimplified = new Vector(-2, 4, 6, { simplify: true });
	const negativeTwoIFourJSixKStretchable = new Vector(-2, 4, 6, { stretchable: true });
	assert.is(negativeTwoIFourJSixKNonSimplified.toIJKString(), '- 2 \\mathbf{i} + 4 \\mathbf{j} + 6 \\mathbf{k}');
	assert.is(
		negativeTwoIFourJSixKSimplified.toIJKString(),
		'2 \\left( - \\mathbf{i} + 2 \\mathbf{j} + 3 \\mathbf{k} \\right)',
	);
	assert.is(negativeTwoIFourJSixKStretchable.toIJKString(), '- \\mathbf{i} + 2 \\mathbf{j} + 3 \\mathbf{k}');
});

vectorClass('toString', () => {
	const zero = new Vector(2, 3, 1, { coeff: 0 });

	assert.is(
		`${zero}`,
		`\\begin{pmatrix}
	0 \\\\
	0 \\\\
	0
\\end{pmatrix}`,
	);

	zero.simplify();
	assert.equal([zero.coeff.valueOf(), zero.x.valueOf(), zero.y.valueOf()], [1, 0, 0]);

	const fiveIMinusHalfJ = new Vector(5, 0, new Fraction(-1, 2));
	assert.is(
		`${fiveIMinusHalfJ}`,
		`\\begin{pmatrix}
	5 \\\\
	0 \\\\
	- \\frac{1}{2}
\\end{pmatrix}`,
	);

	assert.is(zero.toIJKString(), '\\mathbf{0}');

	const twoIMinusFourK = new Vector(2, 0, -4);
	assert.is(twoIMinusFourK.toCoordinates('A'), 'A \\left( 2, 0, - 4 \\right)');
});

vectorClass('arithmetic', () => {
	const twoIMinusFourK = new Vector(2, 0, -4);
	const iMinusTwoK = new Vector(1, 0, -2);
	const twoIMinusFourKV2 = iMinusTwoK.multiply(2, { multiplyIntoCoeff: true });
	const twoIMinusFourKV3 = iMinusTwoK.multiply(2);
	assert.is(twoIMinusFourK.isEqualTo(twoIMinusFourKV2), true);
	assert.is(twoIMinusFourKV2.x.isEqualTo(2), false);
	assert.is(twoIMinusFourKV3.x.isEqualTo(2), true);
	assert.is(`${twoIMinusFourKV2.magnitude()}`, '2 \\sqrt{5}');

	const jPlusK = new Vector(0, 1, 1);
	const twoIMinusJMinusFiveK = twoIMinusFourK.minus(jPlusK);
	const twoIMinusJMinusFiveKV2 = twoIMinusFourKV2.minus(jPlusK);
	assert.equal(
		[twoIMinusJMinusFiveK.x.valueOf(), twoIMinusJMinusFiveK.y.valueOf(), twoIMinusJMinusFiveK.z.valueOf()],
		[2, -1, -5],
	);
	assert.equal(
		[twoIMinusJMinusFiveKV2.x.valueOf(), twoIMinusJMinusFiveKV2.y.valueOf(), twoIMinusJMinusFiveKV2.z.valueOf()],
		[2, -1, -5],
	);

	const minusIPlusTwoK = iMinusTwoK.negative({ multiplyIntoCoeff: true });
	assert.equal(
		[
			minusIPlusTwoK.coeff.valueOf(),
			minusIPlusTwoK.x.valueOf(),
			minusIPlusTwoK.y.valueOf(),
			minusIPlusTwoK.z.valueOf(),
		],
		[-1, 1, 0, -2],
	);
});

vectorClass('angleTo', () => {
	const iPlusJ = new Vector(1, 1);
	const iPlusJMinusK = new Vector(1, 1, -1);
	const minusI = new Vector(-1);
	const minusIPlusJ = new Vector(-1, 1);
	assert.is(Vector.K.angleTo(Vector.K), '0^\\circ');
	assert.is(iPlusJMinusK.angleTo(iPlusJ), '35.3^\\circ');
	assert.is(iPlusJ.angleTo(Vector.I), '45^\\circ');
	assert.is(Vector.J.angleTo(Vector.I), '90^\\circ');
	assert.is(iPlusJMinusK.angleTo(minusI), '125.3^\\circ');
	assert.is(minusIPlusJ.angleTo(Vector.I), '135^\\circ');
	assert.is(minusIPlusJ.angleTo(Vector.I, { acute: true }), '45^\\circ');
	assert.is(Vector.K.angleTo(Vector.K, { sineMode: true }), '90^\\circ');
	assert.is(iPlusJMinusK.angleTo(iPlusJ, { sineMode: true }), '54.7^\\circ');
	assert.is(iPlusJ.angleTo(Vector.I, { sineMode: true }), '45^\\circ');
	assert.is(Vector.J.angleTo(Vector.I, { sineMode: true }), '0^\\circ');
	assert.is(iPlusJMinusK.angleTo(minusI, { sineMode: true }), '35.3^\\circ');
	assert.is(Vector.I.isPerpendicularTo(Vector.J), true);
	assert.is(Vector.I.isParallelTo(minusI), true);
});

vectorClass('clone', () => {
	const fiveI = new Vector(5);
	const fiveIClone = fiveI.clone();
	assert.equal([fiveI.coeff.valueOf(), fiveI.x.valueOf()], [1, 5]);
	fiveI.simplify();
	assert.equal([fiveI.coeff.valueOf(), fiveI.x.valueOf()], [5, 1]);
	assert.equal([fiveIClone.coeff.valueOf(), fiveIClone.x.valueOf()], [1, 5]);
});

vectorClass('JSON', () => {
	const iMinusHalfK = new Vector(1, 0, new Fraction(-1, 2));
	const vJSON = JSON.stringify(iMinusHalfK);
	const iMinusHalfKReconstructed = JSONParse(vJSON) as Vector;
	assert.is(iMinusHalfK.isEqualTo(iMinusHalfKReconstructed), true);
});

vectorClass('hat', () => {
	const v1 = new Vector(1, -2, 2);
	const v1Hat = v1.hat();
	assert.throws(() => {
		new Vector(1, 2, 3).hat();
	});
	assert.throws(() => {
		Vector.ZERO.hat();
	});
	assert.is(`${v1Hat.magnitude()}`, '1');
});

vectorClass.run();
