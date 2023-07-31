/**
 * Finds greatest common divisor of n **integers**
 * of which at least one is non-zero
 *
 * @returns the (positive) gcd of the given numbers
 */
export function gcd(...integers: number[]): number;
export function lcm(...integers: number[]): number;
/**
 * takes an integer and/or Fraction, and returns a new Fraction instance
 * representing the number
 */
export function numberToFraction(x: number | Fraction): Fraction;
/**
 * Fraction class `{num: numerator, den: denominator}`
 *
 * `num` represents the numerator and is an integer
 *
 * `den` represents the denominator and is a positive integer (any negative signs are "hoisted" to `num`)
 */
export class Fraction {
    /** numerator of the fraction (integer) */
    num: number;
    /** denominator of the fraction (positive integer) */
    den: number;
    /**
     * Creates a new `Fraction` instance, 'simplifying' the fraction to the form a/b such that a is an integer, b is a positive integer and gcd(a,b)=1.
     * @param num numerator
     * @param den denominator defaults to `1`
     */
    constructor(num: number, den?: number);
    /**
     * addition
     * @param f2 the number/fraction to be added
     * @returns the sum of this fraction and `f2`
     */
    plus(f2: number | Fraction): Fraction;
    /**
     * multiplication
     * @param f2 the number/fraction to be multiplied
     * @returns the product of this fraction and `f2`
     */
    times(f2: number | Fraction): Fraction;
    /**
     * @returns negative of this fraction
     */
    negative(): Fraction;
    /**
     * @returns the absolute value of this Fraction
     */
    abs(): Fraction;
    /**
     * subtraction
     * @param f2 the number/fraction to be subtracted
     * @returns this fraction minus `f2`
     */
    minus(f2: number | Fraction): Fraction;
    /**
     * reciprocal
     * @returns this 1/(this fraction), provided that this fraction is non-zero
     */
    reciprocal(): Fraction;
    /**
     * division
     * @param f2 the number/fraction to be divided by. Cannot be zero.
     * @returns this fraction divided by `f2`
     */
    divide(f2: number | Fraction): Fraction;
    /**
     * exponentiation
     * @param n integer
     * @returns this fraction to the power of `n`
     */
    pow(n: number | Fraction): Fraction;
    /**
     * square
     * @returns the square of this fraction
     */
    square(): Fraction;
    /**
     * checks if this fraction is equal to `f2`
     */
    isEqualTo(f2: number | Fraction): boolean;
    /**
     * checks if this fraction not is equal to `f2`
     */
    isNotEqualTo(f2: number | Fraction): boolean;
    /**
     * checks if this fraction is an integer
     */
    isInteger(): boolean;
    /**
     * checks if this fraction is larger than f2
     * @param f2 number or fraction to compare against
     */
    isGreaterThan(f2: number | Fraction): boolean;
    /**
     * checks if this fraction is smaller than f2
     * @param f2 number or fraction to compare against
     */
    isLessThan(f2: number | Fraction): boolean;
    /**
     * checks if this fraction is greater than or equal to f2
     * @param f2 number or fraction to compare against
     */
    isAtLeast(f2: number | Fraction): boolean;
    /**
     * checks if this fraction is less than or equal to f2
     * @param f2 number or fraction to compare against
     */
    isAtMost(f2: number | Fraction): boolean;
    /**
     * ceiling function
     * @returns the least integer greater than or equal to this fraction in Fraction form
     */
    ceil(): Fraction;
    /**
     * floor function
     * @returns the greatest integer less than or equal to this fraction in Fraction form
     */
    floor(): Fraction;
    /**
     * rounding function
     *
     * round off this fraction to the nearest integer, and
     * @returns the value in Fraction form
     */
    round(): Fraction;
    /**
     * sign function
     *
     * @returns the sign of this fraction
     */
    sign(): number;
    /**
     * converts to Javascript built-in Number type
     * @returns the float representation of this fraction in the JavaScript number format
     */
    valueOf(): number;
    /**
     * invokes the JavaScript `Number.prototype.toFixed()` method
     */
    toFixed(digits?: number): string;
    /**
     * invokes the JavaScript `Number.prototype.toPrecision()` method
     * before passing it back as a number (to avoid exponential notation)
     */
    toPrecision(precision?: number): string;
    /**
     * `toString()` method
     *
     * @returns the LaTeX string representation of the fraction
     */
    toString(): string;
    /**
     * toJSON method that allows for quick reconstruction of class instance
     * by storing its constructor arguments
     */
    toJSON(): FractionJSON;
    /**
     * clones the Fraction: creating a new Fraction instance
     */
    clone(): Fraction;
    /**
     * the fraction class instance of 1
     */
    static ONE: Fraction;
    /**
     * the fraction class instance of 0
     */
    static ZERO: Fraction;
    /**
     * @returns gcd of given fractions
     */
    static gcd(...fractions: (number | Fraction)[]): Fraction;
    /**
     * given a set of fractions (a, b, c, ..., n)
     * @returns an array `[[A, B, C, ..., N], k ]`,
     * where k(A, B, C, ..., N) = (a, b, c, ..., n)
     */
    static factorize(...fractions: (number | Fraction)[]): [Fraction[], Fraction];
}
interface FractionJSON {
    type: string;
    args: [number, number];
}
/**
 * Basic Term class `{coeff: Fraction, variable: string }`
 * handles edge cases in typesetting:
 * 0x = 0, 1x = x, -1x = -x, \pm 1 = \pm 1
 */
export class BasicTerm {
    /** Coefficient of the term */
    coeff: Fraction;
    /**
     * String representation of the variable.
     *
     * An empty string here will represent the "constant term"
     */
    variableString: string;
    /**
     * Creates a new term instance
     * @param coeff coefficient of the term
     * @param variable string representation of the term/'variable'.
     * An empty string (default) means we are working with the constant term
     */
    constructor(coeff: Fraction | number, variable?: string);
    /**
     * `toString()` method
     *
     * @returns the LaTeX string representation of the term
     */
    toString(): string;
}
/**
 * Imaginary class representing 'ki', where i is the complex unit
 */
export class Imaginary extends BasicTerm {
    constructor(coeff?: number | Fraction);
    plus(x: Imaginary): Imaginary;
    negative(): Imaginary;
    minus(x: Imaginary): Imaginary;
    times(x: Imaginary | Fraction): Fraction | Imaginary;
    pow(n: number): Fraction | Imaginary;
    square(): Fraction;
    clone(): Imaginary;
    toJSON(): ImaginaryJSON;
}
interface ImaginaryJSON {
    type: 'imaginary';
    args: [FractionJSON];
}
/**
 * `Unknown` class representing "k x^n"
 */
export class VariableTerm extends BasicTerm {
    /** variable string (before taking powers) */
    variable: string;
    /** degree of the polynomial term: must be a non-negative integer */
    n: Fraction;
    /**
     * Creates a new polynomial term instance
     * @param coeff coefficient of the term. If a string is passed, we will use that as the unknown and let the coefficient and power be 1
     * @param options defaults to `{ unknown: 'x', n: 1, }`;
     */
    constructor(coeff?: Fraction | number | string, options?: {
        variable?: string;
        n?: number | Fraction;
    });
    /**
     * Multiplication
     */
    times(k: number | Fraction | VariableTerm): VariableTerm;
    /**
     * Division
     */
    divide(k: number | Fraction | VariableTerm): VariableTerm;
    /**
     * @returns the negative of this `Term`. Equivalent to `term.multiply(-1)`.
     */
    negative(): VariableTerm;
    pow(n: number): VariableTerm;
    /**
     * substitutes the unknown in and returns a fraction
     *
     * only supports fraction when n is an integer at the moment
     */
    subIn(x: number | Fraction): Fraction;
    /**
     * substitutes the unknown in and returns a number type
     */
    subInNumber(x: number): number;
    /** clones and creates a new instance */
    clone(): VariableTerm;
    toJSON(): VariableTermJSON;
}
interface VariableTermJSON {
    type: 'variable';
    args: [FractionJSON, {
        variable: string;
        n: FractionJSON;
    }];
}
export class MathSymbol {
    kind: string;
    symbol: string;
    constructor(symbol: string, options?: {
        kind?: string;
    });
    toString(): string;
    /**
     * toJSON method that allows for quick reconstruction of class instance
     * by storing its constructor arguments
     */
    toJSON(): MathSymbolJSON;
}
interface MathSymbolJSON {
    type: string;
    args: [string, {
        kind: string;
    }] | [] | [number] | [number, FractionJSON];
}
declare class _MathSymbol1 {
    kind: string;
    symbol: string;
    constructor(symbol: string, options?: {
        kind?: string;
    });
    toString(): string;
    /**
     * toJSON method that allows for quick reconstruction of class instance
     * by storing its constructor arguments
     */
    toJSON(): _MathSymbolJSON1;
}
interface _MathSymbolJSON1 {
    type: string;
    args: [string, {
        kind: string;
    }] | [] | [number] | [number, FractionJSON];
}
/**
 * Given a,b,...n,
 * returns
 * `{ k: sign*gcd(a,b,...,n), numbers: [a1,b1,...n1]}`
 * such that a+b+...+n = k(a1+b1+...+n1)
 */
export function factorize(...args: number[]): {
    k: number;
    numbers: number[];
};
/**
 * takes an integer and/or Fraction, and returns a new Fraction instance
 * representing the number
 */
export function numberToSquareRoot(x: number | Fraction | SquareRoot): SquareRoot;
/**
 * A term represented by k x_1 x_2 ... x_n, where k is the coefficient
 * and x_i represent "basic units" (square roots, variables and the imaginary unit)
 */
