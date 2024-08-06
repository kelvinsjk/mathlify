import type { Expression } from 'mathlify';
import type { IntervalOneSided } from './01-concepts/02-functions.practice';

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
		if (this.left === Number.NEGATIVE_INFINITY) {
			return this.right === Number.POSITIVE_INFINITY
				? `${x} \\in \\mathbb{R}`
				: `${x} ${lessThan(this.rightInclusive)} ${this.right}`;
		}
		if (this.right === Number.POSITIVE_INFINITY) {
			return `${x} ${greaterThan(this.leftInclusive)} ${this.left}`;
		}
		return `${this.left} ${lessThan(this.leftInclusive)} ${x} ${lessThan(this.rightInclusive)} ${this.right}`;
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
		return (
			(this.left.valueOf() === Number.NEGATIVE_INFINITY &&
				this.right.valueOf() !== Number.POSITIVE_INFINITY) ||
			(this.left.valueOf() !== Number.NEGATIVE_INFINITY && this.right === Number.POSITIVE_INFINITY)
		);
	}
	toOneSidedInterval(): IntervalOneSided {
		if (this.left === Number.NEGATIVE_INFINITY) {
			if (this.right === Number.POSITIVE_INFINITY)
				throw new Error('Real line cannot be converted to one-sided interval');
			return { type: 'left', inclusive: this.rightInclusive, x: this.right.valueOf() };
		}
		if (this.right === Number.POSITIVE_INFINITY)
			return { type: 'right', inclusive: this.leftInclusive, x: this.left.valueOf() };
		throw new Error('Two sided-interval cannot be converted to one-sided interval');
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
	inclusive: boolean,
): Interval {
	return type === 'left'
		? new Interval({ right: x, rightInclusive: inclusive })
		: new Interval({ left: x, leftInclusive: inclusive });
}
