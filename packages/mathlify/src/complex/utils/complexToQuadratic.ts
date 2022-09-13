import { Polynomial } from '../../core';
import { Complex } from '../complexClass';

export function complexToQuadratic(z: Complex, options?: { variable?: string }): Polynomial {
	const { variable } = {
		variable: 'z',
		...options,
	};
	return new Polynomial([1, z.real.times(-2), z.rSquared()], { variable });
}
