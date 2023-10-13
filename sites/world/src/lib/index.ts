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

export const contentElements = ['h2', 'h3', 'p', 'display'] as const;
export const elements = [...contentElements, 'example', 'iExample', 'iQn'] as const;

type Element =
	| {
			type: (typeof contentElements)[number];
			props: {
				content: string;
			};
	  }
	| {
			type: 'example';
			props: {
				content: string;
				title?: string;
			};
	  }
	| {
			type: 'iExample';
			props: {
				generator: (...args: any[]) => string;
				argsGenerator: () => unknown;
				initialArg?: unknown;
				title?: string;
				plural?: boolean;
			};
	  }
	| {
			type: 'iQn';
			props: {
				generator: (...args: any[]) => [string, string];
				argsGenerator: () => unknown;
				initialArg?: unknown;
				title?: string;
				preamble?: string;
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

	display(content: string) {
		this.elements.push({ type: 'display', props: { content } });
	}

	text(content: string) {
		this.elements.push({ type: 'p', props: { content } });
	}

	example(content: string, options?: { title?: string; plural?: boolean }) {
		this.elements.push({ type: 'example', props: { content, ...options } });
	}

	iExample(
		/*eslint @typescript-eslint/no-explicit-any: ["error", { "ignoreRestArgs": true }]*/
		generator: (...args: any[]) => string,
		argsGenerator: () => unknown,
		options?: { initialArgs?: unknown; title?: string; plural?: boolean }
	) {
		this.elements.push({ type: 'iExample', props: { generator, argsGenerator, ...options } });
	}

	iQn(
		generator: (...args: any[]) => [string, string],
		argsGenerator: () => unknown,
		options?: { initialArgs?: unknown; title?: string; preamble: string }
	) {
		this.elements.push({ type: 'iQn', props: { generator, argsGenerator, ...options } });
	}
}
