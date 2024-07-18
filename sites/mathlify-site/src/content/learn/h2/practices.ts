import type { Practice } from '../practices';
import { practices as fnsPractices } from './fns/practices';

export const practices: Record<string, Record<string, Record<string, Practice>>> = {
	fns: fnsPractices,
};
