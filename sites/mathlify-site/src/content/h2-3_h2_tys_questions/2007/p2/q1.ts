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

export const question = new Question();

const matrix = [
	[1.15, 0.6, 0.55, 8.28],
	[1.2, 0.45, 0.3, 6.84],
	[2.15, 0.9, 0.65, 13.05]
];
const leeLian = [1.3, 0.25, 0.5];
const rows = ['| :-- | :---: | :---: | :---: | :---: |', '| | Suresh | Fandi | Cindy | Lee Lian |'];
const headings = ['Pineapples (kg)', 'Mangoes (kg)', 'Lychees (kg)', 'Total amount paid in \\$'];
for (let i = 0; i < 4; i++) {
	rows.push(
		`| ${headings[i]} | ${matrix[0][i].toFixed(2)} | ${matrix[1][i].toFixed(2)} | ${matrix[2][i].toFixed(2)} | ${leeLian[i]?.toFixed(2) ?? ''} |`
	);
}
const table = rows.join('\n');

question.addBody(
	mathlifier`Four friends buy three different kinds of fruit in the market. When they get home they cannot remember
the individual prices per kilogram, but three of them can remember the total amount that they each
paid.

The weights of fruit and the total amounts paid are shown in the following table.

@${table}

Assuming that, for each variety of fruit, the price per kilogram paid by each of the friends is the same,
calculate the total amount that Lee Lian paid.`,
	{ marks: 6 }
);
