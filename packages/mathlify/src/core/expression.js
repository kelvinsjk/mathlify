// the expression class is a collection of terms under addition

import { Fraction } from "./fraction.js";
import { Term } from "./term.js";

/** @typedef {import('./types.d.ts').ExpressionType} ExpressionType */
/** @typedef {import('./types.d.ts').ExpressionJSON} ExpressionJSON */
/** @typedef {import('./types.d.ts').TermJSON} TermJSON */

/** Expression class
 * @property {Map<string,Fraction>} termCoeffMap the terms in the expression, where the key is the term signature and the value is the coefficient
 * @property {Map<string,Term>} termAtomMap the terms in the expression, with coefficient adjusted to 1
 * @property {Term[]} terms - array of terms in the expression
 * @property {ExpressionType} type - mathlify expression class kind
 */
export class Expression {
  /** @type {Map<string,Fraction>} */
  termCoeffMap;
  /** @type {Map<string,Term>} */
  termAtomMap;
  /** @type {Term[]} */
  terms;
  /** @type {ExpressionType} */
  type;
  /**
   * @constructor
   * Creates an Expression instance
   * @param {(number|Fraction|string|Term|(number|Fraction|string|{variable: string, power: number|Fraction}|[string,number|Fraction]|Term)[])[]} terms - terms of the expression
   */
  constructor(...terms) {
    if (terms.length === 0) {
      throw new Error("Expression must have at least one term");
    }
    /** @type {Map<string,Fraction>} */
    const termCoeffMap = new Map();
    /** @type {Map<string,Term>} */
    const termAtomMap = new Map();
    terms.forEach((term) => {
      if (typeof term === "number" || term instanceof Fraction) {
        //! numbers/Fractions
        const currentConstant = termCoeffMap.get("") ?? new Fraction(0);
        termCoeffMap.set("", currentConstant.plus(term));
      } else if (typeof term === "string") {
        //! strings
        if (term !== "") {
          // ignore empty string
          const currentConstant = termCoeffMap.get(term) ?? new Fraction(0);
          termCoeffMap.set(term, currentConstant.plus(1));
          if (!termAtomMap.has(term)) {
            termAtomMap.set(term, new Term(term));
          }
        }
      } else if (term instanceof Term || Array.isArray(term)) {
        //! convert array to term
        if (Array.isArray(term)) {
          let newTerm = new Term(1);
          term.forEach((t) => {
            const newT =
              typeof t === "number" ||
              typeof t === "string" ||
              t instanceof Fraction ||
              t instanceof Term
                ? t
                : new Term(t);
            newTerm = newTerm.times(newT);
          });
          term = newTerm;
        }
        //! Term
        // serialize variables
        const variable = term.signature;
        const currentConstant = termCoeffMap.get(variable) ?? new Fraction(0);
        termCoeffMap.set(variable, currentConstant.plus(term.coeff));
        if (!termAtomMap.has(variable)) {
          termAtomMap.set(variable, term.resetCoeff());
        }
      }
    });
    this.termCoeffMap = termCoeffMap;
    this.termAtomMap = termAtomMap;
    /** @type {Term[]} */
    const termsArray = [];
    //! recreate terms from termCoeffMap and termAtomMap
    termCoeffMap.forEach((coeff, variable) => {
      if (coeff.is.zero()) {
        if (variable !== "") {
          this.termCoeffMap.delete(variable);
          this.termAtomMap.delete(variable);
        }
      } else {
        if (variable === "") {
          // constant term
          termsArray.push(new Term(coeff));
        } else {
          const newTerm = this.termAtomMap.get(variable);
          if (newTerm) {
            // should always occur. to satisfy typescript
            termsArray.push(newTerm.times(coeff));
          }
        }
      }
    });
    this.terms = termsArray.length === 0 ? [new Term(0)] : termsArray;
    this.type = "expression";
  }

  /** @type {string[]} */
  get variables() {
    /** @type {string[]} */
    const variables = [];
    this.termAtomMap.forEach((term) => {
      variables.push(...term.variables);
    });
    return [...new Set(variables)];
  }

