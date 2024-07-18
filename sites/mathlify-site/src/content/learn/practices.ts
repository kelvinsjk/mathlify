import { practices as h2Practices } from './h2/practices';

export interface PracticeQuestion {
	qn: string;
	answer: string;
	solution?: string;
	objectives?: Set<string>;
}

export type PracticeState = Record<string, string | number | boolean>;
export interface Practice {
	objectives?: Set<string>;
	generateState: (...args: unknown[]) => PracticeState;
	generateQn: (state: PracticeState, ...args: unknown[]) => PracticeQuestion;
}

export const practices: Record<string, Record<string, Record<string, Record<string, Practice>>>> = {
	h2: h2Practices,
};
