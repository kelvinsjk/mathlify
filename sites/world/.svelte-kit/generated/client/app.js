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
	() => import('./nodes/13')
];

export const server_loads = [];

export const dictionary = {
		"/": [3],
		"/amath/surds/algebra/comparing": [4,[2]],
		"/amath/surds/algebra/equations-involving-surds": [5,[2]],
		"/amath/surds/arithmetic/addition-and-subtraction": [6,[2]],
		"/amath/surds/arithmetic/multiplication": [7,[2]],
		"/amath/surds/basics/basics-ii": [9,[2]],
		"/amath/surds/basics/basics-i": [8,[2]],
		"/amath/surds/rationalising/rationalising-ii": [11,[2]],
		"/amath/surds/rationalising/rationalising-i": [10,[2]],
		"/amath/surds/simplifying-surds/division": [12,[2]],
		"/amath/surds/simplifying-surds/multiplication": [13,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';