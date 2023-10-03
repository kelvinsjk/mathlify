import { TermJSON, FractionJSON } from '../core/types';

export interface SqrtJSON extends TermJSON {
	type: 'sqrt';
	radicand: number;
	args2: [number, { coeff: FractionJSON }];
}
