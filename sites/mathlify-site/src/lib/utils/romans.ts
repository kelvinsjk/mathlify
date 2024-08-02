// modified from https://github.com/qbunt/romans/blob/main/romans.js
// see [MIT License](https://github.com/qbunt/romans/blob/main/LICENSE) from the project

const roman_map = {
	x: 10,
	ix: 9,
	v: 5,
	iv: 4,
	i: 1,
};

const allChars = Object.keys(roman_map);
const allNumerals = Object.values(roman_map);

export const romanize = (decimal: number): string => {
	if (
		decimal <= 0 ||
		typeof decimal !== 'number' ||
		Math.floor(decimal) !== decimal ||
		decimal > 10
	) {
		throw new Error('requires an unsigned integer at most 10');
	}
	let roman = '';
	for (let i = 0; i < allChars.length; i++) {
		while (decimal >= allNumerals[i]) {
			decimal -= allNumerals[i];
			roman += allChars[i];
		}
	}
	return roman;
};
