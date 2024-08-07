import { renderHTML } from 'djot-temml';

/**
 * generates djot string,
 * using JavaScript's template literal syntax to handle mathematical expressions (both static and dynamic)
 *
 * math: starts with ${}, terminates with \n,
 * display: starts with $${}, terminates with \n\n,
 * display env: starts with $${'align'}, etc.
 * text: starts with @${}, terminates immediately
 */
export function mathlifyDj(strings: TemplateStringsArray, ...values: unknown[]): string {
	return mathlifyGen(modules)(strings, ...values);
}

export function mathlify(strings: TemplateStringsArray, ...values: unknown[]): string {
	return renderHTML(mathlifyDj(strings, ...values));
}

export function mathlifyQED(strings: TemplateStringsArray, ...values: unknown[]): string {
	return renderHTML(
		mathlifyGen(modules, { postContent: { mode: 'auto-math', content: '\\; \\blacksquare' } })(
			strings,
			...values,
		),
	);
}

const modules: Modules = {
	math: (x: string) => `$\`${x}\``,
	display,
	mathEnvs: {
		equation: (x: string) => display(insertEnv('equation', x)),
		align: (x: string) => display(insertEnv('align', x)),
		gather: (x: string) => display(insertEnv('gather', x)),
		alignat: (x: string) => display(insertEnv('alignat', x)),
		equationStar: (x: string) => display(insertEnv('equation*', x)),
		alignStar: (x: string) => display(insertEnv('align*', x)),
		gatherStar: (x: string) => display(insertEnv('gather*', x)),
		alignatStar: (x: string) => display(insertEnv('alignat*', x)),
	},
};

function insertEnv(env: string, content: string, args = ''): string {
	if (env === 'alignat' || env === 'alignat*') {
		let firstLine = content.split('\n')[0];
		if (!firstLine) {
			firstLine = content.split('\n')[1];
		}
		const twoN = firstLine.split('&').length;
		if (twoN % 2 !== 0)
			console.warn(`alignat should have an even number of columns, but got ${twoN} instead`);
		args = `{${Math.floor(twoN / 2)}}`;
	}
	// todo: handle this with regex
	while (content.endsWith('\n') || content.endsWith('\t') || content.endsWith(' ')) {
		content = content.slice(0, content.length - 1);
	}
	return `\\begin{${env}}${args}${content}\n\\end{${env}}`;
}

function display(x: string): string {
	return `$$\`${x}\``;
}

enum Modes {
	text, // 0
	math, // 1
	display, // 2
	mathEnv, // 3
}

export interface Modules {
	math: (x: string) => string;
	display: (x: string) => string;
	mathEnvs?: {
		equation?: (x: string) => string;
		align?: (x: string) => string;
		gather?: (x: string) => string;
		alignat?: (x: string) => string;
		equationStar?: (x: string) => string;
		alignStar?: (x: string) => string;
		gatherStar?: (x: string) => string;
		alignatStar?: (x: string) => string;
	};
}

enum MathEnvs {
	equation,
	equationStar,
	align,
	alignStar,
	gather,
	gatherStar,
	alignat,
	alignatStar,
}

type postContentModes = 'text' | 'math' | 'display' | 'auto-math';

const mathEnvsKeys = [
	'equation',
	'equation*',
	'align',
	'align*',
	'gather',
	'gather*',
	'alignat',
	'alignat*',
] as const;
function isMathEnv(x: string): x is (typeof mathEnvsKeys)[number] {
	return (mathEnvsKeys as readonly string[]).includes(x);
}

const envToMode: Record<(typeof mathEnvsKeys)[number], MathEnvs> = {
	equation: MathEnvs.equation,
	'equation*': MathEnvs.equationStar,
	align: MathEnvs.align,
	'align*': MathEnvs.alignStar,
	gather: MathEnvs.gather,
	'gather*': MathEnvs.gatherStar,
	alignat: MathEnvs.alignat, // triggered by $${'alignat'}{x}
	'alignat*': MathEnvs.alignatStar, // triggered by $${'alignat'}{x}
};

interface MathEnvOptions {
	mathEnv: MathEnvs;
	eqnColumns?: number;
}

// TODO: alignat cols

