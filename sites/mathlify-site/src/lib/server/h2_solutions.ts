import type { AnswerObject, Answer } from '$lib/classes/answer';

type Data = {
	answer: AnswerObject;
	solution: AnswerObject;
};

import { z } from 'zod';
const solutionsSchema = z.object({
	answer: z.custom<Answer>()
});

export const preprocess: {
	module: (module: unknown) => Data;
} = {
	module: (module: unknown) => {
		const mod = solutionsSchema.parse(module);
		return { answer: mod.answer.answer, solution: mod.answer.solution };
	}
};

// export function toTex(module: unknown): {
// 	documentclass: string;
// 	classoption: string | string[];
// 	'header-includes': string;
// 	content: string;
// } {
// 	const mod = solutionsSchema.parse(module);
// 	let content = '\\begin{questions}\n';
// 	for (const qn of mod.exam) {
// 		let qnTex = '\\question';
// 		if (qn.marks) qnTex += `[${qn.marks}]`;
// 		qnTex += '\n';
// 		if (qn.body) qnTex += qn.body;
// 		if (qn.parts) qnTex += partsToTex(qn.parts);
// 		if (qn.marks) qnTex += '\\droppoints\n';
// 		content += qnTex;
// 	}
// 	content += '\\end{questions}\n';
// 	return {
// 		documentclass: 'exam',
// 		classoption: '12pt',
// 		'header-includes': `\\usepackage{amsmath,amssymb}
// \\pointsinrightmargin
// \\bracketedpoints
// \\pointsdroppedatright`,
// 		content
// 	};
// }

// function partsToTex(qns: Question[], subparts = false): string {
// 	const parts = subparts ? 'subparts' : 'parts';
// 	const part = subparts ? 'subpart' : 'part';
// 	let partsTex = `\\begin{${parts}}\n`;
// 	for (const qn of qns) {
// 		let partTex = `\\${part}`;
// 		if (qn.marks) partTex += `[${qn.marks}]`;
// 		partTex += '\n';
// 		if (qn.body) partTex += qn.body;
// 		if (qn.parts) partTex += partsToTex(qn.parts, true);
// 		partsTex += partTex;
// 		if (qn.marks) partsTex += `\n\\droppoints\n`;
// 	}
// 	partsTex += `\\end{${parts}}\n`;
// 	return partsTex;
// }
