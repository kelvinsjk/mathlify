import { Fraction } from '../../fraction.js';

/**
 * creates the string representation of a Term, following the order
 * as laid out in the term's powerMap
 * @param {Map<string,Fraction>} powerMap
 * @returns {string}
 */
export function powerMapToString(powerMap) {
	let variableString = '',
		firstTerm = true;
	powerMap.forEach((power, variable) => {
		const powerString = `${power}`.length > 1 ? `{${power}}` : `${power}`;
		if (firstTerm) {
			variableString = power.is.one() ? variable : `${variable}^${powerString}`;
			firstTerm = false;
		} else {
			variableString += power.is.one()
				? ` ${variable}`
				: ` ${variable}^${powerString}`;
		}
	});
	return variableString;
}
