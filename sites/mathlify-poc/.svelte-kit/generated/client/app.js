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
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34'),
	() => import('./nodes/35'),
	() => import('./nodes/36'),
	() => import('./nodes/37'),
	() => import('./nodes/38')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/og/sec1/chapter2/worksheet2b": [3],
		"/og/sec1/chapter2/worksheet2d": [4],
		"/og/sec1/chapter4/worksheet4a": [5],
		"/og/sec1/chapter4/worksheet4b": [6],
		"/og/sec1/chapter4/worksheet4c": [7],
		"/og/sec1/chapter4/worksheet4d": [8],
		"/og/sec1/chapter5/worksheet5a": [9],
		"/og/sec1/chapter5/worksheet5b": [10],
		"/og/sec1/chapter6/worksheet6b": [11],
		"/og/sec2/chapter1/worksheet1d": [12],
		"/og/sec2/chapter2/worksheet2a": [13],
		"/og/sec2/chapter3/worksheet3a": [14],
		"/og/sec2/chapter3/worksheet3b": [15],
		"/og/sec2/chapter3/worksheet3c": [16],
		"/og/sec2/chapter3/worksheet3d": [17],
		"/og/sec2/chapter4/worksheet4a": [18],
		"/og/sec2/chapter4/worksheet4b": [19],
		"/og/sec2/chapter4/worksheet4c": [20],
		"/og/sec2/chapter6/worksheet6a": [21],
		"/og/sec2/chapter6/worksheet6b": [22],
		"/og/sec2/chapter6/worksheet6c": [23],
		"/tys/amath/unit10": [25],
		"/tys/amath/unit11": [26],
		"/tys/amath/unit12": [27],
		"/tys/amath/unit13": [28],
		"/tys/amath/unit1": [24],
		"/tys/amath/unit2": [29],
		"/tys/amath/unit3": [30],
		"/tys/amath/unit4": [31],
		"/tys/amath/unit5": [32],
		"/tys/amath/unit6": [33],
		"/tys/amath/unit8": [34],
		"/tys/emath/chapter1/unit1": [35],
		"/tys/emath/chapter1/unit5": [36],
		"/tys/emath/chapter1/unit7": [37],
		"/world": [38]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';