export class Term {
    kind: string;
    coeff: Fraction;
    symbols: {
        [key: string]: {
            symbol: MathSymbol | Surd;
            power: Fraction;
        };
    };
    constructor(...args: (number | Fraction | string | MathSymbol | ImaginarySymbol | Surd | [string | MathSymbol, number | Fraction])[]);
    isSurd(): boolean;
    isImag(): boolean;
    isRational(): boolean;
    /**
     * check if two terms are 'like terms'
     * (ie same symbols with same powers)
     */
    isLike(x: Term): boolean;
    /**
     * Multiplication
     */
    times(x: number | Fraction | string | MathSymbol | ImaginarySymbol | Surd | [string | MathSymbol, number | Fraction] | Term): Term;
    divide(x: number | Fraction | string | MathSymbol | ImaginarySymbol | Surd | [string | MathSymbol, number | Fraction] | Term): Term;
    negative(): Term;
    plus(x: number | Fraction | Term): Term;
    minus(x: number | Fraction | Term): Term;
    pow(n: number | Fraction): Term;
    reciprocal(): Term;
    subIn(x: number | Fraction, symbol?: string | MathSymbol): Fraction;
    subInNumber(x: number, symbol?: string | MathSymbol): number;
    valueOf(): number;
    square(): Term | Fraction;
    clone(): Term;
    toString(): string;
    /**
     * toJSON method that allows for quick reconstruction of class instance
     * by storing its constructor arguments
     */
    toJSON(): {
        type: string;
        args: [FractionJSON, ...(MathSymbolJSON | SurdJSON)[]] | [FractionJSON, FractionJSON];
    };
}
/**
 * the NthRoot class
 * `${coeff: Fraction, n: positive integer, radicand: non-negative fraction}`
 * representing $a \sqrt[n]{b}$ where $a$ is the coefficient and $b$ is the radicand.
 *
 * Note that we do not support negative radicands at this point.
 * For odd `n`, you may want to consider 'hoisting' the negative sign to the coefficient)
 *
 * Simplification of perfect Nth-powers are only done if the radicand is made up of
 * prime factors less than 100.
 *
 * It is recommended to use the `SquareRoot` class instead of `NthRoot` for square roots.
 */
export class NthRoot extends Term {
    /** the n-th root */
    n: number;
    /** the non-negative integer inside the radical */
    radicand: Fraction;
    kind: 'nthRootTerm' | 'sqrtTerm';
    coeff: Fraction;
    /**
     * creates a new NthRoot instance representing $a \sqrt[n]{b}$.
     * @param radicand only non-negative integers or Fractions are supported at this moment.
     * @param coeff coefficient of the radical (defaults to 1).
     */
    constructor(n: number, radicand: number | Fraction, coeff?: number | Fraction);
    /**
     * radical multiplication: $a_1 \sqrt[n]{b_1} \times a_2 \sqrt[n]{b_2} = a_1 a_2 \sqrt[n]{b_1 b_2}$
     *
     * only valid if n is the same for both terms.
     */
    times(x: NthRoot | number | Fraction): NthRoot;
    times(x: string | Term): Term;
    /**
     * radical division: a_1 \sqrt[n]{b_1} / a_2 \sqrt[n]{b_2} = a_1 / a_2 * \sqrt[n]{b_1 / b_2}$
     */
    divide(x: NthRoot | number | Fraction): NthRoot;
    /**
     * exponentiation
     *
     * @param n non-negative integer
     * @returns this NthRoot to the power of n
     */
    pow(n: number): NthRoot;
    /**
     * @returns the value of this NthRoot in the primitive number type
     */
    valueOf(): number;
    /**
     * tests for equality
     */
    isEqualTo(x: number | Fraction | NthRoot): boolean;
    /**
     * @returns true if this NthRoot represents a rational number
     */
    isRational(): boolean;
    /**
     * if this NthRoot is a rational number, returns the rational number as a `Fraction` instance.
     *
     * Warning: throws if NthRoot is not a rational number.
     */
    toFraction(): Fraction;
    toPrecision(precision: number): string;
    toFixed(digits: number): string;
    clone(): NthRoot;
}
/**
 * the SquareRoot class
 * `${coeff: Fraction, radicand: non-negative integer}`
 * representing $a \sqrt{b}$ where $a$ is the coefficient and $b$ is the radicand.
 *
 * Note that we do not support negative radicands at this point.
 */
export class SquareRoot extends NthRoot {
    kind: 'sqrtTerm';
    /**
     * creates a new SquareRoot instance representing $a \sqrt{b}$.
     * @param radicand only non-negative integers or Fractions are supported at this moment.
     * @param coeff coefficient of the radical (defaults to 1).
     *
     * If a fraction is provided as the radicand, we will 'rationalize' it such that
     * $a \sqrt{b/c}$ is converted to $\frac{a}{c} \sqrt{bc}$ so that the radicand is an integer.
     *
     * we will also simplify our radical such that the final surd $a\sqrt{b}$ is such that b square free,
     * up to prime powers less than 100
     */
    constructor(radicand: number | Fraction, coeff?: number | Fraction);
    /**
     * radical multiplication: $a_1 \sqrt[n]{b_1} \times a_2 \sqrt[n]{b_2} = a_1 a_2 \sqrt[n]{b_1 b_2}$
     *
     * only valid if n is the same for both terms.
     */
    times(x: SquareRoot | number | Fraction): SquareRoot;
    times(x: string | Term): Term;
    /**
     * radical division: a_1 \sqrt[n]{b_1} / a_2 \sqrt[n]{b_2} = a_1 / a_2 * \sqrt[n]{b_1 / b_2}$
     */
    divide(x: SquareRoot | number | Fraction): SquareRoot;
    /**
     * addition of radicals: only work for same radicand currently
     */
    plus(x: SquareRoot): SquareRoot;
    /**
     * subtraction of radicals: only work for same radicand currently
     */
    minus(x: SquareRoot): SquareRoot;
    /**
     * @returns negative of this SquareRoot
     */
    negative(): SquareRoot;
    /**
     * exponentiation
     *
     * @param n non-negative integer
     * @returns this NthRoot to the power of n
     */
    pow(n: number): SquareRoot;
    abs(): SquareRoot;
    square(): Fraction;
    /**
     * @returns the reciprocal this SquareRoot
     */
    reciprocal(): SquareRoot;
    clone(): SquareRoot;
    /**
     * the number one in SquareRoot class
     */
    static ONE: SquareRoot;
    toJSON(): SquareRootJSON;
}
interface SquareRootJSON {
    type: string;
    args: [FractionJSON, FractionJSON];
}
/**
 * Surd class representing \\sqrt{x}
 */
export class Surd extends _MathSymbol1 {
    kind: 'surd';
    radicand: number;
    constructor(radicand: number);
    toJSON(): SurdJSON;
}
export interface SurdJSON {
    type: 'surd';
    args: [number];
}
/**
 * NthRootSymbol class representing \\sqrt[n]{x}
 */
export class RootSymbol extends _MathSymbol1 {
    kind: 'rootSymbol';
    radicand: Fraction;
    n: number;
    constructor(n: number, radicand: number | Fraction);
    toJSON(): RootSymbolJSON;
}
export interface RootSymbolJSON {
    type: 'rootSymbol';
    args: [number, FractionJSON];
}
/**
 * Imaginary class representing 'ki', where i is the complex unit
 */
export class ImaginarySymbol extends _MathSymbol1 {
    kind: 'imaginarySymbol';
    constructor();
    toJSON(): ImaginarySymbolJSON;
}
export interface ImaginarySymbolJSON {
    type: 'imaginarySymbol';
    args: [];
}
/**
 * Expression class representing the sum of `Terms`
 */
export class Expression {
    kind: string;
    /** array of terms making up the expression */
    terms: Term[];
    /**
     * Creates a new Expression
     * @param args one or more `Term`s
     * `number` and `Fraction` types will be transformed into constant terms,
     *  while `string` type will be transformed into a term with coefficient 1
     */
    constructor(...args: (number | Fraction | string | [string, number | Fraction] | SquareRoot | Term | ExpressionOptions)[]);
    /**
     * `toString` method
     *
     * @returns the LaTeX string representation of the sum of all the terms
     */
    toString(): string;
    /**
     * toJSON method that allows for quick reconstruction of class instance
     * by storing its constructor arguments
     */
    toJSON(): {
        type: string;
        args: any[];
    };
    /**
     * performs scalar multiplication on each term of this
     */
    times(k: number | Fraction | string | SquareRoot | Term | Expression): Expression;
    divide(x: number | Fraction | string | SquareRoot | Term | Expression): Expression;
    /** applies negative to square root and imaginary terms */
    negative(): Expression;
    pow(n: number): Expression;
    square(): Expression;
    subIn(x: number | Fraction): Fraction;
    subInNumber(x: number): number;
    valueOf(): number;
    /**
     * adds the two expressions,
     * similar to concatenating the terms in the two expressions, combining like terms
     *
     * @returns the sum
     */
    plus(newExpression: number | Fraction | string | SquareRoot | Term | Expression): Expression;
    /**
     * subtracts this expression by the given expression
     *
     * @returns the difference
     */
    minus(newExpression: number | Fraction | string | SquareRoot | Term | Expression): Expression;
    /**
     * clones the object, creating a new instance of this expression
     */
    clone(): Expression;
}
interface ExpressionOptions {
    expressionKind: string;
}
/**
 * Polynomial class representing "ax^n + bx^n-1 + ... + k"
 */
