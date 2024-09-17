export function match(param: string) {
	const q = param[0];
	const num = Number(param.slice(1));
	if (isNaN(num)) {
		return false;
	}
	return q === 'q' && num >= 1 && num <= 12;
}
