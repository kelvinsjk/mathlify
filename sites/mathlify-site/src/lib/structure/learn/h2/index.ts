import { sections as fnSections } from './fns/sections';
import { chapters as flatChapters } from './chapters';
import type { Chapter } from '$lib/types/learn';
import { arrayToObject } from '$lib/utils/arrayToObject';

const chapters: Chapter[] = flatChapters;

chapters.filter((c) => c.slug === 'fns')[0]['sections'] = fnSections;

export const chapterObj = arrayToObject(chapters, 'slug');
