import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Fraction, Vector, Line, Plane, SquareRoot } from '../index';

const vectorPlaneClass = suite('vector plane class');

const l1 = new Line(new Vector(1, 2, -1), new Vector(1, -2));
const p1 = new Plane(new Vector(1, 2, -1), { rhs: 3 });
const p1x = new Plane(new Vector(2, 4, -2), { rhs: 6 });
const p2 = new Plane(new Vector(1, 2, -1), { mode: 'aDotN', v2: new Vector(3) });
const p3 = new Plane(new Vector(1, 2, -1), { mode: 'ptDD', v2: new Vector(3), v3: new Vector(1, -2) });
const p4 = new Plane(new Vector(1, 2, -1), { mode: 'ptPtD', v2: new Vector(3), v3: new Vector(1, -2) });
const p5 = new Plane(new Vector(1, 2, -1), { mode: 'ptPtPt', v2: new Vector(3), v3: new Vector(1, -2) });

vectorPlaneClass('constructor and boolean checks', () => {
	assert.throws(() => new Plane(new Vector(0)));
	//@ts-ignore
	assert.throws(() => new Plane(new Vector(1), { mode: 'ptPD' }));
	assert.is(p3.contains(l1), true);
	assert.is(p1.contains(new Vector(0, 0, -3)), true);
	assert.is(p3.isParallelTo(l1), true);
	const p1Parallel = new Plane(new Vector(-2, -4, 2), { rhs: 6 });
	assert.is(p1.isParallelTo(p1Parallel), true);
	assert.is(p1.isEqualTo(p1Parallel), false);
	assert.is(p1.isEqualTo(p2), true);
	assert.is(p1.isEqualTo(p1x), true);
	assert.is(p1.isEqualTo(p3), false);
	const yEqual2 = new Plane(Vector.J, { rhs: 2 });
	const zEqual2 = new Plane(Vector.K, { rhs: 2 });
	assert.is(yEqual2.point().isEqualTo(new Vector(0, 2)), true);
	assert.is(zEqual2.point().isEqualTo(new Vector(0, 0, 2)), true);
	assert.is(yEqual2.isEqualTo(yEqual2), true);
	assert.is(zEqual2.isEqualTo(zEqual2), true);
});

vectorPlaneClass('toString', () => {
	assert.is(`${p1}`, '\\mathbf{r} \\cdot \\begin{pmatrix}\n\t1 \\\\\n\t2 \\\\\n\t- 1\n\\end{pmatrix} = 3');
	assert.is(
		p4.toIJKString(),
		'\\mathbf{r} \\cdot \\left( - 2 \\mathbf{i} - \\mathbf{j} + 2 \\mathbf{k} \\right) = - 6',
	);
	assert.is(p5.toCartesianString(), 'x - y - 4 z = 3');
});

vectorPlaneClass('intersection', () => {
	const ptIntersect = p1.intersect(l1) as Vector;
	assert.is(ptIntersect.isEqualTo(new Vector(2, 0, -1)), true);
	const p1Line = new Line(new Vector(3, 0, 0), new Vector(0, 1, 2));
	const p1LineIntersect = p1.intersect(p1Line) as Line;
	assert.is(p1LineIntersect.isEqualTo(p1Line), true);
	const p1Line2 = new Line(new Vector(4, 0, 0), new Vector(0, 1, 2));
	const p1LineIntersect2 = p1.intersect(p1Line2);
	assert.is(p1LineIntersect2, null);
	const lineIntersect = p1.intersect(p4) as Line;
	assert.is(lineIntersect.isEqualTo(new Line(new Vector(3), new Vector(1, 0, 1))), true);
	const p1Clone = p1.intersect(p2) as Plane;
	assert.is(p1Clone.isEqualTo(p1), true);
	const p1Parallel = new Plane(new Vector(1, 2, -1), { rhs: 4 });
	assert.is(p1Parallel.intersect(p1), null);

	const p3 = new Plane(new Vector(1, 2, 0));
	const lIntersect = p1.intersect(p3) as Line;
	assert.is(lIntersect.isEqualTo(new Line(new Vector(0, 0, -3), new Vector(2, -1, 0))), true);
	const p5 = new Plane(Vector.K);
	const p6 = new Plane(Vector.J, { rhs: 2 });
	const lIntersect2 = p5.intersect(p6) as Line;
	assert.is(lIntersect2.isEqualTo(new Line(new Vector(0, 2), new Vector(1))), true);
});

vectorPlaneClass('angle', () => {
	assert.is(p1.angle(p5), '73.2^\\circ');
	assert.is(p1.angle(l1), '33.2^\\circ');
	assert.is(p1.angle(new Vector(1, -2)), '33.2^\\circ');
});

vectorPlaneClass('distance', () => {
	assert.is(p1.distanceTo(new Vector(4, 2, -1)).isEqualTo(new SquareRoot(6)), true);
	assert.is(p1.distanceTo(new Line(new Vector(4, 2, -1), new Vector(-2, 1))).isEqualTo(new SquareRoot(6)), true);
	assert.is(p1.distanceTo(new Line(new Vector(4, 2, -1), new Vector(-2, 1, 1))).isEqualTo(0), true);
	assert.is(p1.distanceTo(new Plane(new Vector(-2, -4, 2), { rhs: -18 })).isEqualTo(new SquareRoot(6)), true);
	assert.is(p1.distanceTo(new Plane(new Vector(-2, -4))).isEqualTo(0), true);
});

vectorPlaneClass('reflect', () => {
	const ptReflection = p1.reflect(new Vector(4, 2, -1)) as Vector;
	assert.is(ptReflection.isEqualTo(new Vector(2, -2, 1)), true);
	const l1 = new Line(new Vector(4, 2, -1), new Vector(0, 1, 2));
	const lineReflection = p1.reflect(l1) as Line;
	assert.is(lineReflection.isEqualTo(new Line(new Vector(2, -2, 1), new Vector(0, 1, 2))), true);
	const l2 = new Line(new Vector(0, 1, -1), new Vector(4, 1));
	const lineReflection2 = p1.reflect(l2) as Line;
	assert.is(lineReflection2.isEqualTo(new Line(new Vector(2, -2, 1), new Vector(2, -3, 2))), true);
});

vectorPlaneClass('clone', () => {
	const p1Clone = p1.clone();
	p1.rhs = new Fraction(4);
	assert.is(p1.rhs.isEqualTo(4), true);
	assert.is(p1Clone.rhs.isEqualTo(4), false);
});

vectorPlaneClass.run();
