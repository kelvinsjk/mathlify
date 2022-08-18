import { heads, getRandomVec, getRandomInt, getRandomLine, Vector } from 'mathlify';

export async function load({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const a = getRandomVec({ nonzero: false });
		let b = getRandomVec({ nonzero: false });
		while (a.isEqualTo(b)) {
			b = getRandomVec({ nonzero: false });
		}
		varsJSON['a'] = JSON.stringify(a);
		varsJSON['b'] = JSON.stringify(b);
		varsPrimitive['variant'] = getRandomInt(1, 2);
	} else if (qn === 'b') {
		const l = getRandomLine();
		let p = getRandomVec({ nonzero: false });
		while (l.contains(p)) {
			p = getRandomVec({ nonzero: false });
		}
		varsJSON['a'] = JSON.stringify(l.a);
		varsJSON['d'] = JSON.stringify(l.d);
		varsJSON['p'] = JSON.stringify(p);
	} else if (qn === 'c') {
		const l = getRandomLine();
		varsJSON['a'] = JSON.stringify(l.a);
		varsJSON['d'] = JSON.stringify(l.d);
		varsPrimitive['variant'] = getRandomInt(1, 2);
		varsPrimitive['pos'] = getRandomInt(1, 3);
	} else if (qn === 'd') {
		const l = getRandomLine();
		const translation = [
			Vector.J.multiply(getRandomInt(-3, 3, { avoid: [0] })),
			Vector.I.multiply(getRandomInt(-3, 3, { avoid: [0] })),
			Vector.K.multiply(getRandomInt(-3, 3, { avoid: [0] })),
		][getRandomInt(0, 2)];
		const p = heads()
			? heads()
				? getRandomVec({ nonzero: false })
				: l.point(getRandomInt(-3, 3, { avoid: [0] })).plus(translation)
			: l.point(getRandomInt(-3, 3, { avoid: [0] }));
		varsJSON['a'] = JSON.stringify(l.a);
		varsJSON['d'] = JSON.stringify(l.d);
		varsJSON['p'] = JSON.stringify(p);
	}

	return {
		varsPrimitive,
		varsJSON,
		subtitles: {
			a: 'Vector Equation of a Line I',
			b: 'Vector Equation of a Line II',
			c: 'Cartesian Equation of a Line',
			d: 'Relationship between Point and Line',
		},
	};
}