export class Polynomial extends Expression {
    /** array of coefficients in ascending order, starting from constant term */
    coeffs: Fraction[];
    /** whether polynomial in ascending or descending order */
    ascending: boolean;
    /** degree of the polynomial */
    degree: number;
    /** variable name (e.g. "x") */
    variable: string;
    /**
     * Creates a new Polynomial instance
     * @param coeffs array of coefficients. if a number/fraction is provided, will create the polynomial "kx".
     * @param options defaults to `{ascending: false, degree: coeffs.length-1, variable: 'x'}`
     */
    constructor(coeffs: (number | Fraction)[] | (number | Fraction) | string, options?: {
        ascending?: boolean;
        degree?: number;
        variable?: string;
    });
    /** add two polynomials
     *
     * fraction/numbers will be converted a "constant polynomial", while a string will be converted to a polynomial term with coefficient 1
     */
    plus(p2: number | Fraction | string | Polynomial): Polynomial;
    /** multiplies two polynomials */
    times(p2: number | Fraction | string | Polynomial): Polynomial;
    /** negative of this polynomial */
    negative(): Polynomial;
    /**
     * divide by a *scalar*
     */
    divide(p2: number | Fraction): Polynomial;
    /** subtracts this by p2 */
    minus(p2: number | Fraction | string | Polynomial): Polynomial;
    /**
     * exponentiation
     * @returns this polynomial taken to a power of `n`
     */
    pow(n: number): Polynomial;
    /**
     * replace x with a new polynomial
     * @param x if string, replaces the variable
     */
    replaceXWith(x: string | Polynomial): Polynomial;
    /**
     * replace x with x+k
     */
    shift(k: number | Fraction): Polynomial;
    /**
     * square
     *
     * @returns the square of this polynomial
     *  */
    square(): Polynomial;
    /**
     * returns a polynomial with positive leading coefficient and gcd(...coeffs) = 1
     * */
    simplify(): Polynomial;
    subInSurd(x: number | SquareRoot): Expression;
    /**
     * changes ascending/behavior of polynomial
     *
     * @param ascending sets ascending behavior. By default, this
     * option is set to toggle current ascending/descending behavior
     *
     * @returns a reference to this polynomial instance
     *
     * WARNING: mutates current instance
     */
    changeAscending(ascending?: boolean): this;
    /** derivative of the polynomial */
    differentiate(): Polynomial;
    /** integral of the polynomial
     * @param options `{c, x1, y1}` where we can put in the integration constant c (defaults to 0),
     * or a point on the curve (x1, y1).
     */
    integrate(options?: {
        c?: number | Fraction;
        x1?: number | Fraction;
        y1?: number | Fraction;
    }): Polynomial;
    /** definite integral (fraction form)*/
    definiteIntegral(lower: number | Fraction, upper: number | Fraction): Fraction;
    /** definite integral (number form) */
    definiteIntegralNumber(lower: number | Fraction, upper: number | Fraction): number;
    /**
     * @returns an ascending polynomial only up until degree n
     */
    concatenate(n: number): Polynomial;
    /** checks if two polynomials are equal: i.e., coefficient array is the same and same variable */
    isEqualTo(poly2: Polynomial): boolean;
    /** clones this polynomial */
    clone(): Polynomial;
    /**
     * toJSON method that allows for quick reconstruction of class instance
     * by storing its constructor arguments
     */
    toJSON(): {
        type: 'polynomial';
        args: [Fraction[], {
            ascending: boolean;
            degree: number;
            variable: string;
        }];
    };
}
/**
 * Vector class representing a 3D vector coeff(x i + y j + z k)
 */
export class Vector {
    x: Fraction;
    y: Fraction;
    z: Fraction;
    coeff: Fraction;
    /**
     * creates a new Vector instance
     *
     * @param options defaults to `{coeff: 1, simplify: false, stretchable: false}`
     *  if `simplify` is `true`, then we will factorize our expression such that
     *  x,y,z are integers with gcd 1.
     *  if `stretchable` is set to true, then we will `simplify` and then
     *  set `coeff` to be 1
     *
     */
    constructor(x: number | Fraction, y?: number | Fraction, z?: number | Fraction, options?: {
        coeff?: number | Fraction;
        simplify?: boolean;
        stretchable?: boolean;
    });
    /**
     * simplifies the current vector to k(a,b,c) by taking
     * out common factors so that gcd(a,b,c)=1
     *
     * @param options defaults to `{stretchable: false}`.
     * If set to true, will set coeff to 1
     *
     * WARING: this method mutates the current instance
     *
     * @returns a reference to this vector
     */
    simplify(options?: {
        stretchable: boolean;
    }): this;
    /**
     * returns the unit vector parallel to this vector
     *
     * WARNING: only works if magnitude is integer
     */
    hat(): Vector;
    /**
     * Expands the coeff, taking this k(x,y,z) and
     * returning (kx, ky, kz)
     */
    expand(): Vector;
    /**
     * @returns the dot product
     */
    dot(v2: Vector): Fraction;
    /**
     * @returns the magnitude squared of this vector
     */
    magnitudeSquare(): Fraction;
    /**
     * @returns the magnitude as a SquareRoot class
     */
    magnitude(): SquareRoot;
    /**
     * @returns if the vector is a zero vector
     */
    isZero(): boolean;
    /**
     * vector addition
     *
     * if the coeffs are the same, will retain the same coeff
     *
     * if the coeffs are different, will expand them in before performing addition
     */
    plus(v2: Vector, options?: {
        simplify?: boolean;
        stretchable?: boolean;
    }): Vector;
    /**
     * returns the negative of this vector
     *
     * @param options default to `{multiplyIntoCoeff: false}`
     * the coeff stays the same while the components are made negative
     * if false, the coeff is made negative instead
     */
    negative(options?: {
        multiplyIntoCoeff: boolean;
    }): Vector;
    /**
     * vector subtraction
     */
    minus(v2: Vector): Vector;
    /**
     * scalar multiplication
     *
     * by default, the coeff stays the same while the components are multiplied
     * if false, the coeff is multiplied instead
     *
     * @param options defaults to `{multiplyIntoCoeff: false}`
     */
    multiply(k: number | Fraction, options?: {
        multiplyIntoCoeff: boolean;
    }): Vector;
    /**
     * scalar division
     *
     * by default, the coeff stays the same while the components are multiplied
     * if false, the coeff is multiplied instead
     *
     * @param options defaults to `{multiplyIntoCoeff: false}`
     */
    divide(k: number | Fraction, options?: {
        multiplyIntoCoeff: boolean;
    }): Vector;
    /**
     * @returns the cross product (this cross v2)
     */
    cross(v2: Vector, options?: {
        simplify?: boolean;
        stretchable?: boolean;
    }): Vector;
    /**
     * checks if this is perpendicular to v2
     */
    isPerpendicularTo(v2: Vector): boolean;
    /**
     * checks if this is parallel to v2
     */
    isParallelTo(v2: Vector): boolean;
    /**
     * @returns latex string representing the vector in column vector form
     */
    toString(): string;
    /**
     * @returns latex string representing the vector in ijk notation
     */
    toIJKString(): string;
    /**
     * @returns (kx, ky, kz) as a coordinate triple.
     *
     * @param name The name of the point which is attached to the front of the coordinates
     */
    toCoordinates(name?: string): string;
    /**
     * checks if two vectors are equal
     */
    isEqualTo(v2: Vector): boolean;
    /**
     * @returns angle between two vectors as a string in degrees
     *
     * @param options default to {acute: false, sineMode: false}
     */
    angleTo(v2: Vector, options?: {
        acute?: boolean;
        sineMode?: boolean;
    }): string;
    /**
     * clones a new instance of this vector
     */
    clone(): Vector;
    toJSON(): VectorJSON;
    /**
     * the zero vector
     */
    static ZERO: Vector;
    /**
     * the x-axis unit vector (1,0,0)
     */
    static I: Vector;
    /**
     * the y-axis unit vector (0,1,0)
     */
    static J: Vector;
    /**
     * the z-axis unit vector (0,0,1)
     */
    static K: Vector;
    /**
     * ratio theorem
     */
    static Ratio(v1: Vector, v2: Vector, options?: {
        lambda?: number | Fraction;
        mu?: number | Fraction;
    }): Vector;
}
interface VectorJSON {
    type: 'vector';
    args: [FractionJSON, FractionJSON, FractionJSON, {
        coeff: FractionJSON;
    }];
}
/**
 * determinant of [[a b], [c d]] 2x2 matrix or [[a b c], [d e f], [g h i]] 3x3 matrix
 *
 * WARNING: does not work for any other sizes
 */
export function determinantFrac(...args: (number | Fraction)[]): Fraction;
/**
 * apply Cramer's rule to 2x2 [[a b], [d e]] = [[c], [f]]
 * or to 3x3 [[a b c], [e f g], [i j k] = [[d], [h], [l]]]
 * or to 4x4
 */
export function cramers(...args: NumberArray2x2): [number, number];
export function cramers(...args: NumberArray3x3): [number, number, number];
export function cramers(...args: NumberArray4x4): [number, number, number, number];
/**
 * apply Cramer's rule to 2x2 [[a b], [d e]] = [[c], [f]],
 * to 3x3 [[a b c], [e f g], [i j k] = [[d], [h], [l]]]
 * or 4x4
 */
export function cramersFrac(...args: FractionArray2x2): [Fraction, Fraction];
export function cramersFrac(...args: FractionArray3x3): [Fraction, Fraction, Fraction];
export function cramersFrac(...args: FractionArray4x4): [Fraction, Fraction, Fraction, Fraction];
export type NumberArray2x2 = [number, number, number, number, number, number];
export type FractionArray2x2 = [
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number
];
export type NumberArray3x3 = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
export type FractionArray3x3 = [
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number
];
export type NumberArray4x4 = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
export type FractionArray4x4 = [
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number,
    Fraction | number
];
/**
 * implementation of the bisection method for numerical root finding.
 *
 * @param f function
 * @param lower lower bound (sign must be different at lower and upper)
 * @param upper upper bound (sign must be different at lower and upper)
 * @param precision number of digits after the decimal point to match before terminating
 */
export function bisection(f: (x: number) => number, lower: number, upper: number, precision?: number): number;
/**
 * Line class representing a 3D Line represented in vector form
 * r = a + \lambda d, where a is a point on the line,
 * d is a direction vector parallel to the line,
 * and lambda is the parameter
 */
export class Line {
    a: Vector;
    d: Vector;
    lambda: string;
    /**
     * creates a new Line instance
     *
     * by default, v1 is taken as the point a and v2 the direction vector d
     *
     * if options is `{twoPointsMode: true}` (default: false), then v1 and v2
     * will be taken as two points on the line
     *
     * @param lambda string representing the parameter to be used when
     * typesetting the equation of the line. Defaults to `"\\lambda"`
     */
    constructor(v1: Vector, v2: Vector, options?: {
        twoPointsMode?: boolean;
        lambda?: string;
    });
    /**
     * checks if line contains a point
     */
    contains(point: Vector): boolean;
    /**
     * checks if line is parallel to vector or line
     */
    isParallelTo(v: Vector | Line): boolean;
    /**
     * checks if two lines are the same
     */
    isEqualTo(l2: Line): boolean;
    /**
     * subs in the parameter lambda
     *
     * @returns the position vector of the resulting point on the line
     */
    point(lambda?: number | Fraction): Vector;
    /**
     * finds *acute* angle between lines/line and vector
     *
     * @returns angle between this line and given vector/line
     */
    angleTo(v: Vector | Line): string;
    /**
     * finds distance between this line to a point or a parallel line
     *
     * WARNING: does not support skew lines at the moment
     */
    distanceTo(v: Vector | Line): SquareRoot;
    /**
     * finds intersection point between two lines
     *
     * @returns the position vector of the point of intersection,
     * or null if there are no points of intersection,
     * or a line if the two lines are coincident.
     *
     */
    intersect(l2: Line): Vector | null | Line;
    /**
     * @returns [lambda, mu] that corresponds to the intersection of this line and l2
     * returns null if skew/parallel/coincident lines
     */
    intersectParameters(l2: Line): null | [Fraction, Fraction];
    /**
     * finds the foot of perpendicular from point to this line
     */
    footOfPerpendicular(point: Vector): Vector;
    /**
     * finds the reflection of a point/line about this line
     */
    reflect(v: Vector | Line): Vector | Line;
    /**
     * finds the reflection of point about this line
     */
    reflectPoint(point: Vector): Vector;
    /**
     * checks if two lines are skew
     */
    isSkewTo(l2: Line): boolean;
    /**
     * finds the reflection of line l2 about this line
     *
     * WARNING: throws an error if skew lines encountered
     */
    reflectLine(l2: Line): Line;
    /**
     * @returns equation of the line r = a + lambda d in column vector form
     */
    toString(): string;
    /**
     * @returns equation of the line r = a + lambda d in ijk form
     */
    toIJKString(): string;
    /**
     * @returns (a+lambda d) combined together in a column vector
     *
     * @param component 0 (default) returns all 3 components, 1 returns x, 2 returns y, 3 returns z
     */
    toCombinedString(component?: number): string;
    /**
     * @returns cartesian equation of the line
     */
    toCartesianString(): string;
    /**
     * clones and returns a new instance of this line
     */
    clone(): Line;
}
/**
 * Plane class representing a 3D Plane represented in scalar product form
 * r \cdot n = rhs, where rhs = a \cdot n and a is a point on the plane,
 * n is a normal vector perpendicular to the plane,
 * and lambda is the parameter
 */
