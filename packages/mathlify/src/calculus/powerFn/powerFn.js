import { ExpansionTerm } from "../../algebra";
import { Fraction, Polynomial, Term } from "../../core";
import { numberToFraction } from "../../utils";

/**
 * PowerTerm class extending the Term class representing k (f(x))^n
 * @property {Fraction} coeff
 * @property {Polynomial} fx
 * @property {Fraction} power
 * @property {"power-fn"} kind - mathlify rational class kind
 * @property {"power-fn"} type - mathlify rational class type
 * @extends Term
 */
export class PowerFn extends Term {
  /** @type {Fraction} */
  coeff;
  /** @type {Polynomial} coeff  */
  fx;
  /** @type {Fraction} power  */
  power;
  /** @type {"power-fn"} kind - mathlify rational class kind */
  kind;
  /** @type {"power-fn"} type - mathlify rational class type */
  type;

  /**
   * @constructor
   * Creates an Expansion Term instance
   * @param {Polynomial} fx - f(x) in k (f(x))^n
   * @param {number|Fraction} power - n in k (f(x))^n
   * @param {{coeff?: number|Fraction}} [options] - options
   */
  constructor(fx, power, options) {
    const coeff = options?.coeff ?? 1;
    super(coeff, [`\\left(${fx}\\right)`, power]);
    this.fx = fx;
    this.power = numberToFraction(power);
    this.coeff = numberToFraction(coeff);
    this.kind = "power-fn";
    this.type = "power-fn";
  }

  /**
   * differentiates
   * @returns {ExpansionTerm|PowerFn} powerFn type if fx is a linear polynomial, otherwise expansion term
   */
  differentiate() {
    if (this.fx.degree === 1) {
      return new PowerFn(this.fx, this.power.minus(1), {
        coeff: this.coeff.times(this.power).times(this.fx.coeffs[1]),
      });
    }
    return new ExpansionTerm(
      this.coeff.times(this.power),
      this.fx.differentiate(),
      [this.fx, this.power.minus(1)]
    );
  }

  /**
   * integrates. only does automatic division for linear polynomials, otherwise assumes f'(x) is already there
   * @returns {PowerFn} - the Expansion Term multiplied by x
   */
  integrate() {
    let coeff = this.coeff.divide(this.power.plus(1));
    if (this.fx.degree === 1) {
      coeff = coeff.divide(this.fx.coeffs[1]);
    }
    return new PowerFn(this.fx, this.power.plus(1), { coeff });
  }

  /**
   * sub in many
   * @param {{[key: string]: number|Fraction}|number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
   * If a number of Fraction is received, we assume that the variable is 'x'
   * @returns {Term} the term with the values subbed in
   */
  subIn(variableToValue) {
    const variable =
      typeof variableToValue === "number" || variableToValue instanceof Fraction
        ? variableToValue
        : variableToValue[Object.keys(variableToValue)[0]];
    return new Term(
      this.fx.subIn(variable).pow(this.power.valueOf()).times(this.coeff)
    );
  }
}
