import { Fraction, Term } from "../core/index.js";
import { numberToFraction } from "../utils/toFraction.js";

// TODO: should we move this into core so that the term class automatically combines surds?

/**
 * SquareRoot extending the Term class
 * will be automatically rationalized into k sqrt(radicand), where k is the coefficient (handled by the base Term class)
 * supports automatic simplification involving prime factors at most 100
 * @property {Fraction} radicand - radicand of the square root (will be rationalized to an integer)
 * @property {"sqrt"} kind - mathlify sqrt class kind
 * @property {"sqrt"|"sqrt-rational"} type - mathlify sqrt class type
 * @extends Term
 */
export class SquareRoot extends Term {
  /** @type {Fraction} */
  radicand;
  /** @type {"sqrt"} kind - mathlify sqrt class kind */
  kind;
  /** @type {"sqrt"|"sqrt-rational"} type - mathlify sqrt class type */
  type;

  /**
   * @constructor
   * Creates an Expansion Term instance
   * @param {number|Fraction} radicand - x in k sqrt{x}
   * @param {{coeff: number|Fraction}} [options] - options object defaulting to `{coeff: 1}`
   */
  constructor(radicand, options) {
    radicand = numberToFraction(radicand);
    let coeff = numberToFraction(options?.coeff ?? 1);
    let radicandInt = 1;
    if (radicand.is.negative()) {
      throw new Error(
        `Square root cannot have negative radicand. ${radicand} received.`
      );
    }
    if (radicand.is.zero()) {
      coeff = new Fraction(0);
    } else {
      // rationalize. k sqrt(n/d) = k/d sqrt(n*d)
      coeff = coeff.divide(radicand.den);
      radicandInt = radicand.num * radicand.den;
    }
    // extract square factors
    // x = a^2 b
    const [a, b] = extractPowers(radicandInt);
    coeff = coeff.times(a);
    radicandInt = b;
    if (radicandInt !== 1) {
      super(coeff, `\\sqrt{${radicandInt}}`);
    } else {
      super(coeff);
    }
    this.radicand = new Fraction(radicandInt);
    this.kind = "sqrt";
    this.type = radicandInt === 1 ? "sqrt-rational" : "sqrt";
  }

  /**
   * resets coeff
   * should not be used directly: only present to ensure compatibility with Expression class
   * @returns {SquareRoot} - the Expansion Term but with coeff = 1
   */
  resetCoeff() {
    return new SquareRoot(this.radicand);
  }

  /**
   * @overload
   * product
   * @param {string|Term} x - the multiplicand
   * @returns {Term|SquareRoot} - the product
   */
  /**
   * @overload
   * product
   * @param {number|Fraction|SquareRoot} x - the multiplicand
   * @returns {SquareRoot} - the product
   */
  /**
   * product
   * @param {number|Fraction|SquareRoot|string|Term} x - the other term to multiply with
   * @returns {Term|SquareRoot} the product of the two terms
   */
  times(x) {
    if (
      typeof x === "string" ||
      (x instanceof Term && !(x instanceof SquareRoot))
    ) {
      if (x instanceof Term && x.type === "term-frac") {
        x = x.cast.toFraction();
      } else {
        return super.times(x);
      }
    }
    const newRadicand =
      x instanceof SquareRoot ? this.radicand.times(x.radicand) : this.radicand;
    const coeff =
      x instanceof SquareRoot ? this.coeff.times(x.coeff) : this.coeff.times(x);
    return new SquareRoot(newRadicand, { coeff });
  }

  /**
   * reciprocal
   * @returns {SquareRoot} - the reciprocal
   */
  reciprocal() {
    return new SquareRoot(this.radicand.reciprocal(), {
      coeff: this.coeff.reciprocal(),
    });
  }

