// ExpansionProduct represents
// g(x) \\prod_i (exp_i)^ni
// g(x) is a factor term (no additions within)
// exp_i is an expression with at least 2 terms
// ni is rational

import {
  Expression,
  Fraction,
  Term,
  numberToFraction,
} from "../../../core/index.js";

/**
 * ExpansionTerm class extending the Term class
 * @property {Map<Expression,Fraction>} expPowerMap - map of all the expressions and their powers
 * @property {Term} factor
 * @property {Expression[]} exps
 * @property {"expansion-product"} type
 * @extends Term
 */
export class ExpressionProduct extends Term {
  /** @type {Map<Expression,Fraction>} */
  expPowerMap;
  /** @type {Expression[]} */
  exps;
  /** @type {"expression-product"} kind - mathlify rational class kind */
  type;
  /** @type {Term} */
  factor;

  /**
   * @constructor
   * Creates an Expansion Term instance
   * @param {(number|Fraction|string|Term|Expression
   * |[Expression|(number|Fraction|string|{variable: string, power: number|Fraction}|[string,number|Fraction]|Term)[], number|Fraction])[]} exps - the expression
   */
  constructor(...exps) {
    /** @type {Map<Expression,Fraction>} */
    const expPowerMap = new Map();
    let factor = new Term(1);
    exps.forEach((exp) => {
      if (
        typeof exp === "number" ||
        exp instanceof Fraction ||
        typeof exp === "string" ||
        exp instanceof Term
      ) {
        factor = factor.times(exp);
      } else {
        if (exp instanceof Expression) {
          exp = [exp, 1];
        }
        // all of [exp, power] form now
        const [expression, power] = [
          exp[0] instanceof Expression ? exp[0] : new Expression(exp[0]),
          numberToFraction(exp[1]),
        ];
        if (expression.is.constant()) {
          factor = factor.times(expression.cast.toFraction().pow(power));
        } else if (expression.is.term()) {
          factor = factor.times(expression.cast.toTerm().pow(power));
        } else {
          // add to expPowerMap
          // TODO: is there a more efficient way to do this?
          let expressionExistsInPowerMap = false;
          for (let exp of expPowerMap.keys()) {
            if (exp.is.equalTo(expression)) {
              // non-null assertion because we know exp exists in expPowerMap
              const oldPower = /** @type {!Fraction} */ (expPowerMap.get(exp));
              expPowerMap.set(exp, oldPower.plus(power));
              expressionExistsInPowerMap = true;
              break;
            }
          }
          if (!expressionExistsInPowerMap) {
            expPowerMap.set(expression, power);
          }
        }
      }
    });

    /** @type {[string, Fraction][]} */
    const expArray = [];
    /** @type {Expression[]} */
    const expressions = [];
    for (let [exp, power] of expPowerMap.entries()) {
      if (power.is.equalTo(0)) {
        expPowerMap.delete(exp);
      } else {
        expArray.push([`(${exp})`, power]);
        expressions.push(exp);
      }
    }
    /** @type {[string, Fraction][]} */
    const args = [];
    factor.powerMap.forEach((power, variable) => {
      args.push([variable, power]);
    });
    super(factor.coeff, ...args, ...expArray);
    this.expPowerMap = expPowerMap;
    this.factor = factor;
    this.exps = expressions;
    this.type = "expression-product";
  }

  /**
   * resets coeff
   * should not be used directly: only present to ensure compatibility with Expression class
   * @returns {ExpressionProduct} - the Expansion Term but with coeff = 1
   */
  resetCoeff() {
    return new ExpressionProduct(
      this.factor.resetCoeff(),
      ...expPowerMapToConstructorObj(this.expPowerMap)
    );
  }

  /**
   * times (into coefficient)
   * @param {number|Fraction} x - the multiplier
   * @returns {ExpressionProduct} - the Expansion Term multiplied by x
   */
  times(x) {
    return new ExpressionProduct(
      this.factor.times(x),
      ...expPowerMapToConstructorObj(this.expPowerMap)
    );
  }

  /**
   * divide expansion terms
   * @param {ExpressionProduct} x - the divisor
   * @returns {ExpressionProduct} - the Expansion Term divided by x
   */
  divide(x) {
    const expPowerMap = new Map(this.expPowerMap);
    this.expPowerMap.forEach((power, exp) => {
      if (x.expPowerMap.has(exp)) {
        const newPower = power.minus(
          /** @type {Fraction}*/ (x.expPowerMap.get(exp))
        );
        if (newPower.is.zero()) {
          expPowerMap.delete(exp);
        } else {
          expPowerMap.set(exp, newPower);
        }
      } else {
        expPowerMap.set(exp, power);
      }
    });
    return new ExpressionProduct(
      this.factor.divide(x.coeff),
      ...expPowerMapToConstructorObj(expPowerMap)
    );
  }

