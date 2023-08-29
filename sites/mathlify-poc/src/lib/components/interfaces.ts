export interface AnswerObject {
	body?: string;
	parts?: AnswerPart[];
	partLabelType?: 'alpha' | 'roman';
}

export interface AnswerPart extends AnswerObject {
	partNo?: number;
}

export type NumberArray6 = [number, number, number, number, number, number];
export type NumberArray12 = [
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
];
export type NumberArray20 = [
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
];