export class Plane {
    n: Vector;
    rhs: Fraction;
    /**
     * mode 1: normal vector, rhs
     *
     * mode 2: normal vector, pt
     *
     * mode 3: pt, d1, d2, {points: 1}
     *
     * mode 4: pt1, pt2, d, {points: 2}
     *
     * mode 5: pt1, pt2, pt3, {points: 3}
     */
    constructor(n: Vector, rhs?: number | Fraction);
    constructor(n: Vector, a: Vector);
    constructor(pt: Vector, d1: Vector, d2: Vector, options: {
        points: 1;
    });
    constructor(pt1: Vector, pt2: Vector, d1: Vector, options: {
        points: 2;
    });
    constructor(pt1: Vector, pt2: Vector, pt3: Vector, options: {
        points: 3;
    });
    /**
     * checks if this plane contains a point/line
     */
    contains(pointOrLine: Vector | Line): boolean;
    /**
     * checks if this plane is parallel to line or plane
     */
    isParallelTo(lineOrPlane: Plane | Line): boolean;
    /**
     * checks if two planes are the same
     */
    isEqualTo(p2: Plane): boolean;
    /**
     * @returns a point on the plane
     *
     * tries (x,0,0) if possible, followed by (0,y,0) and (0,0,z)
     */
    point(): Vector;
    /**
     * finds angle between this plane and vector/line/plane
     */
    angleTo(v: Vector | Line | Plane): string;
    /**
     * finds distance between this plane to a point or a parallel line/plane
     */
    distanceTo(v: Vector | Line | Plane): SquareRoot;
    /**
     * finds intersection between this plane and another line/plane
     */
    intersect(lineOrPlane: Line | Plane): Vector | Line | null | Plane;
    /**
     * finds lambda of line such that line intersects plane
     */
    intersectLineParam(l: Line): Fraction;
    /**
     * finds the intersection between this plane and a line
     */
    intersectLine(l: Line): Vector | null | Line;
    /**
     * finds the intersection between this plane and a plane
     */
    intersectPlane(p2: Plane): Line | null | Plane;
    /**
     * finds the foot of perpendicular from point to this plane
     */
    footOfPerpendicular(point: Vector): Vector;
    /**
     * finds the reflection of point about this plane
     */
    pointReflection(point: Vector): Vector;
    /**
     * finds the reflection of line l about this plane
     */
    lineReflection(l: Line): Line;
    /**
     * reflects a point/line about this plane
     */
    reflect(pointOrLine: Line | Vector): Vector | Line;
    /**
     * @returns equation of the plane r \cdot n = rhs in column vector form
     */
    toString(): string;
    /**
     * @returns equation of the line r = a + lambda d in ijk form
     */
    toIJKString(): string;
    /**
     * @returns cartesian equation of the line
     */
    toCartesianString(): string;
    /**
     * clones a new instance of this line
     */
    clone(): Plane;
}
/**
 * "Extended" Vector class representing a 3D vector coeff(x i + y j + z k),
 * where x,y and z can be Expressions
 */
export class xVector {
    x: Expression;
    y: Expression;
    z: Expression;
    coeff: Fraction;
    /**
     * creates a new Vector instance
     *
     * @param options defaults to `{coeff: 1, simplify: false, stretchable: false}`
     *  if `simplify` is `true`, then we will factorize our expression such that
     *  x,y,z are integers with gcd 1.
     *  if `stretchable` is set to true, then we will `simplify` and then
     *  set `coeff` to be 1
     *
     */
    constructor(x: number | Fraction | string | Term | Expression, y?: number | Fraction | string | Term | Expression, z?: number | Fraction | string | Term | Expression, options?: {
        coeff?: number | Fraction;
    });
    /**
     * Expands the coeff, taking this k(x,y,z) and
     * returning (kx, ky, kz)
     */
    expand(): xVector;
    /**
     * @returns the dot product
     */
    dot(v2: xVector | Vector): Expression;
    /**
     * @returns the magnitude squared of this vector
     */
    magnitudeSquare(): Expression;
    /**
     * @returns if the vector is a zero vector
     */
    isZero(): boolean;
    /**
     * vector addition
     *
     * if the coeffs are the same, will retain the same coeff
     *
     * if the coeffs are different, will expand them in before performing addition
     */
    plus(v2: xVector | Vector): xVector;
    /**
     * returns the negative of this vector
     *
     * @param options default to `{multiplyIntoCoeff: false}`
     * the coeff stays the same while the components are made negative
     * if false, the coeff is made negative instead
     */
    negative(options?: {
        multiplyIntoCoeff: boolean;
    }): xVector;
    /**
     * vector subtraction
     */
    minus(v2: xVector | Vector): xVector;
    /**
     * scalar multiplication
     *
     * by default, the coeff stays the same while the components are multiplied
     * if false, the coeff is multiplied instead
     *
     * @param options defaults to `{multiplyIntoCoeff: false}`
     */
    multiply(k: number | Fraction, options?: {
        multiplyIntoCoeff: boolean;
    }): xVector;
    /**
     * @returns the cross product (this cross v2)
     */
    cross(v2: xVector | Vector): xVector;
    /**
     * checks if this is perpendicular to v2
     */
    isPerpendicularTo(v2: xVector | Vector): boolean;
    /**
     * checks if this is parallel to v2
     */
    isParallelTo(v2: xVector | Vector): boolean;
    subIn(x: Fraction): Vector;
    /**
     * @returns latex string representing the vector in column vector form
     */
    toString(): string;
    toCartesianString(): string;
    /**
     * @returns (kx, ky, kz) as a coordinate triple.
     *
     * @param name The name of the point which is attached to the front of the coordinates
     */
    toCoordinates(name?: string): string;
    /**
     * checks if two vectors are equal
     */
    isEqualTo(v2: xVector | Vector): boolean;
    /**
     * clones a new instance of this vector
     */
    clone(): xVector;
    /**
     * the zero vector
     */
    static ZERO: xVector;
    /**
     * the x-axis unit vector (1,0,0)
     */
    static I: xVector;
    /**
     * the y-axis unit vector (0,1,0)
     */
    static J: xVector;
    /**
     * the z-axis unit vector (0,0,1)
     */
    static K: xVector;
}
/**
 * An unknown vector represented by k a
 */
export class uVector extends BasicTerm {
    vector: string;
    /**
     * Creates a new unknown vector
     * @param coeff the k in k a
     * @param vector the a in k a
     */
    constructor(vector: string, coeff?: Fraction | number);
    plus(v: uVector | string): uVectorExpression;
    negative(): uVector;
    minus(v: uVector | string): uVectorExpression;
    /** scalar multiplication */
    multiply(k: number | Fraction): uVector;
    /** scalar (dot) product */
    dot(v: uVector | string): Term;
    /** vector (cross) product */
    cross(v: uVector | string): uVector;
    clone(): uVector;
}
export class uVectorExpression {
    vectors: uVector[];
    constructor(...args: (string | uVector)[]);
    plus(v: string | uVector | uVectorExpression): uVectorExpression;
    negative(): uVectorExpression;
    minus(v: string | uVector | uVectorExpression): uVectorExpression;
    /** scalar multiplication */
    multiply(k: number | Fraction): uVectorExpression;
    /** scalar (dot) product */
    dot(v: string | uVector | uVectorExpression): Expression;
    /** vector (cross) product */
    cross(v: string | uVector | uVectorExpression): uVectorExpression;
    /**
     * `toString` method
     *
     * @returns the LaTeX string representation of the sum of all the vectors
     */
    toString(): string;
    clone(): uVectorExpression;
}
/**
 * An unknown vector represented by k a, where k can potentially be unknown
 */
export class uxVector {
    coeff: Term;
    vector: string;
    /**
     * Creates a new unknown vector
     * @param coeff the k in k a
     * @param vector the a in k a
     */
    constructor(vector: string, coeff?: Fraction | number | string | Term);
    plus(v: uVector | string | uxVector): uxVectorExpression;
    negative(): uxVector;
    minus(v: uVector | string | uxVector): uxVectorExpression;
    /** scalar multiplication */
    multiply(k: number | Fraction): uxVector;
    /** scalar (dot) product */
    dot(v: uVector | string | uxVector): Term;
    /** vector (cross) product */
    cross(v: uVector | string | uxVector): uxVector;
    /** sub in unknown into the coefficient term */
    subIn(x: Fraction | number): uVector;
    clone(): uxVector;
    toString(): string;
}
export class uxVectorExpression {
    vectors: (uVector | uxVector)[];
    constructor(...args: (string | uVector | uxVector)[]);
    plus(v: string | uVector | uxVector | uxVectorExpression): uxVectorExpression;
    negative(): uxVectorExpression;
    minus(v: string | uVector | uxVector | uVectorExpression): uxVectorExpression;
    /** scalar multiplication */
    multiply(k: number | Fraction): uxVectorExpression;
    /** scalar (dot) product */
    dot(v: string | uVector | uxVector | uVectorExpression): Expression;
    /** vector (cross) product */
    cross(v: string | uVector | uxVector | uVectorExpression | uxVectorExpression): uxVectorExpression;
    /**
     * `toString` method
     *
     * @returns the LaTeX string representation of the sum of all the vectors
     */
    toString(): string;
    clone(): uxVectorExpression;
}
/**
 * Generates a random integer between `min` and `max` (inclusive)
 *
 * @param min defaults to -9
 * @param max defaults to 9
 * @param options `{avoid: []}` array of numbers to be avoided
 *
 */
