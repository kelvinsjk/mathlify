export type FractionJSON = {
	type: 'fraction';
	num: number;
	den: number;
	args: [number, number];
};

/**
 * @typedef {import('./fraction.js').} FractionJSON
 * @typedef {Object} TermJSON
 * @property {TermType} type 'term'
 * @property {string} coeff coefficient string
 * @property {string} signature term signature string
 * @property {[FractionJSON, ...[string, Fraction][]]} args - array of arguments to reconstruct current term
 */

export type TermType =
	| 'term'
	| 'rational-term'
	| 'expansion-term'
	| 'sqrt'
	| 'rational-fn'
	| 'power-fn'
	| 'exp-fn'
	| 'ln-fn'
	| 'sin-fn'
	| 'cos-fn';

export type TermJSON = {
	type: TermType;
	coeff: string;
	signature: string;
	args: [FractionJSON, ...[string, FractionJSON][]];
};
