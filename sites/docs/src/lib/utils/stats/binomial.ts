import { binomialDistribution } from 'simple-statistics';

/**
 * binomPdf(n,p,x)
 *
 * @returns P(X=x)
 *
 * uses  the implementation by [simple-statistics package](https://simplestatistics.org/)
 */
function binomPdf(n: number, p: number, x: number): number {
  return binomialDistribution(n, p)[x];
}

/**
 * binomCdf(n,p,x)
 *
 * @returns P(X \leq x)
 *
 * uses  the implementation by [simple-statistics package](https://simplestatistics.org/)
 */
function binomCdf(n: number, p: number, x: number): number {
  x = Math.floor(x);
  return binomialDistribution(n, p)
    .slice(0, x + 1)
    .reduce((x, y) => x + y);
}

/**
 * binomCdfRange(n,p,x1,x2)
 *
 * @returns P(x1 \\leq X \leq x2)
 *
 * uses  the implementation by [simple-statistics package](https://simplestatistics.org/)
 */
function binomCdfRange(n: number, p: number, lower: number, upper: number): number {
  lower = Math.ceil(lower);
  upper = Math.floor(upper);
  const p2 = binomialDistribution(n, p)
    .slice(0, upper + 1)
    .reduce((x, y) => x + y);
  const p1 = binomialDistribution(n, p)
    .slice(0, lower)
    .reduce((x, y) => x + y);
  return p2 - p1;
}

export { binomPdf, binomCdf, binomCdfRange };
