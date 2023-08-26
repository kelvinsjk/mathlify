import { math } from 'mathlifier';

export function intervalsToMath<T>(
	intervals: Array<T>,
	options?: { blacksquare?: boolean },
): string {
	const blacksquare = options?.blacksquare ?? false ? `\\; \\blacksquare` : ``;
	if (intervals.length === 0) return '';
	if (intervals.length === 1) return math(`${intervals[0]}${blacksquare}`);
	if (intervals.length === 2)
		return `${math(`${intervals[0]} \\; `)} or ${math(`\\; ${intervals[1]}${blacksquare}`)}`;
	const start = intervals
		.slice(0, -2)
		.map((i) => math(`${i}, \\; `))
		.join(' ');
	return `${start} ${math(`${intervals[intervals.length - 2]}  \\; `)} or ${math(
		`\\; ${intervals[intervals.length - 1]}${blacksquare}`,
	)}`;
}
