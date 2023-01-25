import { Fraction, Term, Expression, VariableTerm, SquareRoot, Imaginary, Polynomial } from '../core/index';
import { Vector } from '../vectors/index';
import { Laurent } from '../calculus';

/**
 * parse JSON, returning a Mathlify class instance (Fraction/Term/Expression/Vector)
 *
 * for primitive types, return itself:
 */
export function JSONParse(
	jsonString: string,
):
	| string
	| number
	| boolean
	| Fraction
	| Term
	| Expression
	| Polynomial
	| Vector
	| Laurent
	| (string | number | boolean | Fraction | Term | Expression | Vector)[] {
	const jsonObject = JSON.parse(jsonString);
	return Array.isArray(jsonObject) ? parseArray(jsonObject) : parseSingleItem(jsonObject);
}

function parseArray(arr: any[]): any[] {
	return arr.map((e) => {
		return Array.isArray(e) ? parseArray(e) : parseSingleItem(e);
	});
}

function parseSingleItem(
	item: any,
): string | number | boolean | Fraction | Term | Expression | Vector | Polynomial | Laurent {
	if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
		return item;
	}
	if ('type' in item && 'args' in item && item.type in classes) {
		const type = item.type as 'fraction' | 'term' | 'expression' | 'vector' | 'polynomial' | 'laurent';
		const args = item.args as any[];
		const parsedArgs = parseArray(args);
		return new (classes[type] as any)(...parsedArgs);
	} else {
		return JSON.stringify(item);
	}
}

const classes = {
	fraction: Fraction,
	term: Term,
	expression: Expression,
	vector: Vector,
	variable: VariableTerm,
	imaginary: Imaginary,
	squareRoot: SquareRoot,
	polynomial: Polynomial,
	laurent: Laurent,
};