  /**
   * to expression power array
   * @returns {[Expression, power: Fraction][]} - the expression power array
   */
  toExpPowerArray() {
    /** @type {[Expression, Fraction][]} */
    const expPowerArray = [];
    for (let [exp, power] of this.expPowerMap.entries()) {
      expPowerArray.push([exp, power]);
    }
    return expPowerArray;
  }

  /**
   * expands the expression
   * @returns {Expression} - the expanded expression
   * WARNING: only works for positive integral powers
   */
  expand() {
    /** @type {Expression|undefined} */
    let exp = undefined;
    for (let [exp1, power] of this.expPowerMap.entries()) {
      if (exp === undefined) {
        exp = exp1.pow(power);
      } else {
        exp = exp.times(exp1.pow(power));
      }
    }
    if (exp === undefined) {
      return new Expression(this.factor);
    }
    return exp.times(this.factor);
  }

  // /**
  //  * toString
  //  * @returns {string} - the LaTeX string representation of the Expression
  //  */
  // toString() {
  //   /** @type {string[]} */
  //   const expStrings = [];
  //   if (this.expPowerMap.size === 1) {
  //     const [exp, power] = Array.from(this.expPowerMap)[0];
  //     if (this.coeff.is.equalTo(1) && power.is.equalTo(1)) {
  //       expStrings.push(`${exp}`);
  //     } else {
  //       const powerBrackets = `${power}`.length > 1 ? `{${power}}` : `${power}`;
  //       const bracketString =
  //         exp.terms.length === 1 ? `${exp}` : `\\left( ${exp} \\right)`;
  //       const expString = power.is.equalTo(1)
  //         ? bracketString
  //         : `${bracketString}^${powerBrackets}`;
  //       expStrings.push(expString);
  //     }
  //   } else {
  //     for (let [exp, power] of this.expPowerMap.entries()) {
  //       const bracketString =
  //         exp.terms.length === 1 ? `${exp}` : `\\left( ${exp} \\right)`;
  //       const powerBrackets = `${power}`.length > 1 ? `{${power}}` : `${power}`;
  //       const expString = power.is.equalTo(1)
  //         ? bracketString
  //         : `${bracketString}^${powerBrackets}`;
  //       expStrings.push(expString);
  //     }

  //     //if (firstTerm) {
  //     //	firstTerm = false;
  //     //	if (exp.terms.length === 1 && power.is.equalTo(1)) {
  //     //		if (`${exp}` !== '1') {
  //     //			expStrings.push(`${exp}`);
  //     //		}
  //     //	} else {
  //     //		const powerBrackets =
  //     //			`${power}`.length > 1 ? `{${power}}` : `${power}`;
  //     //		const expString = power.is.equalTo(1)
  //     //			? this.expPowerMap.size === 1 && this.coeff.is.equalTo(1)
  //     //				? `${exp}`
  //     //				: `\\left( ${exp} \\right)`
  //     //			: `\\left( ${exp} \\right)^${powerBrackets}`;
  //     //		expStrings.push(expString);
  //     //	}
  //     //} else {
  //     //	const powerBrackets = `${power}`.length > 1 ? `{${power}}` : `${power}`;
  //     //	const bracketString =
  //     //	const expString = power.is.equalTo(1)
  //     //		? `\\left( ${exp} \\right)`
  //     //		: `\\left( ${exp} \\right)^${powerBrackets}`;
  //     //	expStrings.push(expString);
  //     //}
  //   }
  //   return `${new Term(this.coeff, ...expStrings)}`;
  // }

  //! Static Methods
  /**
   * lcm
   * @static
   * @param {(ExpressionProduct|Expression)[]} exps - the expansion terms
   * @returns {ExpressionProduct} - the lcm of the expansion terms
   */
  static lcm(...exps) {
    /** @type {Map<Expression,Fraction>} */
    let expPowerMap = new Map();
    /** @type {Fraction} */
    let coeff = new Fraction(1);
    exps.forEach((exp) => {
      const expression =
        exp instanceof ExpressionProduct ? exp : new ExpressionProduct(exp);
      expPowerMap = expPowerMapMaxPower(expPowerMap, expression.expPowerMap);
      coeff = Fraction.lcm(coeff, expression.coeff);
    });
    return new ExpressionProduct(
      coeff,
      ...expPowerMapToConstructorObj(expPowerMap)
    );
  }

