// ExpansionTerm represents (exp_1)^n1 (exp_2)^n2 ... (exp_n)^n3, where exp_i are expressions

import { Expression, Fraction, Term } from "../../../core/index.js";
import { numberToFraction } from "../../../utils/toFraction.js";

//TODO: allow expression for first term

/**
 * ExpansionTerm class extending the Term class
 * @property {Term} exp1 - the first expression (currently only supports a single term)
 * @property {Expression} exp2 - the second expression
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
        expression = new Expression(exp);
      } else if (exp instanceof Expression) {
        expression = exp;
      } else if (Array.isArray(exp)) {
        expression = exp[0];
        power = numberToFraction(exp[1]);
      } else {
        expression = exp.exp;
        power = numberToFraction(exp.power);
      }
      // handle first expression: hoist coeff if just a single term
      if (i === 0) {
        if (expression.terms.length === 1 && power.is.equalTo(1)) {
          const termCoeff = expression.terms[0].coeff;
          expression = expression.divide(termCoeff);
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
      }
    });
    /** @type {string[]} */
    const expStrings = [];
    for (let [exp, power] of expPowerMap.entries()) {
      expStrings.push(`(${exp})^{${power}}`);
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
      ...expPowerMapToConstructorObj(this.expPowerMap),
      x
    );
  }

  /**
   * expands the expression
   * @returns {Expression} - the expanded expression
   * WARNING: only works for positive integral powers
   */
  expand() {
    let exp = new Expression(1);
    for (let [exp1, power] of this.expPowerMap.entries()) {
      exp = exp.times(exp1.pow(power));
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
    let firstTerm = true;
    for (let [exp, power] of this.expPowerMap.entries()) {
      if (firstTerm) {
        firstTerm = false;
        if (exp.terms.length === 1 && power.is.equalTo(1)) {
          if (`${exp}` !== "1") {
            expStrings.push(`${exp}`);
          }
        } else {
          const powerBrackets =
            `${power}`.length > 1 ? `{${power}}` : `${power}`;
          const expString = power.is.equalTo(1)
            ? `\\left( ${exp} \\right)`
            : `\\left( ${exp} \\right)^${powerBrackets}}`;
          expStrings.push(expString);
        }
      } else {
        const powerBrackets = `${power}`.length > 1 ? `{${power}}` : `${power}`;
        const expString = power.is.equalTo(1)
          ? `\\left( ${exp} \\right)`
          : `\\left( ${exp} \\right)^${powerBrackets}}`;
        expStrings.push(expString);
      }
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
    if (!expExists) {
      expPowerMap.set(exp, power);
    }
  }
  return expPowerMap;
}
