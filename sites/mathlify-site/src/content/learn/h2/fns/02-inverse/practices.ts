import { practice as practice1 } from './01-existence';
import { practice as practice2 } from './02-domain';
import type { Practice } from '../../../practices';

export const practices: Record<string, Practice> = {
	'01-existence': practice1,
	'02-domain': practice2,
};