  /**
   * gcd
   * @static
   * @param {(ExpressionProduct|Expression)[]} exps - the expansion terms
   * @returns {ExpressionProduct} - the lcm of the expansion terms
   */
  static gcd(...exps) {
    /** @type {Map<Expression,Fraction>} */
    let expPowerMap = new Map();
    /** @type {Fraction} */
    let coeff = new Fraction(1);
    exps.forEach((exp) => {
      const expression =
        exp instanceof ExpressionProduct ? exp : new ExpressionProduct(exp);
      expPowerMap = expPowerMapMinPower(expPowerMap, expression.expPowerMap);
      coeff = Fraction.gcd(coeff, expression.coeff);
    });
    return new ExpressionProduct(
      coeff,
      ...expPowerMapToConstructorObj(expPowerMap)
    );
  }

  /**
   * factorize
   * @static
   * @param {ExpressionProduct} exp1 - expansion term 1
   * @param {ExpressionProduct} exp2 - expansion term 2
   * @returns {ExpressionProduct} factorized expression (...)(gcd)
   */
  static factorize(exp1, exp2) {
    const gcd = ExpressionProduct.gcd(exp1, exp2);
    const remainder1 = exp1.divide(gcd).expand();
    const remainder2 = exp2.divide(gcd).expand();
    return new ExpressionProduct(remainder1.plus(remainder2), gcd);
  }

  /**
   * product
   * @static
   * @param {(ExpressionProduct|Expression)[]} exps - the expansion terms
   * @returns {ExpressionProduct} - the product of the expansion terms
   */
  static product(...exps) {
    /** @type {(Expression|[Expression, Fraction])[]} */
    const expPowerArray = [];
    let coeff = new Fraction(1);
    exps.forEach((exp) => {
      if (exp instanceof ExpressionProduct) {
        coeff = coeff.times(exp.coeff);
        expPowerArray.push(...exp.toExpPowerArray());
      } else {
        expPowerArray.push(exp);
      }
    });
    return new ExpressionProduct(coeff, ...expPowerArray);
  }
}

/**
 *
 * @param {Map<Expression,Fraction>} expPowerMap
 * @returns {[Expression, Fraction][]}
 */
function expPowerMapToConstructorObj(expPowerMap) {
  /** @type {[Expression, Fraction][]} */
  const constructorObj = [];
  for (let [exp, power] of expPowerMap.entries()) {
    constructorObj.push([exp, power]);
  }
  return constructorObj;
}

/**
 * given two expPowerMaps, return a new expPowerMap that is the "lcm" of the two
 * @param {Map<Expression,Fraction>} expPowerMap1
 * @param {Map<Expression,Fraction>} expPowerMap2
 */
function expPowerMapMaxPower(expPowerMap1, expPowerMap2) {
  const expPowerMap = new Map(expPowerMap1);
  for (let [exp, power] of expPowerMap2.entries()) {
    let expExists = false;
    for (let [exp1, power1] of expPowerMap.entries()) {
      if (exp1.is.equalTo(exp)) {
        if (power1.is.lessThan(power)) {
          expPowerMap.set(exp, power);
        }
        expExists = true;
        break;
      }
    }
    // exp in expPowerMap2 not in expPowerMap
    if (!expExists) {
      expPowerMap.set(exp, power);
    }
  }
  return expPowerMap;
}

/**
 * given two expPowerMaps, return a new expPowerMap that is the "gcd" of the two
 * @param {Map<Expression,Fraction>} expPowerMap1
 * @param {Map<Expression,Fraction>} expPowerMap2
 */
function expPowerMapMinPower(expPowerMap1, expPowerMap2) {
  const expPowerMap = new Map(expPowerMap1);
  for (let [exp, power] of expPowerMap.entries()) {
    let expExists = false;
    for (let [exp2, power2] of expPowerMap2.entries()) {
      if (exp2.is.equalTo(exp)) {
        if (power2.is.lessThan(power)) {
          expPowerMap.set(exp, power2);
        }
        expExists = true;
        break;
      }
    }
    if (!expExists) {
      expPowerMap.delete(exp);
    }
  }
  return expPowerMap;
}
