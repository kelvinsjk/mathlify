import { Expression, greek, pi, quotient } from 'mathlify';
import { sqrtTerm } from 'mathlify/fns';

export const sqrt3 = sqrtTerm(3);
export const half = quotient(1, 2);
export const quarter = quotient(1, 4);
export const quarterPi = new Expression([quarter, pi]);
export const lambda = greek('lambda');
export const mu = greek('mu');
