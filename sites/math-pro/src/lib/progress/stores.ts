import { writable } from 'svelte-local-storage-store';

export const defaultQnProgress: QnProgress = {
	'04': {
		'0401a': ['new', 'new'],
		'0401b': 'new',
		'0401c': 'new',
		'0402a': ['new', 'new'],
		'0402b': 'new',
		'0402c': 'new',
		'0402d': 'new',
		'0403a': ['new', 'new'],
		'0403b': ['new', 'new'],
		'0403c': 'new',
		'0404a': 'new',
		'0404b': 'new',
		'0404c': 'new',
	},
	'12': {
		'1201a': 'new',
		'1201b': ['new', 'new'],
		'1201c': ['new', 'new'],
		'1201d': ['new', 'new'],
		'1201e': 'new',
		'1201f': 'new',
		'1202a': 'new',
		'1202b': 'new',
		'1202c': 'new',
		'1202d': ['new', 'new'],
		'1202e': ['new', 'new'],
		'1203a': ['new', 'new'],
		'1203b': ['new', 'new'],
		'1203c': ['new', 'new'],
		'1203d': ['new', 'new'],
		'1204a': ['new', 'new'],
		'1204b': ['new', 'new'],
		'1204c': ['new', 'new'],
		'1204d': ['new', 'new'],
		'1204e': ['new', 'new'],
	},
	'13': {
		'1301a': ['new', 'new'],
		'1301b': 'new',
		'1301c': ['new', 'new'],
		'1301d': 'new',
		'1302a': 'new',
		'1302b': 'new',
		'1302c': 'new',
		'1302d': ['new', 'new'],
		'1302e': ['new', 'new'],
		'1302f': 'new',
		'1303a': ['new', 'new'],
		'1303b': ['new', 'new'],
		'1303c': ['new', 'new'],
		'1303d': ['new', 'new'],
		'1303e': ['new', 'new'],
		'1303f': ['new', 'new'],
		'1304a': ['new', 'new'],
		'1304b': ['new', 'new'],
		'1304c': 'new',
		'1304d': ['new', 'new'],
		'1304e': 'new',
		'1304f': 'new',
	},
	'14': {
		'1401a': ['new', 'new'],
		'1401b': 'new',
		'1401c': ['new', 'new'],
		'1401d': 'new',
		'1402a': ['new', 'new'],
		'1402b': 'new',
		'1402c': ['new', 'new'],
		'1402d': 'new',
		'1403a': ['new', 'new'],
		'1403b': ['new', 'new'],
		'1404a': ['new', 'new'],
		'1404b': ['new', 'new'],
		'1404c': 'new',
		'1404d': 'new',
		'1404e': 'new',
	},
};

export const qnProgress = writable('qnProgress', defaultQnProgress);

type aToB = 'a' | 'b';
type aToC = aToB | 'c';
type aToD = aToC | 'd';
type aToE = aToD | 'e';
type aToF = aToE | 'f';

type qnID04 = `0401${aToC}` | `0402${aToD}` | `0403${aToC}` | `0404${aToC}`;
type qnID12 = `1201${aToF}` | `1202${aToE}` | `1203${aToD}` | `1204${aToE}`;
type qnID13 = `1301${aToD}` | `1302${aToF}` | `1303${aToF}` | `1304${aToF}`;
type qnID14 = `1401${aToD}` | `1402${aToD}` | `1403${aToB}` | `1404${aToE}`;

export type QnProgress = {
	'04': {
		[key in qnID04]: ('new' | 'attempted' | 'completed')[] | 'new' | 'attempted' | 'completed';
	};
	'12': {
		[key in qnID12]: ('new' | 'attempted' | 'completed')[] | 'new' | 'attempted' | 'completed';
	};
	'13': {
		[key in qnID13]: ('new' | 'attempted' | 'completed')[] | 'new' | 'attempted' | 'completed';
	};
	'14': {
		[key in qnID14]: ('new' | 'attempted' | 'completed')[] | 'new' | 'attempted' | 'completed';
	};
};
