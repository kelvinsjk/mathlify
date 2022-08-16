import { getNiceVec, getRandomVec } from 'mathlify';

const a = getNiceVec();
let b = getRandomVec({ simplify: true });
while (a.isParallelTo(b)) {
	b = getRandomVec({ simplify: true });
}

export async function GET() {
	return {
		body: {
			vectors: JSON.stringify([a, b]),
		},
	};
}
