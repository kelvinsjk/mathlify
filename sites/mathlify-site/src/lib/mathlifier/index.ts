/**
 * generates djot string,
 * using JavaScript's template literal syntax to handle mathematical expressions (both static and dynamic)
 *
 * math: starts with ${}, terminates with \n,
 * display: starts with $${}, terminates with \n\n,
 * display env: starts with $${'align'}, etc.
 * text: starts with @${}, terminates immediately
 */
export function mathlify(strings: TemplateStringsArray, ...values: unknown[]): string {
	return mathlifyGen(modules)(strings, ...values);
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
): (strings: TemplateStringsArray, ...values: unknown[]) => string {
	return (strings: TemplateStringsArray, ...values: unknown[]) => {
		let currentModeString = '';
		let output = '';
		let mode = Modes.text;
		let mathEnvOptions: MathEnvOptions = { mathEnv: MathEnvs.equation };
		strings.forEach((str, i) => {
			const nextVal = values[i] ?? '';
			if (mode === Modes.text) {
				if (str.endsWith('@')) {
					// continues text mode
					currentModeString += `${str.slice(0, str.length - 1)}${nextVal}`;
				} else {
					// starts new text environment
					[mode, output, currentModeString, mathEnvOptions] = startNewEnv(
						str,
						'',
						nextVal,
						currentModeString,
					);
				}
			} else if (mode === Modes.math) {
				// checks for \n or \r\n non-greedily
				const regex = /([^]*?)(\r?\n)([^]*)/;
				const match = str.match(regex);
				if (match) {
					// end math mode
					const [, before, newline, after] = match;
					output += `${before}`;
					if (output) {
						currentModeString += modules.math(output);
					}
					[mode, output, currentModeString, mathEnvOptions] = startNewEnv(
						after,
						newline,
						nextVal,
						currentModeString,
					);
				} else {
					// continue math mode
					if (str.endsWith(`@`)) {
						// TODO: check this
						output += `${str.slice(0, str.length - 1)}`;
					} else {
						output += `${str}${nextVal}`;
					}
					if (i === strings.length - 1) {
						// final string
						currentModeString += modules.math(output);
					}
				}
			} else if (mode === Modes.display) {
				// checks for \n\n or \r\n\r\n within str. group into (#1)(#2) where #2 = \n or \r\n and it is done non-greedily
				const regex = /([^]*?)(\r?\n[ \t]*\r?\n)([^]*)/;
				const match = str.match(regex);
				if (match) {
					// end display mode
					const [, before, newline, after] = match;
					output += before;
					if (output) {
						currentModeString += modules.display(output);
					}
					[mode, output, currentModeString, mathEnvOptions] = startNewEnv(
						after,
						newline,
						nextVal,
						currentModeString,
					);
				} else {
					// continue display mode
					if (str.endsWith(`@`)) {
						// TODO: check this
						output += `${str.slice(0, str.length - 1)}`;
					} else {
						output += `${str}${nextVal}`;
					}
					if (i === strings.length - 1) {
						// final string
						currentModeString += modules.display(output);
					}
				}
			} else if (mode === Modes.mathEnv) {
				// checks for \n\n or \r\n\r\n within str. group into (#1)(#2) where #2 = \n or \r\n and it is done non-greedily
				const regex = /([^]*?)(\r?\n[ \t]*\r?\n)([^]*)/;
				const match = str.match(regex);
				if (match) {
					// end mathEnv mode
					const [, before, newline, after] = match;
					output += before;
					if (output) {
						currentModeString += insertMathEnv(mathEnvOptions, output, modules);
					}
					[mode, output, currentModeString, mathEnvOptions] = startNewEnv(
						after,
						newline,
						nextVal,
						currentModeString,
					);
				} else {
					// continue mathEnv mode
					if (str.endsWith(`@`)) {
						// TODO: check this.
						output += `${str.slice(0, str.length - 1)}`;
					} else {
						output += `${str}${nextVal}`;
					}
					if (i === strings.length - 1) {
						// final string
						currentModeString += insertMathEnv(mathEnvOptions, output, modules);
					}
				}
			}
		});
		return currentModeString;
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
