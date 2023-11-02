import { Fraction, Term, numberToFraction } from "../core/index.js";

//TODO: check base before operation

export class LnTerm extends Term {
  /** @type {'ln-term'} */
  type;
  /** @type {Fraction} */
  arg;
  /** @type {string|Fraction} */
  base;
  /** @type {string} */
  ln;
  /**
   * @param {number|Fraction} arg
   * @param {{coeff?: number|Fraction, base?: string|Fraction|number}} [options]
   */
  constructor(arg, options) {
    arg = numberToFraction(arg);
    if (arg.is.atMost(0)) {
      throw new Error(`lnTerm must take positive argument, ${arg} received`);
    }
    let coeff = options?.coeff ?? 1;
    if (arg.is.one()) {
      coeff = 0;
    }
    const base = options?.base ?? "e";
    const baseString = `${base}`.length === 1 ? `${base}` : `{${base}}`;
    const lnString = base === "e" ? `\\ln` : `\\log_${baseString}`;
    super(coeff, `${lnString} ${arg}`);
    this.type = "ln-term";
    this.arg = arg;
    this.base = typeof base === "number" ? numberToFraction(base) : base;
    this.ln = lnString;
  }

  /**
   * @param {LnTerm} x
   * @returns {LnTerm}
   */
  plus(x) {
    // k1 ln x1 + k2 ln x2 = coeff( power1 ln x1 + power2 ln x2 )
    if (typeof this.base === "string") {
      if (this.base !== x.base) {
        throw new Error(
          `Cannot add ln terms with different bases: ${this.base} and ${x.base}`
        );
      }
    } else {
      if (typeof x.base === "string") {
        throw new Error(
          `Cannot add ln terms with different bases: ${this.base} and ${x.base}`
        );
      }
      if (this.base.is.not.equalTo(x.base)) {
        throw new Error(
          `Cannot add ln terms with different bases: ${this.base} and ${x.base}`
        );
      }
    }
    const [[power1, power2], coeff] = Fraction.factorize(this.coeff, x.coeff);
    return new LnTerm(this.arg.pow(power1).times(x.arg.pow(power2)), {
      coeff,
      base: this.base,
    });
  }

  /**
   * @returns {LnTerm}
   */
  negative() {
    return new LnTerm(this.arg, {
      coeff: this.coeff.negative(),
      base: this.base,
    });
  }

  /**
   * @returns {LnTerm}
   */
  makeCoeffPositive() {
    return this.coeff.is.positive()
      ? new LnTerm(this.arg, { coeff: this.coeff, base: this.base })
      : new LnTerm(this.arg.reciprocal(), {
          coeff: this.coeff.negative(),
          base: this.base,
        });
  }

  /**
   * @param {LnTerm} x
   * @returns {LnTerm}
   */
  minus(x) {
    return this.plus(x.negative());
  }

  /**
   * change base working
   * @param {string|Fraction|number} newBase
   * @returns {string}
   */
  changeBase(newBase) {
    const newBaseString =
      `${newBase}`.length === 1 ? `${newBase}` : `{${newBase}}`;
    const lnString = newBase === "e" ? `\\ln` : `\\log_${newBaseString}`;
    const numTerm = new LnTerm(this.arg, { base: newBase, coeff: this.coeff });
    const denTerm =
      this.base instanceof Fraction
        ? new LnTerm(this.base, { base: newBase })
        : `${lnString} ${this.base}`;
    return `\\frac{${numTerm}}{${denTerm}}`;
  }
}
