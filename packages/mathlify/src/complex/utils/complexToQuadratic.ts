import { Polynomial } from '../../core';
import { Complex } from '../complexClass';

export function complexToQuadratic(z: Complex, options?: { unknown?: string }): Polynomial {
	const { unknown } = {
		unknown: 'z',
		...options,
	};
	return new Polynomial([1, z.real.times(-2), z.rSquared()], { variable: unknown });
}
