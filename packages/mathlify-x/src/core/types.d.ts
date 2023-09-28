export type FractionJSON = {
	type: 'fraction';
	num: number;
	den: number;
	args: [number, number];
};

export type TermJSON = {
	type: TermType;
	coeff: string;
	signature: string;
	args: [FractionJSON, ...[string, FractionJSON][]];
};

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

export type ExpressionType =
	| 'expression'
	| 'polynomial'
	| 'extended-polynomial'
	| 'general-fn'
	| 'polynomial-like';