export function getRandomInt(min?: number, max?: number, options?: {
    avoid?: number | number[];
}): number;
/**
 * Generates a random integer between `min` and `max` (inclusive)
 *
 * @param n number of integers to be generated
 * @param min defaults to -9
 * @param max defaults to 9
 * @param options `{avoid: [], repeated: false}`
 *
 */
export function getRandomInts(n: number, min?: number, max?: number, options?: {
    avoid?: number[];
    repeated?: boolean;
}): number[];
/**
 * shuffles the array
 *
 * WARNING: mutates current array
 */
export function shuffle<Type>(array: Array<Type>): Array<Type>;
export function heads(): boolean;
/**
 * returns all factor pairs of a positive integer
 */
export function factorPairs(n: number): [number, number][];
/**
 * parses an expression, and attempts to convert it to a Polynomial
 * of degree n
 *
 * options default to {n: 2, ascending: false}
 */
export function expToPoly(exp: Expression, options?: {
    n?: number;
    ascending?: boolean;
}): Polynomial;
/**
 * simplify a polynomial, returning a simplified polynomial
 * so that all the coefficients are integers, the leading coefficient is positive,
 * and gcd(...coeffs) = 1
 */
export function simplifyPoly(poly: Polynomial): Polynomial;
/**
 * factorize a simplified quadratic polynomial into two linear factors
 *
 * Also returns the two roots of the quadratic
 */
export function factorizeQuadratic(poly: Polynomial): [Polynomial, Polynomial, [Fraction, Fraction]];
/**
 * factorize a simplified cubic polynomial into three linear factors or one linear + one irreducible quadratic
 *
 * Also returns the other roots
 */
export function factorizeCubic(poly: Polynomial, root: number | Fraction): [Polynomial[], [Fraction, Fraction] | null];
/**
 * solves a quadratic equation
 *
 * throws [NaN, NaN] if complex roots found: consider using complex solver
 *
 */
export function solveQuadratic(poly: Polynomial | (number | Fraction)[]): [Fraction, Fraction, 'frac'] | [number, number, 'float'] | [number, number, 'NaN'];
/**
 * solves a quadratic equation to give irrational roots in surd form
 *
 * throws if complex roots found: consider using complex solver
 *
 */
export function solveQuadraticSurd(poly: Polynomial | (number | Fraction)[]): [Expression, Expression];
/**
 * solves a linear equation
 */
export function solveLinear(poly: Polynomial | (number | Fraction)[]): Fraction;
/**
 * shifts a polynomial: replace x with x+a
 */
export function shiftPoly(poly: Polynomial, a: number | Fraction): Polynomial;
/**
 * completes the square
 */
export function completeSquare(poly: Polynomial): string;
/**
 * Complex class representing x + yi
 */
export class Complex extends Expression {
    /** real part of the complex number */
    real: Fraction;
    /** imaginary part of the complex number */
    imag: Fraction;
    /**
     * Creates a new Complex instance
     */
    constructor(real: number | Fraction, imag?: number | Fraction);
    /**
     * adds two complex numbers
     */
    plus(z: number | Fraction | Complex): Complex;
    /**
     * negative of this complex number
     */
    negative(): Complex;
    /**
     * complex number subtraction
     */
    minus(z: number | Fraction | Complex): Complex;
    /**
     * complex number multiplication
     */
    times(z: number | Fraction | Complex): Complex;
    /**
     * complex conjugation
     */
    conjugate(): Complex;
    /**
     * r^2 = |z|^2
     */
    rSquared(): Fraction;
    /**
     * reciprocal
     */
    reciprocal(): Complex;
    /**
     * complex division
     */
    divide(z: number | Fraction | Complex): Complex;
    /**
     * r = |z|
     */
    r(): SquareRoot;
    /**
     * z^n
     */
    pow(n: number): Complex;
    /**
     * z^2
     */
    square(): Complex;
    isReal(): boolean;
    isPurelyImaginary(): boolean;
    isEqualTo(z: Complex | number): boolean;
    /**
     * clones this complex number
     */
    clone(): Complex;
    static I: Complex;
}
/**
 * Angle class representing an angle k pi
 */
export class Angle extends Term {
    /**
     * k in k pi
     */
    k: Fraction;
    /**
     * angle in degrees
     */
    degrees: Fraction;
    /**
     * 'complex' means -pi < theta \leq pi
     * 'default' means 0 \leq theta < 2 pi
     * 'all' means -\infty < theta < infty: no cycling will be performed
     */
    domain: 'complex' | 'default' | 'all';
    /**
     * constructs a new Angle class instance
     *
     * @param angle if angle is a number, we will treat it as if it is in degrees. If angle is of Fraction type, will treat it
     * as if it is k in k pi
     * @param options defaults to { domain: 'complex' }
     * 'complex' means -pi < theta \leq pi
     * 'default' means 0 \leq theta < 2 pi
     * 'all' means -\infty < theta < infty: no cycling will be performed
     */
    constructor(angle: number | Fraction, options?: {
        domain?: 'complex' | 'default' | 'all';
    });
    plus(theta: number | Fraction | Angle): Angle;
    negative(): Angle;
    minus(theta: number | Fraction | Angle): Angle;
    times(k: number | Fraction): Angle;
    divide(k: number | Fraction): Angle;
    isEqualTo(theta: number | Fraction | Angle): boolean;
    /**
     * returns the value of the angle in radians in the number type
     */
    valueOf(): number;
    clone(): Angle;
}
export function cos(theta: Angle | number | Fraction): SquareRoot;
export function sin(theta: Angle | number | Fraction): SquareRoot;
export function tan(theta: Angle | number | Fraction): SquareRoot;
export function asin(x: number | SquareRoot | Fraction): Angle;
export function acos(x: number | SquareRoot | Fraction): Angle;
export function atan(x: number | SquareRoot | Fraction): Angle;
/**
 * ComplexExp class representing r e^{i theta}
 */
export class ComplexExp extends Term {
    /** modulus of the complex number */
    mod: SquareRoot;
    /** argument of the complex number */
    arg: Angle;
    /**
     * Creates a new ComplexExp instance
     *
     * @param theta type number will be interpreted as in degrees, type Fraction will be interpreted as k in k pi
     */
    constructor(r: number | Fraction | SquareRoot, theta?: number | Fraction | Angle);
    /**
     * negative of this complex number
     */
    negative(): ComplexExp;
    /**
     * complex number multiplication
     */
    times(z: number | Fraction | ComplexExp): ComplexExp;
    /**
     * complex conjugation
     */
    conjugate(): ComplexExp;
    reciprocal(): ComplexExp;
    /**
     * complex division
     */
    divide(z: number | Fraction | ComplexExp): ComplexExp;
    /**
     * complex exponentiation
     */
    pow(n: number): ComplexExp;
    /**
     * z^2
     */
    square(): ComplexExp;
    /**
     * returns the polar form r (cos theta + i sin theta)
     */
    toPolarString(wrap?: boolean): string;
    clone(): ComplexExp;
    /**
     * returns the standard form r e^(i theta)
     */
    static FORM(r?: string, theta?: string): string;
    /**
     * returns the standard form r e^(i theta)
     */
    static POLAR_FORM(r?: string, theta?: string): string;
}
/**
 * xComplex class representing x + yi
 * where x,y can be expressions
 */
export class xComplex extends Expression {
    /** real part of the complex number */
    real: Expression;
    /** imaginary part of the complex number */
    imag: Expression;
    /**
     * Creates a new Complex instance
     */
    constructor(real: number | Fraction | string | SquareRoot | Term | Expression, imag?: number | Fraction | string | SquareRoot | Term | Expression);
    /**
     * adds two complex numbers
     */
    plus(z: number | Fraction | Complex | xComplex): xComplex;
    /**
     * negative of this complex number
     */
    negative(): xComplex;
    /**
     * complex number subtraction
     */
    minus(z: number | Fraction | Complex | xComplex): xComplex;
    /**
     * complex number multiplication
     */
    times(z: number | Fraction | Complex | xComplex): xComplex;
    /**
     * complex conjugation
     */
    conjugate(): xComplex;
    /**
     * r^2 = |z|^2
     */
    rSquared(): Expression;
    /**
     * z^n
     */
    pow(n: number): xComplex;
    /**
     * z^2
     */
    square(): xComplex;
    clone(): xComplex;
}
export function expToCartesian(z: ComplexExp): xComplex;
export function complexToQuadratic(z: Complex, options?: {
    variable?: string;
}): Polynomial;
export function subComplexIntoPoly(z: Complex, poly: Polynomial): Complex;
export function solveQuadraticComplex(poly: Polynomial | (number | Fraction)[]): [Complex, Complex] | [xComplex, xComplex];
/**
 * given p(x)/d(x),
 *
 * @returns {quotient, remainder}
 */
export function longDivide(poly: Polynomial, divisor: Polynomial, carryOver?: Polynomial): {
    quotient: Polynomial;
    remainder: Polynomial;
};
/**
 *
 * @param options pt: [x1,y1] point on the line. Use gradient m (priority) if provided, otherwise uses pt2 to form the line
 */
export function linear(options: {
    m?: number | Fraction;
    pt: [number | Fraction, number | Fraction];
    pt2?: [number | Fraction, number | Fraction];
}): Polynomial;
export function subSurdInPoly(poly: Polynomial, x: SquareRoot): Expression;
/**
 * function representing f(x) / g(x) where f, g are polynomials
 * Does not consider repeated roots at the moment
 */
