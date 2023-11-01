import { Polynomial, Fraction } from "../../core/index.js";
import { xPolynomial } from "../../extended/xPolynomial.js";

/**
 * @param {Polynomial|xPolynomial} poly
 * @param {number} n
 * @param {number} end - number of terms to expand
 * @return {string}
 */
export function binomialExpansionWorking(poly, n, end) {
  const firstTerm = poly.coeffs[0];
  const secondTerm =
    firstTerm instanceof Fraction
      ? poly.minus(firstTerm)
      : poly.minus(firstTerm);
  const firstTermString =
    `${firstTerm}` === "1"
      ? ""
      : !`${firstTerm}`.startsWith("-")
      ? firstTerm.toString()
      : `\\left(${firstTerm.toString()}\\right)`;
  const powString = `${n}`.length > 1 ? `{${n}}` : `${n}`;
  let str = firstTermString === "" ? "1" : `${firstTermString}^${powString}`;
  for (let r = 1; r < end; r++) {
    const nMinusR = n - r;
    const nMinusRString =
      `${nMinusR}`.length > 1 ? `{${nMinusR}}` : `${nMinusR}`;
    const rString = r === 1 ? "" : `${r}`.length > 1 ? `^{${r}}` : `^${r}`;
    str += `+ {${n} \\choose ${r}}`;
    str += firstTermString === "" ? "1" : `${firstTermString}^${nMinusRString}`;
    const secondTermString =
      `${secondTerm}`.length > 1
        ? `\\left(${secondTerm.toString()}\\right)`
        : `${secondTerm.toString()}`;
    str += `${secondTermString}${rString}`;
  }
  return str + "+ \\dotsb";
}
