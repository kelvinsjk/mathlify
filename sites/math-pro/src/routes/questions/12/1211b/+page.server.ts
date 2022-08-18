import { getNiceVec, getRandomVec } from 'mathlify';

const a = getNiceVec();
let b = getRandomVec({ simplify: true });
while (a.isParallelTo(b)) {
	b = getRandomVec({ simplify: true });
}

export async function load() {
	return {
		vectors: JSON.stringify([a, b]),
	};
}
