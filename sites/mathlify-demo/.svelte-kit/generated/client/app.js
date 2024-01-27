export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/0/1/01-simplifying-fractions": [3],
		"/0/1/02-multiplying-integers": [4],
		"/0/1/03-multiplying-fractions": [5],
		"/0/1/04-dividing-fractions": [6],
		"/0/1/05-dividing-integers": [7],
		"/0/1/06-adding-fractions": [8],
		"/0/1/07-subtracting-fractions": [9],
		"/0/2/01-addition-negative-integers": [10],
		"/0/2/02-multiplying-negative-integers": [11],
		"/0/2/03-simplifying-fractions": [12],
		"/0/2/04-fraction-arithmetic": [13],
		"/1/1/01-simplifying-fractions": [14],
		"/1/1/02-multiplying-integers": [15],
		"/1/1/03-multiplying-fractions": [16],
		"/1/1/04-dividing-fractions": [17],
		"/1/1/05-dividing-integers": [18],
		"/1/1/06-adding-fractions": [19],
		"/1/1/07-subtracting-fractions": [20],
		"/1/2/01-addition-negative-integers": [21],
		"/1/2/02-multiplying-negative-integers": [22],
		"/1/2/03-simplifying-fractions": [23],
		"/1/2/04-fraction-arithmetic": [24],
		"/[chapter=integer]": [25],
		"/[chapter=integer]/[section=integer]": [26]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';