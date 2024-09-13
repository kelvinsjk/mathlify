export function match(param: string) {
	const num = Number(param);
	if (isNaN(num)) {
		return false;
		// TODO: specimen paper
	}
	return num > 2007 && num <= 2013 && num % 2 === 1;
}
