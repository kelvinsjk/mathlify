import type { QuestionObject } from '$lib/types/question';
export class Question {
	qn: QuestionObject;

	constructor() {
		this.qn = {};
	}

	addBody(body: string, otherParams?: { marks?: number; partLabelType?: 'alpha' | 'roman' }) {
		this.qn.body = body;
		if (otherParams?.marks) this.qn.marks = otherParams.marks;
		if (otherParams?.partLabelType) this.qn.partLabelType = otherParams.partLabelType;
	}
	newPart() {
		if (this.qn['parts'] === undefined) {
			this.qn['parts'] = [{}];
		} else {
			this.qn.parts.push({});
		}
	}
	addPart(
		body: string,
		otherParams?: { marks?: number; partLabelType?: 'alpha' | 'roman'; uplevel?: string },
	) {
		if (this.qn['parts'] === undefined) this.qn['parts'] = [];
		this.qn.parts.push({ body, ...otherParams });
	}
	addSubPart(
		body: string,
		otherParams: { marks?: number; partLabelType?: 'alpha' | 'roman'; uplevel?: string },
	) {
		if (this.qn.parts === undefined) this.qn['parts'] = [{}];
		if (this.qn.parts.at(-1)!['parts'] === undefined) this.qn.parts.at(-1)!['parts'] = [];
		this.qn.parts.at(-1)?.parts?.push({ body, ...otherParams });
	}
}
