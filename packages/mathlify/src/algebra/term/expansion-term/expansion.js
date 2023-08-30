// ExpansionTerm represents k (exp_1)^n1 (exp_2)^n2 ... (exp_n)^n3, where exp_i are expressions

import { Expression, Fraction, Term } from "../../../core/index.js";
import { numberToFraction } from "../../../utils/toFraction.js";

/**
 * ExpansionTerm class extending the Term class
 * @property {Map<Expression,Fraction>} expPowerMap - map of all the expressions and their powers
 * @property {Fraction} coeff - either 1 or -1 to indicate the sign of the term
 * @property {"expansion-term"} kind - mathlify rational class kind
 * @property {"expansion-term"} type - mathlify rational class type
 * @extends Term
 */
export class ExpansionTerm extends Term {
  /** @type {Map<Expression,Fraction>} */
  expPowerMap;
  /** @type {Fraction} coeff  */
  coeff;
  /** @type {"expansion-term"} kind - mathlify rational class kind */
  kind;
  /** @type {"expansion-term"} type - mathlify rational class type */
  type;

  /**
   * @constructor
   * Creates an Expansion Term instance
   * @param {(number|Fraction|string|Term|Expression|{exp: Expression, power: number|Fraction}|[Expression, number|Fraction])[]} exps - the expression
   */
  constructor(...exps) {
    /** @type {Map<Expression,Fraction>} */
    const expPowerMap = new Map();
    /** @type {Fraction} */
    let coeff = new Fraction(1);
    exps.forEach((exp, i) => {
      /** @type {Expression} */
      let expression;
      /** @type {Fraction} */
      let power = new Fraction(1);
      if (
        typeof exp === "number" ||
        exp instanceof Fraction ||
        typeof exp === "string" ||
        exp instanceof Term
      ) {
        expression =
          exp instanceof ExpansionTerm ? exp.expand() : new Expression(exp);
      } else if (exp instanceof Expression) {
        expression = exp;
      } else if (Array.isArray(exp)) {
        // [exp, power]
        expression = exp[0];
        power = numberToFraction(exp[1]);
      } else {
        // {exp, power}
        expression = exp.exp;
        power = numberToFraction(exp.power);
      }
      // handle first expression: hoist coeff if just a single term
      if (i === 0) {
        if (expression.terms.length === 1 && power.is.equalTo(1)) {
          const termCoeff = expression.terms[0].coeff;
          if (termCoeff.is.not.zero()) {
            expression = expression.times(termCoeff.reciprocal());
          }
          coeff = coeff.times(termCoeff);
        }
      }
      // inserts expression into expPowerMap
      if (expression.is.not.constant()) {
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
      } else {
        coeff = coeff.times(expression.cast.toFraction());
      }
    });
    /** @type {string[]} */
    const expStrings = [];
    for (let [exp, power] of expPowerMap.entries()) {
      if (power.is.equalTo(0)) {
        expPowerMap.delete(exp);
      } else {
        expStrings.push(`(${exp})^{${power}}`);
      }
    }
    super(coeff, ...expStrings);
    this.expPowerMap = expPowerMap;
    this.coeff = coeff;
    this.kind = "expansion-term";
    this.type = "expansion-term";
  }

  /**
   * resets coeff
   * should not be used directly: only present to ensure compatibility with Expression class
   * @returns {ExpansionTerm} - the Expansion Term but with coeff = 1
   */
  resetCoeff() {
    return new ExpansionTerm(...expPowerMapToConstructorObj(this.expPowerMap));
  }

  /**
   * times (into coefficient)
   * @param {number|Fraction} x - the multiplier
   * @returns {ExpansionTerm} - the Expansion Term multiplied by x
   */
  times(x) {
    return new ExpansionTerm(
      this.coeff.times(x),
      ...expPowerMapToConstructorObj(this.expPowerMap)
    );
  }

  /**
   * divide expansion terms
   * @param {ExpansionTerm} x - the divisor
   * @returns {ExpansionTerm} - the Expansion Term divided by x
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
    return new ExpansionTerm(
      this.coeff.divide(x.coeff),
      ...expPowerMapToConstructorObj(expPowerMap)
    );
  }

  /**
   * to expression power array
   * @returns {{exp: Expression, power: Fraction}[]} - the expression power array
   */
  toExpPowerArray() {
    /** @type {{exp: Expression, power: Fraction}[]} */
    const expPowerArray = [];
    for (let [exp, power] of this.expPowerMap.entries()) {
      expPowerArray.push({ exp, power });
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
      return new Expression(this.coeff);
    }
    return exp.times(this.coeff);
  }

