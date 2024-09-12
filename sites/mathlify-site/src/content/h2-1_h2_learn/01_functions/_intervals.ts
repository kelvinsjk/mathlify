import type { Expression } from 'mathlify';
import type { IntervalOneSided } from './01_concepts/02_domain-and-range/02_practice-1';

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
	toInequality(x = 'x') {
		const type = this.type;
		if (type === 'all') return `${x} \\in \\mathbb{R}`;
		if (type === 'left') return `${x} ${lessThan(this.rightInclusive)} ${this.right}`;
		if (type === 'right') return `${x} ${greaterThan(this.leftInclusive)} ${this.left}`;
		return `${this.left} ${lessThan(this.leftInclusive)} ${x} ${lessThan(this.rightInclusive)} ${this.right}`;
	}
	includes(x: number | Expression): boolean {
		const xVal = x.valueOf();
		if (xVal < this.left.valueOf()) return false;
		if (xVal === this.left.valueOf()) return this.leftInclusive;
		if (xVal === this.right.valueOf()) return this.rightInclusive;
		if (xVal > this.right.valueOf()) return false;
		return true;
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
	isOneSided(): boolean {
		return this.type === 'left' || this.type === 'right';
	}
	toOneSidedInterval(): IntervalOneSided {
		const type = this.type;
		if (type === 'all') throw new Error('Cannot convert real line to one-sided interval');
		if (type === 'two') throw new Error('Cannot convert two-sided interval to one-sided interval');
		const x = type === 'left' ? this.right : this.left;
		const inclusive = type === 'left' ? this.rightInclusive : this.leftInclusive;
		return { type, inclusive, x: x.valueOf() };
	}
	get type(): 'all' | 'right' | 'left' | 'two' {
		if (this.left === Number.NEGATIVE_INFINITY && this.right === Number.POSITIVE_INFINITY)
			return 'all';
		if (this.left === Number.NEGATIVE_INFINITY) return 'left';
		if (this.right === Number.POSITIVE_INFINITY) return 'right';
		return 'two';
	}

	static ALL_REAL = new Interval({});
}

function leftBracket(inclusive: boolean): string {
	return inclusive ? '[' : '(';
}
function rightBracket(inclusive: boolean): string {
	return inclusive ? ']' : ')';
}
function greaterThan(inclusive: boolean): string {
	return inclusive ? '\\geq ' : '>';
}
function lessThan(inclusive: boolean): string {
	return inclusive ? '\\leq ' : '<';
}
export function intervalBuilder(
	type: 'left' | 'right',
	x: number | Expression,
	inclusive: boolean
): Interval {
	return type === 'left'
		? new Interval({ right: x, rightInclusive: inclusive })
		: new Interval({ left: x, leftInclusive: inclusive });
}
