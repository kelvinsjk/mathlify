import type { Practice, PracticeQuestion, PracticeState } from '../../../practices';

export function generateState(): PracticeState {
	const a = Math.floor(Math.random() * 10) - 5;
	return { a };
}

export function generateQn(): PracticeQuestion {
	return {
		qn: 'What is the interval?',
		answer: '[-∞, ∞]',
	};
}

export const practice: Practice = {
	generateQn,
	generateState,
};
