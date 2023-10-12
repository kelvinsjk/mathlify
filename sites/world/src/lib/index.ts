// types for contents page

interface SubSection {
	title: string;
}

interface Section {
	title: string;
	subsections: SubSection[];
}

/**
 * Array of Content Items
 * `{ [key: string]: {title: string}[] }`
 */
export type Contents = NonEmptyArray<Section>;

type NonEmptyArray<T> = [T, ...T[]];

// types for page data

export const contentElements = ['h2', 'h3', 'p'] as const;
export const staticElements = ['example'] as const;
export const dynamicElements = ['iExample', 'iQn'] as const;
export const elements = [...staticElements, staticElements, ...dynamicElements] as const;

type Element =
	| {
			type: (typeof contentElements)[number];
			props: {
				content: string;
			};
	  }
	| {
			type: (typeof staticElements)[number];
			props: {
				content: string;
				title?: string;
			};
	  }
	| {
			type: (typeof dynamicElements)[number];
			props: {
				generator: (...args: any[]) => string;
				argsGenerator: () => unknown[] | unknown;
				initialArg?: unknown;
				title?: string;
			};
	  };

export class PageContent {
	elements: Element[];
	constructor(...elements: Element[]) {
		this.elements = elements;
	}

	get content() {
		return this.elements;
	}

	section(title: string) {
		this.elements.push({ type: 'h2', props: { content: title } });
	}

	subsection(title: string) {
		this.elements.push({ type: 'h3', props: { content: title } });
	}

	text(content: string) {
		this.elements.push({ type: 'p', props: { content } });
	}

	example(content: string, title?: string) {
		this.elements.push({ type: 'example', props: { content, title } });
	}

	iExample(
		generator: (...args: any[]) => string,
		argsGenerator: () => unknown[] | unknown,
		options?: { initialArg?: unknown; title?: string }
	) {
		this.elements.push({ type: 'iExample', props: { generator, argsGenerator, ...options } });
	}

	iQn(
		generator: (...args: any[]) => string,
		argsGenerator: () => unknown[] | unknown,
		options?: { initialArg?: unknown; title?: string }
	) {
		this.elements.push({ type: 'iQn', props: { generator, argsGenerator, ...options } });
	}
}
