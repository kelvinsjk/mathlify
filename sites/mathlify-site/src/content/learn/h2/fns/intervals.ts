import type { Expression } from 'mathlify';

export class Interval {
	left: number | Expression;
	leftInclusive: boolean;
	right: number | Expression;
	rightInclusive: boolean;
	constructor(values: {
		left?: number | Expression;
		leftInclusive?: boolean;
		right?: number | Expression;
		rightInclusive?: boolean;
	}) {
		this.left = values.left ?? Number.NEGATIVE_INFINITY;
		this.leftInclusive = values.leftInclusive ?? false;
		this.right = values.right ?? Number.POSITIVE_INFINITY;
		this.rightInclusive = values.rightInclusive ?? false;
	}
	toString() {
		const left = this.left === Number.NEGATIVE_INFINITY ? '-\\infty' : this.left.toString();
		const right = this.right === Number.POSITIVE_INFINITY ? '\\infty' : this.right.toString();
		return `\\left${leftBracket(this.leftInclusive)} ${left}, ${right} \\right${rightBracket(this.rightInclusive)}`;
	}
	isSubsetOf(other: Interval): boolean {
		// (a, b) against (A, B)
		const a = this.left.valueOf();
		const b = this.right.valueOf();
		const A = other.left.valueOf();
		const B = other.right.valueOf();
		const leftFits = a > A || (a === A && !(this.leftInclusive && !other.leftInclusive));
		const rightFits = b < B || (b === B && !(this.rightInclusive && !other.rightInclusive));
		return leftFits && rightFits;
	}

	static ALL_REAL = new Interval({});
}

function leftBracket(inclusive: boolean): string {
	return inclusive ? '[' : '(';
}
function rightBracket(inclusive: boolean): string {
	return inclusive ? ']' : ')';
}

export function intervalBuilder(
	type: 'left' | 'right',
	x: number | Expression,
	inclusive: boolean,
): Interval {
	return type === 'left'
		? new Interval({ right: x, rightInclusive: inclusive })
		: new Interval({ left: x, leftInclusive: inclusive });
}
