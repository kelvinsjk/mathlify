export interface AnswerObject {
	body?: string;
	parts?: AnswerPart[];
	partLabelType?: 'alpha' | 'roman';
}

export interface AnswerPart extends AnswerObject {
	partNo?: number;
}