export class Rational {
    /** numerator */
    num: Polynomial;
    /** denominator */
    den: Polynomial;
    /** Rational poles of the function */
    poles: Fraction[];
    /**
     * Creates a new Rational class
     * @param options defaults to `{ poles: [] }` Poles are automatically determined for degree at most 2.
     */
    constructor(num: Polynomial | number | Fraction, den?: Polynomial | Fraction | number, options?: {
        poles?: (number | Fraction)[];
    });
    /** Addition */
    plus(rational2: number | Fraction | Polynomial | Rational): Rational;
    negative(): Rational;
    /** subtraction */
    minus(rational2: number | Fraction | Polynomial | Rational): Rational;
    /** multiplication */
    times(rational2: number | Fraction | Polynomial | Rational): Rational;
    reciprocal(): Rational;
    /** division */
    divide(rational2: number | Fraction | Polynomial | Rational): Rational;
    /** subs in a fraction/integer */
    subIn(x: number | Fraction): Fraction;
    subInNumber(x: number): number;
    differentiate(): Rational;
    replaceXWith(x: string | Polynomial): Rational;
    /**
     * `toString` method
     *
     * @returns the LaTeX string representation of the sum of all the terms
     */
    toString(): string;
}
/**
 * solves a rational inequality lhs < rhs
 * @param rhs defaults to `0`
 * @param options defaults to `{lessThan: true, equality: false}`
 *
 * only works for square free polynomials of degree at most 2
 */
export function solveRational(lhs: Rational, rhs?: number | Fraction | Polynomial | Rational, options?: {
    lessThan?: boolean;
    equality?: boolean;
}): {
    combinedAnswer: string;
    intervals: string[];
    values: Fraction[];
};
export function partialFractions(denominators: Polynomial | Polynomial[], options?: {
    numerators?: number | Fraction | Polynomial | (number | Fraction | Polynomial)[];
}): Rational[];
/**
 * Polynomial class representing "ax^n + bx^n-1 + ... + k"
 */
export class xPolynomial extends Expression {
    /** array of coefficients in ascending order, starting from constant term */
    coeffs: Expression[];
    /** whether polynomial in ascending or descending order */
    ascending: boolean;
    /** degree of the polynomial */
    degree: number;
    /** variable name (e.g. "x") */
    variable: string;
    /**
     * Creates a new Polynomial instance
     * @param coeffs array of coefficients. if a number/fraction is provided, will create the polynomial "kx".
     * @param options defaults to `{ascending: false, degree: coeffs.length-1, variable: 'x'}`
     */
    constructor(coeffs: (number | Fraction | string | Expression)[] | (number | Fraction), options?: {
        ascending?: boolean;
        degree?: number;
        variable?: string;
    });
    /** add two polynomials
     *
     * fraction/numbers will be converted a "constant polynomial", while a string will be converted to a polynomial term with coefficient 1
     */
    plus(p2: number | Fraction | string | Polynomial | xPolynomial | Expression): xPolynomial;
    /** multiplies two polynomials */
    times(p2: number | Fraction | string | Polynomial | xPolynomial | Expression): xPolynomial;
    /** negative of this polynomial */
    negative(): xPolynomial;
    /**
     * divide by a *scalar*
     */
    divide(p2: number | Fraction): xPolynomial;
    /** subtracts this by p2 */
    minus(p2: number | Fraction | string | Polynomial | xPolynomial): xPolynomial;
    /**
     * exponentiation
     * @returns this polynomial taken to a power of `n`
     */
    pow(n: number): xPolynomial;
    /**
     * replace x with a new polynomial
     * @param x if string, replaces the unknown
     */
    replaceXWith(x: string | Polynomial | xPolynomial): xPolynomial;
    /**
     * square
     *
     * @returns the square of this polynomial
     *  */
    square(): xPolynomial;
    /**
     * @returns an ascending polynomial only up until degree n
     */
    concatenate(n: number): xPolynomial;
    /**
     * changes ascending/behavior of polynomial
     *
     * @param ascending sets ascending behavior. By default, this
     * option is set to toggle current ascending/descending behavior
     *
     * @returns a reference to this polynomial instance
     *
     * WARNING: mutates current instance
     */
    changeAscending(ascending?: boolean): this;
    /** derivative of the polynomial */
    differentiate(): xPolynomial;
    /** checks if two polynomials are equal: i.e., coefficient array is the same and same unknown */
    isEqualTo(poly2: xPolynomial): boolean;
    /** clones this polynomial */
    clone(): xPolynomial;
}
/**
 * function representing k ( f(x) )^n
 */
export class PowerFn {
    /** coefficient k in k( f(x) )^n */
    coeff: Fraction;
    /** "inner" function f(x) */
    fx: Polynomial | SinFn | CosFn | LnFn;
    /** Exponent */
    n: Fraction;
    /**
     * Creates a new PowerFn class
     * @param options defaults to `{ fx: "x", coeff: 1 }`
     */
    constructor(n: number | Fraction, options?: {
        fx?: string | VariableTerm | Polynomial | CosFn | SinFn | LnFn;
        coeff?: number | Fraction;
    });
    /**
     * differentiates this expression using chain rule
     * @return `{ string, power, fPrime }` where string is an attempted string representation of the derivative,
     * power is the PowerFn n ( f(x) )^(n-1) and fPrime is f'(x)
     */
    differentiate(): {
        string: string;
        power: PowerFn;
        fPrime: Polynomial | CosFn | SinFn | RationalFn;
    };
    /**
     * integration of this expression, using the f'(x) ( f(x) )^n formula
     * for non-linear fx, we assume f'(x) is present
     */
    integrate(options?: {
        modulus?: boolean;
    }): PowerFn | LnFn;
    times(x: number | Fraction): PowerFn;
    divide(x: number | Fraction): PowerFn;
    removeCoeff(): PowerFn;
    /** sub in: only works for polynomial inner function
     * and integral n at the moment
     * also works for square roots if the value substituted in can be square-rooted
     */
    subIn(x: number | Fraction): Fraction;
    /**
     * only works for polynomial inner function at the moment
     */
    subInNumber(x: number): number;
    /**
     * if n = k/2, then substituting a value in will return a surd.
     * this method accomplishes that
     */
    subInToGetSurd(x: number | Fraction): SquareRoot;
    /**
     * definite integral: only works for polynomial inner function
     * and integral n \neq -1 at the moment
     */
    definiteIntegral(lower: number | Fraction, upper: number | Fraction): Fraction;
    /**
     * `toString` method
     *
     * @returns the LaTeX string representation of the sum of all the terms
     */
    toString(): string;
}
/**
 * function representing k sin ( f(x) )
 */
export class SinFn {
    /** coefficient k in k sin ( f(x) ) */
    coeff: Fraction;
    /** "inner" function f(x) */
    fx: Polynomial;
    /**
     * Creates a new SinFn class
     * @param options defaults to `{ fx: "x", coeff: 1 }`
     */
    constructor(options?: {
        fx?: string | VariableTerm | Polynomial;
        coeff?: number | Fraction;
    });
    /** differentiates this expression */
    differentiate(): CosFn;
    /** integrates this expression */
    integrate(): CosFn;
    times(x: number | Fraction): SinFn;
    removeCoeff(): SinFn;
    /**
     * @returns special ratios
     *
     * only works for sin nx at the moment
     */
    subIn(x: Angle | number | Fraction): SquareRoot;
    /**
     * `toString` method
     *
     * @returns the LaTeX string representation of the sum of all the terms
     */
    toString(): string;
}
/**
 * function representing k cos ( f(x) )
 */
export class CosFn {
    /** coefficient k in k cos ( f(x) ) */
    coeff: Fraction;
    /** "inner" function f(x) */
    fx: Polynomial;
    /**
     * Creates a new CosFn class
     * @param options defaults to `{ fx: "x", coeff: 1 }`
     */
    constructor(options?: {
        fx?: string | VariableTerm | Polynomial;
        coeff?: number | Fraction;
    });
    /** differentiates this expression */
    differentiate(): SinFn;
    times(x: number | Fraction): CosFn;
    /** integrates this expression */
    integrate(): SinFn;
    removeCoeff(): CosFn;
    /**
     * @returns special ratios
     *
     * only works for sin nx at the moment
     */
    subIn(x: Angle | number | Fraction): SquareRoot;
    /**
     * `toString` method
     *
     * @returns the LaTeX string representation of the sum of all the terms
     */
    toString(): string;
}
/**
 * function representing k exp ( f(x) )
 */
export class ExpFn {
    /** coefficient k in k exp ( f(x) ) */
    coeff: Fraction;
    /** "inner" function f(x) */
    fx: Polynomial;
    /**
     * Creates a new CosFn class
     * @param options defaults to `{ fx: "x", coeff: 1 }`
     */
    constructor(options?: {
        fx?: string | VariableTerm | Polynomial;
        coeff?: number | Fraction;
    });
    /** differentiates this expression */
    differentiate(): ExpFn;
    /** integrates this expression */
    integrate(): ExpFn;
    times(x: number | Fraction): ExpFn;
    removeCoeff(): ExpFn;
    /**
     * `toString` method
     *
     * @returns the LaTeX string representation of the sum of all the terms
     */
    toString(): string;
}
/**
 * function representing k ln ( f(x) )
 */
export class LnFn {
    /** coefficient k in k ln ( f(x) ) */
    coeff: Fraction;
    /** "inner" function f(x) */
    fx: Polynomial;
    /** modulus allows for k ln |f(x)|*/
    modulus: boolean;
    /**
     * Creates a new SinFn class
     * @param options defaults to `{ fx: "x", coeff: 1 }`
     */
    constructor(options?: {
        fx?: string | VariableTerm | Polynomial;
        coeff?: number | Fraction;
        modulus?: boolean;
    });
    /** differentiates this expression */
    differentiate(): RationalFn;
    /**
     * `toString` method
     *
     * @returns the LaTeX string representation of the sum of all the terms
     */
    toString(): string;
}
/**
 * function representing f(x) / g(x)
 * the RationalFn extends the Rational class by allowing differentiation
 */
export class RationalFn extends Rational {
    constructor(num: Polynomial | number | Fraction, den?: Polynomial | Fraction | number, options?: {
        poles?: (number | Fraction)[];
    });
    /** differentiates this expression */
    differentiate(): RationalFn;
}
/**
 * representation of a series including negative exponents
 *
 * a_{-m} x^{-m} + ... + a0 + a1 x + ... + a_n x^n
 *
 * we store them as `negCoeffs: [a_{-1}, a_{-2}, ..., a_{-m}]`
 * and `a0 + ... + a_n x^n` as poly
 */
