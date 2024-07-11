import { ComplexExp } from '../complexExpClass';
import { xComplex } from '../extendedComplexClass';
import { cos, sin } from '../../trigo';

export function expToCartesian(z: ComplexExp): xComplex {
	return new xComplex(cos(z.arg).times(z.mod), sin(z.arg).times(z.mod));
}