export function mathlifyGen(
	modules: Modules,
	options?: {
		postContent?: { mode?: postContentModes; content: string };
	},
): (strings: TemplateStringsArray, ...values: unknown[]) => string {
	return (strings: TemplateStringsArray, ...values: unknown[]) => {
		let finalOutput = '';
		let accumulatedEnvOutput = '';
		let mode: Modes = Modes.text;
		let mathEnvOptions: MathEnvOptions = { mathEnv: MathEnvs.equation };
		strings.forEach((str, i) => {
			let nextVal = values[i];
			if (
				nextVal === undefined ||
				nextVal === null ||
				(typeof nextVal === 'object' && Object.keys(nextVal).length === 0)
			)
				nextVal = '';
			if (mode === Modes.text) {
				if (str.endsWith('@')) {
					// continues text mode
					finalOutput += `${str.slice(0, str.length - 1)}${nextVal}`;
				} else {
					// starts new text environment
					[mode, accumulatedEnvOutput, finalOutput, mathEnvOptions] = startNewEnv(
						str,
						'',
						nextVal,
						finalOutput,
					);
				}
			} else if (mode === Modes.math) {
				// checks for \n or \r\n non-greedily
				const regex = /([^]*?)(\r?\n)([^]*)/;
				const match = str.match(regex);
				if (match) {
					// end math mode
					const [, before, newline, after] = match;
					accumulatedEnvOutput += `${before}`;
					if (accumulatedEnvOutput) {
						finalOutput += modules.math(accumulatedEnvOutput);
					}
					[mode, accumulatedEnvOutput, finalOutput, mathEnvOptions] = startNewEnv(
						after,
						newline,
						nextVal,
						finalOutput,
					);
				} else {
					// continue math mode
					if (str.endsWith(`@`)) {
						// TODO: check this
						accumulatedEnvOutput += `${str.slice(0, str.length - 1)}`;
					} else {
						accumulatedEnvOutput += `${str}${nextVal}`;
					}
					// if (i === strings.length - 1) {
					// 	// final string
					// 	finalOutput += modules.math(accumulatedEnvOutput);
					// }
				}
			} else if (mode === Modes.display) {
				// checks for \n\n or \r\n\r\n within str. group into (#1)(#2) where #2 = \n or \r\n and it is done non-greedily
				const regex = /([^]*?)(\r?\n[ \t]*\r?\n)([^]*)/;
				const match = str.match(regex);
				if (match) {
					// end display mode
					const [, before, newline, after] = match;
					accumulatedEnvOutput += before;
					if (accumulatedEnvOutput) {
						finalOutput += modules.display(accumulatedEnvOutput);
					}
					[mode, accumulatedEnvOutput, finalOutput, mathEnvOptions] = startNewEnv(
						after,
						newline,
						nextVal,
						finalOutput,
					);
				} else {
					// continue display mode
					if (str.endsWith(`@`)) {
						// TODO: check this
						accumulatedEnvOutput += `${str.slice(0, str.length - 1)}`;
					} else {
						accumulatedEnvOutput += `${str}${nextVal}`;
					}
					// if (i === strings.length - 1) {
					// 	// final string
					// 	finalOutput += modules.display(accumulatedEnvOutput);
					// }
				}
			} else if (mode === Modes.mathEnv) {
				// checks for \n\n or \r\n\r\n within str. group into (#1)(#2) where #2 = \n or \r\n and it is done non-greedily
				const regex = /([^]*?)(\r?\n[ \t]*\r?\n)([^]*)/;
				const match = str.match(regex);
				if (match) {
					// end mathEnv mode
					const [, before, newline, after] = match;
					accumulatedEnvOutput += before;
					if (accumulatedEnvOutput) {
						finalOutput += insertMathEnv(mathEnvOptions, accumulatedEnvOutput, modules);
					}
					[mode, accumulatedEnvOutput, finalOutput, mathEnvOptions] = startNewEnv(
						after,
						newline,
						nextVal,
						finalOutput,
					);
				} else {
					// continue mathEnv mode
					if (str.endsWith(`@`)) {
						// TODO: check this.
						accumulatedEnvOutput += `${str.slice(0, str.length - 1)}`;
					} else {
						accumulatedEnvOutput += `${str}${nextVal}`;
					}
					// if (i === strings.length - 1) {
					// 	// final string
					// 	finalOutput += insertMathEnv(mathEnvOptions, accumulatedEnvOutput, modules);
					// }
				}
			}
		});
		// handle accumulated value and post content
		if (accumulatedEnvOutput) {
			const currentMode = mode as Modes;
			if (options?.postContent) {
				const finalMode = options.postContent.mode ?? 'auto-math';
				const content = options.postContent.content;
				if (currentMode === Modes.text && finalMode === 'text') {
					finalOutput += accumulatedEnvOutput + content;
				} else if (
					currentMode === Modes.math &&
					(finalMode === 'math' || finalMode === 'auto-math')
				) {
					finalOutput += modules.math(accumulatedEnvOutput + content);
				} else if (
					currentMode === Modes.display &&
					(finalMode === 'display' || finalMode === 'auto-math')
				) {
					finalOutput += modules.display(accumulatedEnvOutput + content);
				} else if (currentMode === Modes.mathEnv && finalMode === 'auto-math') {
					finalOutput += insertMathEnv(mathEnvOptions, accumulatedEnvOutput + content, modules);
				} else {
					// new env. append final value first
					if (currentMode === Modes.text) {
						finalOutput += accumulatedEnvOutput;
					} else if (currentMode === Modes.math) {
						finalOutput += modules.math(accumulatedEnvOutput);
					} else if (currentMode === Modes.display) {
						finalOutput += modules.display(accumulatedEnvOutput);
					} else {
						finalOutput += insertMathEnv(mathEnvOptions, accumulatedEnvOutput, modules);
					}
					// handle post content
					if (finalMode === 'text') {
						finalOutput += content;
					} else if (finalMode === 'math' || finalMode === 'auto-math') {
						finalOutput += modules.math(content);
					} else if (finalMode === 'display') {
						finalOutput += modules.display(content);
					}
				}
			} else {
				if (currentMode === Modes.math) {
					finalOutput += modules.math(accumulatedEnvOutput);
				} else if (currentMode === Modes.display) {
					finalOutput += modules.display(accumulatedEnvOutput);
				} else {
					finalOutput += insertMathEnv(mathEnvOptions, accumulatedEnvOutput, modules);
				}
			}
		} else if (options?.postContent) {
			const { mode, content } = options.postContent;
			if (mode === 'text') {
				finalOutput += content;
			} else if (mode === 'math' || mode === 'auto-math') {
				finalOutput += modules.math(content);
			} else if (mode === 'display') {
				finalOutput += modules.display(content);
			}
		}
		return finalOutput;
	};
}