  //! boolean methods
  /**
   * boolean methods for this expression
   */
  is = {
    /**
     * @returns {boolean} whether this expression is a singleton (ie can be cast to Term class)
     * */
    term: () => this.terms.length <= 1,
    /**
     * @returns {boolean} whether this expression is a constant (ie can be cast to Fraction class)
     * */
    constant: () =>
      // TODO: improve method when we add more complicated variables (eg pi vs x)
      this.terms.length === 1 && this.terms[0].is.constant(),
    /**
     * @returns {boolean} whether this expression is rational (ie can be cast to Fraction class)
     * */
    rational: () => this.terms.length === 1 && this.terms[0].is.constant(),
    /**
     * @returns {boolean} whether this expression is zero
     */
    zero: () => this.toTex() === "0",
    /**
     * @param {Expression|number|Fraction|string|Term} exp2 the expression to compare to
     * @returns {boolean} whether the two expressions are equal
     */
    equalTo: (exp2) => {
      const exp2Exp = exp2 instanceof Expression ? exp2 : new Expression(exp2);
      return (
        this.terms.length === exp2Exp.terms.length &&
        this.terms.every((term) =>
          exp2Exp.terms.some((term2) => term.is.equalTo(term2))
        ) &&
        exp2Exp.terms.every((term) =>
          this.terms.some((term2) => term.is.equalTo(term2))
        )
      );
    },
    not: {
      /** @returns {boolean} whether this expression is not a term (ie more than 1 term present) */
      term: () => !this.is.term(),
      /** @returns {boolean} whether this expression is not a constant (ie have variables)) */
      constant: () => !this.is.constant(),
      /** @returns {boolean} whether this expression is not rational (ie have non-fractions)) */
      rational: () => !this.is.rational(),
      /**
       *  @param {Expression|number|Fraction|string|Term} exp2
       * @returns {boolean} whether the two expressions are not equal
       */
      equalTo: (exp2) => !this.is.equalTo(exp2),
      /**  @returns {boolean} whether this expression is not zero */
      zero: () => !this.is.zero(),
    },
  };

  //! casting methods
  /** methods to cast this term to other types */
  cast = {
    /**
     * @returns {Term} the term representation of this
     */
    toTerm: () => {
      if (this.terms.length === 1) {
        return this.terms[0];
      }
      throw new Error(
        `cannot cast ${this.toTex()} to Term: more than 1 term detected`
      );
    },
    /**
     * cast to Fraction type
     * @returns {Fraction} the fraction representation of this term
     */
    toFraction: () => {
      if (this.terms.length === 1) {
        return this.terms[0].cast.toFraction();
      }
      throw new Error(
        `cannot cast ${this.toTex()} to Fraction: more than 1 term detected`
      );
    },
  };

  //! arithmetic methods
  /**
   * Expression addition
   * @param {number|Fraction|string|Term|Expression} x term/expression to be added
   * @returns {Expression} the sum of the two
   */
  plus(x) {
    if (`${this.toTex()}` === "0") {
      return x instanceof Expression ? x : new Expression(x);
    }
    if (x instanceof Expression) {
      return new Expression(...this.terms, ...x.terms);
    }
    return new Expression(...this.terms, x);
  }

  /**
   * @returns {Expression} the negative of the expression
   */
  negative() {
    return new Expression(...this.terms.map((term) => term.negative()));
  }

  /** subtract terms from this Expression
   * @param {number|Fraction|string|Term|Expression} x - term to be subtracted
   * @returns {Expression} - the difference this minus x
   */
  minus(x) {
    if (typeof x === "number" || typeof x === "string") {
      x = new Term(x);
    }
    return this.plus(x.negative());
  }

  /**
   * @param {number|Fraction|string|Term|Expression} x term/expression to be multiplied
   * @returns {Expression} the product
   */
  times(x) {
    if (x instanceof Expression) {
      /** @type {Term[]} */
      const newTerms = [];
      this.terms.forEach((term) => {
        x.terms.forEach((xTerm) => {
          newTerms.push(term.times(xTerm));
        });
      });
      return new Expression(...newTerms);
    }
    const newTerms = this.terms.map((term) => term.times(x));
    return new Expression(...newTerms);
  }

  /**
   * @param {number|Fraction} n the exponent (must be non-negative integer)
   * @returns {Expression} the expression raised to the power of x, fully expanded
   */
  pow(n) {
    if (typeof n === "number") {
      n = new Fraction(n);
    }
    if (n.is.negative() || n.is.not.integer()) {
      throw new Error(
        `exponent must be non-negative integer, ${n.toTex()} received`
      );
    }

    /** @type {Expression|undefined} */
    let result = undefined;
    for (let i = 0; i < n.valueOf(); i++) {
      if (result === undefined) {
        result = this;
      } else {
        result = result.times(this);
      }
    }
    if (result === undefined) {
      return new Expression(1);
    }
    return result;
  }

