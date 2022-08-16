import { getRandomInt } from 'mathlify';

let l1 = getRandomInt(1, 4);
let l2 = getRandomInt(1, 4);
let m1 = getRandomInt(1, 4);
let m2 = getRandomInt(1, 4);
while (l1 + m1 > 5) {
	l1 = getRandomInt(1, 4);
	m1 = getRandomInt(1, 4);
}
while (l2 + m2 > 5) {
	l2 = getRandomInt(1, 4);
	m2 = getRandomInt(1, 4);
}

export async function GET() {
	return {
		body: {
			l1,
			m1,
			l2,
			m2,
		},
	};
}
