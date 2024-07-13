export function arrayToObject<T>(arr: T[], key: keyof T): Record<string, T & { order: number }> {
	const obj: Record<string, T & { order: number }> = {};
	for (const [order, item] of arr.entries()) {
		const itemKey = item[key];
		if (typeof itemKey !== 'string') throw new Error('Key must be a string');
		obj[itemKey] = { ...item, order };
	}
	return obj;
}
