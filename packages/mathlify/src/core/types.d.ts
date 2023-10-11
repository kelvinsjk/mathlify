export interface FractionJSON {
	type: 'fraction';
	num: number;
	den: number;
	args: [number, number];
}

export type TermType =
	| 'term'
	| 'sqrt'
	| 'rational-term'
	| 'expansion-term'
	| 'rational-fn'
	| 'power-fn'
	| 'exp-fn'
	| 'ln-fn'
	| 'sin-fn'
	| 'cos-fn';

export interface TermJSON {
	type: TermType;
	coeff: string;
	signature: string;
	args: [FractionJSON, ...[string, FractionJSON][]];
}

export type ExpressionType =
	| 'expression'
	| 'polynomial'
	| 'extended-polynomial'
	| 'general-fn'
	| 'polynomial-like';

export interface ExpressionJSON {
	type: ExpressionType;
	terms: string[];
	args: TermJSON[];
}

export interface PolynomialJSON extends ExpressionJSON {
	type: 'polynomial';
	variable: string;
	coeffs: string[];
	args2: [FractionJSON[], { variable: string; ascending: boolean }];
}