  /**
   * toString
   * @returns {string} - the LaTeX string representation of the Expression
   */
  toString() {
    /** @type {string[]} */
    const expStrings = [];
    if (this.expPowerMap.size === 1) {
      const [exp, power] = Array.from(this.expPowerMap)[0];
      if (this.coeff.is.equalTo(1) && power.is.equalTo(1)) {
        expStrings.push(`${exp}`);
      } else {
        const powerBrackets = `${power}`.length > 1 ? `{${power}}` : `${power}`;
        const bracketString =
          exp.terms.length === 1 ? `${exp}` : `\\left( ${exp} \\right)`;
        const expString = power.is.equalTo(1)
          ? bracketString
          : `${bracketString}^${powerBrackets}`;
        expStrings.push(expString);
      }
    } else {
      for (let [exp, power] of this.expPowerMap.entries()) {
        const bracketString =
          exp.terms.length === 1 ? `${exp}` : `\\left( ${exp} \\right)`;
        const powerBrackets = `${power}`.length > 1 ? `{${power}}` : `${power}`;
        const expString = power.is.equalTo(1)
          ? bracketString
          : `${bracketString}^${powerBrackets}`;
        expStrings.push(expString);
      }

      //if (firstTerm) {
      //	firstTerm = false;
      //	if (exp.terms.length === 1 && power.is.equalTo(1)) {
      //		if (`${exp}` !== '1') {
      //			expStrings.push(`${exp}`);
      //		}
      //	} else {
      //		const powerBrackets =
      //			`${power}`.length > 1 ? `{${power}}` : `${power}`;
      //		const expString = power.is.equalTo(1)
      //			? this.expPowerMap.size === 1 && this.coeff.is.equalTo(1)
      //				? `${exp}`
      //				: `\\left( ${exp} \\right)`
      //			: `\\left( ${exp} \\right)^${powerBrackets}`;
      //		expStrings.push(expString);
      //	}
      //} else {
      //	const powerBrackets = `${power}`.length > 1 ? `{${power}}` : `${power}`;
      //	const bracketString =
      //	const expString = power.is.equalTo(1)
      //		? `\\left( ${exp} \\right)`
      //		: `\\left( ${exp} \\right)^${powerBrackets}`;
      //	expStrings.push(expString);
      //}
    }
    return `${new Term(this.coeff, ...expStrings)}`;
  }

  //! Static Methods
  /**
   * lcm
   * @static
   * @param {(ExpansionTerm|Expression)[]} exps - the expansion terms
   * @returns {ExpansionTerm} - the lcm of the expansion terms
   */
  static lcm(...exps) {
    /** @type {Map<Expression,Fraction>} */
    let expPowerMap = new Map();
    /** @type {Fraction} */
    let coeff = new Fraction(1);
    exps.forEach((exp) => {
      const expression =
        exp instanceof ExpansionTerm ? exp : new ExpansionTerm(exp);
      expPowerMap = expPowerMapMaxPower(expPowerMap, expression.expPowerMap);
      coeff = Fraction.lcm(coeff, expression.coeff);
    });
    return new ExpansionTerm(
      coeff,
      ...expPowerMapToConstructorObj(expPowerMap)
    );
  }

  /**
   * gcd
   * @static
   * @param {(ExpansionTerm|Expression)[]} exps - the expansion terms
   * @returns {ExpansionTerm} - the lcm of the expansion terms
   */
  static gcd(...exps) {
    /** @type {Map<Expression,Fraction>} */
    let expPowerMap = new Map();
    /** @type {Fraction} */
    let coeff = new Fraction(1);
    exps.forEach((exp) => {
      const expression =
        exp instanceof ExpansionTerm ? exp : new ExpansionTerm(exp);
      expPowerMap = expPowerMapMinPower(expPowerMap, expression.expPowerMap);
      coeff = Fraction.gcd(coeff, expression.coeff);
    });
    return new ExpansionTerm(
      coeff,
      ...expPowerMapToConstructorObj(expPowerMap)
    );
  }

  /**
   * factorize
   * @static
   * @param {ExpansionTerm} exp1 - expansion term 1
   * @param {ExpansionTerm} exp2 - expansion term 2
   * @returns {ExpansionTerm} factorized expression (...)(gcd)
   */
  static factorize(exp1, exp2) {
    const gcd = ExpansionTerm.gcd(exp1, exp2);
    const remainder1 = exp1.divide(gcd).expand();
    const remainder2 = exp2.divide(gcd).expand();
    return new ExpansionTerm(remainder1.plus(remainder2), gcd);
  }

  /**
   * product
   * @static
   * @param {(ExpansionTerm|Expression)[]} exps - the expansion terms
   * @returns {ExpansionTerm} - the product of the expansion terms
   */
  static product(...exps) {
    /** @type {(Expression|{exp: Expression, power: Fraction})[]} */
    const expPowerArray = [];
    let coeff = new Fraction(1);
    exps.forEach((exp) => {
      if (exp instanceof ExpansionTerm) {
        coeff = coeff.times(exp.coeff);
        expPowerArray.push(...exp.toExpPowerArray());
      } else {
        expPowerArray.push(exp);
      }
    });
    return new ExpansionTerm(coeff, ...expPowerArray);
  }
}

/**
 *
 * @param {Map<Expression,Fraction>} expPowerMap
 * @returns {{exp: Expression, power: Fraction}[]}
 */
function expPowerMapToConstructorObj(expPowerMap) {
  /** @type {{exp: Expression, power: Fraction}[]} */
  const constructorObj = [];
  for (let [exp, power] of expPowerMap.entries()) {
    constructorObj.push({ exp, power });
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
