import { FractionJSON } from '../fractionClass';

export class MathSymbol {
	kind: string;
	symbol: string;

	constructor(symbol: string, options?: { kind?: string }) {
		const { kind } = {
			kind: 'symbol',
			...options,
		};
		this.kind = kind;
		this.symbol = symbol;
	}

	toString(): string {
		return this.symbol;
	}

	/**
	 * toJSON method that allows for quick reconstruction of class instance
	 * by storing its constructor arguments
	 */
	toJSON(): MathSymbolJSON {
		return {
			type: 'mathSymbol',
			args: [this.symbol, { kind: this.kind }],
		};
	}
}

export interface MathSymbolJSON {
	type: string;
	args: [string, { kind: string }] | [] | [number] | [number, FractionJSON];
}
