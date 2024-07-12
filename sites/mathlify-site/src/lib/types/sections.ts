export interface Section extends Subsection {
	subsections: Subsection[];
}

interface Subsection {
	title: string;
	slug: string;
	shortTitle: string;
}
