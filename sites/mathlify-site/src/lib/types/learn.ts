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
	solution?: string;
	objectives?: Set<string>;
}
type SupportedTypes = string | number | boolean | undefined;
export type PracticeState = Record<string, SupportedTypes | Record<string, SupportedTypes>>;
export interface Practice {
	objectives?: Set<string>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	generateState: (...args: any[]) => PracticeState;
	generateQn: (state: PracticeState, ...args: unknown[]) => PracticeQuestion;
}
