/**
 * @overload
 * @param {'<'} sign
 * @returns {'>'}
 */
/**
 * @overload
 * @param {'>'} sign
 * @returns {'<'}
 */
/**
 * @overload
 * @param {'\\leq'} sign
 * @returns {'\\geq'}
 */
/**
 * @overload
 * @param {'\\geq'} sign
 * @returns {'\\leq'}
 */
/**
 * @overload
 * @param {'<'|'>'} sign
 * @returns {'<'|'>'}
 */
/**
 * @overload
 * @param {'\\geq'|'\\leq'} sign
 * @returns {'\\leq'|'\\geq'}
 */
/**
 * @overload
 * @param {'<'|'>'|'\\leq'|'\\geq'} sign
 * @returns {'<'|'>'|'\\leq'|'\\geq'}
 */
/**
 * opposite sign
 * @param {'<'|'>'|'\\geq'|'\\leq'} sign
 * @returns {'<'|'>'|'\\geq'|'\\leq'}
 */
export function oppositeSign(sign) {
	switch (sign) {
		case '<':
			return '>';
		case '>':
			return '<';
		case '\\geq':
			return '\\leq';
		case '\\leq':
			return '\\geq';
	}
}
