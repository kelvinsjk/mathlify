import { Term, Fraction } from '../core';

/**
 * Angle class representing an angle k pi
 */
export class Angle extends Term {
	/**
	 * k in k pi
	 */
	k: Fraction;
	/**
	 * angle in degrees
	 */
	degrees: Fraction;
	/**
	 * 'complex' means -pi < theta \leq pi
	 * 'default' means 0 \leq theta < 2 pi
	 * 'all' means -\infty < theta < infty: no cycling will be performed
	 */
	domain: 'complex' | 'default' | 'all';
	/**
	 * constructs a new Angle class instance
	 *
	 * @param angle if angle is a number, we will treat it as if it is in degrees. If angle is of Fraction type, will treat it
	 * as if it is k in k pi
	 * @param options defaults to { domain: 'complex' }
	 * 'complex' means -pi < theta \leq pi
	 * 'default' means 0 \leq theta < 2 pi
	 * 'all' means -\infty < theta < infty: no cycling will be performed
	 */
	constructor(angle: number | Fraction, options?: { domain?: 'complex' | 'default' | 'all' }) {
		const domain = options?.domain ?? 'complex';
		let k = typeof angle === 'number' ? new Fraction(angle, 180) : angle;
		if (domain === 'complex') {
			while (k.isAtMost(-1)) {
				k = k.plus(2);
			}
			while (k.isGreaterThan(1)) {
				k = k.minus(2);
			}
		} else if (domain === 'default') {
			while (k.isLessThan(0)) {
				k = k.plus(2);
			}
			while (k.isAtLeast(2)) {
				k = k.minus(2);
			}
		}
		super(k, '\\pi');
		this.k = k;
		this.degrees = k.times(180);
		this.domain = domain;
	}

	plus(theta: number | Fraction | Angle): Angle {
		return new Angle(this.k.plus(numberToAngle(theta).k), { domain: this.domain });
	}
	negative(): Angle {
		return new Angle(this.k.negative(), { domain: this.domain });
	}
	minus(theta: number | Fraction | Angle): Angle {
		return new Angle(this.k.minus(numberToAngle(theta).k), { domain: this.domain });
	}
	times(k: number | Fraction): Angle {
		return new Angle(this.k.times(k), { domain: this.domain });
	}
	divide(k: number | Fraction): Angle {
		return new Angle(this.k.divide(k), { domain: this.domain });
	}
	isEqualTo(theta: number | Fraction | Angle): boolean {
		return this.k.isEqualTo(numberToAngle(theta).k);
	}

	/**
	 * returns the value of the angle in radians in the number type
	 */
	valueOf(): number {
		return this.k.valueOf() * Math.PI;
	}
	clone(): Angle {
		return new Angle(this.k.clone(), { domain: this.domain });
	}
}

function numberToAngle(angle: number | Fraction | Angle): Angle {
	if (angle instanceof Angle) {
		return angle;
	}
	return new Angle(angle);
}
