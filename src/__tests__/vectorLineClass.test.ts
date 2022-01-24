import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Fraction, Vector, Line } from '../index';

const vectorLineClass = suite('vector line class');

const l1 = new Line(new Vector(2, 4, 6), new Vector(1, 3, -2));
const l1v2 = new Line(new Vector(1, 2, 3, { coeff: 2 }), new Vector(1, 3, -2));
const v1 = new Vector(3, 7, 4);
const l2 = new Line(v1, new Vector(2, -1, 3));
const l3 = new Line(Vector.I, new Vector(2, -1, 3));
const l4 = new Line(Vector.J, new Vector(2, -1, 3));

vectorLineClass('constructor and boolean checks', () => {
	const l1v3 = new Line(v1, new Vector(1, 3, -2));
	assert.is(l1.contains(v1), true);
	assert.is(l1.isEqualTo(l1v2), true);
	assert.is(l1.isEqualTo(l1v3), true);
	const intersectionPt = l1.intersect(l2) as Vector;
	assert.is(intersectionPt.isEqualTo(v1), true);
	assert.is(l1.isSkewTo(l3), true);
	assert.is(l3.isParallelTo(l4), true);
	assert.is(l3.isParallelTo(new Vector(-4, 2, -6)), true);
	assert.is(l1.contains(Vector.ZERO), false);
	assert.is(l1.isEqualTo(l2), false);
	assert.is(l1.intersect(l3), null);
	assert.is(l3.isSkewTo(l4), false);
	assert.throws(() => {
		new Line(Vector.K, Vector.ZERO);
	});
	assert.throws(() => {
		l1.reflect(l3);
	});
	assert.throws(() => {
		l1.distanceTo(l3);
	});
});

vectorLineClass('toString', () => {
	const aString1 = '\\left( 2 \\mathbf{i} + 4 \\mathbf{j} + 6 \\mathbf{k} \\right)';
	const dString1 = '\\left( \\mathbf{i} + 3 \\mathbf{j} - 2 \\mathbf{k} \\right)';
	assert.is(l1v2.toIJKString(), `\\mathbf{r} = ${aString1} + \\lambda ${dString1}`);
	assert.is(l1.toCartesianString(), 'x - 2 = \\frac{y - 4}{3} = \\frac{z - 6}{-2}');

	const l5 = new Line(Vector.I, new Vector(3, 2, 2), { twoPointsMode: true, lambda: '\\mu' });
	const aString2 = '\\begin{pmatrix}\n\t1 \\\\\n\t0 \\\\\n\t0\n\\end{pmatrix}';
	const dString2 = '\\begin{pmatrix}\n\t1 \\\\\n\t1 \\\\\n\t1\n\\end{pmatrix}';
	const combinedString = '\\begin{pmatrix}\n\t1 + \\mu \\\\\n\t\\mu \\\\\n\t\\mu\n\\end{pmatrix}';
	assert.is(`${l5}`, `\\mathbf{r} = ${aString2} + \\mu ${dString2}`);
	assert.is(l5.toCombinedString(), combinedString);

	const xEqual2YEqualZ = new Line(new Vector(2), new Vector(0, 1, 1));
	const xEqual2YEqualMinus2 = new Line(new Vector(2, -2), new Vector(0, 0, 1));
	const xEqual2ZEqualMinus1 = new Line(new Vector(2, 2, -1), new Vector(0, 3, 0));
	assert.is(xEqual2YEqualZ.toCartesianString(), 'x = 2, y = z');
	assert.is(xEqual2YEqualMinus2.toCartesianString(), 'x = 2, y = - 2, z \\in \\R');
	assert.is(xEqual2ZEqualMinus1.toCartesianString(), 'x = 2, y \\in \\R, z = - 1');
	const yEqual1ZEqual0 = new Line(new Vector(1, 1, 0), new Vector(1));
	const xMinusTwoOver3EqualZ = new Line(new Vector(2, 0, 0), new Vector(3, 0, 1));
	assert.is(yEqual1ZEqual0.toCartesianString(), 'x \\in \\R, y = 1, z = 0');
	assert.is(xMinusTwoOver3EqualZ.toCartesianString(), '\\frac{x - 2}{3} = z, y = 0');
	const xMinusTwoOver3EqualYPlusOneOverMinus1 = new Line(new Vector(2, -1, 0), new Vector(3, -1, 0));
	assert.is(xMinusTwoOver3EqualYPlusOneOverMinus1.toCartesianString(), '\\frac{x - 2}{3} = \\frac{y + 1}{-1}, z = 0');
});

vectorLineClass('intersection', () => {
	const lineOfReflection = l2.reflect(l1) as Line;
	const pointOfReflection = l2.reflect(new Vector(2, 4, 6)) as Vector;
	const lineOfReflectionV2 = new Line(new Vector(3, 7, 4), new Vector(3, 2, 1));
	assert.is(lineOfReflection.isEqualTo(lineOfReflectionV2), true);
	assert.is(pointOfReflection.isEqualTo(new Vector(6, 9, 5)), true);
	const l5 = new Line(v1, l1.d);
	const lineOfReflectionV3 = l2.reflect(l5) as Line;
	assert.is(lineOfReflectionV3.isEqualTo(lineOfReflection), true);
	const l6 = new Line(new Vector(2, 4, 6), new Vector(2, -1, 3));
	const l6ReflectedInL2 = l2.reflect(l6) as Line;
	const l6ReflectedInL2V2 = new Line(new Vector(6, 9, 5), new Vector(2, -1, 3));
	assert.is(l6ReflectedInL2.isEqualTo(l6ReflectedInL2V2), true);
	const l7 = new Line(new Vector(2, 4, 5), new Vector(1, 3, 2));
	const l8 = new Line(new Vector(2, 4, 5), new Vector(1, 3, -2));
	assert.is(l7.intersect(l1), null);
	assert.is(l8.intersect(l1), null);
	const l7Intersection = l7.intersect(l7) as Line;
	assert.is(l7Intersection.isEqualTo(l7), true);
	const l7Reflection = l7.reflect(l7) as Line;
	assert.is(l7Reflection.isEqualTo(l7), true);
});

vectorLineClass('angle', () => {
	const iPlusJMinusK = new Line(Vector.I, new Vector(1, 1, -1));
	const zAxis = new Line(Vector.ZERO, Vector.K);
	assert.is(iPlusJMinusK.angle(zAxis), '54.7^\\circ');
	assert.is(iPlusJMinusK.angle(Vector.K), '54.7^\\circ');
});

vectorLineClass('distance', () => {
	const a = new Vector(-3, 5, 1);
	const d = new Vector(-1, 2, -2);
	const l1 = new Line(a, d);
	const l2 = new Line(new Vector(-4, 5, 1), d);
	assert.is(`${l2.distanceTo(l1)}`, '\\frac{2}{3} \\sqrt{2}');
	assert.is(`${l2.distanceTo(a)}`, '\\frac{2}{3} \\sqrt{2}');
});

vectorLineClass('clone', () => {
	const l1Clone = l1.clone();
	l1.lambda = 's';
	assert.is(l1.lambda, 's');
	assert.is(l1Clone.lambda, '\\lambda');
});

vectorLineClass.run();
