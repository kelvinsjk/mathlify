import type {
	Fraction,
	SquareRoot,
	Vector,
	Term,
	Expression,
	Line,
	Plane,
	Complex,
	Polynomial,
} from 'mathlify';

export interface AnswerObject {
	body?: string;
	marks?: number;
	parts?: AnswerPart[];
	partLabelType?: string;
}

export interface AnswerPart extends AnswerObject {
	partNo?: number;
	uplevel?: string;
}

export interface QuestionVariables {
	variant?: number;
	answers: Answer[];
}

export interface Answer {
	type:
		| 'integer'
		| 'decimal'
		| 'fraction'
		| 'vector'
		| 'line'
		| 'coordinates'
		| 'sqrt'
		| 'multi'
		| 'mcq'
		| 'plane'
		| 'complex'
		| 'polynomial';
	name?: string;
	value?: Fraction | SquareRoot | number | Vector | number[] | Line | Plane | Complex | Polynomial;
	options?: string[];
	parallel?: boolean;
	approx?: boolean;
	specialCase?: string;
	units?: string;
}

export interface Question {
	(variables?: {
		[key in string]: boolean | Fraction | SquareRoot | Vector | string | Term | Expression | number;
	}): [AnswerObject, AnswerObject, QuestionVariables];
}

export interface VarsPrimitive {
	[key: string]: string | number | boolean;
}
export interface StringObject {
	[key: string]: string;
}
