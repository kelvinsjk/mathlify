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
