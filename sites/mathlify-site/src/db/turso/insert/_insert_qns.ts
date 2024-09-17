import { turso } from '../..';
import { tysQuestions } from '../qns-techniques';

const parts: {
	id: string;
	year: number;
	paper: number;
	question: number;
	part: number;
	subpart?: number;
}[] = [];

const qs: [number, number, number, number | number[]][] = [
	[2007, 1, 2, [0, 0]],
	[2008, 2, 4, [0, 0, 0, 0]],
	[2009, 2, 3, [0, 0, 0]],
	[2010, 2, 4, [0, 0, 0, 0, 0]],
	[2011, 2, 3, [0, 0, 0]],
	[2012, 1, 7, [0, 0, 0]],
	[2013, 2, 1, [0, 0]],
	[2022, 1, 6, [0, 0, 0, 0]],
	[2023, 1, 7, [0, 0, 0, 0, 0]]
];
for (const q of qs) {
	const [year, paper, question, pArr] = q;
	if (!Array.isArray(pArr)) {
		// only body
		parts.push({
			id: `${year}/p${paper}/q${question}`,
			year,
			paper,
			question,
			part: 0
		});
		continue;
	}
	for (const [i, p] of pArr.entries()) {
		if (p === 0) {
			// only part, no subpart
			parts.push({
				id: `${year}/p${paper}/q${question}/${toPartLabel(i + 1)}`,
				year,
				paper,
				question,
				part: i + 1
			});
			continue;
		}
		for (let j = 0; j < p; j++) {
			parts.push({
				id: `${year}/p${paper}/q${question}/${toPartLabel(i + 1)}/${toSubpartLabel(j + 1)}`,
				year,
				paper,
				question,
				part: i + 1,
				subpart: j + 1
			});
		}
	}
}

const result = await turso.insert(tysQuestions).values(parts);

console.log(result);

function toPartLabel(p: number): string {
	return String.fromCharCode(96 + p);
}
function toSubpartLabel(p: number): string {
	const romans = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
	return romans[p];
}
