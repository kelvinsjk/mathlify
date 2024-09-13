export class Question {
	question: QuestionObject;

	constructor(questionBody?: string) {
		const question: QuestionObject = {};
		if (questionBody) question['body'] = questionBody;
		this.question = question;
	}

	addBody(body?: string, options?: { marks?: number }) {
		if (body !== undefined) this.question['body'] = body;
		if (options?.marks !== undefined) this.question['marks'] = options.marks;
	}
	newPart() {
		if (this.question['parts'] === undefined) {
			this.question['parts'] = [{}];
		} else {
			this.question.parts.push({});
		}
	}
	addPart(body?: string, options?: { marks?: number; uplevel?: string }) {
		if (this.question['parts'] === undefined) this.question['parts'] = [];
		if (body !== undefined) this.question['parts'].push({ body, ...options });
	}
	addSubPart(body?: string, options?: { marks?: number; uplevel?: string }) {
		if (this.question.parts === undefined) this.question['parts'] = [{}];
		if (this.question.parts.at(-1)!['parts'] === undefined)
			this.question.parts.at(-1)!['parts'] = [];
		if (body !== undefined) this.question.parts.at(-1)?.parts?.push({ body, ...options });
	}

	get marks(): number {
		let mark = this.question['marks'] ?? 0;
		for (const part of this.question['parts'] ?? []) {
			mark += part['marks'] ?? 0;
			for (const subPart of part['parts'] ?? []) {
				mark += subPart['marks'] ?? 0;
			}
		}
		return mark;
	}
}

//export interface QuestionObject {
//	body?: string;
//	marks?: number;
//	parts?: QuestionPart[];
//}
//export interface QuestionPart extends QuestionObject {
//	uplevel?: string;
//}

import { z } from 'zod';

const baseSchema = z.object({
	body: z.string().optional(),
	marks: z.number().optional(),
	uplevel: z.string().optional()
});
type QuestionPart = z.infer<typeof baseSchema> & {
	parts?: QuestionPart[];
};
const questionPartSchema: z.ZodType<QuestionPart> = baseSchema.extend({
	parts: z.lazy(() => questionPartSchema.array().optional())
});
export const questionSchema = z.object({
	body: z.string().optional(),
	marks: z.number().optional(),
	parts: questionPartSchema.array().optional()
});
export type QuestionObject = z.infer<typeof questionSchema>;