export class Laurent extends Expression {
    poly: Polynomial;
    negCoeffs: Fraction[];
    /**
     * @param negCoeffs [a_{-1}, ... a_{-m}]
     */
    constructor(poly: Polynomial | (number | Fraction)[], negCoeffs: (number | Fraction)[]);
    differentiate(): Laurent;
    multiplyDenom(): Polynomial;
    subIn(x: number | Fraction): Fraction;
    subInSurd(x: SquareRoot): Expression;
    /**
     * toJSON method that allows for quick reconstruction of class instance
     * by storing its constructor arguments
     */
    toJSON(): {
        type: 'laurent';
        args: [Polynomial, Fraction[]];
    };
}
/**
 * Parametric Eqn class
 */
export class Parametric {
    x: Polynomial | PowerFn | CosFn | SinFn;
    y: Polynomial | PowerFn | CosFn | SinFn;
    constructor(x: Polynomial | PowerFn | CosFn | SinFn, y: Polynomial | PowerFn | CosFn | SinFn);
    /**
     * the derivative dydx
     * @return `{num, den, string}`
     */
    dydx(): string;
}
export function rationalToPowerFn(rational: Rational): PowerFn;
/**
 * integrates 1/quadratic or 1/sqrt(quadratic)
 * @param options defaults to `{squareRootMode: false, modulus: true, initial: undefined}`.
 * initial only valid for finding particular solution in DE qns for ln qns
 */
declare function mf26(quadratic: Polynomial, options?: {
    squareRootMode?: boolean;
    initial?: number | Fraction;
    modulus?: boolean;
    flip?: boolean;
}): ArcFunction | LnFunction;
interface ArcFunction {
    toString(): string;
    subIn(x: number | Fraction | SquareRoot): Angle;
}
interface LnFunction {
    toString(): string;
    subIn(x: number | Fraction): LnValue;
    subInSurdCase(x: number | Fraction): string;
}
/**
 * a ln x
 */
declare class LnValue {
    coeff: Fraction;
    x: Fraction;
    constructor(x: number | Fraction, options?: {
        coeff?: number | Fraction;
    });
    toString(): string;
    valueOf(): number;
}
/**
 * integration by parts:
 * (1a) x^n cos x
 * (1b) x^n sin x
 * (1c) x^n exp x
 */
declare function byParts(u: PowerFn, vPrime: CosFn | SinFn | ExpFn): Expression;
/**
 * integration by parts:
 * (1a) x^n cos x
 * (1b) x^n sin x
 * (1c) x^n exp x
 */
declare function byPartsD(u: PowerFn, vPrime: CosFn | SinFn, lower: number | Fraction | Angle, upper: number | Fraction | Angle): Expression;
declare function byPartsD(u: PowerFn, vPrime: ExpFn, lower: number | Fraction, upper: number | Fraction): Expression;
export const integrate: {
    /** trigo integrations */
    trigo: {
        cos2: (options?: {
            k?: number | Fraction | undefined;
            coeff?: number | Fraction | undefined;
            variable?: string | undefined;
        } | undefined) => Expression;
        sin2: (options?: {
            k?: number | Fraction | undefined;
            coeff?: number | Fraction | undefined;
            variable?: string | undefined;
        } | undefined) => Expression;
        sinSin: (A: number | Fraction, B: number | Fraction, options?: {
            variable?: string | undefined;
            coeff?: number | Fraction | undefined;
        } | undefined) => Expression;
        cosCos: (A: number | Fraction, B: number | Fraction, options?: {
            variable?: string | undefined;
            coeff?: number | Fraction | undefined;
        } | undefined) => Expression;
        sinCos: (A: number | Fraction, B: number | Fraction, options?: {
            variable?: string | undefined;
            coeff?: number | Fraction | undefined;
        } | undefined) => Expression;
        cosSin: (A: number | Fraction, B: number | Fraction, options?: {
            variable?: string | undefined;
            coeff?: number | Fraction | undefined;
        } | undefined) => Expression;
    };
    /** by parts integrations */
    byParts: typeof byParts;
    /** integration of 1/(x^2 \\pm a^2) or 1/sqrt(x^2 \\pm a^2) */
    mf26: typeof mf26;
};
export const definiteIntegral: {
    trigo: {
        cos2: (lower: number | Fraction | Angle, upper: number | Fraction | Angle, options?: {
            k?: number | Fraction;
            coeff?: number | Fraction;
        }) => Expression;
        sin2: (lower: number | Fraction | Angle, upper: number | Fraction | Angle, options?: {
            k?: number | Fraction;
            coeff?: number | Fraction;
        }) => Expression;
        cosCos: (A: number | Fraction, B: number | Fraction, lower: number | Fraction | Angle, upper: number | Fraction | Angle, options?: {
            coeff?: number | Fraction;
        }) => Expression;
        cosSin: (A: number | Fraction, B: number | Fraction, lower: number | Fraction | Angle, upper: number | Fraction | Angle, options?: {
            coeff?: number | Fraction;
        }) => Expression;
        sinCos: (A: number | Fraction, B: number | Fraction, lower: number | Fraction | Angle, upper: number | Fraction | Angle, options?: {
            coeff?: number | Fraction;
        }) => Expression;
        sinSin: (A: number | Fraction, B: number | Fraction, lower: number | Fraction | Angle, upper: number | Fraction | Angle, options?: {
            coeff?: number | Fraction;
        }) => Expression;
    };
    byParts: typeof byPartsD;
};
/**
 * implementation of Simpson's 1/3 rule for numerical integration.
 *
 * @param intervals number of intervals (defaults to 100)
 */
export function simpsons(f: (x: number) => number, lower: number, upper: number, intervals?: number): number;
export function finiteDifference(f: (x: number) => number, x: number, precision?: number): number;
/**
 * Solves DE of the form dxdt = a + b t
 * @param poly a + bt as a Polynomial, or [a, b] as an array or b if a=0.
 * @param options `{variable, initial}`. variable is used as 't'
 * @returns solution of the DE in expression form A/b exp(bt) - a/b.
 * general solution in terms of 'A' if no initial provided,
 * particular solution otherwise
 */
declare function type1a(poly: number | Fraction | [number | Fraction, number | Fraction] | Polynomial, options?: {
    variable?: string;
    initial?: number | Fraction;
}): Expression;
export const de: {
    type1a: typeof type1a;
};
/**
 * parse JSON, returning a Mathlify class instance (Fraction/Term/Expression/Vector)
 *
 * for primitive types, return itself:
 */
export function JSONParse(jsonString: string): string | number | boolean | Fraction | Term | Expression | Polynomial | Vector | Laurent | (string | number | boolean | Fraction | Term | Expression | Vector)[];
/**
 * returns an unsimplified expression string
 */
export class UnsimplifiedExpression {
    terms: (Term | VariableTerm | Fraction | number | string | SquareRoot | Imaginary)[];
    constructor(...args: (Term | VariableTerm | Fraction | number | string | SquareRoot | Imaginary)[]);
    simplify(): Expression;
    toString(): string;
    clone(): UnsimplifiedExpression;
}
/**
 * representation of k(ax+...+by) where k is a Fraction and ax+...+by is an Expression
 */
export class BracketedTerm extends Term {
    innerExpression: Expression | UnsimplifiedExpression;
    /**
     * Creates a new BracketedTerm
     * representing k(ax+...+by)
     */
    constructor(coeff: number | Fraction, innerExpression: UnsimplifiedExpression | Expression | Term | Fraction | number | string);
    /**
     * if innerExpression is a WorkingExpression, simplify it
     */
    simplifyInnerExpression(): BracketedTerm;
    /**
     * multiplies k in, returning the expanded expression
     */
    simplify(): Expression;
    clone(): BracketedTerm;
}
/**
 * Generates a random 3D Vector with
 * integer coordinates between `min` and `max` (inclusive)
 *
 * @param options defaults  to `{min: -5, max: 5, simplify: false, nonzero: true, avoid: [], avoidParallel: false, avoidPerp: false, avoidLine: }`
 * setting nonzero to true will ensure a non-zero Vector
 * setting simplify to true will return a 'simplified' Vector (such that gcd(x,y,z)=1)
 *
 */
export function getRandomVec(options?: randomVecOptions): Vector;
/**
 * options default to {min: -5, max: 5, lambda: '\\lambda'}
 */
export function getRandomLine(options?: {
    min?: number;
    max?: number;
    lambda?: string;
}): Line;
/**
 * Generates a random 3D Vector with
 * integral magnitude
 *
 * (1,2,2 | 3) * 2
 * (0,3,4 | 5) * 2
 * (2,3,6 | 7)
 * (1,4,8 | 9)
 * (2,6,9 | 11)
 * (0,5,12 | 13)
 *
 * @param options defaults to {multiplesAllowed: false, max: 13}, magnitudes from 3,5,7,9,11,13 supported
 */
export function getNiceVec(options?: {
    multiplesAllowed?: boolean;
    max?: number;
}): Vector;
/**
 * get two random vectors that are perpendicular to each other
 *
 * this algorithm makes x1 and y2 non-zero
 *
 * options default to `{ min: -5, max: 5, simplify: true}`
 *
 * warning: max should be positive or loop logic may fail
 */
export function getRandomPerps(options?: {
    min?: number;
    max?: number;
    simplify?: boolean;
}): [Vector, Vector];
/**
 * get a random vector that is perpendicular to given vector
 *
 * options default to `{ min: -5, max: 5, simplify: true, avoid: []}`
 *
 * @param options avoid is an array of vectors that the return value cannot be parallel to
 *
 * warning: max should be positive or loop logic may fail
 */
export function getRandomPerp(v: Vector, options?: {
    min?: number;
    max?: number;
    simplify?: boolean;
    avoid?: Vector[];
}): Vector;
/**
 * options for `getRandomInt`
 *
 * of the form `{ avoid: [] }`;
 */
interface randomVecOptions {
    /** whether the vector must be nonzero */
    nonzero?: boolean;
    /** whether the vector is "simplified" */
    simplify?: boolean;
    /** min */
    min?: number;
    /** max */
    max?: number;
    /** vectors to avoid */
    avoid?: Vector[];
    /** avoidParallel */
    avoidParallel?: boolean;
    /** avoidPerp */
    avoidPerp?: boolean;
    /** avoidPerp */
    avoidLine?: Line;
}
/**
 * Generates a random Fraction
 *
 * @param options defaults to `{ numRange: [-9,9], denRange: [1,9], avoid: [] }`
 * where numRange and denRange specifies the minimum and maximum values for the numerator and denominator, respectively
 * and avoid is an Array of numbers/Fractions that will not be generated
 */
