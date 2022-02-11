import { Fraction } from '../classes/fractionClass';
import { Term, Expression, Polynomial } from '../classes/algebra/index';

/**
 * parse JSON, returning a Mathlify class instance (Fraction/Term/Expression/Polynomial)
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
	| (string | number | boolean | Fraction | Term | Expression | Polynomial)[] {
	const jsonObject = JSON.parse(jsonString);
	return Array.isArray(jsonObject) ? parseArray(jsonObject) : parseSingleItem(jsonObject);
}

function parseArray(arr: any[]): any[] {
	return arr.map((e) => {
		return Array.isArray(e) ? parseArray(e) : parseSingleItem(e);
	});
}

function parseSingleItem(item: any): string | number | boolean | Fraction | Term | Expression | Polynomial {
	if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
		return item;
	}
	if ('type' in item && 'args' in item && item.type in classes) {
		const type = item.type as 'fraction' | 'term' | 'expression' | 'polynomial';
		const args = item.args as any[];
		const parsedArgs = parseArray(args);
		return new (classes[type] as any)(...parsedArgs);
	} else if ('ascending' in item && 'degree' in item && 'variableAtom' in item) {
		return item;
	} else {
		throw new Error(`JSONParse: ${item} is not a valid Mathlify JSON object`);
	}
}

const classes = {
	fraction: Fraction,
	term: Term,
	expression: Expression,
	polynomial: Polynomial,
};
