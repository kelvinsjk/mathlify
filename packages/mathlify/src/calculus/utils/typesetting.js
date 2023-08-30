/**
 *
 * @param {{x?: string, y?: string}} [options]
 * @returns {string}
 */
export function dydx(options) {
  const { x = "x", y = "y" } = options ?? {};
  return `\\frac{\\operatorname{d}\\!${y}}{\\operatorname{d}\\!${x}}`;
}

/**
 *
 * @param {{x?: string, y?: string}} [options]
 * @returns {string}
 */
export function d2ydx2(options) {
  const { x = "x", y = "y" } = options ?? {};
  return `\\frac{\\operatorname{d^2}\\!${y}}{\\operatorname{d}\\!${x}^2}`;
}
