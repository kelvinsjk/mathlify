export interface AnswerObject {
	body?: string;
	parts?: AnswerPart[];
	partLabelType?: 'alpha' | 'roman';
}

export interface AnswerPart extends AnswerObject {
	partNo?: number;
}

export interface QuestionObject {
	body?: string;
	marks?: number;
	parts?: QuestionPart[];
	partLabelType?: 'alpha' | 'roman';
}

export interface QuestionPart extends QuestionObject {
	partNo?: number;
	uplevel?: string;
}
