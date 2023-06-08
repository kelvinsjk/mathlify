import { chapter0 } from './chapter0';
import { chapter1 } from './chapter1';

export const chapters: Chapter[] = [chapter0, chapter1];

export interface Chapter {
	title: string;
	shortTitle: string;
	description: string;
	sections: Section[];
}

interface Section {
	title: string;
	description: string;
	shortTitle: string;
	subsections: Subsection[];
}

type Subsection = {
	slug: string;
	title: string;
	shortTitle: string;
};
