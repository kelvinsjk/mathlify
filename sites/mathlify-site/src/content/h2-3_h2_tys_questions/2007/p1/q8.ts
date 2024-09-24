/* The question here is the copyright of 
- Singapore Examinations and Assessment Board
- Cambridge Assessment International Education
- Ministry of Education, Singapore
- Government of Singapore

We provide this question on Mathlify under fair use for archival purposes.
These are questions more than 10 years old and are difficult to obtain
commercially.

For the newer questions, please purchase a copy of the
"ten year series" from authorized publishers and distributors.
*/

import { Question } from '$lib/classes/question';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Vector, Plane } from 'mathlify/vectors';

export const question = new Question();

// A (1,2,4)
// B (-2,3,1)
// p: 3x-y+2z = 17
const A = new Vector(1, 2, 4, { stringMode: 'coordinates' });
const B = new Vector(-2, 3, 1, { stringMode: 'coordinates' });
const n = new Vector(3, -1, 2);
const rhs = 17;
const p = new Plane(n, { rhs, stringMode: 'cartesian' });

question.addBody(
	mathlifier`The line ${'l'}
passes through the points ${'A'}
and ${'B'}
with coordinates ${{}} {${A}}
and ${{}} {${B}}
respectively.

The plane ${'p'}
has equation ${{}} {${p}.}
Find`
);
// a
{
	question.addPart(
		mathlifier`the coordinates of the point of intersection of ${'l'}
and ${'p'},`,
		{ marks: 5 }
	);
}
// b
{
	question.addPart(
		mathlifier`The acute angle between ${'l'}
and ${'p'},`,
		{ marks: 3 }
	);
}
// c
{
	question.addPart(
		mathlifier`The perpendicular distance from ${'A'}
to ${'p'}.`,
		{ marks: 3 }
	);
}
