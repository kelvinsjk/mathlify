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

import { Polynomial } from 'mathlify';
import { Question } from '$lib/classes/question';
import { mathlifierDj as mathlifier } from 'mathlifier';

export const question = new Question();

//f(x) = 1/(x-3)
//g(x) = x^2

const a = -3;
const f = new Polynomial([1, a]).reciprocal();
const g = Polynomial.ofDegree(2);

question.addBody(
	mathlifier`Functions ${'f'}
and ${'g'}
are defined by
$${'align*'}
&f: x \\mapsto ${f}  \\quad && \\text{for } x \\in \\mathbb{R}, x \\neq 3, \\\\
&g: x \\mapsto ${g}  \\quad && \\text{for } x \\in \\mathbb{R}.
`
);
// a
{
	question.addPart(
		mathlifier`Only one of the
composite functions ${'fg'}
and ${'gf'}
exists. Give a definition (including the domain)
of the composite that exists, and explain why
the other composite does not exist.`,
		{ marks: 3 }
	);
}
// b
{
	question.addPart(
		mathlifier`Find ${'f^{-1}(x)'}
and state the domain of ${'f^{-1}'}.`,
		{ marks: 3 }
	);
}