  /**
   * @overload
   * division
   * @param {string|Term} x - the other term to divide with
   * @returns {Term} - the quotient
   */
  /**
   * @overload
   * division
   * @param {number|Fraction|SquareRoot} x - the other term to divide with
   * @returns {SquareRoot} - the quotient
   */
  /**
   * term division
   * @param {number|Fraction|string|Term} x - the other term to divide with
   * @returns {Term|SquareRoot} the quotient of the two terms
   */
  divide(x) {
    if (
      typeof x === "string" ||
      (x instanceof Term && !(x instanceof SquareRoot))
    ) {
      return super.times(x);
    }
    if (!(x instanceof SquareRoot)) {
      x = new SquareRoot(1, { coeff: x });
    }
    return this.times(x.reciprocal());
  }

  /**
   * power
   * @param {number} n - the exponent
   * @returns {SquareRoot} - the power
   */
  pow(n) {
    return new SquareRoot(this.radicand.pow(n), { coeff: this.coeff.pow(n) });
  }

  /**
   * square
   * @returns {Fraction} - the square
   */
  square() {
    return this.radicand.times(this.coeff.square());
  }

  /**
   * negative
   * @returns {SquareRoot} - the negative
   */
  negative() {
    return new SquareRoot(this.radicand, { coeff: this.coeff.negative() });
  }

  /**
   * abs
   * @returns {SquareRoot} - the absolute value
   */
  abs() {
    return new SquareRoot(this.radicand, { coeff: this.coeff.abs() });
  }

  /**
   * boolean methods for this term
   */
  is = {
    // super methods
    constant: () => true,
    /** @type {(term2: string|number|Fraction|Term)=>boolean} */
    like: (term2) => super.is.like(term2),

    /**
     * checks if two square roots are equal
     * @param {SquareRoot|number|Fraction|Term|string} term2
     * @return {boolean}
     */
    equalTo: (term2) => {
      if (typeof term2 === "number" || term2 instanceof Fraction) {
        term2 = new SquareRoot(1, { coeff: term2 });
      }
      if (term2 instanceof SquareRoot) {
        return (
          this.radicand.is.equalTo(term2.radicand) &&
          this.coeff.is.equalTo(term2.coeff)
        );
      }
      return false;
    },

    /**
     * whether this square root is rational (ie radicand of one)
     */
    rational: () => {
      return this.radicand.is.one();
    },

    not: {
      rational: () => !this.is.rational(),
      /**
       * checks if two square roots are not equal
       * @param {SquareRoot|number|Fraction|Term|string} term2
       * @return {boolean}
       */
      equalTo: (term2) => !this.is.equalTo(term2),
      // super methods
      constant: () => true,
      /** @type {(term2: string|number|Fraction|Term)=>boolean} */
      like: (term2) => super.is.not.like(term2),
    },
  };

  /** methods to cast this term to other types */
  cast = {
    /**
     * cast to Fraction type
     * @returns {Fraction} the fraction representation of this term
     */
    toFraction: () => {
      if (this.is.rational()) {
        return this.coeff;
      }
      throw new Error(`cannot cast ${this} to Fraction: radicands detected`);
    },
  };

  /**
   * value of
   * @returns {number} - the numerical value of the term
   */
  valueOf() {
    return this.coeff.valueOf() * Math.sqrt(this.radicand.valueOf());
  }

  /**
   *
   * @param {number} precision
   * @returns {string}
   */
  toPrecision(precision) {
    return this.valueOf().toPrecision(precision);
  }
}

/**
 * extract perfect n powers from a number
 * takes an integer x, and returns [a, b] such that x = a^n b, where b is n-power free (up to prime factors less than 100)
 * @param {number} x - the number to be factorized
 * @param {number} [n=2] - the power to be extracted
 * @param {number} [y=1] - a^n store-keep. for purposes of recurrence, should typically only be used internally.
 * @return {[number, number]} - [a, b] such that x = a^n b, where b is n-power free (up to prime factors less than 100)
 */
export function extractPowers(x, n = 2, y = 1) {
  if (x === 0) {
    return [0, 0];
  }
  const primes = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
    73, 79, 83, 89, 97,
  ];
  for (const prime of primes) {
    if (x % prime ** n === 0) {
      return extractPowers(x / prime ** n, n, y * prime);
    } else if (x < Math.pow(prime, n)) {
      // early return since relevant primes are already considered
      break;
    }
  }
  return [y, x];
}
