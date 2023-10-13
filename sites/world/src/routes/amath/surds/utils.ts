export const surdBases = [2, 3, 5, 6, 7, 10, 11] as const;

export const surdCoeffs = {
	2: [1, 2, 3, 4, 5, 6, 7],
	3: [1, 2, 3, 4, 5],
	5: [1, 2, 3, 4, 5],
	6: [1, 2, 3, 4],
	7: [1, 2, 3],
	10: [1, 2, 3],
	11: [1, 2, 3],
} satisfies {
	[key in (typeof surdBases)[number]]: number[];
};

export const pythagoreanTriples: [number, number, number][] = [
	[3, 4, 5],
	[3, 4, 5],
	[3, 4, 5],
	[5, 12, 13],
	[5, 12, 13],
	[8, 15, 17],
	[7, 24, 25],
	[20, 21, 29],
	[12, 35, 37],
	[9, 40, 41],
];