  /**
   * @returns {Expression} the expression squared (expanded)
   */
  square() {
    return this.pow(2);
  }

  /**
   * expression divided by a term
   * @param {number|Fraction|string|Term} x term to be divided
   * @param {{fractionalDisplayMode: "always"|"auto"|"never"}} [options] whether to display the term as a fraction (default: false) (3/5 x by default, 3x/5 if true)
   * @returns {Expression} the quotient this divided by x
   * @warning division by expressions not supported. consider using the RationalTerm class
   */
  divide(x, options) {
    if (typeof x === "number") {
      x = new Fraction(x);
    }
    if (x instanceof Fraction) {
      return this.times(x.reciprocal());
    }
    if (!(x instanceof Term)) {
      x = new Term(x);
    }
    return this.times(x.reciprocal(options));
  }

  /**
   * @overload
   * @param {{[key: string]: number|Fraction}} x the values to sub in with the key being the variable signature.
   * @returns {Expression} the new Expression
   */
  /**
   * @overload
   * @param {number|Fraction} x the value to sub in as "x"
   * @return {Fraction} the value of the expression cast to Fraction type (make sure to check that this is valid or an error will be thrown)
   */
  /**
   * sub in a value for a variable
   * @param {{[key: string]: number|Fraction}|number|Fraction} x - the values to sub in with the key being the variable signature.
   * @returns {Expression|Fraction} - the new Expression
   * @example new Expression(2,'x').subIn({x: 3}) returns new Expression(6)
   * while new Expression(2,'x').subIn(3) returns new Fraction(6)
   */
  subIn(x) {
    if (typeof x === "number" || x instanceof Fraction) {
      const exp = this.subIn({ x });
      if (exp.is.rational()) {
        return exp.cast.toFraction();
      }
      throw new Error(
        `not able to cast ${exp.toTex()} as fraction. consider using subIn({x: val}) if an expression is expected`
      );
    }
    const newTerms = this.terms.map((term) => term.subIn(x));
    return new Expression(...newTerms);
  }

  /**
   * change order of terms
   * @param {number[]} args - the indices of the terms to be placed at the front (0-indexed).
   * indices not provided will retain the original order after these terms
   * @return {Expression} the rearranged expression
   */
  changeOrder(args) {
    const terms = this.terms;
    /** @type {Term[]} */
    const newTerms = [];
    args.forEach((arg) => {
      newTerms.push(terms[arg]);
    });
    newTerms.push(...terms.filter((_, i) => !args.includes(i)));
    return new Expression(...newTerms);
  }

  /**
   * slice the expression
   * @param {number} end - the end index (not inclusive)
   * @return {Expression} the expression with only terms from term 0 to term end-1
   */
  slice(end) {
    return new Expression(...this.terms.slice(0, end));
  }

  /**
   * gcd of the expression (only supports Fractions at the moment)
   * @return {Fraction} the gcd of all the term coefficients
   */
  gcd() {
    if (`${this.toTex()}` === "0") {
      throw new Error(`gcd is not defined for the 0 expression`);
    }
    return Fraction.gcd(...this.terms.map((term) => term.coeff));
  }

  /**
   * @returns {string} the LaTeX string representation of the Expression
   */
  toTex() {
    return this.terms.reduce((prev, term, i) => {
      if (i !== 0 && term.coeff.is.positive()) {
        return `${prev} + ${term.toTex()}`;
      }
      const space = i === 0 ? "" : " ";
      return `${prev}${space}${term.toTex()}`;
    }, "");
  }

  toString() {
    return this.toTex();
  }

  /**
   * serializes expression object. can be used with the static
   * `Expression.FromJSON` method to recreate this expression
   * class instance
   * @returns {ExpressionJSON}
   */
  toJSON() {
    /** @type {TermJSON[]} */
    const args = this.terms.map((term) => term.toJSON());
    /** @type {string[]} */
    const terms = this.terms.map((term) => term.toTex());
    return {
      type: "expression",
      terms,
      args,
    };
  }

  //! static methods
  /**
   * re-instantiate Expression class instance from JSON object literal
   * @param {ExpressionJSON} exp JSON object literal obtained from JSON.parse
   * @returns {Expression} Term class instance
   */
  static fromJSON(exp) {
    const terms = exp.args.map((term) => Term.fromJSON(term));
    return new Expression(...terms);
  }
}