export function getRandomFrac(options?: {
    numRange?: [number, number];
    denRange?: [number, number];
    avoid?: number | Fraction | (number | Fraction)[];
}): Fraction;
/**
 * picks a random element in an array
 */
export function sample<T>(arr: T[]): T;
/**
 * picks n random elements *without* replacement
 */
export function sampleN<T>(n: number, arr: T[]): T[];
/**
 * generates k in k pi, such that k pi is a special angle
 * @param options defaults to `{ allowReal: false, allowImag: false }` where we allow angles 0,pi for the first option
 * and \pm pi/2 for the second option
 *
 * @param options.avoid Fraction[] to avoid
 */
export function getRandomAngle(options?: {
    allowReal?: boolean;
    allowImag?: boolean;
    avoid?: Fraction[];
}): Fraction;
/**
 * Arithmetic progression
 */
export class AP {
    a: Fraction;
    d: Fraction;
    /**
     * creates new AP instance
     */
    constructor(a: number | Fraction, d: number | Fraction);
    /**
     * nth term, u_n = a + (n-1)d
     */
    u(n: number): Fraction;
    /**
     * nth term as a polynomial: u_n = nd + a-d
     */
    uNPoly(): Polynomial;
    /**
     * sum of n terms, S_n = n/2 * (2a + (n-1)d)
     */
    S(n: number): Fraction;
    /**
     * sum of n terms as a polynomial: S_n = n/2 * (2a + (n-1)d)
     */
    sNPoly(): Polynomial;
}
/**
 * Geometric progression
 */
export class GP {
    a: Fraction;
    r: Fraction;
    /**
     * creates new GP instance
     */
    constructor(a: number | Fraction, r: number | Fraction);
    /**
     * nth term, u_n = a r^(n-1)
     */
    u(n: number): Fraction;
    /**
     * sum of n terms, S_n = a (1 - r^n)/(1-r)
     */
    S(n: number): Fraction;
    /**
     * sum to infinity, S_infty = a / (1-r)
     */
    SInfty(): Fraction;
    /**
     * u_n formula to be used for floats
     */
    static u(a: number, r: number, n: number): number;
    /**
     * S_n formula to be used for floats
     */
    static S(a: number, r: number, n: number): number;
    /**
     * S_infty formula to be used for floats
     */
    static SInfty(a: number, r: number): number;
}
/**
 * solve for sN > k (or less than by configuring options)
 * @param options defaults to `{moreThan: true}`
 */
export function solveGpSN(gp: GP, k: number | Fraction, options?: {
    moreThan?: boolean;
}): number;
/**
 * solve for sN > k (or less than by configuring options)
 * @param options defaults to `{moreThan: true}`
 */
export function solveGpSNNumber(a: number, r: number, k: number, options?: {
    moreThan?: boolean;
}): number;
/**
 * A [Factorial](https://en.wikipedia.org/wiki/Factorial), usually written n!, is the product of all positive
 * integers less than or equal to n. Often factorial is implemented
 * recursively, but this iterative approach is significantly faster
 * and simpler.
 *
 * @param {number} n input, must be an integer number 1 or greater
 * @returns {number} factorial: n!
 * @throws {Error} if n is less than 0 or not an integer
 * @example
 * factorial(5); // => 120
 */
export function factorial(n: number): number;
export const Maclaurin: {
    /**
     * binomial expansion of (1+x)^n
     *
     * @param degree: highest power to include in power series
     * @param options defaults to {x: 'x'}
     */
    binomial(degree: number, n: number | Fraction, options?: {
        x?: string | Polynomial;
    }): Polynomial;
    /**
     * power series for e^x
     */
    exp(degree: number, options?: {
        x?: string | Polynomial;
    }): Polynomial;
    /**
     * power series for sin(x)
     */
    sin(degree: number, options?: {
        x?: string | Polynomial;
    }): Polynomial;
    /**
     * power series for cos(x)
     */
    cos(degree: number, options?: {
        x?: string | Polynomial;
    }): Polynomial;
    /**
     * power series for ln(1+x)
     */
    ln(degree: number, options?: {
        x?: string | Polynomial;
    }): Polynomial;
};
export const xMaclaurin: {
    /**
     * binomial expansion of (1+x)^n
     *
     * @param degree: highest power to include in power series
     * @param options defaults to {x: 'x'}
     */
    binomial(degree: number, n: number | Fraction, options?: {
        x?: string | Polynomial | xPolynomial;
    }): xPolynomial;
    /**
     * power series for e^x
     */
    exp(degree: number, options?: {
        x?: string | Polynomial | xPolynomial;
    }): xPolynomial;
    /**
     * power series for sin(x)
     */
    sin(degree: number, options?: {
        x?: string | Polynomial | xPolynomial;
    }): xPolynomial;
    /**
     * power series for cos(x)
     */
    cos(degree: number, options?: {
        x?: string | Polynomial | xPolynomial;
    }): xPolynomial;
    /**
     * power series for ln(1+x)
     */
    ln(degree: number, options?: {
        x?: string | Polynomial | xPolynomial;
    }): xPolynomial;
};
/**
 * n choose r
 *
 * uses a multiplication algorithm: beware of potential overflow for large numbers;
 */
export function nCr(n: number, r: number): number;
/**
 * typesets and calculate nCr via toString and valueOf
 */
export class NCR {
    n: number;
    r: number;
    ordered: boolean;
    constructor(n: number, r: number, ordered?: boolean);
    toString(): string;
    valueOf(): number;
}
/**
 * binomPdf(n,p,x)
 *
 * @returns P(X=x)
 *
 */
export function binomPdf(n: number, p: number, x: number): number;
/**
 * binomCdf(n,p,x)
 *
 * @returns P(X \leq x)
 *
 */
export function binomCdf(n: number, p: number, x: number): number;
/**
 * binomCdfRange(n,p,x1,x2)
 *
 * @returns P(x1 \\leq X \leq x2)
 *
 */
export function binomCdfRange(n: number, p: number, lower: number, upper: number): number;
/**
 * normCdf(mu, sigma, limits)
 *
 * @param limits defaults to {lower: -infinity, upper: infinity} (implemented by the MAX_VALUE property)
 *
 * @returns P(lower < X < upper)
 *
 * uses the implementation of the error function by [simple-statistics package](https://simplestatistics.org/)
 */
export function normCdf(mu: number, sigma: number, limits: Limits): number;
/**
 * invNorm(p, mu, sigma, mode)
 *
 * @param mu mean. defaults to 0
 * @param sigma standard deviation. defaults to 1
 * @param mode defaults to 'left' for left tail. Alternatives: 'right', 'center' for right and center
 *
 * @returns x such that P(X < x) = p for left tail. for 'center' mode, P(x1 < X < x2) = p, only x2 will be returned.
 *
 * uses the implementation of the inverse error function from [math-erfinv](https://github.com/math-io/erfinv)
 */
export function invNorm(p: number, mu?: number, sigma?: number, mode?: 'left' | 'right' | 'center' | 'r' | 'c' | 'l'): number;
/**
 * zTest(mu, sigma, xBar, n, tail)
 *
 * @param tail `'left'`(default), `'right'` or `'two'`
 * @returns p-value
 *
 * uses  the implementation by [simple-statistics package](https://simplestatistics.org/)
 */
export function zTest(mu: number, sigma: number, xBar: number, n: number, tail?: string): number;
interface Limits {
    lower?: number;
    upper?: number;
}
export class Normal {
    /**
     * class representing normally distributed random variable X ~ N(mu, sigma^2)
     */
    mean: number;
    sd: number;
    variance: number;
    sdMode: boolean;
    name: string;
    /**
     * Creates a new normal r.v. instance
     *
     * @param mean population mean mu
     * @param variance population variance sigma^2
     * @param options default to {name: 'X', sdMode: false} where sdMode indicate sd instead of
     * variance is provided
     *
     */
    constructor(mean: number, variance?: number, options?: {
        name?: string;
        sdMode?: boolean;
    });
    /**
     * adds two independently distributed normal r.v.
     *
     */
    plus(Y: number | Normal, options?: {
        name?: string;
    }): Normal;
    /**
     * multiplies by a scalar, nX ~ (n mu, n^2 sigma^2)
     *
     */
    times(n: number, options?: {
        name?: string;
    }): Normal;
    /**
     * divides by a scalar, 1/n X ~ (mu/n, sigma^2/n^2)
     *
     */
    divide(n: number, options?: {
        name?: string;
    }): Normal;
    /**
     * subtracts independently distributed normal r.v., this - Y
     *
     */
    minus(Y: number | Normal, options?: {
        name?: string;
    }): Normal;
    /**
     * sum X1 + ... + Xn ~ N(n mu, n sigma^2)
     */
    sum(n: number, options?: {
        name?: string;
    }): Normal;
    /**
     * sample mean XBar ~ N (mu, sigma^2 / n)
     */
    bar(n: number): Normal;
    /**
     * less than
     *
     * @returns P(X < x)
     */
    lessThan(x: number): number;
    /**
     * more than
     *
     * @returns P(X > x)
     */
    moreThan(x: number): number;
    /**
     * between
     *
     * @returns P(x1 < X < x2)
     */
    between(x1: number, x2: number): number;
    /**
     * invNorm
     *
     * @mode defaults to 'left' for left tail, accepts 'right' or 'center'
     *
     * @return x such that P(X < x) = p
     */
    invNorm(p: number, mode?: 'center' | 'left' | 'right' | 'l' | 'c' | 'r'): number;
    /**
     * toString: returns `X ~ N(mu, sigma^2)`
     *
     * @param name symbol representing the r.v. (default `X`)
     */
    toString(): string;
}
export class Regression {
    x: string;
    y: string;
    xData: number[];
    yData: number[];
    constructor(xData: number[], yData: number[], options?: {
        x?: string;
        y?: string;
    });
    xBar(): number;
    yBar(): number;
    r(): number;
    r2(): number;
    /**
     * @returns [a, b] such that y = a + bx
     */
    yOnX(): [number, number];
    yOnXAt(x: number): number;
    /**
     * @returns [a, b] such that x = a + by
     */
    xOnY(): [number, number];
    toString(precision?: number, options?: {
        dpMode?: boolean;
    }): string;
    linearize(functions?: {
        xFn?: ((x1: number) => number) | 'ln' | 'reciprocal' | 'square';
        yFn?: ((y1: number) => number) | 'ln' | 'reciprocal' | 'square';
        x?: string;
        y?: string;
    }): Regression;
}

//# sourceMappingURL=types.d.ts.map
