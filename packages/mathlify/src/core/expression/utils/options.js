/** @typedef {import('../index.js').SimplifyOptions} SimplifyOptions */

/**
 * @param {SimplifyOptions} [options]
 * @returns {Required<SimplifyOptions>}
 */
export function resolveOptions(options) {
	if (hasNoValidOptions(options)) {
		options = {
			brackets: true,
			product: true,
			sum: true,
			numeral: true,
			quotient: true,
			exponent: true,
		};
	}
	return {
		brackets: false,
		product: false,
		sum: false,
		numeral: false,
		quotient: false,
		exponent: false,
		...options,
	};
}

/**
 * @param {SimplifyOptions} [options]
 * @returns {boolean} */
function hasNoValidOptions(options) {
	return (
		options === undefined ||
		(options.brackets === undefined &&
			options.product === undefined &&
			options.sum === undefined &&
			options.numeral === undefined &&
			options.quotient === undefined &&
			options.exponent === undefined)
	);
}
