import { Fraction, getRandomInt, heads, getRandomAngle } from 'mathlify';

export async function GET({ params }) {
	const qn = params.qn;
	const varsPrimitive: { [key: string]: string | number | boolean } = {};
	const varsJSON: { [key: string]: string } = {};

	if (qn === 'a') {
		const { variant, r } = {
			variant: getRandomInt(1, 2),
			r: getRandomInt(1, 5),
		};
		const angles = [Fraction.ZERO, new Fraction(1, 2), Fraction.ONE, new Fraction(-1, 2)];
		const theta = variant === 1 ? getRandomAngle() : angles[getRandomInt(0, angles.length - 1)];
		varsPrimitive['variant'] = variant;
		varsPrimitive['r'] = r;
		varsJSON['theta'] = JSON.stringify(theta);
	} else if (qn === 'b') {
		const { r, theta, exp } = {
			r: getRandomInt(1, 5),
			theta: getRandomAngle({ allowReal: true, allowImag: true }),
			exp: heads(),
		};
		varsPrimitive['r'] = r;
		varsPrimitive['exp'] = exp;
		varsJSON['theta'] = JSON.stringify(theta);
	} else if (qn === 'c') {
		const { n, rBeta, rGamma, argAlpha, den, flip, exp } = {
			n: getRandomInt(2, 5),
			rBeta: getRandomInt(1, 3),
			rGamma: getRandomInt(1, 3),
			argAlpha: getRandomAngle(),
			den: getRandomInt(0, 2), // whether alpha, beta or gamma in denominator
			flip: heads(), // flip fraction to get alpha/(beta gamma);
			exp: heads(), // whether to use exponential form (vs polar)
		};
		const argBeta = getRandomAngle({ avoid: [argAlpha] });
		const argGamma = getRandomAngle({ avoid: [argAlpha, argBeta] });
		varsPrimitive['n'] = n;
		varsPrimitive['rBeta'] = rBeta;
		varsPrimitive['rGamma'] = rGamma;
		varsPrimitive['flip'] = flip;
		varsPrimitive['exp'] = exp;
		varsPrimitive['den'] = den;
		varsJSON['argAlpha'] = JSON.stringify(argAlpha);
		varsJSON['argBeta'] = JSON.stringify(argBeta);
		varsJSON['argGamma'] = JSON.stringify(argGamma);
	} else if (qn === 'd') {
		const { realCase, r } = {
			r: getRandomInt(1, 9),
			realCase: getRandomInt(1, 4), // 1: real, 2: real and positive, 3: real and negative, 4: purely imaginary
		};
		let theta = getRandomAngle();
		if (realCase === 3) {
			// avoid even numerator
			while (theta.abs().num === 2) {
				theta = getRandomAngle();
			}
		} else if (realCase === 4) {
			// avoid denominator 3
			while (theta.den === 3) {
				theta = getRandomAngle();
			}
		}
		varsPrimitive['realCase'] = realCase;
		varsPrimitive['r'] = r;
		varsJSON['theta'] = JSON.stringify(theta);
	} else if (qn === 'e') {
		const { twoTheta, addition } = {
			twoTheta: heads(),
			addition: heads(),
		};
		varsPrimitive['twoTheta'] = twoTheta;
		varsPrimitive['addition'] = addition;
	}

	return {
		body: {
			varsPrimitive,
			varsJSON,
			subtitles: {
				a: 'Conversion from Cartesian to Modulus-Argument Form',
				b: 'Conversion from Modulus-Argument to Cartesian Form',
				c: 'Polar Form Arithmetic',
				d: 'Real and Purely Imaginary Numbers in Polar Form',
				e: 'The Half Angle Trick',
			},
		},
	};
}
