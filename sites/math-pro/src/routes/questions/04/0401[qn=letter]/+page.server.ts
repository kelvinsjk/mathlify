import { getRandomInt, sample, AP } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a' || qn === 'b') {
		const { a, d, n, variant } = {
			a: getRandomInt(-9, 9),
			d: getRandomInt(-5, 5, { avoid: [0] }),
			n: getRandomInt(9, 20),
			variant: getRandomInt(1, 2),
		};
		varsPrimitive['n'] = n;
		varsPrimitive['a'] = a;
		varsPrimitive['d'] = d;
		if (qn === 'a') {
			varsPrimitive['variant'] = variant;
		}
	} else if (qn === 'c') {
		const { a, d } = {
			a: getRandomInt(-9, 9),
			d: getRandomInt(1, 5, { avoid: [0] }),
		};
		const ks = [100, 500, 1000];
		const ap = new AP(a, d);
		const s10 = ap.S(10),
			s100 = ap.S(100);
		const k = sample(
			ks.filter((x) => {
				return x > s10.valueOf() && x < s100.valueOf();
			}),
		);
		varsPrimitive['a'] = a;
		varsPrimitive['d'] = d;
		varsPrimitive['k'] = k;
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: 'AP I',
			b: 'AP II',
			c: 'AP III',
		},
	};
}
