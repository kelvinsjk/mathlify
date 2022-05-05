import { Fraction, SquareRoot } from 'mathlify';
import { Angle } from './angleClass';

export function cos(theta: Angle): SquareRoot {
	const degrees = theta.degrees;
	if (degrees.isEqualTo(0)) {
		return new SquareRoot(1);
	} else if (degrees.isEqualTo(180)) {
		return new SquareRoot(1, -1);
	} else if (degrees.divide(90).isInteger()) {
		return new SquareRoot(1, 0);
	}
	if (secondQuadrant(degrees) || thirdQuadrant(degrees)) {
		const basicAngle = secondQuadrant(degrees)
			? theta.supplement().degrees
			: theta.negative().supplement().degrees;
		if (basicAngle.isEqualTo(30)) {
			return new SquareRoot(3, new Fraction(-1, 2));
		} else if (basicAngle.isEqualTo(45)) {
			return new SquareRoot(2, new Fraction(-1, 2));
		} else if (basicAngle.isEqualTo(60)) {
			return new SquareRoot(1, new Fraction(-1, 2));
		} else {
			throw new Error(`${theta.degrees} not a special angle`);
		}
	}
	// first and fourth
	const basicAngle = fourthQuadrant(degrees) ? theta.negative().degrees : degrees;
	if (basicAngle.isEqualTo(30)) {
		return new SquareRoot(3, new Fraction(1, 2));
	} else if (basicAngle.isEqualTo(45)) {
		return new SquareRoot(2, new Fraction(1, 2));
	} else if (basicAngle.isEqualTo(60)) {
		return new SquareRoot(1, new Fraction(1, 2));
	} else {
		throw new Error(`${theta.degrees} not a special angle`);
	}
}

export function sin(theta: Angle): SquareRoot {
	let basicAngle = theta.degrees;
	let negative = 1;
	if (secondQuadrant(theta.degrees) || thirdQuadrant(theta.degrees)) {
		basicAngle = theta.supplement().degrees.abs();
		negative = secondQuadrant(theta.degrees) ? 1 : -1;
	} else if (fourthQuadrant(theta.degrees)) {
		basicAngle = theta.degrees.abs();
		negative = -1;
	}
	const cosBasic = cos(new Angle(90).minus(basicAngle));
	return cosBasic.times(negative);
}

function secondQuadrant(degrees: Fraction): boolean {
	return degrees.isGreaterThan(90) && degrees.isLessThan(180);
}
function thirdQuadrant(degrees: Fraction): boolean {
	return degrees.isLessThan(-90);
}
function fourthQuadrant(degrees: Fraction): boolean {
	return degrees.isGreaterThan(-90) && degrees.isLessThan(0);
}
