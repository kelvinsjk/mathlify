import type { Practice } from '../../practices';
import { practices as practices1 } from './01-concepts/practices';
import { practices as practices2 } from './02-inverse/practices';

export const practices: Record<string, Record<string, Practice>> = {
	'01-concepts': practices1,
	'02-inverse': practices2,
};
