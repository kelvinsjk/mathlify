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
import { Vector } from 'mathlify/vectors';

export const question = new Question();

// a: i-j+2k
// b: 2i+4j+k
// c: -4i+2j+2k
const a = new Vector(1, -1, 2, { stringMode: 'ijk' });
const b = new Vector(2, 4, 1, { stringMode: 'ijk' });
const c = new Vector(-4, 2, 2, { stringMode: 'ijk' });

question.addBody(
	mathlifier`Referred to the origin ${'O'},
the position vectors of the points ${'A'}
and ${'B'}
are

$${{}} ${a} \\quad \\text{and} \\quad ${b}

respectively.`
);
// a
{
	question.addPart(
		mathlifier`Show that the ${'OA'}
is perpendicular to ${'OB'}.`,
		{ marks: 2 }
	);
}
// b
{
	question.addPart(
		mathlifier`Find the position vector of the
point ${'M'}
on the line segment ${'AB'}
such that ${{}} {AM:MB = 1: 2.}`,
		{ marks: 3 }
	);
}
// c
{
	question.addPart(
		mathlifier`The position vector ${'C'}
has position vector ${{}} {${c}.}
Use a vector product to find the exact
area of triangle ${'OAC.'}`,
		{ marks: 4 }
	);
}
