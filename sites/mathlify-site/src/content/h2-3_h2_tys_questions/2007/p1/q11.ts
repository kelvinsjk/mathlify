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
import { dxString } from '$lib/typesetting/math';
import { mathlifierDj as mathlifier } from 'mathlifier';

export const question = new Question();

question.addBody(mathlifier`A curve has parametric equations
	
$${{}} x = \\cos^2 t, \\quad y = \\sin^3 t, \\quad \\text{for } 0 \\leq t \\leq \\tfrac{1}{2}\\pi.`);

// a
question.addPart(mathlifier`Sketch the curve.`, { marks: 2 });
// b
question.addPart(
	mathlifier`The tangent to the curve at the point ${{}} {\\left( \\cos^2 \\theta, \\sin^3 \\theta \\right),}
where ${{}} {0 < \\theta < \\frac{1}{2}\\pi,}
meets the ${'x\\text{-}'}
and ${'y\\text{-axes}'}
at ${'Q'}
and ${'R'}
respectively.

The origin is denoted by ${'O'}.
Show that the area of triangle ${'OQR'}
is

$${{}} \\tfrac{1}{12} \\sin \\theta \\left( 3 \\cos^2 \\theta + 2 \\sin^2 \\theta \\right)^2.`,
	{ marks: 6 }
);
// c
question.addPart(
	mathlifier`Show that the area under the curve for ${{}} {0 \\leq t \\leq \\frac{1}{2}\\pi}
is 

$${{}} \\int_0^{\\frac{1}{2}\\pi} \\cos t \\sin^4 t ${dxString('t')},

and use the substitution ${{}}{\\sin t = u}
to find this area.`,
	{ marks: 5 }
);
