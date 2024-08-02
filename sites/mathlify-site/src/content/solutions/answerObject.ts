import type { AnswerObject } from '$lib/types/question';

export class Answer {
	answer: AnswerObject;
	solution: AnswerObject;

	constructor(answerBody?: string, solutionBody?: string) {
		const answer: AnswerObject = {};
		const solution: AnswerObject = {};
		if (answerBody) answer['body'] = answerBody;
		if (solutionBody) solution['body'] = solutionBody;
		this.answer = answer;
		this.solution = solution;
	}

	addBody(answerBody?: string, solutionBody?: string) {
		if (answerBody) this.answer['body'] = answerBody;
		if (solutionBody) this.solution['body'] = solutionBody;
	}
	newPart() {
		if (this.answer['parts'] === undefined) {
			this.answer['parts'] = [{}];
		} else {
			this.answer.parts.push({});
		}
		if (this.solution['parts'] === undefined) {
			this.solution['parts'] = [];
		} else {
			this.solution.parts.push({});
		}
	}
	addPart(answerBody?: string, solutionBody?: string) {
		if (this.answer['parts'] === undefined) this.answer['parts'] = [];
		if (this.solution['parts'] === undefined) this.solution['parts'] = [];
		if (answerBody) this.answer['parts'].push({ body: answerBody });
		if (solutionBody) this.solution['parts'].push({ body: solutionBody });
	}
	addSubPart(answerBody?: string, solutionBody?: string) {
		if (this.answer.parts === undefined) this.answer['parts'] = [{}];
		if (this.solution.parts === undefined) this.solution['parts'] = [{}];
		if (this.answer.parts.at(-1)!['parts'] === undefined) this.answer.parts.at(-1)!['parts'] = [];
		if (this.solution.parts.at(-1)!['parts'] === undefined)
			this.solution.parts.at(-1)!['parts'] = [];
		if (answerBody) this.answer.parts.at(-1)?.parts?.push({ body: answerBody });
		if (solutionBody) this.solution.parts.at(-1)?.parts?.push({ body: solutionBody });
	}
}