// returns [Mode, acc, curr, {mathEnv, eqnColumns?}]
function startNewEnv(
	after: string,
	newline: string,
	nextVal: unknown,
	curr: string,
): [Modes, string, string, MathEnvOptions] {
	const defaultMathEnvOptions = { mathEnv: MathEnvs.equation };
	let mathEnvOptions: MathEnvOptions = defaultMathEnvOptions;
	if (after.endsWith('$')) {
		let x = `${nextVal}`;
		let mode = Modes.display;
		if (isMathEnv(x)) {
			// new math env
			mode = Modes.mathEnv;
			mathEnvOptions = { mathEnv: envToMode[x] };
			//TODO: handle alignat cols
			x = '';
		}
		// new display mode
		return [mode, x, curr + `${newline}${after.slice(0, after.length - 1)}`, mathEnvOptions];
	} else if (after.endsWith('@')) {
		// new text mode
		return [
			Modes.text,
			'',
			curr + `${newline}${after.slice(0, after.length - 1)}${nextVal}`,
			defaultMathEnvOptions,
		];
	} else {
		// new math mode
		return [Modes.math, `${nextVal}`, curr + newline + after, defaultMathEnvOptions];
	}
}

function insertMathEnv(mathEnvOptions: MathEnvOptions, acc: string, modules: Modules): string {
	const mathEnv = mathEnvOptions.mathEnv;
	if (mathEnv === MathEnvs.equation) {
		return modules.mathEnvs?.equation ? modules.mathEnvs.equation(acc) : acc;
	} else if (mathEnv === MathEnvs.equationStar) {
		return modules.mathEnvs?.equationStar ? modules.mathEnvs.equationStar(acc) : acc;
	} else if (mathEnv === MathEnvs.align) {
		return modules.mathEnvs?.align ? modules.mathEnvs.align(acc) : acc;
	} else if (mathEnv === MathEnvs.alignStar) {
		return modules.mathEnvs?.alignStar ? modules.mathEnvs.alignStar(acc) : acc;
	} else if (mathEnv === MathEnvs.gather) {
		return modules.mathEnvs?.gather ? modules.mathEnvs.gather(acc) : acc;
	} else if (mathEnv === MathEnvs.gatherStar) {
		return modules.mathEnvs?.gatherStar ? modules.mathEnvs.gatherStar(acc) : acc;
	} else if (mathEnv === MathEnvs.alignat) {
		return modules.mathEnvs?.alignat ? modules.mathEnvs.alignat(acc) : acc;
	} else if (mathEnv === MathEnvs.alignatStar) {
		return modules.mathEnvs?.alignatStar ? modules.mathEnvs.alignatStar(acc) : acc;
	}
	console.warn(`mathEnv ${mathEnv} not found`);
	return acc;
}
