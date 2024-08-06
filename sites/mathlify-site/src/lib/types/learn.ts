export interface Section extends Subsection {
	subsections: Subsection[];
}

interface Subsection {
	title: string;
	slug: string;
	shortTitle: string;
}

export interface ChapterOnly {
	title: string;
	shortTitle: string;
	slug: string;
}

export interface Chapter extends ChapterOnly {
	sections?: Section[];
}

export interface PracticeQuestion {
	qn: string;
	ans: string;
	soln?: string;
	objectives?: Set<string>;
}
export type SupportedTypes =
	| string
	| number
	| boolean
	| undefined
	| Array<number>
	| Array<boolean>
	| Array<string>;
interface SupportedTypesObject {
	[key: string]: SupportedTypes | SupportedTypesObject;
}
export type PracticeState = Record<string, SupportedTypes | SupportedTypesObject>;
export interface Practice {
	objectives?: Set<string>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	generateState: (...args: any[]) => PracticeState;
	generateQn: (state: PracticeState, ...args: unknown[]) => PracticeQuestion;
}
