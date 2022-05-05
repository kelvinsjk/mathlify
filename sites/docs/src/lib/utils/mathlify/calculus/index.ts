export { PolynomialFn } from './polynomialFnClass';
export { PowerFn, LnFn } from './powerLnClasses';
export { ExpFn } from './expFnClass';
export { SinFn, CosFn } from './sinCosFnClasses';

export { dydxString } from './typesetting';

import { fPrime } from './integration/fPrimeIntegral';
import { perfectSquare } from './integration/perfectSquareIntegral';
import { byParts } from './integration/byParts';
import { trigo } from './integration/trigo';

export const integrate = {
	fPrime,
	perfectSquare,
	byParts,
	trigo,
};
