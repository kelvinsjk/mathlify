function $7f2edef52699c44b$export$f81847884871263e(...integers) {
    if (integers.length === 0) throw new RangeError("gcd ERROR: gcd function must have at least one argument");
    else if (integers.length === 1) return Math.abs(integers[0]);
    else if (integers.length === 2) return $7f2edef52699c44b$var$gcdTwo(integers[0], integers[1]);
    else {
        // recursively call this method
        const [integer1, integer2, ...restOfIntegers] = integers;
        return integer1 === 0 && integer2 === 0 ? $7f2edef52699c44b$export$f81847884871263e(0, ...restOfIntegers) : $7f2edef52699c44b$export$f81847884871263e($7f2edef52699c44b$var$gcdTwo(integer1, integer2), ...restOfIntegers);
    }
}
function $7f2edef52699c44b$export$f686d97e407ec4ef(...integers) {
    if (integers.length === 0) throw new RangeError("lcm function must have at least one argument");
    else if (integers.length === 1) return Math.abs(integers[0]);
    else if (integers.length === 2) return $7f2edef52699c44b$var$lcmTwo(integers[0], integers[1]);
    else {
        // recursively call this method
        const [integer1, integer2, ...restOfIntegers] = integers;
        return $7f2edef52699c44b$export$f686d97e407ec4ef($7f2edef52699c44b$var$lcmTwo(integer1, integer2), ...restOfIntegers);
    }
}
/**
 * Greatest common divisor of two integers
 *
 * @returns the (positive) gcd of two integers
 */ function $7f2edef52699c44b$var$gcdTwo(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    if (a === 0 && b === 0) throw new RangeError("gcd(0,0) not defined");
    if (!Number.isInteger(a) || !Number.isInteger(b)) throw new TypeError("gcd not defined for non-integers");
    if (a === 0 || b === 0) // at least one non-zero due to earlier check
    return Math.max(a, b);
    while(b !== 0)[a, b] = [
        b,
        a % b
    ];
    return a;
}
function $7f2edef52699c44b$var$lcmTwo(a, b) {
    return Math.abs(a * b) / $7f2edef52699c44b$var$gcdTwo(a, b);
}



function $2aab13bad14c4123$export$98fc78f39c2afd39(x) {
    if (typeof x === "number") return new (0, $f182971f6d253900$export$b336c2702c498be5)(x);
    else return new (0, $f182971f6d253900$export$b336c2702c498be5)(x.num, x.den);
}


class $f182971f6d253900$export$b336c2702c498be5 {
    /**
	 * Creates a new `Fraction` instance, 'simplifying' the fraction to the form a/b such that a is an integer, b is a positive integer and gcd(a,b)=1.
	 * @param num numerator
	 * @param den denominator defaults to `1`
	 */ constructor(num, den = 1){
        if (!Number.isInteger(den) || !Number.isInteger(num)) throw new RangeError("Fraction error: parameters must be integers");
        if (den === 0) throw new RangeError("Fraction error: denominator must be non-zero");
        const divisor = (0, $7f2edef52699c44b$export$f81847884871263e)(num, den);
        const sign = Math.sign(num) * Math.sign(den); // signs hoisted to top
        this.num = sign * Math.abs(num) / divisor;
        this.den = Math.abs(den) / divisor;
    }
    /**
	 * addition
	 * @param f2 the number/fraction to be added
	 * @returns the sum of this fraction and `f2`
	 */ plus(f2) {
        f2 = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(f2);
        return new $f182971f6d253900$export$b336c2702c498be5(this.num * f2.den + f2.num * this.den, this.den * f2.den);
    }
    /**
	 * multiplication
	 * @param f2 the number/fraction to be multiplied
	 * @returns the product of this fraction and `f2`
	 */ times(f2) {
        f2 = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(f2);
        return new $f182971f6d253900$export$b336c2702c498be5(this.num * f2.num, this.den * f2.den);
    }
    /**
	 * @returns negative of this fraction
	 */ negative() {
        return this.times(-1);
    }
    /**
	 * @returns the absolute value of this Fraction
	 */ abs() {
        return new $f182971f6d253900$export$b336c2702c498be5(Math.abs(this.num), this.den);
    }
    /**
	 * subtraction
	 * @param f2 the number/fraction to be subtracted
	 * @returns this fraction minus `f2`
	 */ minus(f2) {
        f2 = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(f2);
        return this.plus(f2.negative());
    }
    /**
	 * reciprocal
	 * @returns this 1/(this fraction), provided that this fraction is non-zero
	 */ reciprocal() {
        return new $f182971f6d253900$export$b336c2702c498be5(this.den, this.num);
    }
    /**
	 * division
	 * @param f2 the number/fraction to be divided by. Cannot be zero.
	 * @returns this fraction divided by `f2`
	 */ divide(f2) {
        f2 = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(f2);
        return this.times(f2.reciprocal());
    }
    /**
	 * exponentiation
	 * @param n integer
	 * @returns this fraction to the power of `n`
	 */ pow(n) {
        if (n instanceof $f182971f6d253900$export$b336c2702c498be5) {
            if (n.den !== 1) throw new RangeError(`only integral n are allowed for fraction.pow at the moment. ${n} received`);
            n = n.valueOf();
        }
        if (!Number.isInteger(n)) throw new RangeError(`only integral n are allowed for fraction.pow(n). ${n} received`);
        const modN = Math.abs(n);
        const thisPowerModN = new $f182971f6d253900$export$b336c2702c498be5(Math.pow(this.num, modN), Math.pow(this.den, modN));
        return n >= 0 ? thisPowerModN : thisPowerModN.reciprocal();
    }
    /**
	 * square
	 * @returns the square of this fraction
	 */ square() {
        return this.pow(2);
    }
    /**
	 * checks if this fraction is equal to `f2`
	 */ isEqualTo(f2) {
        f2 = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(f2);
        return this.num === f2.num && this.den == f2.den;
    }
    /**
	 * checks if this fraction not is equal to `f2`
	 */ isNotEqualTo(f2) {
        return !this.isEqualTo(f2);
    }
    /**
	 * checks if this fraction is an integer
	 */ isInteger() {
        return this.den === 1;
    }
    /**
	 * checks if this fraction is larger than f2
	 * @param f2 number or fraction to compare against
	 */ isGreaterThan(f2) {
        return this.valueOf() > f2.valueOf();
    }
    /**
	 * checks if this fraction is smaller than f2
	 * @param f2 number or fraction to compare against
	 */ isLessThan(f2) {
        return this.valueOf() < f2.valueOf();
    }
    /**
	 * checks if this fraction is greater than or equal to f2
	 * @param f2 number or fraction to compare against
	 */ isAtLeast(f2) {
        return this.isGreaterThan(f2) || this.isEqualTo(f2);
    }
    /**
	 * checks if this fraction is less than or equal to f2
	 * @param f2 number or fraction to compare against
	 */ isAtMost(f2) {
        return this.isLessThan(f2) || this.isEqualTo(f2);
    }
    /**
	 * ceiling function
	 * @returns the least integer greater than or equal to this fraction in Fraction form
	 */ ceil() {
        return new $f182971f6d253900$export$b336c2702c498be5(Math.ceil(this.valueOf()));
    }
    /**
	 * floor function
	 * @returns the greatest integer less than or equal to this fraction in Fraction form
	 */ floor() {
        return new $f182971f6d253900$export$b336c2702c498be5(Math.floor(this.valueOf()));
    }
    /**
	 * rounding function
	 *
	 * round off this fraction to the nearest integer, and
	 * @returns the value in Fraction form
	 */ round() {
        return new $f182971f6d253900$export$b336c2702c498be5(Math.round(this.valueOf()));
    }
    /**
	 * sign function
	 *
	 * @returns the sign of this fraction
	 */ sign() {
        return Math.sign(this.valueOf());
    }
    /**
	 * converts to Javascript built-in Number type
	 * @returns the float representation of this fraction in the JavaScript number format
	 */ valueOf() {
        return this.num / this.den;
    }
    /**
	 * invokes the JavaScript `Number.prototype.toFixed()` method
	 */ toFixed(digits) {
        return this.valueOf().toFixed(digits);
    }
    /**
	 * invokes the JavaScript `Number.prototype.toPrecision()` method
	 * before passing it back as a number (to avoid exponential notation)
	 */ toPrecision(precision) {
        return Number(this.valueOf().toPrecision(precision)).toString();
    }
    /**
	 * `toString()` method
	 *
	 * @returns the LaTeX string representation of the fraction
	 */ toString() {
        if (this.isInteger()) return this.num < 0 ? `- ${Math.abs(this.num)}` : `${this.num}`;
        // fraction
        const sign = this.num < 0 ? "- " : "";
        return `${sign}\\frac{${Math.abs(this.num)}}{${this.den}}`;
    }
    /**
	 * toJSON method that allows for quick reconstruction of class instance
	 * by storing its constructor arguments
	 */ toJSON() {
        return {
            type: "fraction",
            args: [
                this.num,
                this.den
            ]
        };
    }
    /**
	 * clones the Fraction: creating a new Fraction instance
	 */ clone() {
        return new $f182971f6d253900$export$b336c2702c498be5(this.num, this.den);
    }
    /**
	 * the fraction class instance of 1
	 */ static ONE = new $f182971f6d253900$export$b336c2702c498be5(1);
    /**
	 * the fraction class instance of 0
	 */ static ZERO = new $f182971f6d253900$export$b336c2702c498be5(0);
    /**
	 * @returns gcd of given fractions
	 */ static gcd(...fractions) {
        if (fractions.length === 0) throw new Error("Fraction ERROR: gcd function must have at least one argument");
        else if (fractions.length === 1) {
            const fraction = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(fractions[0]);
            return fraction;
        } else if (fractions.length === 2) {
            const fraction1 = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(fractions[0]);
            const fraction2 = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(fractions[1]);
            const gcdNum = (0, $7f2edef52699c44b$export$f81847884871263e)(fraction1.num, fraction2.num);
            const gcdDen = (0, $7f2edef52699c44b$export$f81847884871263e)(fraction1.den, fraction2.den);
            const lcmDen = Math.abs(fraction1.den * fraction2.den) / gcdDen;
            return new $f182971f6d253900$export$b336c2702c498be5(gcdNum, lcmDen);
        } else {
            // recursively call this method
            const [fraction11, fraction21, ...restOfFractions] = fractions;
            return fraction11.valueOf() === 0 && fraction21.valueOf() === 0 ? $f182971f6d253900$export$b336c2702c498be5.gcd(0, ...restOfFractions) : $f182971f6d253900$export$b336c2702c498be5.gcd($f182971f6d253900$export$b336c2702c498be5.gcd(fraction11, fraction21), ...restOfFractions);
        }
    }
    /**
	 * given a set of fractions (a, b, c, ..., n)
	 * @returns an array `[[A, B, C, ..., N], k ]`,
	 * where k(A, B, C, ..., N) = (a, b, c, ..., n)
	 */ static factorize(...fractions) {
        let gcd = $f182971f6d253900$export$b336c2702c498be5.gcd(...fractions);
        let simplifiedArray = fractions.map((fraction)=>{
            fraction = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(fraction);
            return fraction.divide(gcd);
        });
        if (simplifiedArray.reduce((acc, current)=>acc && current.valueOf() <= 0, true)) {
            simplifiedArray = simplifiedArray.map((fraction)=>fraction.negative());
            gcd = gcd.negative();
        }
        return [
            simplifiedArray,
            gcd
        ];
    }
}



class $e86e55fd775d0f9a$export$921da06a0f908654 {
    /**
	 * Creates a new term instance
	 * @param coeff coefficient of the term
	 * @param variable string representation of the term/'variable'.
	 * An empty string (default) means we are working with the constant term
	 */ constructor(coeff, variable = ""){
        coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
        this.coeff = coeff;
        this.variableString = variable;
    }
    /**
	 * `toString()` method
	 *
	 * @returns the LaTeX string representation of the term
	 */ toString() {
        if (this.coeff.isEqualTo(0)) return "0";
        if (this.coeff.isEqualTo(1)) return this.variableString === "" ? "1" : `${this.variableString}`;
        if (this.coeff.isEqualTo(-1)) return this.variableString === "" ? "- 1" : `- ${this.variableString}`;
        // non 0/1/-1 coefficient
        if (this.variableString === "") // constant term
        return `${this.coeff}`;
        // variable term and non 0/1/-1 coefficient
        return `${this.coeff} ${this.variableString}`;
    }
}




class $e94ebcbaae2b1672$export$fb07cc2f3f2c86fa extends (0, $e86e55fd775d0f9a$export$921da06a0f908654) {
    constructor(coeff = 1){
        super(coeff, "\\mathrm{i}");
    }
    plus(x) {
        return new $e94ebcbaae2b1672$export$fb07cc2f3f2c86fa(this.coeff.plus(x.coeff));
    }
    negative() {
        return new $e94ebcbaae2b1672$export$fb07cc2f3f2c86fa(this.coeff.negative());
    }
    minus(x) {
        return new $e94ebcbaae2b1672$export$fb07cc2f3f2c86fa(this.coeff.minus(x.coeff));
    }
    times(x) {
        return x instanceof (0, $f182971f6d253900$export$b336c2702c498be5) ? new $e94ebcbaae2b1672$export$fb07cc2f3f2c86fa(this.coeff.times(x)) : this.coeff.times(x.coeff).times(-1);
    }
    pow(n) {
        if (!Number.isInteger(n) || n < 0) throw new Error("Exponent must be a non-negative integer");
        let result = new (0, $f182971f6d253900$export$b336c2702c498be5)(1);
        for(let i = 0; i < n; i++)result = this.times(result);
        return result;
    }
    square() {
        const x = this.times(this);
        return x;
    }
    clone() {
        return new $e94ebcbaae2b1672$export$fb07cc2f3f2c86fa(this.coeff);
    }
    toJSON() {
        return {
            type: "imaginary",
            args: [
                this.coeff.toJSON()
            ]
        };
    }
}





class $8622b8d7bfb82666$export$d155811788b32995 extends (0, $e86e55fd775d0f9a$export$921da06a0f908654) {
    /**
	 * Creates a new polynomial term instance
	 * @param coeff coefficient of the term. If a string is passed, we will use that as the unknown and let the coefficient and power be 1
	 * @param options defaults to `{ unknown: 'x', n: 1, }`;
	 */ constructor(coeff = 1, options){
        const { variable: variable , n: nNumber  } = {
            variable: "x",
            n: 1,
            ...options
        };
        if (typeof coeff === "string") {
            // edge case
            super(1, coeff);
            this.variable = coeff;
            this.n = new (0, $f182971f6d253900$export$b336c2702c498be5)(1);
        } else {
            coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
            const n = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(nNumber);
            let variableString; // x^n
            if (n.isEqualTo(1) || n.isEqualTo(0)) variableString = n.isEqualTo(1) ? variable : "";
            else {
                const powerString = `${n}`.length > 1 ? `{${n}}` : `${n}`;
                variableString = `${variable}^${powerString}`;
            }
            super(coeff, variableString);
            this.variable = variable;
            this.n = n;
        }
    }
    /**
	 * Multiplication
	 */ times(k) {
        if (k instanceof $8622b8d7bfb82666$export$d155811788b32995) {
            if (k.variable !== this.variable) throw new Error("Cannot multiply two power terms with different unknowns");
            return new $8622b8d7bfb82666$export$d155811788b32995(this.coeff.times(k.coeff), {
                variable: this.variable,
                n: this.n.plus(k.n)
            });
        }
        return new $8622b8d7bfb82666$export$d155811788b32995(this.coeff.times(k), {
            variable: this.variable,
            n: this.n
        });
    }
    /**
	 * Division
	 */ divide(k) {
        if (k instanceof $8622b8d7bfb82666$export$d155811788b32995) {
            if (k.variable !== this.variable) throw new Error("Cannot multiply two power terms with different unknowns");
            return new $8622b8d7bfb82666$export$d155811788b32995(this.coeff.divide(k.coeff), {
                variable: this.variable,
                n: this.n.minus(k.n)
            });
        }
        return new $8622b8d7bfb82666$export$d155811788b32995(this.coeff.divide(k), {
            variable: this.variable,
            n: this.n
        });
    }
    /**
	 * @returns the negative of this `Term`. Equivalent to `term.multiply(-1)`.
	 */ negative() {
        return this.times(-1);
    }
    pow(n) {
        return new $8622b8d7bfb82666$export$d155811788b32995(this.coeff.pow(n), {
            variable: this.variable,
            n: this.n.times(n)
        });
    }
    /**
	 * substitutes the unknown in and returns a fraction
	 *
	 * only supports fraction when n is an integer at the moment
	 */ subIn(x) {
        x = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(x);
        if (!this.n.isInteger()) throw new Error(`Cannot substitute in a non-integer power ${this.n}`);
        return this.coeff.times(x.pow(this.n.num));
    }
    /**
	 * substitutes the unknown in and returns a number type
	 */ subInNumber(x) {
        return this.coeff.valueOf() * Math.pow(x, this.n.valueOf());
    }
    /** clones and creates a new instance */ clone() {
        return new $8622b8d7bfb82666$export$d155811788b32995(this.coeff.clone(), {
            variable: this.variable,
            n: this.n
        });
    }
    toJSON() {
        return {
            type: "variable",
            args: [
                this.coeff.toJSON(),
                {
                    variable: this.variable,
                    n: this.n.toJSON()
                }
            ]
        };
    }
}


class $3457bc831d272ab3$export$2d8ad6e0bc55950e {
    constructor(symbol, options){
        const { kind: kind  } = {
            kind: "symbol",
            ...options
        };
        this.kind = kind;
        this.symbol = symbol;
    }
    toString() {
        return this.symbol;
    }
    /**
	 * toJSON method that allows for quick reconstruction of class instance
	 * by storing its constructor arguments
	 */ toJSON() {
        return {
            type: "mathSymbol",
            args: [
                this.symbol,
                {
                    kind: this.kind
                }
            ]
        };
    }
}


class $2d5ae0e4f85ad95c$export$2d8ad6e0bc55950e {
    constructor(symbol, options){
        const { kind: kind  } = {
            kind: "symbol",
            ...options
        };
        this.kind = kind;
        this.symbol = symbol;
    }
    toString() {
        return this.symbol;
    }
    /**
	 * toJSON method that allows for quick reconstruction of class instance
	 * by storing its constructor arguments
	 */ toJSON() {
        return {
            type: "mathSymbol",
            args: [
                this.symbol,
                {
                    kind: this.kind
                }
            ]
        };
    }
}




function $725cf8b52ea54301$export$6f6f5910ffbc7e59(...args) {
    let k = (0, $7f2edef52699c44b$export$f81847884871263e)(...args);
    if (args.filter((e)=>e > 0).length === 0) k = -k;
    return {
        k: k,
        numbers: args.map((x)=>x / k)
    };
}










function $23160e13dd404e1b$export$d991e3d99172da5e(x) {
    if (typeof x === "number" || x instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(1, x);
    return x.clone();
}





class $8b0d087ec1c2aa1d$export$656c1e606ad06131 {
    constructor(...args){
        let coeff = new (0, $f182971f6d253900$export$b336c2702c498be5)(1);
        let symbols = {};
        let imagCount = 0;
        let surdArg = 1;
        args.forEach((x)=>{
            if (Array.isArray(x)) {
                const [symbol, power] = x;
                if (symbol === "i" || symbol instanceof (0, $60b13a6be04206e3$export$d5439f8590acfb59)) imagCount++;
                else {
                    const mathSymbol = typeof symbol === "string" ? new (0, $3457bc831d272ab3$export$2d8ad6e0bc55950e)(symbol) : symbol;
                    $8b0d087ec1c2aa1d$var$appendToSymbols(symbols, mathSymbol, power);
                }
            } else if (typeof x === "string") {
                if (x === "i") imagCount++;
                else if (x === "surd") throw new RangeError(`'surd' is a reserved symbol name in the Term class`);
                else {
                    const mathSymbol1 = new (0, $3457bc831d272ab3$export$2d8ad6e0bc55950e)(x);
                    $8b0d087ec1c2aa1d$var$appendToSymbols(symbols, mathSymbol1);
                }
            } else if (typeof x === "number" || x instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) coeff = coeff.times(x);
            else if (x instanceof (0, $60b13a6be04206e3$export$d5439f8590acfb59)) imagCount++;
            else if (x instanceof (0, $7811ac8504c01765$export$bacc3050bcb5570)) surdArg *= x.radicand;
            else {
                if (x.symbol === "i" || x.symbol === "surd") throw new RangeError(`'i' and 'surd' are reserved symbol names in the Term class`);
                // MathSymbol
                $8b0d087ec1c2aa1d$var$appendToSymbols(symbols, x);
            }
        });
        // handle imaginary
        imagCount = imagCount % 4;
        if (imagCount === 2) coeff = coeff.times(-1);
        else if (imagCount === 1) symbols["i"] = {
            symbol: new (0, $60b13a6be04206e3$export$d5439f8590acfb59)(),
            power: new (0, $f182971f6d253900$export$b336c2702c498be5)(1)
        };
        else if (imagCount === 3) {
            coeff = coeff.times(-1);
            symbols["i"] = {
                symbol: new (0, $60b13a6be04206e3$export$d5439f8590acfb59)(),
                power: new (0, $f182971f6d253900$export$b336c2702c498be5)(1)
            };
        }
        // handle surds. sqrt(surdArg) = y sqrt{x}
        const [y, x] = $8b0d087ec1c2aa1d$var$extractPowers(surdArg);
        coeff = coeff.times(y);
        if (x !== 1) symbols["surd"] = {
            symbol: new (0, $7811ac8504c01765$export$bacc3050bcb5570)(x),
            power: new (0, $f182971f6d253900$export$b336c2702c498be5)(1)
        };
        // set up class props
        this.coeff = coeff;
        if (this.coeff.isEqualTo(0)) symbols = {};
        for(const symbol in symbols)if (symbols[symbol].power.isEqualTo(0)) delete symbols[symbol];
        this.symbols = symbols;
        const length = Object.keys(symbols).length;
        if (length === 0) this.kind = "fractionTerm";
        else if (length === 1) {
            if ("surd" in symbols) this.kind = "sqrtTerm";
            else if ("i" in symbols) this.kind = "imaginaryTerm";
            else this.kind = "singleton";
        } else this.kind = "term";
    }
    isSurd() {
        return "surd" in this.symbols;
    }
    isImag() {
        return "i" in this.symbols;
    }
    isRational() {
        return Object.keys(this.symbols).length === 0;
    }
    /**
	 * check if two terms are 'like terms'
	 * (ie same symbols with same powers)
	 */ isLike(x) {
        if (Object.keys(this.symbols).length !== Object.keys(x.symbols).length) return false;
        for(const term in this.symbols){
            if (!(term in x.symbols)) return false;
            else if (this.symbols[term].power.isNotEqualTo(x.symbols[term].power)) return false;
        }
        return true;
    }
    /**
	 * Multiplication
	 */ times(x) {
        if (typeof x === "number" || x instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) return new $8b0d087ec1c2aa1d$export$656c1e606ad06131(this.coeff.times(x), ...$8b0d087ec1c2aa1d$var$symbolsToArray(this.symbols));
        else if (typeof x === "string" || x instanceof (0, $3457bc831d272ab3$export$2d8ad6e0bc55950e) || x instanceof (0, $60b13a6be04206e3$export$d5439f8590acfb59) || x instanceof (0, $7811ac8504c01765$export$bacc3050bcb5570) || Array.isArray(x)) return new $8b0d087ec1c2aa1d$export$656c1e606ad06131(this.coeff, ...$8b0d087ec1c2aa1d$var$symbolsToArray(this.symbols), x);
        else // Term type
        return new $8b0d087ec1c2aa1d$export$656c1e606ad06131(this.coeff.times(x.coeff), ...$8b0d087ec1c2aa1d$var$symbolsToArray(this.symbols), ...$8b0d087ec1c2aa1d$var$symbolsToArray(x.symbols));
    }
    divide(x) {
        if (typeof x === "number" || x instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) return new $8b0d087ec1c2aa1d$export$656c1e606ad06131(this.coeff.divide(x), ...$8b0d087ec1c2aa1d$var$symbolsToArray(this.symbols));
        else if (typeof x === "string" || x instanceof (0, $3457bc831d272ab3$export$2d8ad6e0bc55950e)) return new $8b0d087ec1c2aa1d$export$656c1e606ad06131(this.coeff, ...$8b0d087ec1c2aa1d$var$symbolsToArray(this.symbols), [
            x,
            -1
        ]);
        else if (x instanceof (0, $60b13a6be04206e3$export$d5439f8590acfb59)) return new $8b0d087ec1c2aa1d$export$656c1e606ad06131(this.coeff.negative(), ...$8b0d087ec1c2aa1d$var$symbolsToArray(this.symbols), x);
        else if (x instanceof (0, $7811ac8504c01765$export$bacc3050bcb5570)) return new $8b0d087ec1c2aa1d$export$656c1e606ad06131(this.coeff.divide(x.radicand), ...$8b0d087ec1c2aa1d$var$symbolsToArray(this.symbols), x);
        else if (Array.isArray(x)) return new $8b0d087ec1c2aa1d$export$656c1e606ad06131(this.coeff, ...$8b0d087ec1c2aa1d$var$symbolsToArray(this.symbols), [
            x[0],
            (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(x[1]).negative()
        ]);
        else // Term type
        return this.times(x.reciprocal());
    }
    negative() {
        return new $8b0d087ec1c2aa1d$export$656c1e606ad06131(this.coeff.negative(), ...$8b0d087ec1c2aa1d$var$symbolsToArray(this.symbols));
    }
    plus(x) {
        if (!(x instanceof $8b0d087ec1c2aa1d$export$656c1e606ad06131)) x = new $8b0d087ec1c2aa1d$export$656c1e606ad06131(x);
        if (!this.isLike(x)) throw new Error(`addition of terms only work for like terms at the moment.
					${this} and ${x} received. Consider using the Expression class`);
        return new $8b0d087ec1c2aa1d$export$656c1e606ad06131(this.coeff.plus(x.coeff), ...$8b0d087ec1c2aa1d$var$symbolsToArray(this.symbols));
    }
    minus(x) {
        if (!(x instanceof $8b0d087ec1c2aa1d$export$656c1e606ad06131)) x = new $8b0d087ec1c2aa1d$export$656c1e606ad06131(x);
        if (!this.isLike(x)) throw new Error(`subtraction of terms only work for like terms at the moment.
					${this} and ${x} received. Consider using the Expression class`);
        return new $8b0d087ec1c2aa1d$export$656c1e606ad06131(this.coeff.minus(x.coeff), ...$8b0d087ec1c2aa1d$var$symbolsToArray(this.symbols));
    }
    pow(n) {
        if (n instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) {
            if (n.den !== 1) throw new RangeError(`only integral n are allowed for term.pow at the moment. ${n} received`);
            n = n.valueOf();
        }
        if (!Number.isInteger(n)) throw new RangeError(`only integral n are allowed for term.pow at the moment. ${n} received`);
        const multiple = n < 0 ? this.reciprocal() : this;
        let x = new $8b0d087ec1c2aa1d$export$656c1e606ad06131(1);
        for(let i = 0; i < Math.abs(n); i++)x = x.times(multiple);
        return x;
    }
    reciprocal() {
        const symbolsArray = Object.keys(this.symbols).map((x)=>{
            return [
                this.symbols[x].symbol,
                this.symbols[x].power.reciprocal()
            ];
        });
        return new $8b0d087ec1c2aa1d$export$656c1e606ad06131(this.coeff.reciprocal(), ...symbolsArray);
    }
    // applies negative if surd or imaginary term present
    //conjugate(): Term {
    //	return this.isImag || this.isSurd ? this.negative() : this.clone();
    //}
    subIn(x, symbol = "x") {
        let y = this.coeff;
        symbol = typeof symbol === "string" ? symbol : symbol.symbol;
        for(const symbol2 in this.symbols){
            if (symbol2 === symbol) y = y.times((0, $2aab13bad14c4123$export$98fc78f39c2afd39)(x).pow(this.symbols[symbol2].power));
            else throw new Error(`symbols other than ${symbol} (${symbol2}) found`);
        }
        return y;
    }
    subInNumber(x, symbol = "x") {
        let y = this.coeff.valueOf();
        for(const symbol2 in this.symbols){
            if (symbol2 === symbol) y = y * Math.pow(x, this.symbols[symbol2].power.valueOf());
            else if (symbol2 === "surd") {
                const surd = this.symbols[symbol2].symbol;
                if (surd instanceof (0, $7811ac8504c01765$export$bacc3050bcb5570)) y = y * Math.sqrt(surd.radicand);
                else throw new Error(`unexpected error: non-surd found`);
            } else throw new Error(`symbols other than ${symbol} (${symbol2}) found`);
        }
        return y;
    }
    valueOf() {
        // TODO: 'e', 'pi', 'ln Term'
        let y = this.coeff.valueOf();
        for(const symbol2 in this.symbols){
            if (symbol2 === "surd") {
                const surd = this.symbols[symbol2].symbol;
                if (surd instanceof (0, $7811ac8504c01765$export$bacc3050bcb5570)) y = y * Math.sqrt(surd.radicand);
                else throw new Error(`unexpected error: non-surd found`);
            } else throw new Error(`symbols other than surds (${symbol2}) found`);
        }
        return y;
    }
    square() {
        return this.pow(2);
    }
    clone() {
        return new $8b0d087ec1c2aa1d$export$656c1e606ad06131(this.coeff.clone(), ...$8b0d087ec1c2aa1d$var$symbolsToArray(this.symbols));
    }
    toString() {
        if (this.coeff.isEqualTo(0)) return `0`;
        let numString = "", denString = "";
        for(const key in this.symbols){
            const { power: power , symbol: symbol  } = this.symbols[key];
            if (power.isEqualTo(1)) {
                if (numString !== "") numString += " ";
                numString += `${symbol}`;
            } else if (power.isEqualTo(-1)) {
                if (denString !== "") denString += " ";
                denString += `${symbol}`;
            } else if (power.isGreaterThan(0)) {
                const powerString = `${power}`.length > 1 ? `{${power}}` : `${power}`;
                if (numString !== "") numString += " ";
                numString += `${symbol}^${powerString}`;
            } else if (power.isLessThan(0)) {
                const powerString1 = `${power.abs()}`.length > 1 ? `{${power.abs()}}` : `${power.abs()}`;
                if (denString !== "") denString += " ";
                denString += `${symbol}^${powerString1}`;
            } else throw new Error(`Unexpected power 0 term`);
        }
        // non-fraction
        if (denString === "") return numString === "" ? this.coeff.toString() : $8b0d087ec1c2aa1d$var$termToString(this.coeff, numString);
        // fraction type
        const sign = this.coeff.isGreaterThan(0) ? "" : "- ";
        if (numString === "") return `${sign}\\frac{${this.coeff.abs().num}}{${$8b0d087ec1c2aa1d$var$termToString(this.coeff.den, denString)}}`;
        else return `${sign}\\frac{${$8b0d087ec1c2aa1d$var$termToString(this.coeff.abs().num, numString)}}{${$8b0d087ec1c2aa1d$var$termToString(this.coeff.den, denString)}}`;
    }
    /**
	 * toJSON method that allows for quick reconstruction of class instance
	 * by storing its constructor arguments
	 */ toJSON() {
        return {
            type: "term",
            args: [
                this.coeff.toJSON(),
                ...Object.keys(this.symbols).map((x)=>this.symbols[x].symbol.toJSON())
            ]
        };
    }
}
/**
 * append MathSymbol to symbols object
 *
 * @param symbols the symbols object
 * @param symbol the MathSymbol
 * @param power the power (number/Fraction). Defaults to 1
 */ function $8b0d087ec1c2aa1d$var$appendToSymbols(symbols, symbol, power = 1) {
    if (symbol.symbol in symbols) symbols[symbol.symbol].power = symbols[symbol.symbol].power.plus(power);
    else symbols[symbol.symbol] = {
        symbol: symbol,
        power: (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(power)
    };
}
/**
 * convert the symbols object to an array [symbol: MathSymbol, power: Fraction][]
 *
 * @param symbols: symbols object
 * @returns [symbol: MathSymbol, power: Fraction][]
 */ function $8b0d087ec1c2aa1d$var$symbolsToArray(symbols) {
    return Object.keys(symbols).map((key)=>[
            symbols[key].symbol,
            symbols[key].power
        ]);
}
/**
 * handle edge cases where coeff is 0/1/-1
 */ function $8b0d087ec1c2aa1d$var$termToString(coeff, term) {
    coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
    if (coeff.isEqualTo(0)) return `0`;
    else if (coeff.isEqualTo(1)) return term;
    else if (coeff.isEqualTo(-1)) return `- ${term}`;
    else return `${coeff} ${term}`;
}
/** takes integers x and n, and returns [a, b] such that x = a^n b.
 * Only work for prime factors up to 100.
 *
 * @param x integer to extract powers from
 * @param options {y?: number, n?: number} defaults to y=1, n=2.
 * y facilitates a recursive algorithm while n is the power to be extracted.
 *
 */ function $8b0d087ec1c2aa1d$var$extractPowers(x, options) {
    if (x === 0) return [
        0,
        0
    ];
    const { y: y , n: n  } = {
        y: 1,
        n: 2,
        ...options
    };
    if (!(Number.isInteger(n) && n >= 2)) throw new RangeError(`n must be an integer at least 2. ${n} received`);
    const primes = [
        2,
        3,
        5,
        7,
        11,
        13,
        17,
        19,
        23,
        29,
        31,
        37,
        41,
        43,
        47,
        53,
        59,
        61,
        67,
        71,
        73,
        79,
        83,
        89,
        97
    ];
    for (const prime of primes){
        if (x % Math.pow(prime, n) === 0) return $8b0d087ec1c2aa1d$var$extractPowers(x / Math.pow(prime, n), {
            n: n,
            y: y * prime
        });
        else if (x < Math.pow(prime, n)) break;
    }
    return [
        y,
        x
    ];
}


class $54e5ac5d13ec125e$export$dc386df03dfad113 extends (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131) {
    //// constructor
    /**
	 * creates a new NthRoot instance representing $a \sqrt[n]{b}$.
	 * @param radicand only non-negative integers or Fractions are supported at this moment.
	 * @param coeff coefficient of the radical (defaults to 1).
	 */ constructor(n, radicand, coeff = 1){
        if (!Number.isInteger(n) || n < 2) throw new Error("n must be a integer at least 2");
        if (radicand.valueOf() < 0) throw new Error("radicand must be non-negative");
        // 'rationalize'
        coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
        radicand = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(radicand);
        // extract powers
        const [aNum, bNum] = $54e5ac5d13ec125e$var$extractPowers(radicand.num, n);
        const [aDen, bDen] = $54e5ac5d13ec125e$var$extractPowers(radicand.den, n);
        if (bNum === 1 || bDen === 1) {
            coeff = coeff.times(aNum).divide(aDen);
            radicand = new (0, $f182971f6d253900$export$b336c2702c498be5)(bNum, bDen);
        }
        // create term
        // edge cases for typesetting
        if (radicand.valueOf() === 0) coeff = new (0, $f182971f6d253900$export$b336c2702c498be5)(0);
        if (coeff.isEqualTo(0)) radicand = new (0, $f182971f6d253900$export$b336c2702c498be5)(1);
        if (radicand.isEqualTo(1)) super(coeff);
        else if (n === 2) super(coeff, new (0, $7811ac8504c01765$export$bacc3050bcb5570)(radicand.valueOf()));
        else super(coeff, new (0, $7811ac8504c01765$export$37c5252633151bef)(n, radicand));
        this.coeff = coeff;
        this.n = n;
        this.radicand = radicand;
        this.kind = "nthRootTerm";
    }
    times(x) {
        if (typeof x === "number" || x instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) x = (0, $0ad02af7964cc0d0$export$f5b5744fa2c312e3)(this.n, x);
        if (!(x instanceof $54e5ac5d13ec125e$export$dc386df03dfad113)) return super.times(x);
        if (this.n !== x.n) throw new Error("n must be the same for both terms");
        return new $54e5ac5d13ec125e$export$dc386df03dfad113(this.n, this.radicand.times(x.radicand), this.coeff.times(x.coeff));
    }
    /**
	 * radical division: a_1 \sqrt[n]{b_1} / a_2 \sqrt[n]{b_2} = a_1 / a_2 * \sqrt[n]{b_1 / b_2}$
	 */ divide(x) {
        x = (0, $0ad02af7964cc0d0$export$f5b5744fa2c312e3)(this.n, x);
        if (this.n !== x.n) throw new Error("n must be the same for both terms");
        return new $54e5ac5d13ec125e$export$dc386df03dfad113(this.n, this.radicand.divide(x.radicand), this.coeff.divide(x.coeff));
    }
    /**
	 * exponentiation
	 *
	 * @param n non-negative integer
	 * @returns this NthRoot to the power of n
	 */ pow(n) {
        if (!Number.isInteger(n) || n < 0) throw new Error("n must be a non-negative integer");
        return new $54e5ac5d13ec125e$export$dc386df03dfad113(this.n, this.radicand.pow(n), this.coeff.pow(n));
    }
    /**
	 * @returns the value of this NthRoot in the primitive number type
	 */ valueOf() {
        return Math.pow(this.radicand.valueOf(), 1 / this.n) * this.coeff.valueOf();
    }
    //// Comparison methods
    /**
	 * tests for equality
	 */ isEqualTo(x) {
        x = x instanceof $54e5ac5d13ec125e$export$dc386df03dfad113 ? x : new $54e5ac5d13ec125e$export$dc386df03dfad113(this.n, 1, x);
        if (x.coeff.isEqualTo(0) || this.coeff.isEqualTo(0)) return x.coeff.isEqualTo(0) && this.coeff.isEqualTo(0);
        return this.n === x.n && this.radicand.isEqualTo(x.radicand) && this.coeff.isEqualTo(x.coeff);
    }
    /**
	 * @returns true if this NthRoot represents a rational number
	 */ isRational() {
        return this.radicand.valueOf() === 1 || this.radicand.valueOf() === 0;
    }
    /**
	 * if this NthRoot is a rational number, returns the rational number as a `Fraction` instance.
	 *
	 * Warning: throws if NthRoot is not a rational number.
	 */ toFraction() {
        if (!this.isRational()) throw new Error("NthRoot is not a rational number");
        return this.coeff.clone();
    }
    toPrecision(precision) {
        return `${Number(this.valueOf().toPrecision(precision))}`;
    }
    toFixed(digits) {
        return this.valueOf().toFixed(digits);
    }
    clone() {
        return new $54e5ac5d13ec125e$export$dc386df03dfad113(this.n, this.radicand.clone(), this.coeff.clone());
    }
}
class $54e5ac5d13ec125e$export$598b1075f1324aa extends $54e5ac5d13ec125e$export$dc386df03dfad113 {
    //// constructor
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
	 */ constructor(radicand, coeff = 1){
        if (radicand.valueOf() < 0) throw new Error("radicand must be non-negative");
        // 'rationalize'
        coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
        if (typeof radicand !== "number") {
            const c = radicand.den;
            radicand = radicand.num * c;
            coeff = coeff.divide(c);
        }
        // extract powers
        const [a, b] = $54e5ac5d13ec125e$var$extractPowers(radicand);
        coeff = coeff.times(a);
        radicand = b;
        super(2, radicand, coeff);
        // edge cases for typesetting
        this.kind = "sqrtTerm";
    }
    times(x) {
        if (typeof x === "number" || x instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) x = new $54e5ac5d13ec125e$export$598b1075f1324aa(1, x);
        if (!(x instanceof $54e5ac5d13ec125e$export$598b1075f1324aa)) return super.times(x);
        else return new $54e5ac5d13ec125e$export$598b1075f1324aa(this.radicand.times(x.radicand), this.coeff.times(x.coeff));
    }
    /**
	 * radical division: a_1 \sqrt[n]{b_1} / a_2 \sqrt[n]{b_2} = a_1 / a_2 * \sqrt[n]{b_1 / b_2}$
	 */ divide(x) {
        x = (0, $23160e13dd404e1b$export$d991e3d99172da5e)(x);
        return new $54e5ac5d13ec125e$export$598b1075f1324aa(this.radicand.divide(x.radicand), this.coeff.divide(x.coeff));
    }
    /**
	 * addition of radicals: only work for same radicand currently
	 */ plus(x) {
        if (this.isEqualTo(0)) return x;
        if (x.isEqualTo(0)) return this;
        if (this.radicand.isEqualTo(x.radicand)) return new $54e5ac5d13ec125e$export$598b1075f1324aa(this.radicand, this.coeff.plus(x.coeff));
        throw new Error(`${x} and ${this} have different radicands. Consider using an Expression class`);
    }
    /**
	 * subtraction of radicals: only work for same radicand currently
	 */ minus(x) {
        return this.plus(x.negative());
    }
    /**
	 * @returns negative of this SquareRoot
	 */ negative() {
        return new $54e5ac5d13ec125e$export$598b1075f1324aa(this.radicand.clone(), this.coeff.negative());
    }
    /**
	 * exponentiation
	 *
	 * @param n non-negative integer
	 * @returns this NthRoot to the power of n
	 */ pow(n) {
        if (!Number.isInteger(n) || n < 0) throw new Error("n must be a non-negative integer");
        return new $54e5ac5d13ec125e$export$598b1075f1324aa(this.radicand.pow(n), this.coeff.pow(n));
    }
    abs() {
        return new $54e5ac5d13ec125e$export$598b1075f1324aa(this.radicand, this.coeff.abs());
    }
    square() {
        return this.coeff.pow(2).times(this.radicand);
    }
    /**
	 * @returns the reciprocal this SquareRoot
	 */ reciprocal() {
        return new $54e5ac5d13ec125e$export$598b1075f1324aa(this.radicand.reciprocal(), this.coeff.reciprocal());
    }
    clone() {
        return new $54e5ac5d13ec125e$export$598b1075f1324aa(this.radicand.clone(), this.coeff.clone());
    }
    /**
	 * the number one in SquareRoot class
	 */ static ONE = new $54e5ac5d13ec125e$export$598b1075f1324aa(1);
    toJSON() {
        return {
            type: "squareRoot",
            args: [
                this.radicand.toJSON(),
                this.coeff.toJSON()
            ]
        };
    }
}
/**
 * takes an integer x, and returns [a, b] such that x = a^n b and b is n-power free (up to 100)
 * */ function $54e5ac5d13ec125e$var$extractPowers(x, n = 2, y = 1) {
    //if (!Number.isInteger(n) || n < 2) {
    //  throw 'n must be an integer more than 2';
    //}
    if (x == 0) return [
        0,
        0
    ];
    // primes up to 100
    const primes = [
        2,
        3,
        5,
        7,
        11,
        13,
        17,
        19,
        23,
        29,
        31,
        37,
        41,
        43,
        47,
        53,
        59,
        61,
        67,
        71,
        73,
        79,
        83,
        89,
        97
    ];
    for (const prime of primes){
        if (x % Math.pow(prime, n) === 0) return $54e5ac5d13ec125e$var$extractPowers(x / Math.pow(prime, n), n, y * prime);
        else if (x < Math.pow(prime, n)) break;
    }
    return [
        y,
        x
    ];
}


function $0ad02af7964cc0d0$export$f5b5744fa2c312e3(n, x) {
    if (typeof x === "number" || x instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) return new (0, $54e5ac5d13ec125e$export$dc386df03dfad113)(n, 1, x);
    return x.clone();
}





class $7811ac8504c01765$export$bacc3050bcb5570 extends (0, $2d5ae0e4f85ad95c$export$2d8ad6e0bc55950e) {
    constructor(radicand){
        if (!(radicand >= 0 && Number.isInteger(radicand))) throw new RangeError(`${radicand} must be a non-negative integer for the Surd class`);
        super(`\\sqrt{${radicand}}`);
        this.kind = "surd";
        this.radicand = radicand;
    }
    toJSON() {
        return {
            type: "surd",
            args: [
                this.radicand
            ]
        };
    }
}
class $7811ac8504c01765$export$37c5252633151bef extends (0, $2d5ae0e4f85ad95c$export$2d8ad6e0bc55950e) {
    constructor(n, radicand){
        if (!(n >= 2 && Number.isInteger(n))) throw new RangeError(`${n} must be a integer >= 2 for the NthRootSymbol class`);
        radicand = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(radicand);
        super(`\\sqrt[${n}]{${radicand}}`);
        this.kind = "rootSymbol";
        this.radicand = radicand;
        this.n = n;
    }
    toJSON() {
        return {
            type: "rootSymbol",
            args: [
                this.n,
                this.radicand.toJSON()
            ]
        };
    }
}



class $60b13a6be04206e3$export$d5439f8590acfb59 extends (0, $2d5ae0e4f85ad95c$export$2d8ad6e0bc55950e) {
    constructor(){
        super("\\mathrm{i}");
        this.kind = "imaginarySymbol";
    }
    toJSON() {
        return {
            type: "imaginarySymbol",
            args: []
        };
    }
}








class $dde9ae70d19cc36f$export$bfe37c1342e5eb83 {
    /** array of terms making up the expression */ terms = [];
    /**
	 * Creates a new Expression
	 * @param args one or more `Term`s
	 * `number` and `Fraction` types will be transformed into constant terms,
	 *  while `string` type will be transformed into a term with coefficient 1
	 */ constructor(...args){
        let terms = [];
        let kind = "expression";
        args.forEach((x)=>{
            if (typeof x === "object" && "expressionKind" in x) kind = x.expressionKind;
            else {
                const xTerm = x instanceof (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131) || x instanceof (0, $54e5ac5d13ec125e$export$598b1075f1324aa) ? x : new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(x);
                const i = terms.findIndex((y)=>y.isLike(xTerm));
                if (i === -1) terms.push(xTerm);
                else terms = [
                    ...terms.slice(0, i),
                    terms[i].plus(xTerm),
                    ...terms.slice(i + 1)
                ];
            }
        });
        this.terms = terms.filter((x)=>!x.coeff.isEqualTo(0));
        this.kind = kind;
    }
    /**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the terms
	 */ toString() {
        if (this.terms.length === 0) return "0";
        let outputString = this.terms[0].toString();
        this.terms.slice(1).forEach((term)=>{
            outputString += term.coeff.isGreaterThan(0) ? ` + ${term}` : ` ${term}`;
        });
        return outputString;
    }
    /**
	 * toJSON method that allows for quick reconstruction of class instance
	 * by storing its constructor arguments
	 */ toJSON() {
        return {
            type: "expression",
            args: this.terms
        };
    }
    /**
	 * performs scalar multiplication on each term of this
	 */ times(k) {
        if (!(k instanceof $dde9ae70d19cc36f$export$bfe37c1342e5eb83)) {
            const terms = this.terms.map((term)=>term.times(k));
            return new $dde9ae70d19cc36f$export$bfe37c1342e5eb83(...terms);
        }
        return k.terms.reduce((exp, term)=>exp.plus(this.times(term)), new $dde9ae70d19cc36f$export$bfe37c1342e5eb83(0));
    }
    divide(x) {
        if (x instanceof $dde9ae70d19cc36f$export$bfe37c1342e5eb83) throw new RangeError(`division by Expression not supported at the moment`);
        return new $dde9ae70d19cc36f$export$bfe37c1342e5eb83(...this.terms.map((y)=>y.divide(x)));
    }
    /** applies negative to square root and imaginary terms */ //conjugate(): Expression {
    //	const terms = this.terms.map((term) => term.conjugate());
    //	return new Expression(...terms);
    //}
    negative() {
        return new $dde9ae70d19cc36f$export$bfe37c1342e5eb83(...this.terms.map((term)=>term.negative()));
    }
    pow(n) {
        if (!Number.isInteger(n) || n < 0) throw new Error("Exponent must be a non-negative integer");
        let exp = new $dde9ae70d19cc36f$export$bfe37c1342e5eb83(1);
        for(let i = 0; i < n; i++)exp = exp.times(this);
        return exp;
    }
    square() {
        return this.pow(2);
    }
    subIn(x) {
        return this.terms.reduce((sum, term)=>sum.plus(term.subIn(x)), new (0, $f182971f6d253900$export$b336c2702c498be5)(0));
    }
    subInNumber(x) {
        return this.terms.reduce((sum, term)=>sum + term.subInNumber(x), 0);
    }
    valueOf() {
        return this.terms.reduce((sum, term)=>sum + term.valueOf(), 0);
    }
    /**
	 * adds the two expressions,
	 * similar to concatenating the terms in the two expressions, combining like terms
	 *
	 * @returns the sum
	 */ plus(newExpression) {
        return newExpression instanceof $dde9ae70d19cc36f$export$bfe37c1342e5eb83 ? new $dde9ae70d19cc36f$export$bfe37c1342e5eb83(...this.terms, ...newExpression.terms) : new $dde9ae70d19cc36f$export$bfe37c1342e5eb83(...this.terms, newExpression);
    }
    /**
	 * subtracts this expression by the given expression
	 *
	 * @returns the difference
	 */ minus(newExpression) {
        if (!(newExpression instanceof $dde9ae70d19cc36f$export$bfe37c1342e5eb83)) newExpression = new $dde9ae70d19cc36f$export$bfe37c1342e5eb83(newExpression);
        return this.plus(newExpression.times(-1));
    }
    /**
	 * clones the object, creating a new instance of this expression
	 */ clone() {
        const newTerms = this.terms.map((term)=>term.clone());
        return new $dde9ae70d19cc36f$export$bfe37c1342e5eb83(...newTerms);
    }
}







class $1d2ed8d2c70a3abb$export$d705d4e10ac18d72 extends (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83) {
    /**
	 * Creates a new Polynomial instance
	 * @param coeffs array of coefficients. if a number/fraction is provided, will create the polynomial "kx".
	 * @param options defaults to `{ascending: false, degree: coeffs.length-1, variable: 'x'}`
	 */ constructor(coeffs, options){
        let variableDefault = "x";
        if (!Array.isArray(coeffs)) {
            if (typeof coeffs === "string") {
                variableDefault = coeffs;
                coeffs = options?.ascending ? [
                    0,
                    1
                ] : [
                    1,
                    0
                ];
            } else coeffs = options?.ascending ? [
                0,
                coeffs
            ] : [
                coeffs,
                0
            ];
        }
        const { variable: variable , ascending: ascending , degree: degree  } = {
            ascending: false,
            degree: coeffs.length - 1,
            variable: variableDefault,
            ...options
        };
        if (degree < 0 || degree < coeffs.length - 1) throw new RangeError("degree must be greater than coefficients.length-1");
        // reverse coefficient array if descending order
        if (!ascending) coeffs = [
            ...coeffs
        ].reverse();
        // add extra zeros to start from constant term
        if (degree > coeffs.length - 1) {
            const extraCoeffLength = degree - coeffs.length + 1;
            coeffs = [
                ...$1d2ed8d2c70a3abb$export$deba95bbb8548da(extraCoeffLength),
                ...coeffs
            ];
        }
        // convert to Fraction type
        let coeffsFrac = coeffs.map((0, $2aab13bad14c4123$export$98fc78f39c2afd39));
        // remove unnecessary terms (leading coefficients should be non-zero, unless it is a constant polynomial)
        while(coeffsFrac[coeffsFrac.length - 1].isEqualTo(0) && coeffsFrac.length > 1)coeffsFrac.pop();
        // generate variable terms
        const polynomialTerms = coeffsFrac.map((coeff, n)=>{
            return new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(coeff, [
                variable,
                n
            ]);
        });
        // descending order typesetting if necessary;
        if (!ascending) polynomialTerms.reverse();
        super(...polynomialTerms);
        this.coeffs = coeffsFrac;
        this.degree = coeffsFrac.length - 1;
        this.variable = variable;
        this.ascending = ascending;
    }
    /** add two polynomials
	 *
	 * fraction/numbers will be converted a "constant polynomial", while a string will be converted to a polynomial term with coefficient 1
	 */ plus(p2) {
        p2 = $1d2ed8d2c70a3abb$var$toPolynomial(p2);
        const degree = Math.max(this.degree, p2.degree);
        const thisCoeffs = [
            ...this.coeffs,
            ...$1d2ed8d2c70a3abb$export$deba95bbb8548da(degree - this.degree)
        ];
        const p2Coeffs = [
            ...p2.coeffs,
            ...$1d2ed8d2c70a3abb$export$deba95bbb8548da(degree - p2.degree)
        ];
        const newCoeffs = thisCoeffs.map((thisCoeff, i)=>thisCoeff.plus(p2Coeffs[i]));
        if (!this.ascending) newCoeffs.reverse();
        return new $1d2ed8d2c70a3abb$export$d705d4e10ac18d72(newCoeffs, {
            variable: this.variable,
            ascending: this.ascending,
            degree: degree
        });
    }
    /** multiplies two polynomials */ times(p2) {
        p2 = $1d2ed8d2c70a3abb$var$toPolynomial(p2);
        const degree = this.degree + p2.degree;
        const coeffs = $1d2ed8d2c70a3abb$export$deba95bbb8548da(degree + 1);
        for(let i = 0; i < this.coeffs.length; i++)for(let j = 0; j < p2.coeffs.length; j++)coeffs[i + j] = coeffs[i + j].plus(this.coeffs[i].times(p2.coeffs[j]));
        if (!this.ascending) coeffs.reverse();
        return new $1d2ed8d2c70a3abb$export$d705d4e10ac18d72(coeffs, {
            ascending: this.ascending,
            degree: degree,
            variable: this.variable
        });
    }
    /** negative of this polynomial */ negative() {
        return this.times(-1);
    }
    /**
	 * divide by a *scalar*
	 */ divide(p2) {
        p2 = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(p2);
        return this.times(p2.reciprocal());
    }
    /** subtracts this by p2 */ minus(p2) {
        p2 = $1d2ed8d2c70a3abb$var$toPolynomial(p2);
        return this.plus(p2.times(-1));
    }
    /**
	 * exponentiation
	 * @returns this polynomial taken to a power of `n`
	 */ pow(n) {
        if (!(Number.isInteger(n) && n >= 0)) throw new RangeError(`only non-negative integers allowed for n (${n} received)`);
        let newPoly = new $1d2ed8d2c70a3abb$export$d705d4e10ac18d72([
            1
        ], {
            variable: this.variable,
            ascending: this.ascending
        });
        for(let i = 0; i < n; i++)newPoly = newPoly.times(this);
        return newPoly;
    }
    /**
	 * replace x with a new polynomial
	 * @param x if string, replaces the variable
	 */ replaceXWith(x) {
        x = typeof x === "string" ? new $1d2ed8d2c70a3abb$export$d705d4e10ac18d72([
            1,
            0
        ], {
            variable: x
        }) : x;
        return this.coeffs.reduce((prev, coeff, i)=>prev.plus(x.pow(i).times(coeff)), new $1d2ed8d2c70a3abb$export$d705d4e10ac18d72([
            0
        ], {
            ascending: this.ascending,
            variable: x.variable
        }));
    }
    /**
	 * replace x with x+k
	 */ shift(k) {
        return this.replaceXWith(new $1d2ed8d2c70a3abb$export$d705d4e10ac18d72([
            1,
            k
        ], {
            ascending: this.ascending,
            variable: this.variable
        }));
    }
    /**
	 * square
	 *
	 * @returns the square of this polynomial
	 *  */ square() {
        return this.pow(2);
    }
    /**
	 * returns a polynomial with positive leading coefficient and gcd(...coeffs) = 1
	 * */ simplify() {
        const [newCoeffs] = (0, $f182971f6d253900$export$b336c2702c498be5).factorize(...this.coeffs);
        return new $1d2ed8d2c70a3abb$export$d705d4e10ac18d72(newCoeffs, {
            ascending: true,
            variable: this.variable
        }).changeAscending(this.ascending);
    }
    subInSurd(x) {
        const xSurd = typeof x === "number" ? new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(1, x) : x;
        const terms = this.coeffs.map((a, i)=>xSurd.pow(i).times(a));
        return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(...terms);
    }
    /**
	 * changes ascending/behavior of polynomial
	 *
	 * @param ascending sets ascending behavior. By default, this
	 * option is set to toggle current ascending/descending behavior
	 *
	 * @returns a reference to this polynomial instance
	 *
	 * WARNING: mutates current instance
	 */ changeAscending(ascending = !this.ascending) {
        if (this.ascending === ascending) return this;
        this.terms.reverse();
        this.ascending = ascending;
        return this;
    }
    /** derivative of the polynomial */ differentiate() {
        if (this.degree === 0) return new $1d2ed8d2c70a3abb$export$d705d4e10ac18d72([
            0
        ]);
        const newCoeffs = this.coeffs.map((coeff, i)=>coeff.times(i)).slice(1);
        const newPoly = new $1d2ed8d2c70a3abb$export$d705d4e10ac18d72(newCoeffs, {
            ascending: true,
            variable: this.variable
        });
        return this.ascending ? newPoly : newPoly.changeAscending();
    }
    /** integral of the polynomial
	 * @param options `{c, x1, y1}` where we can put in the integration constant c (defaults to 0),
	 * or a point on the curve (x1, y1).
	 */ integrate(options) {
        let c = options?.c ?? 0;
        if (this.degree === 0) return new $1d2ed8d2c70a3abb$export$d705d4e10ac18d72([
            this.coeffs[0],
            c
        ]);
        const newCoeffs = [
            0,
            ...this.coeffs.map((coeff, i)=>coeff.divide(i + 1))
        ];
        const newPoly = new $1d2ed8d2c70a3abb$export$d705d4e10ac18d72(newCoeffs, {
            ascending: true,
            variable: this.variable
        });
        const { x1: x1 , y1: y1  } = {
            ...options
        };
        if (x1 !== undefined && y1 !== undefined) c = newPoly.subIn(x1).negative().plus(y1);
        const polyWithC = newPoly.plus(c);
        return this.ascending ? polyWithC : polyWithC.changeAscending();
    }
    /** definite integral (fraction form)*/ definiteIntegral(lower, upper) {
        const integral = this.integrate();
        return integral.subIn(upper).minus(integral.subIn(lower));
    }
    /** definite integral (number form) */ definiteIntegralNumber(lower, upper) {
        if (typeof lower !== "number") lower = lower.valueOf();
        if (typeof upper !== "number") upper = upper.valueOf();
        const integral = this.integrate();
        return integral.subInNumber(upper) - integral.subInNumber(lower);
    }
    /**
	 * @returns an ascending polynomial only up until degree n
	 */ concatenate(n) {
        const coeffs = this.coeffs.slice(0, n + 1);
        return new $1d2ed8d2c70a3abb$export$d705d4e10ac18d72(coeffs, {
            ascending: true,
            variable: this.variable
        });
    }
    /** checks if two polynomials are equal: i.e., coefficient array is the same and same variable */ isEqualTo(poly2) {
        if (this.variable === poly2.variable) {
            if (this.coeffs.length === poly2.coeffs.length) {
                let valid = true;
                this.coeffs.forEach((coeff, i)=>{
                    if (!coeff.isEqualTo(poly2.coeffs[i])) valid = false;
                });
                return valid;
            }
        }
        return false;
    }
    /** clones this polynomial */ clone() {
        const coeffs = [
            ...this.coeffs
        ];
        if (!this.ascending) // coeffs in ascending by default
        coeffs.reverse();
        return new $1d2ed8d2c70a3abb$export$d705d4e10ac18d72(coeffs, {
            ascending: this.ascending,
            degree: this.degree,
            variable: this.variable
        });
    }
    /**
	 * toJSON method that allows for quick reconstruction of class instance
	 * by storing its constructor arguments
	 */ toJSON() {
        const coeffs = this.coeffs.map((e)=>e.clone());
        if (!this.ascending) coeffs.reverse();
        return {
            type: "polynomial",
            args: [
                coeffs,
                {
                    ascending: this.ascending,
                    degree: this.degree,
                    variable: this.variable
                }
            ]
        };
    }
}
function $1d2ed8d2c70a3abb$export$deba95bbb8548da(n) {
    let zeroArray = [];
    for(let i = 0; i < n; i++)zeroArray.push((0, $f182971f6d253900$export$b336c2702c498be5).ZERO);
    return zeroArray;
}
function $1d2ed8d2c70a3abb$var$toPolynomial(p2) {
    if (typeof p2 === "number" || p2 instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) return new $1d2ed8d2c70a3abb$export$d705d4e10ac18d72([
        p2
    ]);
    if (typeof p2 === "string") return new $1d2ed8d2c70a3abb$export$d705d4e10ac18d72([
        1,
        0
    ], {
        variable: p2
    });
    return p2;
}










class $2977af7a6fa47f89$export$9b781de7bf37bf48 {
    /**
	 * creates a new Vector instance
	 *
	 * @param options defaults to `{coeff: 1, simplify: false, stretchable: false}`
	 *  if `simplify` is `true`, then we will factorize our expression such that
	 *  x,y,z are integers with gcd 1.
	 *  if `stretchable` is set to true, then we will `simplify` and then
	 *  set `coeff` to be 1
	 *
	 */ constructor(x, y, z, options){
        x = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(x);
        y = y === undefined ? (0, $f182971f6d253900$export$b336c2702c498be5).ZERO : (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(y);
        z = z === undefined ? (0, $f182971f6d253900$export$b336c2702c498be5).ZERO : (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(z);
        let { coeff: coeff , simplify: simplify , stretchable: stretchable  } = {
            coeff: (0, $f182971f6d253900$export$b336c2702c498be5).ONE,
            simplify: false,
            stretchable: false,
            ...options
        };
        coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
        if (stretchable || simplify) {
            [[x, y, z], coeff] = (0, $f182971f6d253900$export$b336c2702c498be5).factorize(x, y, z);
            coeff = stretchable ? (0, $f182971f6d253900$export$b336c2702c498be5).ONE : coeff;
        }
        this.x = coeff.isEqualTo(0) ? (0, $f182971f6d253900$export$b336c2702c498be5).ZERO : x;
        this.y = coeff.isEqualTo(0) ? (0, $f182971f6d253900$export$b336c2702c498be5).ZERO : y;
        this.z = coeff.isEqualTo(0) ? (0, $f182971f6d253900$export$b336c2702c498be5).ZERO : z;
        this.coeff = coeff.isEqualTo(0) ? (0, $f182971f6d253900$export$b336c2702c498be5).ONE : coeff;
    }
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
	 */ simplify(options = {
        stretchable: false
    }) {
        const stretchable = options.stretchable;
        if (!this.isZero()) {
            let [[x, y, z], coeff] = (0, $f182971f6d253900$export$b336c2702c498be5).factorize(this.x, this.y, this.z);
            this.x = x;
            this.y = y;
            this.z = z;
            this.coeff = stretchable ? (0, $f182971f6d253900$export$b336c2702c498be5).ONE : coeff.times(this.coeff);
        }
        return this;
    }
    /**
	 * returns the unit vector parallel to this vector
	 *
	 * WARNING: only works if magnitude is integer
	 */ hat() {
        const mag = this.magnitude();
        if (!mag.isRational() || mag.isEqualTo(0)) throw new Error(`only integer magnitude supported: ${mag}`);
        return this.divide(mag.coeff);
    }
    /**
	 * Expands the coeff, taking this k(x,y,z) and
	 * returning (kx, ky, kz)
	 */ expand() {
        return new $2977af7a6fa47f89$export$9b781de7bf37bf48(this.coeff.times(this.x), this.coeff.times(this.y), this.coeff.times(this.z));
    }
    /**
	 * @returns the dot product
	 */ dot(v2) {
        return this.coeff.times(v2.coeff).times(this.x.times(v2.x).plus(this.y.times(v2.y)).plus(this.z.times(v2.z)));
    }
    /**
	 * @returns the magnitude squared of this vector
	 */ magnitudeSquare() {
        return this.dot(this);
    }
    /**
	 * @returns the magnitude as a SquareRoot class
	 */ magnitude() {
        return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(this.magnitudeSquare());
    }
    /**
	 * @returns if the vector is a zero vector
	 */ isZero() {
        return this.magnitudeSquare().isEqualTo(0);
    }
    /**
	 * vector addition
	 *
	 * if the coeffs are the same, will retain the same coeff
	 *
	 * if the coeffs are different, will expand them in before performing addition
	 */ plus(v2, options) {
        if (this.coeff.isEqualTo(v2.coeff)) return new $2977af7a6fa47f89$export$9b781de7bf37bf48(this.x.plus(v2.x), this.y.plus(v2.y), this.z.plus(v2.z), options);
        else return this.expand().plus(v2.expand(), options);
    }
    /**
	 * returns the negative of this vector
	 *
	 * @param options default to `{multiplyIntoCoeff: false}`
	 * the coeff stays the same while the components are made negative
	 * if false, the coeff is made negative instead
	 */ negative(options = {
        multiplyIntoCoeff: false
    }) {
        return options.multiplyIntoCoeff ? new $2977af7a6fa47f89$export$9b781de7bf37bf48(this.x, this.y, this.z, {
            coeff: this.coeff.negative()
        }) : new $2977af7a6fa47f89$export$9b781de7bf37bf48(this.x.negative(), this.y.negative(), this.z.negative(), {
            coeff: this.coeff
        });
    }
    /**
	 * vector subtraction
	 */ minus(v2) {
        return this.plus(v2.negative());
    }
    /**
	 * scalar multiplication
	 *
	 * by default, the coeff stays the same while the components are multiplied
	 * if false, the coeff is multiplied instead
	 *
	 * @param options defaults to `{multiplyIntoCoeff: false}`
	 */ multiply(k, options = {
        multiplyIntoCoeff: false
    }) {
        return options.multiplyIntoCoeff ? new $2977af7a6fa47f89$export$9b781de7bf37bf48(this.x, this.y, this.z, {
            coeff: this.coeff.times(k)
        }) : new $2977af7a6fa47f89$export$9b781de7bf37bf48(this.x.times(k), this.y.times(k), this.z.times(k), {
            coeff: this.coeff
        });
    }
    /**
	 * scalar division
	 *
	 * by default, the coeff stays the same while the components are multiplied
	 * if false, the coeff is multiplied instead
	 *
	 * @param options defaults to `{multiplyIntoCoeff: false}`
	 */ divide(k, options = {
        multiplyIntoCoeff: false
    }) {
        return options.multiplyIntoCoeff ? new $2977af7a6fa47f89$export$9b781de7bf37bf48(this.x, this.y, this.z, {
            coeff: this.coeff.divide(k)
        }) : new $2977af7a6fa47f89$export$9b781de7bf37bf48(this.x.divide(k), this.y.divide(k), this.z.divide(k), {
            coeff: this.coeff
        });
    }
    /**
	 * @returns the cross product (this cross v2)
	 */ cross(v2, options) {
        const coeff = this.coeff.times(v2.coeff);
        const x = this.y.times(v2.z).minus(this.z.times(v2.y));
        const y = this.z.times(v2.x).minus(this.x.times(v2.z));
        const z = this.x.times(v2.y).minus(this.y.times(v2.x));
        return new $2977af7a6fa47f89$export$9b781de7bf37bf48(x, y, z, {
            coeff: coeff,
            ...options
        });
    }
    /**
	 * checks if this is perpendicular to v2
	 */ isPerpendicularTo(v2) {
        return this.dot(v2).isEqualTo(0);
    }
    /**
	 * checks if this is parallel to v2
	 */ isParallelTo(v2) {
        return this.cross(v2).isZero();
    }
    /**
	 * @returns latex string representing the vector in column vector form
	 */ toString() {
        if (this.isZero()) return `\\begin{pmatrix}\n\t0 \\\\\n\t0 \\\\\n\t0\n\\end{pmatrix}`;
        const columnVector = `\\begin{pmatrix}\n\t${this.x} \\\\\n\t${this.y} \\\\\n\t${this.z}\n\\end{pmatrix}`;
        const term = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(this.coeff, columnVector);
        return `${term}`;
    }
    /**
	 * @returns latex string representing the vector in ijk notation
	 */ toIJKString() {
        if (this.isZero()) return "\\mathbf{0}";
        const expression = new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(this.x, "\\mathbf{i}"), new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(this.y, "\\mathbf{j}"), new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(this.z, "\\mathbf{k}"));
        const expressionString = this.coeff.isEqualTo(1) ? `${expression}` : `\\left( ${expression} \\right)`;
        const term = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(this.coeff, expressionString);
        return `${term}`;
    }
    /**
	 * @returns (kx, ky, kz) as a coordinate triple.
	 *
	 * @param name The name of the point which is attached to the front of the coordinates
	 */ toCoordinates(name = "") {
        const v = this.expand();
        return `${name}${name === "" ? "" : " "}\\left( ${v.x}, ${v.y}, ${v.z} \\right)`;
    }
    /**
	 * checks if two vectors are equal
	 */ isEqualTo(v2) {
        return this.minus(v2).magnitudeSquare().isEqualTo(0);
    }
    /**
	 * @returns angle between two vectors as a string in degrees
	 *
	 * @param options default to {acute: false, sineMode: false}
	 */ angleTo(v2, options) {
        let cosSquare = this.dot(v2).square().divide(this.magnitudeSquare()).divide(v2.magnitudeSquare());
        const { acute: acute , sineMode: sineMode  } = {
            acute: false,
            sineMode: false,
            ...options
        };
        if (cosSquare.isEqualTo(1)) return sineMode ? "90^\\circ" : "0^\\circ";
        else if (cosSquare.isEqualTo(new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2))) return sineMode || acute || this.dot(v2).isGreaterThan(0) ? "45^\\circ" : "135^\\circ";
        else if (cosSquare.isEqualTo(0)) return sineMode ? "0^\\circ" : "90^\\circ";
        else {
            const alpha = Math.acos(Math.sqrt(cosSquare.valueOf())) * 180 / Math.PI;
            if (sineMode) {
                const theta = 90 - alpha;
                return `${theta.toFixed(1)}^\\circ`;
            } else {
                const theta1 = acute || this.dot(v2).isGreaterThan(0) ? alpha : 180 - alpha;
                return `${theta1.toFixed(1)}^\\circ`;
            }
        }
    }
    /**
	 * clones a new instance of this vector
	 */ clone() {
        return new $2977af7a6fa47f89$export$9b781de7bf37bf48(this.x, this.y, this.z, {
            coeff: this.coeff
        });
    }
    toJSON() {
        return {
            type: "vector",
            args: [
                this.x.toJSON(),
                this.y.toJSON(),
                this.z.toJSON(),
                {
                    coeff: this.coeff.toJSON()
                }
            ]
        };
    }
    ////
    // static properties
    ////
    /**
	 * the zero vector
	 */ static ZERO = new $2977af7a6fa47f89$export$9b781de7bf37bf48(0);
    /**
	 * the x-axis unit vector (1,0,0)
	 */ static I = new $2977af7a6fa47f89$export$9b781de7bf37bf48(1);
    /**
	 * the y-axis unit vector (0,1,0)
	 */ static J = new $2977af7a6fa47f89$export$9b781de7bf37bf48(0, 1);
    /**
	 * the z-axis unit vector (0,0,1)
	 */ static K = new $2977af7a6fa47f89$export$9b781de7bf37bf48(0, 0, 1);
    /**
	 * ratio theorem
	 */ static Ratio(v1, v2, options) {
        let { lambda: lambda , mu: mu  } = {
            lambda: 1,
            mu: 1,
            ...options
        };
        lambda = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(lambda);
        mu = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(mu);
        return v2.multiply(lambda).plus(v1.multiply(mu)).divide(lambda.plus(mu));
    }
}




function $d2837f1711b34bdd$export$a04698f914c55ed9(...args) {
    if (args.length === 4) return args[0] * args[3] - args[1] * args[2];
    else if (args.length === 9) return args[0] * $d2837f1711b34bdd$export$a04698f914c55ed9(args[4], args[5], args[7], args[8]) - args[1] * $d2837f1711b34bdd$export$a04698f914c55ed9(args[3], args[5], args[6], args[8]) + args[2] * $d2837f1711b34bdd$export$a04698f914c55ed9(args[3], args[4], args[6], args[7]);
    else throw new Error("determinant: only 2x2 or 3x3 matrices supported");
}
function $d2837f1711b34bdd$export$763b2dcbd9a72363(...args) {
    // 0 1 2   3
    // 4 5 6   7
    // 8 9 10 11
    // 12 13 14 15 - + - +
    const argsFrac = args.map((arg)=>(0, $2aab13bad14c4123$export$98fc78f39c2afd39)(arg));
    const a = argsFrac[12].times($d2837f1711b34bdd$export$e6674eb1322665bd(...argsFrac.slice(1, 4), ...argsFrac.slice(5, 8), ...argsFrac.slice(9, 12)));
    const b = argsFrac[13].times($d2837f1711b34bdd$export$e6674eb1322665bd(argsFrac[0], ...argsFrac.slice(2, 5), ...argsFrac.slice(6, 9), ...argsFrac.slice(10, 12)));
    const c = argsFrac[14].times($d2837f1711b34bdd$export$e6674eb1322665bd(...argsFrac.slice(0, 2), ...argsFrac.slice(3, 6), ...argsFrac.slice(7, 10), ...argsFrac.slice(11, 12)));
    const d = argsFrac[15].times($d2837f1711b34bdd$export$e6674eb1322665bd(...argsFrac.slice(0, 3), ...argsFrac.slice(4, 7), ...argsFrac.slice(8, 11)));
    return a.negative().plus(b).minus(c).plus(d);
}
function $d2837f1711b34bdd$export$e6674eb1322665bd(...args) {
    const argsFrac = args.map((arg)=>(0, $2aab13bad14c4123$export$98fc78f39c2afd39)(arg));
    if (argsFrac.length === 4) return argsFrac[0].times(argsFrac[3]).minus(argsFrac[1].times(argsFrac[2]));
    else if (argsFrac.length === 9) {
        const a = argsFrac[0].times($d2837f1711b34bdd$export$e6674eb1322665bd(argsFrac[4], argsFrac[5], argsFrac[7], argsFrac[8]));
        const b = argsFrac[1].times($d2837f1711b34bdd$export$e6674eb1322665bd(argsFrac[3], argsFrac[5], argsFrac[6], argsFrac[8]));
        const c = argsFrac[2].times($d2837f1711b34bdd$export$e6674eb1322665bd(argsFrac[3], argsFrac[4], argsFrac[6], argsFrac[7]));
        return a.minus(b).plus(c);
    } else throw new Error("determinant: only 2x2 or 3x3 matrices supported");
}


function $195096b30d4dc5c6$export$89645a02957ec204(...args) {
    if (args.length === 6) {
        const detA = (0, $d2837f1711b34bdd$export$a04698f914c55ed9)(...args.slice(0, 2), ...args.slice(3, 5));
        if (detA === 0) throw new Error("determinant 0: no roots found");
        const detX = (0, $d2837f1711b34bdd$export$a04698f914c55ed9)(args[2], args[1], args[5], args[4]);
        const detY = (0, $d2837f1711b34bdd$export$a04698f914c55ed9)(args[0], args[2], args[3], args[5]);
        return [
            detX / detA,
            detY / detA
        ];
    } else if (args.length === 12) {
        const detA1 = (0, $d2837f1711b34bdd$export$a04698f914c55ed9)(...args.slice(0, 3), ...args.slice(4, 7), ...args.slice(8, 11));
        if (detA1 === 0) throw new Error("determinant 0: no roots found");
        const detX1 = (0, $d2837f1711b34bdd$export$a04698f914c55ed9)(args[3], ...args.slice(1, 3), args[7], ...args.slice(5, 7), args[11], ...args.slice(9, 11));
        const detY1 = (0, $d2837f1711b34bdd$export$a04698f914c55ed9)(args[0], args[3], args[2], args[4], args[7], args[6], args[8], args[11], args[10]);
        const detZ = (0, $d2837f1711b34bdd$export$a04698f914c55ed9)(...args.slice(0, 2), args[3], ...args.slice(4, 6), args[7], ...args.slice(8, 10), args[11]);
        return [
            detX1 / detA1,
            detY1 / detA1,
            detZ / detA1
        ];
    } else throw new Error("only 2x2 (6 arguments) and 3x3 (12 arguments) equations are supported");
}
function $195096b30d4dc5c6$export$496373a15df62289(...args) {
    if (args.length === 6) {
        const detA = (0, $d2837f1711b34bdd$export$e6674eb1322665bd)(...args.slice(0, 2), ...args.slice(3, 5));
        if (detA.isEqualTo(0)) throw new Error("determinant 0: no roots found");
        const detX = (0, $d2837f1711b34bdd$export$e6674eb1322665bd)(args[2], args[1], args[5], args[4]);
        const detY = (0, $d2837f1711b34bdd$export$e6674eb1322665bd)(args[0], args[2], args[3], args[5]);
        return [
            detX.divide(detA),
            detY.divide(detA)
        ];
    } else if (args.length === 12) {
        const detA1 = (0, $d2837f1711b34bdd$export$e6674eb1322665bd)(...args.slice(0, 3), ...args.slice(4, 7), ...args.slice(8, 11));
        if (detA1.isEqualTo(0)) throw new Error("determinant 0: no roots found");
        const detX1 = (0, $d2837f1711b34bdd$export$e6674eb1322665bd)(args[3], ...args.slice(1, 3), args[7], ...args.slice(5, 7), args[11], ...args.slice(9, 11));
        const detY1 = (0, $d2837f1711b34bdd$export$e6674eb1322665bd)(args[0], args[3], args[2], args[4], args[7], args[6], args[8], args[11], args[10]);
        const detZ = (0, $d2837f1711b34bdd$export$e6674eb1322665bd)(...args.slice(0, 2), args[3], ...args.slice(4, 6), args[7], ...args.slice(8, 10), args[11]);
        return [
            detX1.divide(detA1),
            detY1.divide(detA1),
            detZ.divide(detA1)
        ];
    } else if (args.length === 20) return $195096b30d4dc5c6$var$cramersFrac4x4(...args);
    else throw new Error("only 2x2 (6 arguments) and 3x3 (12 arguments) equations are supported");
}
/**
 * apply Cramer's rule to 4x4
 *
 */ function $195096b30d4dc5c6$var$cramersFrac4x4(...args) {
    if (args.length !== 20) throw new Error("only 4x4 equations are supported");
    const det = (0, $d2837f1711b34bdd$export$763b2dcbd9a72363)(...args.slice(0, 4), ...args.slice(5, 9), ...args.slice(10, 14), ...args.slice(15, 19));
    if (det.isEqualTo(0)) throw new Error("determinant 0: no roots found");
    // 0  1  2  3  4
    // 5  6  7  8  9
    // 10 11 12 13 14
    // 15 16 17 18 19
    const detA = (0, $d2837f1711b34bdd$export$763b2dcbd9a72363)(args[4], ...args.slice(1, 4), args[9], ...args.slice(6, 9), args[14], ...args.slice(11, 14), args[19], ...args.slice(16, 19));
    const detB = (0, $d2837f1711b34bdd$export$763b2dcbd9a72363)(args[0], args[4], ...args.slice(2, 4), args[5], args[9], ...args.slice(7, 9), args[10], args[14], ...args.slice(12, 14), args[15], args[19], ...args.slice(17, 19));
    // 0  1  2  3  4
    // 5  6  7  8  9
    // 10 11 12 13 14
    // 15 16 17 18 19
    const detC = (0, $d2837f1711b34bdd$export$763b2dcbd9a72363)(...args.slice(0, 2), args[4], args[3], ...args.slice(5, 7), args[9], args[8], ...args.slice(10, 12), args[14], args[13], ...args.slice(15, 17), args[19], args[18]);
    const detD = (0, $d2837f1711b34bdd$export$763b2dcbd9a72363)(...args.slice(0, 3), args[4], ...args.slice(5, 8), args[9], ...args.slice(10, 13), args[14], ...args.slice(15, 18), args[19]);
    return [
        detA.divide(det),
        detB.divide(det),
        detC.divide(det),
        detD.divide(det)
    ];
}



function $e693f601f4c1602d$export$c03efc561d3f8db4(f, lower, upper, precision = 5) {
    if (Math.abs(upper - lower) < Math.pow(10, -precision)) return (upper + lower) / 2;
    else {
        const fa = f(lower);
        const fb = f(upper);
        if (Math.sign(fa) === Math.sign(fb)) throw new Error("bisection ERROR: no sign change detected");
        const midPt = (lower + upper) / 2;
        if (Math.sign(fa) === Math.sign(f(midPt))) return $e693f601f4c1602d$export$c03efc561d3f8db4(f, midPt, upper, precision);
        else return $e693f601f4c1602d$export$c03efc561d3f8db4(f, lower, midPt, precision);
    }
}




class $9509415d105b6dfc$export$17d680238e50603e {
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
	 */ constructor(v1, v2, options){
        const { twoPointsMode: twoPointsMode , lambda: lambda  } = {
            twoPointsMode: false,
            lambda: "\\lambda",
            ...options
        };
        v2 = twoPointsMode ? v2.minus(v1).simplify({
            stretchable: true
        }) : v2;
        if (v2.isZero()) throw new Error("Cannot create a line with zero vector as direction");
        this.a = v1.expand();
        this.d = v2.clone();
        this.lambda = lambda;
    }
    /**
	 * checks if line contains a point
	 */ contains(point) {
        const ab = point.minus(this.a);
        return ab.isZero() || this.d.isParallelTo(ab);
    }
    /**
	 * checks if line is parallel to vector or line
	 */ isParallelTo(v) {
        v = v instanceof $9509415d105b6dfc$export$17d680238e50603e ? v.d : v;
        return this.d.isParallelTo(v);
    }
    /**
	 * checks if two lines are the same
	 */ isEqualTo(l2) {
        return this.isParallelTo(l2) && this.contains(l2.a);
    }
    /**
	 * subs in the parameter lambda
	 *
	 * @returns the position vector of the resulting point on the line
	 */ point(lambda = 0) {
        lambda = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(lambda);
        return this.a.plus(this.d.multiply(lambda));
    }
    /**
	 * finds *acute* angle between lines/line and vector
	 *
	 * @returns angle between this line and given vector/line
	 */ angleTo(v) {
        v = v instanceof $9509415d105b6dfc$export$17d680238e50603e ? v.d : v;
        return this.d.angleTo(v, {
            acute: true
        });
    }
    /**
	 * finds distance between this line to a point or a parallel line
	 *
	 * WARNING: does not support skew lines at the moment
	 */ distanceTo(v) {
        let ab;
        if (v instanceof $9509415d105b6dfc$export$17d680238e50603e) {
            if (!v.isParallelTo(this)) throw new Error("Distance method only supported for parallel lines");
            ab = v.a.minus(this.a);
        } else ab = v.minus(this.a);
        const modABCrossD = ab.cross(this.d).magnitude();
        return modABCrossD.divide(this.d.magnitude());
    }
    /**
	 * finds intersection point between two lines
	 *
	 * @returns the position vector of the point of intersection,
	 * or null if there are no points of intersection,
	 * or a line if the two lines are coincident.
	 *
	 */ intersect(l2) {
        if (this.isParallelTo(l2)) return this.isEqualTo(l2) ? this.clone() : null;
        const intersection = this.intersectParameters(l2);
        if (intersection === null) return null;
        else {
            const [lambda] = intersection;
            return this.point(lambda);
        }
    }
    /**
	 * @returns [lambda, mu] that corresponds to the intersection of this line and l2
	 * returns null if skew/parallel/coincident lines
	 */ intersectParameters(l2) {
        if (this.isParallelTo(l2)) return null;
        // solve for lambda and mu from first two rows
        const [a1, b1, c1, a2, b2, c2, a3, b3, c3] = [
            this.d.x,
            l2.d.x.negative(),
            l2.a.x.minus(this.a.x),
            this.d.y,
            l2.d.y.negative(),
            l2.a.y.minus(this.a.y),
            this.d.z,
            l2.d.z.negative(),
            l2.a.z.minus(this.a.z), 
        ];
        let det = $9509415d105b6dfc$var$determinant(a1, b1, a2, b2);
        let x1, x2, x3, y1, y2, y3;
        if (!det.isEqualTo(0)) {
            x1 = a1;
            x2 = b1;
            x3 = c1;
            y1 = a2;
            y2 = b2;
            y3 = c2;
        } else {
            det = $9509415d105b6dfc$var$determinant(a1, b1, a3, b3);
            if (!det.isEqualTo(0)) {
                x1 = a1;
                x2 = b1;
                x3 = c1;
                y1 = a3;
                y2 = b3;
                y3 = c3;
            } else {
                det = $9509415d105b6dfc$var$determinant(a2, b2, a3, b3);
                if (det.isEqualTo(0)) return null;
                else {
                    x1 = a2;
                    x2 = b2;
                    x3 = c2;
                    y1 = a3;
                    y2 = b3;
                    y3 = c3;
                }
            }
        }
        const [lambda, mu] = (0, $195096b30d4dc5c6$export$496373a15df62289)(x1, x2, x3, y1, y2, y3);
        // check if intersecting
        if (this.point(lambda).isEqualTo(l2.point(mu))) // intersecting lines
        return [
            lambda,
            mu
        ];
        else // skew lines
        return null;
    }
    /**
	 * finds the foot of perpendicular from point to this line
	 */ footOfPerpendicular(point) {
        const AB = point.minus(this.a);
        const ABDotD = AB.dot(this.d);
        const lambda = ABDotD.divide(this.d.magnitudeSquare());
        const AF = this.d.multiply(lambda);
        return AF.plus(this.a).expand();
    }
    /**
	 * finds the reflection of a point/line about this line
	 */ reflect(v) {
        return v instanceof $9509415d105b6dfc$export$17d680238e50603e ? this.reflectLine(v) : this.reflectPoint(v);
    }
    /**
	 * finds the reflection of point about this line
	 */ reflectPoint(point) {
        const OF = this.footOfPerpendicular(point);
        return OF.multiply(2).minus(point).expand();
    }
    /**
	 * checks if two lines are skew
	 */ isSkewTo(l2) {
        return !this.isParallelTo(l2) && !this.isEqualTo(l2) && this.intersect(l2) === null;
    }
    /**
	 * finds the reflection of line l2 about this line
	 *
	 * WARNING: throws an error if skew lines encountered
	 */ reflectLine(l2) {
        if (this.isParallelTo(l2)) {
            const OAPrime = this.reflectPoint(l2.a);
            return new $9509415d105b6dfc$export$17d680238e50603e(OAPrime, this.d);
        }
        const OX = this.intersect(l2);
        if (OX === null) // skew lines
        throw new Error("Cannot find line reflection of skew lines");
        else {
            // intersecting
            let OA = l2.a;
            if (this.contains(OA)) OA = l2.point(1);
            const OAPrime1 = this.reflectPoint(OA);
            return new $9509415d105b6dfc$export$17d680238e50603e(OX, OAPrime1, {
                twoPointsMode: true
            });
        }
    }
    /**
	 * @returns equation of the line r = a + lambda d in column vector form
	 */ toString() {
        return this.a.isZero() ? `\\mathbf{r} = ${this.lambda} ${this.d}` : `\\mathbf{r} = ${this.a} + ${this.lambda} ${this.d}`;
    }
    /**
	 * @returns equation of the line r = a + lambda d in ijk form
	 */ toIJKString() {
        return this.a.isZero() ? `\\mathbf{r} = ${this.lambda} \\left( ${this.d.toIJKString()} \\right)` : `\\mathbf{r} = \\left( ${this.a.toIJKString()} \\right) + ${this.lambda} \\left( ${this.d.toIJKString()} \\right)`;
    }
    /**
	 * @returns (a+lambda d) combined together in a column vector
	 *
	 * @param component 0 (default) returns all 3 components, 1 returns x, 2 returns y, 3 returns z
	 */ toCombinedString(component = 0) {
        const x = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            this.a.x,
            this.d.x
        ], {
            ascending: true,
            variable: this.lambda
        });
        const y = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            this.a.y,
            this.d.y
        ], {
            ascending: true,
            variable: this.lambda
        });
        const z = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            this.a.z,
            this.d.z
        ], {
            ascending: true,
            variable: this.lambda
        });
        if (component === 0) return `\\begin{pmatrix}\n\t${x} \\\\\n\t${y} \\\\\n\t${z}\n\\end{pmatrix}`;
        else if (component === 1) return `${x}`;
        else if (component === 2) return `${y}`;
        else if (component === 3) return `${z}`;
        else throw new Error(`Component ${component} not recognized: must be 0-3`);
    }
    /**
	 * @returns cartesian equation of the line
	 */ toCartesianString() {
        if (this.d.x.isEqualTo(0)) {
            if (this.d.y.isEqualTo(0)) // x,y zero
            // by construction z cannot be zero
            return `x = ${this.a.x}, y = ${this.a.y}, z \\in \\mathbb{R}`;
            else {
                // x zero, y non-zero
                const yString = $9509415d105b6dfc$var$toCartesianComponent("y", this.a.y, this.d.y);
                if (this.d.z.isEqualTo(0)) // y non-zero, x,z zero
                return `x = ${this.a.x}, y \\in \\mathbb{R}, z = ${this.a.z}`;
                else {
                    // x zero, y,z non-zero
                    const zString = $9509415d105b6dfc$var$toCartesianComponent("z", this.a.z, this.d.z);
                    return `x = ${this.a.x}, ${yString} = ${zString}`;
                }
            }
        } else {
            // x non-zero
            const xString = $9509415d105b6dfc$var$toCartesianComponent("x", this.a.x, this.d.x);
            if (this.d.y.isEqualTo(0)) {
                // x non-zero, y zero
                if (this.d.z.isEqualTo(0)) // x non-zero, y,z zero
                return `x \\in \\mathbb{R}, y = ${this.a.y}, z = ${this.a.z}`;
                else {
                    // x,z non-zero, y zero
                    const zString1 = $9509415d105b6dfc$var$toCartesianComponent("z", this.a.z, this.d.z);
                    return `${xString} = ${zString1}, y = ${this.a.y}`;
                }
            } else {
                // x,y non-zero
                const yString1 = $9509415d105b6dfc$var$toCartesianComponent("y", this.a.y, this.d.y);
                if (this.d.z.isEqualTo(0)) // x,y non-zero, z zero
                return `${xString} = ${yString1}, z = ${this.a.z}`;
                else {
                    // x,y,z non-zero
                    const zString2 = $9509415d105b6dfc$var$toCartesianComponent("z", this.a.z, this.d.z);
                    return `${xString} = ${yString1} = ${zString2}`;
                }
            }
        }
    }
    /**
	 * clones and returns a new instance of this line
	 */ clone() {
        return new $9509415d105b6dfc$export$17d680238e50603e(this.a, this.d, {
            lambda: this.lambda
        });
    }
}
function $9509415d105b6dfc$var$toCartesianComponent(x, a, d) {
    const xMinusA = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        1,
        a.negative()
    ], {
        variable: x
    });
    let xString;
    if (d.isEqualTo(1)) xString = `${xMinusA}`;
    else {
        // d should be 1 since direction vectors are simplified during instantiation
        //// old code: const xNum = d.den === 1 ? `${xMinusA}` : `${d.den} \\left( ${xMinusA} \\right)`;
        const xNum = `${xMinusA}`;
        xString = `\\frac{${xNum}}{${d.num}}`;
    }
    return xString;
}
/**
 * determinant of 2x2 matrix
 * [a1 a2]
 * [b1 b2]
 */ function $9509415d105b6dfc$var$determinant(a1, b1, a2, b2) {
    return a1.times(b2).minus(a2.times(b1));
}





class $9ab39ccab2ef035d$export$7ff5ac152ef991b0 {
    //constructor(
    //	v1: Vector,
    //	options?: {
    //		mode?: 'rhs' | 'ptN' | 'ptDD' | 'ptPtD' | 'ptPtPt';
    //		rhs?: number | Fraction;
    //		v2?: Vector;
    //		v3?: Vector;
    //	},
    //) {
    constructor(v1, v2 = 0, v3, options){
        let n;
        if (v3 === undefined) {
            n = v1.clone();
            this.rhs = v2 instanceof (0, $2977af7a6fa47f89$export$9b781de7bf37bf48) ? n.dot(v2) : (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(v2);
        } else if (options) {
            if (!(v2 instanceof (0, $2977af7a6fa47f89$export$9b781de7bf37bf48))) throw new Error(`Expected second argument ${v2} to be a vector`);
            if (options.points === 1) {
                n = v2.cross(v3).simplify({
                    stretchable: true
                });
                this.rhs = v1.dot(n);
            } else if (options.points === 2) {
                n = v3.cross(v2.minus(v1)).simplify({
                    stretchable: true
                });
                this.rhs = v1.dot(n);
            } else if (options.points === 3) {
                n = v2.minus(v1).cross(v3.minus(v1)).simplify({
                    stretchable: true
                });
                this.rhs = v1.dot(n);
            } else throw new Error(`Unexpected options object: options.points should be 1/2/3: ${options}`);
        } else throw new Error(`unexpected plane inputs ${v1} ${v2} ${v3} ${options}`);
        if (n.isEqualTo((0, $2977af7a6fa47f89$export$9b781de7bf37bf48).ZERO)) throw new Error("normal vector cannot be zero");
        this.n = n;
    }
    /**
	 * checks if this plane contains a point/line
	 */ contains(pointOrLine) {
        if (pointOrLine instanceof (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)) // point
        return this.rhs.isEqualTo(this.n.dot(pointOrLine));
        else // line
        return this.contains(pointOrLine.a) && this.n.isPerpendicularTo(pointOrLine.d);
    }
    /**
	 * checks if this plane is parallel to line or plane
	 */ isParallelTo(lineOrPlane) {
        if (lineOrPlane instanceof (0, $9509415d105b6dfc$export$17d680238e50603e)) // line
        return this.n.isPerpendicularTo(lineOrPlane.d);
        else // plane
        return this.n.isParallelTo(lineOrPlane.n);
    }
    /**
	 * checks if two planes are the same
	 */ isEqualTo(p2) {
        if (this.isParallelTo(p2)) {
            // n1 = k n2
            let k;
            if (this.n.x.isEqualTo(0)) {
                if (this.n.y.isEqualTo(0)) // theoretically z component should be non-zero
                k = this.n.z.divide(p2.n.z);
                else k = this.n.y.divide(p2.n.y);
            } else // division of x component allowed
            k = this.n.x.divide(p2.n.x);
            return this.rhs.isEqualTo(p2.rhs.times(k));
        }
        return false;
    }
    /**
	 * @returns a point on the plane
	 *
	 * tries (x,0,0) if possible, followed by (0,y,0) and (0,0,z)
	 */ point() {
        if (this.n.x.isEqualTo(0)) {
            if (this.n.y.isEqualTo(0)) // theoretically this.n.z should be non-zero
            return new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(0, 0, this.rhs.divide(this.n.z));
            else // (0,y,0)
            return new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(0, this.rhs.divide(this.n.y));
        } else // (x,0,0)
        return new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(this.rhs.divide(this.n.x));
    }
    /**
	 * finds angle between this plane and vector/line/plane
	 */ angleTo(v) {
        if (v instanceof $9ab39ccab2ef035d$export$7ff5ac152ef991b0) return this.n.angleTo(v.n, {
            acute: true
        });
        else {
            v = v instanceof (0, $9509415d105b6dfc$export$17d680238e50603e) ? v.d : v;
            return this.n.angleTo(v, {
                acute: true,
                sineMode: true
            });
        }
    }
    /**
	 * finds distance between this plane to a point or a parallel line/plane
	 */ distanceTo(v) {
        let ab;
        if (v instanceof (0, $9509415d105b6dfc$export$17d680238e50603e)) {
            if (this.isParallelTo(v)) v = v.a;
            else // intersecting
            return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(0);
        } else if (v instanceof $9ab39ccab2ef035d$export$7ff5ac152ef991b0) {
            if (this.isParallelTo(v)) v = v.point();
            else // intersecting
            return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(0);
        }
        const modABDotN = new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(1, v.minus(this.point()).dot(this.n).abs());
        return modABDotN.divide(this.n.magnitude());
    }
    /**
	 * finds intersection between this plane and another line/plane
	 */ intersect(lineOrPlane) {
        return lineOrPlane instanceof (0, $9509415d105b6dfc$export$17d680238e50603e) ? this.intersectLine(lineOrPlane) : this.intersectPlane(lineOrPlane);
    }
    /**
	 * finds lambda of line such that line intersects plane
	 */ intersectLineParam(l) {
        if (this.isParallelTo(l)) throw new Error("line parallel to plane");
        return this.rhs.minus(l.a.dot(this.n)).divide(l.d.dot(this.n));
    }
    /**
	 * finds the intersection between this plane and a line
	 */ intersectLine(l) {
        if (this.isParallelTo(l)) // parallel or on
        return this.contains(l) ? l.clone() : null;
        // intersecting
        const lambda = this.intersectLineParam(l);
        return l.point(lambda);
    }
    /**
	 * finds the intersection between this plane and a plane
	 */ intersectPlane(p2) {
        if (this.isParallelTo(p2)) // parallel or coincident
        return this.isEqualTo(p2) ? p2.clone() : null;
        // intersecting
        const d1 = this.n.cross(p2.n).simplify({
            stretchable: true
        });
        let d = d1.clone();
        if (d1.z.isLessThan(0) || d1.z.isEqualTo(0) && d1.y.isLessThan(0) || d1.z.isEqualTo(0) && d1.y.isEqualTo(0) && d1.x.isLessThan(0)) d = d1.negative();
        // try z = 0
        let det = $9ab39ccab2ef035d$var$determinant(this.n.x, this.n.y, p2.n.x, p2.n.y);
        if (det.isEqualTo(0)) {
            // try y = 0
            det = $9ab39ccab2ef035d$var$determinant(this.n.x, this.n.z, p2.n.x, p2.n.z);
            if (det.isEqualTo(0)) {
                // x = 0
                det = $9ab39ccab2ef035d$var$determinant(this.n.y, this.n.z, p2.n.y, p2.n.z);
                // theoretically non-zero since planes not parallel
                const y = $9ab39ccab2ef035d$var$determinant(this.rhs, this.n.z, p2.rhs, p2.n.z).divide(det);
                const z = $9ab39ccab2ef035d$var$determinant(this.n.y, this.rhs, p2.n.y, p2.rhs).divide(det);
                return new (0, $9509415d105b6dfc$export$17d680238e50603e)(new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(0, y, z), d);
            } else {
                // y = 0
                const x = $9ab39ccab2ef035d$var$determinant(this.rhs, this.n.z, p2.rhs, p2.n.z).divide(det);
                const z1 = $9ab39ccab2ef035d$var$determinant(this.n.x, this.rhs, p2.n.x, p2.rhs).divide(det);
                return new (0, $9509415d105b6dfc$export$17d680238e50603e)(new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(x, 0, z1), d);
            }
        } else {
            // z = 0
            const y1 = $9ab39ccab2ef035d$var$determinant(this.n.x, this.rhs, p2.n.x, p2.rhs).divide(det);
            const x1 = $9ab39ccab2ef035d$var$determinant(this.rhs, this.n.y, p2.rhs, p2.n.y).divide(det);
            return new (0, $9509415d105b6dfc$export$17d680238e50603e)(new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(x1, y1, 0), d);
        }
    }
    /**
	 * finds the foot of perpendicular from point to this plane
	 */ footOfPerpendicular(point) {
        const AB = point.minus(this.point());
        const ABDotN = AB.dot(this.n);
        const lambda = ABDotN.divide(this.n.magnitudeSquare());
        const FB = this.n.multiply(lambda);
        return point.minus(FB).expand();
    }
    /**
	 * finds the reflection of point about this plane
	 */ pointReflection(point) {
        const OF = this.footOfPerpendicular(point);
        return OF.multiply(2).minus(point).expand();
    }
    /**
	 * finds the reflection of line l about this plane
	 */ lineReflection(l) {
        if (this.isParallelTo(l)) {
            const OAPrime = this.pointReflection(l.a);
            return new (0, $9509415d105b6dfc$export$17d680238e50603e)(OAPrime, l.d);
        }
        // line and plane intersect at one point
        const OX = this.intersect(l);
        let OA = l.a;
        // ensure OA doesn't lie on plane
        if (this.contains(OA)) OA = l.point(1);
        const OAPrime1 = this.pointReflection(OA);
        return new (0, $9509415d105b6dfc$export$17d680238e50603e)(OX, OAPrime1, {
            twoPointsMode: true
        });
    }
    /**
	 * reflects a point/line about this plane
	 */ reflect(pointOrLine) {
        return pointOrLine instanceof (0, $9509415d105b6dfc$export$17d680238e50603e) ? this.lineReflection(pointOrLine) : this.pointReflection(pointOrLine);
    }
    /**
	 * @returns equation of the plane r \cdot n = rhs in column vector form
	 */ toString() {
        return `\\mathbf{r} \\cdot ${this.n} = ${this.rhs}`;
    }
    /**
	 * @returns equation of the line r = a + lambda d in ijk form
	 */ toIJKString() {
        return `\\mathbf{r} \\cdot \\left( ${this.n.toIJKString()} \\right) = ${this.rhs}`;
    }
    /**
	 * @returns cartesian equation of the line
	 */ toCartesianString() {
        const xyzExpression = new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(this.n.x, "x"), new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(this.n.y, "y"), new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(this.n.z, "z"));
        return `${xyzExpression} = ${this.rhs}`;
    }
    /**
	 * clones a new instance of this line
	 */ clone() {
        return new $9ab39ccab2ef035d$export$7ff5ac152ef991b0(this.n, this.rhs);
    }
}
/**
 * determinant of 2x2 matrix
 * [a1 a2]
 * [b1 b2]
 */ function $9ab39ccab2ef035d$var$determinant(a1, b1, a2, b2) {
    return a1.times(b2).minus(a2.times(b1));
}




class $d97f7b9f00f9bb44$export$ff5a3dd162f29e3e {
    /**
	 * creates a new Vector instance
	 *
	 * @param options defaults to `{coeff: 1, simplify: false, stretchable: false}`
	 *  if `simplify` is `true`, then we will factorize our expression such that
	 *  x,y,z are integers with gcd 1.
	 *  if `stretchable` is set to true, then we will `simplify` and then
	 *  set `coeff` to be 1
	 *
	 */ constructor(x, y, z, options){
        x = $d97f7b9f00f9bb44$var$toExpression(x);
        y = y === undefined ? $d97f7b9f00f9bb44$var$toExpression(0) : $d97f7b9f00f9bb44$var$toExpression(y);
        z = z === undefined ? $d97f7b9f00f9bb44$var$toExpression(0) : $d97f7b9f00f9bb44$var$toExpression(z);
        let { coeff: coeff  } = {
            coeff: 1,
            ...options
        };
        coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
        this.x = coeff.isEqualTo(0) ? $d97f7b9f00f9bb44$var$toExpression(0) : x;
        this.y = coeff.isEqualTo(0) ? $d97f7b9f00f9bb44$var$toExpression(0) : y;
        this.z = coeff.isEqualTo(0) ? $d97f7b9f00f9bb44$var$toExpression(0) : z;
        this.coeff = coeff.isEqualTo(0) ? (0, $f182971f6d253900$export$b336c2702c498be5).ONE : coeff;
    }
    /**
	 * Expands the coeff, taking this k(x,y,z) and
	 * returning (kx, ky, kz)
	 */ expand() {
        return new $d97f7b9f00f9bb44$export$ff5a3dd162f29e3e(this.x.times(this.coeff), this.y.times(this.coeff), this.z.times(this.coeff));
    }
    /**
	 * @returns the dot product
	 */ dot(v2) {
        const x = this.x.times(v2.x);
        return this.x.times(v2.x).plus(this.y.times(v2.y)).plus(this.z.times(v2.z)).times(this.coeff).times(v2.coeff);
    }
    /**
	 * @returns the magnitude squared of this vector
	 */ magnitudeSquare() {
        return this.dot(this);
    }
    /**
	 * @returns if the vector is a zero vector
	 */ isZero() {
        return `${this.magnitudeSquare()}` === "0";
    }
    /**
	 * vector addition
	 *
	 * if the coeffs are the same, will retain the same coeff
	 *
	 * if the coeffs are different, will expand them in before performing addition
	 */ plus(v2) {
        if (this.coeff.isEqualTo(v2.coeff)) return new $d97f7b9f00f9bb44$export$ff5a3dd162f29e3e(this.x.plus(v2.x), this.y.plus(v2.y), this.z.plus(v2.z));
        else return this.expand().plus(v2.expand());
    }
    /**
	 * returns the negative of this vector
	 *
	 * @param options default to `{multiplyIntoCoeff: false}`
	 * the coeff stays the same while the components are made negative
	 * if false, the coeff is made negative instead
	 */ negative(options = {
        multiplyIntoCoeff: false
    }) {
        return options.multiplyIntoCoeff ? new $d97f7b9f00f9bb44$export$ff5a3dd162f29e3e(this.x, this.y, this.z, {
            coeff: this.coeff.negative()
        }) : new $d97f7b9f00f9bb44$export$ff5a3dd162f29e3e(this.x.negative(), this.y.negative(), this.z.negative(), {
            coeff: this.coeff
        });
    }
    /**
	 * vector subtraction
	 */ minus(v2) {
        return this.plus(v2.negative());
    }
    /**
	 * scalar multiplication
	 *
	 * by default, the coeff stays the same while the components are multiplied
	 * if false, the coeff is multiplied instead
	 *
	 * @param options defaults to `{multiplyIntoCoeff: false}`
	 */ multiply(k, options = {
        multiplyIntoCoeff: false
    }) {
        return options.multiplyIntoCoeff ? new $d97f7b9f00f9bb44$export$ff5a3dd162f29e3e(this.x, this.y, this.z, {
            coeff: this.coeff.times(k)
        }) : new $d97f7b9f00f9bb44$export$ff5a3dd162f29e3e(this.x.times(k), this.y.times(k), this.z.times(k), {
            coeff: this.coeff
        });
    }
    /**
	 * @returns the cross product (this cross v2)
	 */ cross(v2) {
        const coeff = this.coeff.times(v2.coeff);
        const x = this.y.times(v2.z).minus(this.z.times(v2.y));
        const y = this.z.times(v2.x).minus(this.x.times(v2.z));
        const z = this.x.times(v2.y).minus(this.y.times(v2.x));
        return new $d97f7b9f00f9bb44$export$ff5a3dd162f29e3e(x, y, z, {
            coeff: coeff
        });
    }
    /**
	 * checks if this is perpendicular to v2
	 */ isPerpendicularTo(v2) {
        return `${this.dot(v2)}` === "0";
    }
    /**
	 * checks if this is parallel to v2
	 */ isParallelTo(v2) {
        return this.cross(v2).isZero();
    }
    subIn(x) {
        return new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(this.x.subIn(x), this.y.subIn(x), this.z.subIn(x), {
            coeff: this.coeff
        });
    }
    /**
	 * @returns latex string representing the vector in column vector form
	 */ toString() {
        if (this.isZero()) return `\\begin{pmatrix}\n\t0 \\\\\n\t0 \\\\\n\t0\n\\end{pmatrix}`;
        const columnVector = `\\begin{pmatrix}\n\t${this.x} \\\\\n\t${this.y} \\\\\n\t${this.z}\n\\end{pmatrix}`;
        const term = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(this.coeff, columnVector);
        return `${term}`;
    }
    toCartesianString() {
        const xTerm = this.x.times("x");
        const yTerm = this.y.times("y");
        const zTerm = this.z.times("z");
        const cartesianExpression = xTerm.plus(yTerm).plus(zTerm);
        return `${cartesianExpression}`;
    }
    /**
	 * @returns (kx, ky, kz) as a coordinate triple.
	 *
	 * @param name The name of the point which is attached to the front of the coordinates
	 */ toCoordinates(name = "") {
        const v = this.expand();
        return `${name}\\left( ${v.x}, ${v.y}, ${v.z} \\right)`;
    }
    /**
	 * checks if two vectors are equal
	 */ isEqualTo(v2) {
        return `${this.minus(v2).magnitudeSquare()}` === "0";
    }
    /**
	 * clones a new instance of this vector
	 */ clone() {
        return new $d97f7b9f00f9bb44$export$ff5a3dd162f29e3e(this.x, this.y, this.z, {
            coeff: this.coeff
        });
    }
    ////
    // static properties
    ////
    /**
	 * the zero vector
	 */ static ZERO = new $d97f7b9f00f9bb44$export$ff5a3dd162f29e3e(0);
    /**
	 * the x-axis unit vector (1,0,0)
	 */ static I = new $d97f7b9f00f9bb44$export$ff5a3dd162f29e3e(1);
    /**
	 * the y-axis unit vector (0,1,0)
	 */ static J = new $d97f7b9f00f9bb44$export$ff5a3dd162f29e3e(0, 1);
    /**
	 * the z-axis unit vector (0,0,1)
	 */ static K = new $d97f7b9f00f9bb44$export$ff5a3dd162f29e3e(0, 0, 1);
}
function $d97f7b9f00f9bb44$var$toExpression(x) {
    if (typeof x === "number" || x instanceof (0, $f182971f6d253900$export$b336c2702c498be5) || typeof x === "string") return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(x));
    return x instanceof (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131) ? new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(x) : x.clone();
}



class $be658d927af77459$export$68b43f2f2a2907ee extends (0, $e86e55fd775d0f9a$export$921da06a0f908654) {
    /**
	 * Creates a new unknown vector
	 * @param coeff the k in k a
	 * @param vector the a in k a
	 */ constructor(vector, coeff = 1){
        // bold face if not already
        vector = vector.slice(0, 7) === "\\mathbf" ? vector : `\\mathbf{${vector}}`;
        super(coeff, vector);
        this.vector = vector;
    }
    plus(v) {
        return new $be658d927af77459$export$e077d131706461e7(this, v);
    }
    negative() {
        return new $be658d927af77459$export$68b43f2f2a2907ee(this.vector, this.coeff.negative());
    }
    minus(v) {
        v = v instanceof $be658d927af77459$export$68b43f2f2a2907ee ? v : new $be658d927af77459$export$68b43f2f2a2907ee(v);
        return new $be658d927af77459$export$e077d131706461e7(this, v.negative());
    }
    /** scalar multiplication */ multiply(k) {
        return new $be658d927af77459$export$68b43f2f2a2907ee(this.vector, this.coeff.times(k));
    }
    /** scalar (dot) product */ dot(v) {
        v = v instanceof $be658d927af77459$export$68b43f2f2a2907ee ? v : new $be658d927af77459$export$68b43f2f2a2907ee(v);
        if (this.vector === v.vector) return new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(this.coeff.times(v.coeff), `\\left| ${this.vector} \\right|^2`);
        const [v1, v2] = [
            this.vector,
            v.vector
        ].sort();
        return new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(this.coeff.times(v.coeff), `${v1} \\cdot ${v2}`);
    }
    /** vector (cross) product */ cross(v) {
        v = v instanceof $be658d927af77459$export$68b43f2f2a2907ee ? v : new $be658d927af77459$export$68b43f2f2a2907ee(v);
        if (this.vector === v.vector) return new $be658d927af77459$export$68b43f2f2a2907ee(this.vector, 0);
        const [v1, v2] = [
            this.vector,
            v.vector
        ].sort();
        const coeff = v1 === this.vector ? this.coeff.times(v.coeff) : this.coeff.times(v.coeff).negative();
        return new $be658d927af77459$export$68b43f2f2a2907ee(`${v1} \\times ${v2}`, coeff);
    }
    clone() {
        return new $be658d927af77459$export$68b43f2f2a2907ee(this.vector, this.coeff);
    }
}
class $be658d927af77459$export$e077d131706461e7 {
    constructor(...args){
        const terms = args.map((term)=>{
            if (typeof term === "string") return new $be658d927af77459$export$68b43f2f2a2907ee(term);
            return term.clone();
        });
        // combine like terms and remove zero terms
        this.vectors = $be658d927af77459$var$combineLikeVectors(terms).filter((term)=>!term.coeff.isEqualTo(0));
    }
    plus(v) {
        if (typeof v === "string" || v instanceof $be658d927af77459$export$68b43f2f2a2907ee) return new $be658d927af77459$export$e077d131706461e7(...this.vectors, v);
        return new $be658d927af77459$export$e077d131706461e7(...this.vectors, ...v.vectors);
    }
    negative() {
        return new $be658d927af77459$export$e077d131706461e7(...this.vectors.map((vector)=>vector.negative()));
    }
    minus(v) {
        if (typeof v === "string") v = new $be658d927af77459$export$68b43f2f2a2907ee(v);
        if (v instanceof $be658d927af77459$export$68b43f2f2a2907ee) return new $be658d927af77459$export$e077d131706461e7(...this.vectors, v.negative());
        return new $be658d927af77459$export$e077d131706461e7(...this.vectors, ...v.negative().vectors);
    }
    /** scalar multiplication */ multiply(k) {
        return new $be658d927af77459$export$e077d131706461e7(...this.vectors.map((vector)=>vector.multiply(k)));
    }
    /** scalar (dot) product */ dot(v) {
        if (!(v instanceof $be658d927af77459$export$e077d131706461e7)) {
            const vectors = this.vectors.map((vector)=>vector.dot(v));
            return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(...vectors);
        }
        return v.vectors.reduce((exp, term)=>exp.plus(this.dot(term)), new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(0));
    }
    /** vector (cross) product */ cross(v) {
        if (!(v instanceof $be658d927af77459$export$e077d131706461e7)) {
            const vectors = this.vectors.map((vector)=>vector.cross(v));
            return new $be658d927af77459$export$e077d131706461e7(...vectors);
        }
        return v.vectors.reduce((exp, term)=>exp.plus(this.cross(term)), new $be658d927af77459$export$e077d131706461e7(new $be658d927af77459$export$68b43f2f2a2907ee("a", 0)));
    }
    /**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the vectors
	 */ toString() {
        if (this.vectors.length === 0) return "0";
        let outputString = "";
        this.vectors.forEach((vector, i)=>{
            if (i !== 0) outputString += vector.coeff.isGreaterThan(0) ? " + " : " ";
            outputString += vector.toString();
        });
        return outputString;
    }
    clone() {
        return new $be658d927af77459$export$e077d131706461e7(...this.vectors.map((vector)=>vector.clone()));
    }
}
class $be658d927af77459$export$d1a3e7b57dcfb542 {
    /**
	 * Creates a new unknown vector
	 * @param coeff the k in k a
	 * @param vector the a in k a
	 */ constructor(vector, coeff = 1){
        // bold face if not already
        vector = vector.slice(0, 7) === "\\mathbf" ? vector : `\\mathbf{${vector}}`;
        if (coeff instanceof (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)) this.coeff = coeff.clone();
        else this.coeff = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(coeff);
        this.vector = vector;
    }
    plus(v) {
        return new $be658d927af77459$export$2d2dd6ec9a9522a(this, v);
    }
    negative() {
        return new $be658d927af77459$export$d1a3e7b57dcfb542(this.vector, this.coeff.negative());
    }
    minus(v) {
        v = typeof v === "string" ? new $be658d927af77459$export$d1a3e7b57dcfb542(v) : v;
        return new $be658d927af77459$export$2d2dd6ec9a9522a(this, v.negative());
    }
    /** scalar multiplication */ multiply(k) {
        return new $be658d927af77459$export$d1a3e7b57dcfb542(this.vector, this.coeff.times(k));
    }
    /** scalar (dot) product */ dot(v) {
        v = typeof v === "string" ? new $be658d927af77459$export$d1a3e7b57dcfb542(v) : v;
        if (this.vector === v.vector) return new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(1, `\\left| ${this.vector} \\right|^2`).times(this.coeff).times(v.coeff);
        const [v1, v2] = [
            this.vector,
            v.vector
        ].sort();
        return new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(1, `\\mathbf{${v1}} \\cdot \\mathbf{${v2}}`).times(this.coeff).times(v.coeff);
    }
    /** vector (cross) product */ cross(v) {
        v = typeof v === "string" ? new $be658d927af77459$export$68b43f2f2a2907ee(v) : v;
        if (this.vector === v.vector) return new $be658d927af77459$export$d1a3e7b57dcfb542(this.vector, 0);
        const [v1, v2] = [
            this.vector,
            v.vector
        ].sort();
        return this.vector === v1 ? new $be658d927af77459$export$d1a3e7b57dcfb542(`\\mathbf{${v1}} \\times \\mathbf{${v2}}`, this.coeff.times(v.coeff)) : new $be658d927af77459$export$d1a3e7b57dcfb542(`\\mathbf{${v1}} \\times \\mathbf{${v2}}`, this.coeff.times(v.coeff).negative());
    }
    /** sub in unknown into the coefficient term */ subIn(x) {
        return new $be658d927af77459$export$68b43f2f2a2907ee(this.vector, this.coeff.subIn(x));
    }
    clone() {
        return new $be658d927af77459$export$d1a3e7b57dcfb542(this.vector, this.coeff);
    }
    toString() {
        if (`${this.coeff}` === `0`) return "\\mathbf{0}";
        else if (`${this.coeff}` === `1`) return `${this.vector}`;
        else if (`${this.coeff}` === `- 1`) return `- ${this.vector}`;
        else return `${this.coeff} ${this.vector}`;
    }
}
class $be658d927af77459$export$2d2dd6ec9a9522a {
    constructor(...args){
        const terms = args.map((term)=>{
            if (typeof term === "string") return new $be658d927af77459$export$68b43f2f2a2907ee(term);
            return term.clone();
        });
        // combine like terms and remove zero terms
        this.vectors = $be658d927af77459$var$combineLikeXVectors(terms).filter((term)=>`${term.coeff}` !== "0");
    }
    plus(v) {
        if (typeof v === "string" || v instanceof $be658d927af77459$export$68b43f2f2a2907ee || v instanceof $be658d927af77459$export$d1a3e7b57dcfb542) return new $be658d927af77459$export$2d2dd6ec9a9522a(...this.vectors, v);
        return new $be658d927af77459$export$2d2dd6ec9a9522a(...this.vectors, ...v.vectors);
    }
    negative() {
        return new $be658d927af77459$export$2d2dd6ec9a9522a(...this.vectors.map((vector)=>vector.negative()));
    }
    minus(v) {
        if (typeof v === "string") v = new $be658d927af77459$export$68b43f2f2a2907ee(v);
        if (v instanceof $be658d927af77459$export$68b43f2f2a2907ee || v instanceof $be658d927af77459$export$d1a3e7b57dcfb542) return new $be658d927af77459$export$2d2dd6ec9a9522a(...this.vectors, v.negative());
        return new $be658d927af77459$export$2d2dd6ec9a9522a(...this.vectors, ...v.negative().vectors);
    }
    /** scalar multiplication */ multiply(k) {
        return new $be658d927af77459$export$2d2dd6ec9a9522a(...this.vectors.map((vector)=>vector.multiply(k)));
    }
    /** scalar (dot) product */ dot(v) {
        if (!(v instanceof $be658d927af77459$export$2d2dd6ec9a9522a)) {
            const terms = [];
            this.vectors.forEach((vector, i)=>{
                if (vector instanceof $be658d927af77459$export$d1a3e7b57dcfb542) terms.push(vector.dot(v));
                else if (v instanceof $be658d927af77459$export$d1a3e7b57dcfb542) terms.push(v.dot(vector));
                else terms.push(vector.dot(v));
            });
            return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(...terms);
        }
        return v.vectors.reduce((exp, term)=>exp.plus(this.dot(term)), new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(0));
    }
    /** vector (cross) product */ cross(v) {
        if (!(v instanceof $be658d927af77459$export$e077d131706461e7) && !(v instanceof $be658d927af77459$export$2d2dd6ec9a9522a)) {
            const vectors = [];
            this.vectors.forEach((vector, i)=>{
                if (vector instanceof $be658d927af77459$export$d1a3e7b57dcfb542) vectors.push(vector.cross(v));
                else if (v instanceof $be658d927af77459$export$d1a3e7b57dcfb542) vectors.push(v.cross(vector));
                else vectors.push(vector.cross(v));
            });
            return new $be658d927af77459$export$2d2dd6ec9a9522a(...vectors);
        }
        return v.vectors.reduce((exp, term)=>exp.plus(this.cross(term)), new $be658d927af77459$export$2d2dd6ec9a9522a(new $be658d927af77459$export$d1a3e7b57dcfb542("a", 0)));
    }
    /**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the vectors
	 */ toString() {
        if (this.vectors.length === 0) return "\\mathbf{0}";
        let outputString = "";
        this.vectors.forEach((vector, i)=>{
            if (i !== 0) outputString += `${vector.coeff}`[0] === "-" ? " " : " + ";
            outputString += vector.toString();
        });
        return outputString;
    }
    clone() {
        return new $be658d927af77459$export$2d2dd6ec9a9522a(...this.vectors.map((vector)=>vector.clone()));
    }
}
function $be658d927af77459$var$combineLikeVectors(vectors) {
    const variableArray = [], newTerms = [];
    vectors.forEach((term)=>{
        const variableIndex = variableArray.indexOf(term.variableString);
        if (variableIndex === -1) {
            // new term type
            variableArray.push(term.variableString);
            newTerms.push(term.clone());
        } else // combine like terms
        newTerms[variableIndex] = new $be658d927af77459$export$68b43f2f2a2907ee(term.vector, newTerms[variableIndex].coeff.plus(term.coeff));
    });
    return newTerms;
}
function $be658d927af77459$var$combineLikeXVectors(vectors) {
    const variableArray = [], newTerms = [];
    vectors.forEach((term)=>{
        const variableIndex = variableArray.indexOf(term.vector);
        if (variableIndex === -1) {
            // new term type
            variableArray.push(term.vector);
            newTerms.push(term.clone());
        } else {
            // combine like terms if applicable
            const coeff1 = newTerms[variableIndex].coeff;
            const coeff2 = term.coeff;
            let newCoeff;
            if (coeff1 instanceof (0, $f182971f6d253900$export$b336c2702c498be5) && coeff2 instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) newCoeff = coeff2.plus(coeff1);
            else newCoeff = new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(coeff1, coeff2);
            if (!(newCoeff instanceof (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83))) newTerms[variableIndex] = new $be658d927af77459$export$d1a3e7b57dcfb542(term.vector, newCoeff);
            else newTerms.push(term.clone());
        }
    });
    return newTerms;
}




function $db26e90f964c2edf$export$b141de964f0a90c1(min = -9, max = 9, options) {
    min = Math.ceil(min); // in case min is non-integer
    max = Math.floor(max); // in case max is non-integer
    [min, max] = [
        Math.min(min, max),
        Math.max(min, max)
    ];
    let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    let { avoid: avoid  } = {
        avoid: [],
        ...options
    };
    if (typeof avoid === "number") avoid = [
        avoid
    ];
    if (avoid.length !== 0) {
        let avoidArray = avoid.filter((num)=>num >= min && num <= max);
        avoidArray = avoidArray.filter((num, i)=>avoidArray.indexOf(num) === i);
        if (avoidArray.length >= max - min + 1) throw new Error(`no integer exists between ${min} and ${max} that avoids ${avoid}`);
        while(avoidArray.includes(randomInt))randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return randomInt;
}
function $db26e90f964c2edf$export$a3851e63db0c2294(n, min = -9, max = 9, options) {
    const { avoid: avoid , repeated: repeated  } = {
        avoid: [],
        repeated: false,
        ...options
    };
    const ints = [];
    while(ints.length < n){
        const randomInt = $db26e90f964c2edf$export$b141de964f0a90c1(min, max, {
            avoid: avoid
        });
        ints.push(randomInt);
        if (!repeated) avoid.push(randomInt);
    }
    return ints;
}




function $7034cb64c26be92d$export$448332262467e042(array) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while(currentIndex != 0){
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex]
        ];
    }
    return array;
}


function $682613c92f2b1815$export$26d2c8493973508f() {
    return Math.random() < 0.5;
}


function $d3526e173b3cb353$export$eac87df9834a7950(n) {
    if (n <= 0 || !Number.isInteger(n)) throw new Error(`factorPairs function only valid for positive integers. ${n} received`);
    let result = [
        [
            1,
            n
        ]
    ];
    for(let i = 2; i <= Math.floor(Math.sqrt(n)); i++)if (n % i === 0) result.push([
        i,
        n / i
    ]);
    return result;
}








function $2a2c23e72cfc5cd7$export$f48087c7d2ddb546(exp, options) {
    const { n: n , ascending: ascending  } = {
        n: 2,
        ascending: false,
        ...options
    };
    const coeffs = (0, $1d2ed8d2c70a3abb$export$deba95bbb8548da)(n + 1);
    let variable = undefined;
    exp.terms.forEach((term)=>{
        const length = Object.keys(term.symbols).length;
        // constant term
        if (length === 0) {
            coeffs[0] = coeffs[0].plus(term.coeff);
            return;
        }
        // checks for unknown term
        if (length > 1) throw new Error(`cannot convert term with more than one basic unit ${term}`);
        const unit = term.symbols[Object.keys(term.symbols)[0]];
        // checks if more than one unknown
        if (variable === undefined) variable = unit.symbol.symbol;
        else {
            if (variable !== unit.symbol.symbol) throw new Error(`cannot convert term with multiple unknowns ${unit}, ${variable}`);
        }
        // checks validity of degree
        if (unit.power.isLessThan(0) || unit.power.isGreaterThan(n) || !unit.power.isInteger()) throw new Error(`Invalid degree for ${unit} to be converted into polynomial`);
        // adds into coeffs array
        coeffs[unit.power.valueOf()] = coeffs[unit.power.valueOf()].plus(term.coeff);
    });
    if (!ascending) coeffs.reverse();
    return new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)(coeffs, {
        ascending: ascending,
        degree: n,
        variable: variable ?? "x"
    });
}



function $48fbc849e2253d56$export$71f83fa4be52eb7e(poly) {
    let [coeffs] = (0, $f182971f6d253900$export$b336c2702c498be5).factorize(...poly.coeffs);
    if (coeffs[0].valueOf() < 0) coeffs = coeffs.map((c)=>c.negative());
    if (!poly.ascending) coeffs.reverse();
    return new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)(coeffs, {
        ascending: poly.ascending,
        variable: poly.variable
    });
}
function $48fbc849e2253d56$export$a683619a138832d8(poly) {
    const [root1, root2] = $48fbc849e2253d56$export$425de9c92a3be3b1(poly);
    if (typeof root1 === "number" || typeof root2 === "number") throw new Error("irrational roots");
    const factor1 = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        root1.den,
        -root1.num
    ], {
        variable: poly.variable
    });
    const factor2 = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        root2.den,
        -root2.num
    ], {
        variable: poly.variable
    });
    return [
        factor1,
        factor2,
        [
            root1,
            root2
        ]
    ];
}
function $48fbc849e2253d56$export$5f287bb962e326a2(poly, root) {
    if (!poly.subIn(root).isEqualTo(0)) throw new Error(`root provided is not correct`);
    root = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(root);
    const factor1 = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        root.den,
        -root.num
    ], {
        variable: poly.variable
    });
    // ax^3 + bx^2 + cx + d = (ex+f)(Ax^2+Bx+C);
    // comparing coefficients
    const [d, c, b, a] = poly.coeffs;
    const [f, e] = factor1.coeffs;
    // a = Ae
    const A = a.divide(e);
    // b = Af + Be
    const B = b.minus(A.times(f)).divide(e);
    // check answer: c = Bf + Ce
    // d = fC
    const C = d.divide(f);
    if (!c.isEqualTo(B.times(f).plus(C.times(e)))) throw new Error(`Error encountered in comparing coefficients: check code`);
    const quadratic = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        A,
        B,
        C
    ], {
        variable: poly.variable
    });
    const [root2, root3] = $48fbc849e2253d56$export$425de9c92a3be3b1(quadratic);
    // see if can factorize further
    if (root2 instanceof (0, $f182971f6d253900$export$b336c2702c498be5) && root3 instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) {
        const [factor2, factor3] = $48fbc849e2253d56$export$a683619a138832d8(quadratic);
        return [
            [
                factor1,
                factor2,
                factor3
            ],
            [
                root2,
                root3
            ], 
        ];
    }
    return [
        [
            factor1,
            quadratic
        ],
        null
    ];
}
function $48fbc849e2253d56$export$425de9c92a3be3b1(poly) {
    if (!(poly instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72))) poly = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)(poly);
    if (poly.degree !== 2) throw new Error(`${poly} is not a quadratic polynomial`);
    let [c, b, a] = poly.coeffs;
    if (a.isLessThan(0)) {
        a = a.negative();
        b = b.negative();
        c = c.negative();
    }
    const discriminant = b.square().minus(a.times(c).times(4));
    if (discriminant.valueOf() < 0) return [
        NaN,
        NaN,
        "NaN"
    ];
    const sqrt = new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(discriminant);
    if (sqrt.isRational()) {
        const sqrtValue = sqrt.coeff;
        const root1 = b.negative().minus(sqrtValue).divide(2).divide(a);
        const root2 = b.negative().plus(sqrtValue).divide(2).divide(a);
        return [
            root1,
            root2,
            "frac"
        ];
    }
    // irrational answers
    const sqrtValue1 = sqrt.valueOf();
    const root11 = (-b.valueOf() - sqrtValue1) / 2 / a.valueOf();
    const root21 = (-b.valueOf() + sqrtValue1) / 2 / a.valueOf();
    return [
        root11,
        root21,
        "float"
    ];
}
function $48fbc849e2253d56$export$6211688467daceda(poly) {
    if (!(poly instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72))) poly = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)(poly);
    if (poly.degree !== 2) throw new Error(`${poly} is not a quadratic polynomial`);
    let [c, b, a] = poly.coeffs;
    if (a.isLessThan(0)) [c, b, a] = [
        c.negative(),
        b.negative(),
        a.negative()
    ];
    const discriminant = b.square().minus(a.times(c).times(4));
    if (discriminant.valueOf() < 0) throw new Error(`complex roots found: ${poly}`);
    const sqrt = new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(discriminant);
    const surd = sqrt.divide(a.times(2));
    const root2 = new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(b.negative().divide(a.times(2)), new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(surd.coeff, `${surd.variableString}`));
    const root1 = new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(b.negative().divide(a.times(2)), new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(surd.coeff.negative(), `${surd.variableString}`));
    return [
        root1,
        root2
    ];
}
function $48fbc849e2253d56$export$9f593307716ffb7(poly) {
    if (!(poly instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72))) poly = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)(poly);
    return poly.coeffs[0].negative().divide(poly.coeffs[1]);
}
function $48fbc849e2253d56$export$573c77f136f7960(poly, a) {
    const xPlusA = poly.ascending ? new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        a,
        1
    ], {
        variable: poly.variable,
        ascending: true
    }) : new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        1,
        a
    ], {
        variable: poly.variable
    });
    const zero = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        0
    ], {
        variable: poly.variable,
        ascending: poly.ascending
    });
    return poly.coeffs.reduce((prev, curr, i)=>{
        if (i === 0) return prev.plus(curr);
        return prev.plus(xPlusA.pow(i).times(curr));
    }, zero);
}
function $48fbc849e2253d56$export$c786780ad3272010(poly) {
    if (poly.degree !== 2) throw new Error(`${poly} is not a quadratic polynomial`);
    const { a: a , completedSquare: completedSquare , c: c  } = $48fbc849e2253d56$export$a4ad7037c1d4646c(poly);
    const bOver2A = completedSquare.coeffs[1];
    const bracketed = bOver2A.isEqualTo(0) ? `${completedSquare}^2` : `\\left( ${completedSquare} \\right)^2`;
    const exp = new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(a, `${bracketed}`), c);
    return `${exp}`;
}
function $48fbc849e2253d56$export$a4ad7037c1d4646c(poly) {
    if (poly.degree !== 2) throw new Error(`${poly} is not a quadratic polynomial`);
    const [c1, b1, a] = poly.coeffs;
    const b = b1.divide(2).divide(a);
    const c = c1.minus(b1.square().divide(4).divide(a));
    return {
        a: a,
        c: c,
        completedSquare: new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            1,
            b
        ], {
            variable: poly.variable
        })
    };
}




class $64bd69b91b40e616$export$50ceb3fb9926e63e extends (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83) {
    /**
	 * Creates a new Complex instance
	 */ constructor(real, imag = 0){
        const x = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(real);
        // const y = new Imaginary(imag);
        super(x, new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(imag, "i"));
        this.real = x;
        this.imag = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(imag);
    }
    /**
	 * adds two complex numbers
	 */ plus(z) {
        if (z instanceof $64bd69b91b40e616$export$50ceb3fb9926e63e) return new $64bd69b91b40e616$export$50ceb3fb9926e63e(this.real.plus(z.real), this.imag.plus(z.imag));
        return new $64bd69b91b40e616$export$50ceb3fb9926e63e(this.real.plus(z), this.imag);
    }
    /**
	 * negative of this complex number
	 */ negative() {
        return new $64bd69b91b40e616$export$50ceb3fb9926e63e(this.real.negative(), this.imag.negative());
    }
    /**
	 * complex number subtraction
	 */ minus(z) {
        if (typeof z === "number") return this.plus(new $64bd69b91b40e616$export$50ceb3fb9926e63e(-z, 0));
        return this.plus(z.negative());
    }
    /**
	 * complex number multiplication
	 */ times(z) {
        if (z instanceof $64bd69b91b40e616$export$50ceb3fb9926e63e) return new $64bd69b91b40e616$export$50ceb3fb9926e63e(this.real.times(z.real).minus(this.imag.times(z.imag)), this.real.times(z.imag).plus(this.imag.times(z.real)));
        return new $64bd69b91b40e616$export$50ceb3fb9926e63e(this.real.times(z), this.imag.times(z));
    }
    /**
	 * complex conjugation
	 */ conjugate() {
        return new $64bd69b91b40e616$export$50ceb3fb9926e63e(this.real, this.imag.negative());
    }
    /**
	 * r^2 = |z|^2
	 */ rSquared() {
        return this.times(this.conjugate()).real.clone();
    }
    /**
	 * reciprocal
	 */ reciprocal() {
        if (this.rSquared().isEqualTo(0)) throw new Error("division by zero");
        return this.conjugate().times(this.rSquared().reciprocal());
    }
    /**
	 * complex division
	 */ divide(z) {
        if (typeof z === "number") return this.times(new (0, $f182971f6d253900$export$b336c2702c498be5)(1, z));
        return this.times(z.reciprocal());
    }
    /**
	 * r = |z|
	 */ r() {
        return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(this.rSquared());
    }
    /**
	 * z^n
	 */ pow(n) {
        if (!Number.isInteger(n) || n < 0) throw new Error(`invalid exponent ${n}: only non-negative integers supported`);
        let result = new $64bd69b91b40e616$export$50ceb3fb9926e63e(1, 0);
        for(let i = 0; i < n; i++)result = result.times(this);
        return result;
    }
    /**
	 * z^2
	 */ square() {
        return this.times(this);
    }
    isReal() {
        return this.imag.isEqualTo(0);
    }
    isPurelyImaginary() {
        return this.real.isEqualTo(0);
    }
    isEqualTo(z) {
        if (typeof z === "number") return this.isReal() && this.real.isEqualTo(z);
        return this.real.isEqualTo(z.real) && this.imag.isEqualTo(z.imag);
    }
    /**
	 * clones this complex number
	 */ clone() {
        return new $64bd69b91b40e616$export$50ceb3fb9926e63e(this.real, this.imag);
    }
    static I = new $64bd69b91b40e616$export$50ceb3fb9926e63e(0, 1);
}




class $5d4be2d9156d310f$export$6cdc1cb9345ffadf extends (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131) {
    /**
	 * constructs a new Angle class instance
	 *
	 * @param angle if angle is a number, we will treat it as if it is in degrees. If angle is of Fraction type, will treat it
	 * as if it is k in k pi
	 * @param options defaults to { domain: 'complex' }
	 * 'complex' means -pi < theta \leq pi
	 * 'default' means 0 \leq theta < 2 pi
	 * 'all' means -\infty < theta < infty: no cycling will be performed
	 */ constructor(angle, options){
        const domain = options?.domain ?? "complex";
        let k = typeof angle === "number" ? new (0, $f182971f6d253900$export$b336c2702c498be5)(angle, 180) : angle;
        if (domain === "complex") {
            while(k.isAtMost(-1))k = k.plus(2);
            while(k.isGreaterThan(1))k = k.minus(2);
        } else if (domain === "default") {
            while(k.isLessThan(0))k = k.plus(2);
            while(k.isAtLeast(2))k = k.minus(2);
        }
        super(k, "\\pi");
        this.k = k;
        this.degrees = k.times(180);
        this.domain = domain;
    }
    plus(theta) {
        return new $5d4be2d9156d310f$export$6cdc1cb9345ffadf(this.k.plus($5d4be2d9156d310f$var$numberToAngle(theta).k), {
            domain: this.domain
        });
    }
    negative() {
        return new $5d4be2d9156d310f$export$6cdc1cb9345ffadf(this.k.negative(), {
            domain: this.domain
        });
    }
    minus(theta) {
        return new $5d4be2d9156d310f$export$6cdc1cb9345ffadf(this.k.minus($5d4be2d9156d310f$var$numberToAngle(theta).k), {
            domain: this.domain
        });
    }
    times(k) {
        return new $5d4be2d9156d310f$export$6cdc1cb9345ffadf(this.k.times(k), {
            domain: this.domain
        });
    }
    divide(k) {
        return new $5d4be2d9156d310f$export$6cdc1cb9345ffadf(this.k.divide(k), {
            domain: this.domain
        });
    }
    isEqualTo(theta) {
        return this.k.isEqualTo($5d4be2d9156d310f$var$numberToAngle(theta).k);
    }
    /**
	 * returns the value of the angle in radians in the number type
	 */ valueOf() {
        return this.k.valueOf() * Math.PI;
    }
    clone() {
        return new $5d4be2d9156d310f$export$6cdc1cb9345ffadf(this.k.clone(), {
            domain: this.domain
        });
    }
}
function $5d4be2d9156d310f$var$numberToAngle(angle) {
    if (angle instanceof $5d4be2d9156d310f$export$6cdc1cb9345ffadf) return angle;
    return new $5d4be2d9156d310f$export$6cdc1cb9345ffadf(angle);
}




function $65bb0db3d74bc6f6$export$50d414a77b60d802(theta) {
    if (typeof theta === "number" || theta instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) theta = new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(theta);
    theta = new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(theta.k); // change to -pi to pi domain
    if (theta.k.den === 1) {
        if (theta.k.num === 0) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(1);
        else if (theta.k.num === 1) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(1, -1);
    } else if (theta.k.den === 2) {
        if (Math.abs(theta.k.num) === 1) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(0);
    } else if (theta.k.den === 3) {
        if (Math.abs(theta.k.num) === 1) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(1, new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2));
        else if (Math.abs(theta.k.num) === 2) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(1, new (0, $f182971f6d253900$export$b336c2702c498be5)(-1, 2));
    } else if (theta.k.den === 4) {
        if (Math.abs(theta.k.num) === 1) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(2, new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2));
        else if (Math.abs(theta.k.num) === 3) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(2, new (0, $f182971f6d253900$export$b336c2702c498be5)(-1, 2));
    } else if (theta.k.den === 6) {
        if (Math.abs(theta.k.num) === 1) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(3, new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2));
        else if (Math.abs(theta.k.num) === 5) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(3, new (0, $f182971f6d253900$export$b336c2702c498be5)(-1, 2));
    }
    throw new Error(`${theta} cos function only valid for special angles`);
}
function $65bb0db3d74bc6f6$export$5de3937cb4b592ed(theta) {
    if (typeof theta === "number" || theta instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) theta = new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(theta);
    theta = new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(theta.k); // change to -pi to pi domain
    if (theta.k.den === 1) {
        if (theta.k.num === 0) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(0);
        else if (theta.k.num === 1) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(0);
    } else if (theta.k.den === 2) {
        if (Math.abs(theta.k.num) === 1) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(1).times(Math.sign(theta.k.num));
    } else if (theta.k.den === 3) {
        if (Math.abs(theta.k.num) === 1) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(3, new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2)).times(Math.sign(theta.k.num));
        else if (Math.abs(theta.k.num) === 2) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(3, new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2)).times(Math.sign(theta.k.num));
    } else if (theta.k.den === 4) {
        if (Math.abs(theta.k.num) === 1) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(2, new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2)).times(Math.sign(theta.k.num));
        else if (Math.abs(theta.k.num) === 3) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(2, new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2)).times(Math.sign(theta.k.num));
    } else if (theta.k.den === 6) {
        if (Math.abs(theta.k.num) === 1) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(1, new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2)).times(Math.sign(theta.k.num));
        else if (Math.abs(theta.k.num) === 5) return new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(1, new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2)).times(Math.sign(theta.k.num));
    }
    throw new Error(`${theta} sin function only valid for special angles`);
}
function $65bb0db3d74bc6f6$export$fcdd3b0b3246a325(theta) {
    return $65bb0db3d74bc6f6$export$5de3937cb4b592ed(theta).divide($65bb0db3d74bc6f6$export$50d414a77b60d802(theta));
}




function $49c7af4e0a088319$export$41726bdb1fc63f(x) {
    const half = new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2);
    if (typeof x === "number") x = new (0, $f182971f6d253900$export$b336c2702c498be5)(x);
    if (x instanceof (0, $54e5ac5d13ec125e$export$598b1075f1324aa)) {
        if (x.isRational()) x = x.coeff;
    }
    if (x.isEqualTo(0)) return new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(0, {
        domain: "all"
    });
    if (x instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) {
        if (x.abs().isEqualTo(half)) return x.isGreaterThan(0) ? new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(30, {
            domain: "all"
        }) : new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(-30, {
            domain: "all"
        });
        else if (x.abs().isEqualTo(1)) return x.isGreaterThan(0) ? new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(90, {
            domain: "all"
        }) : new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(-90, {
            domain: "all"
        });
    } else {
        if (x.abs().isEqualTo(new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(2, half))) return x.coeff.isGreaterThan(0) ? new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(45, {
            domain: "all"
        }) : new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(-45, {
            domain: "all"
        });
        else if (x.abs().isEqualTo(new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(3, half))) return x.coeff.isGreaterThan(0) ? new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(60, {
            domain: "all"
        }) : new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(-60, {
            domain: "all"
        });
    }
    throw new Error(`${x} asin function only valid for special ratios`);
}
function $49c7af4e0a088319$export$fd6306be3fde5b04(x) {
    const half = new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2);
    if (typeof x === "number") x = new (0, $f182971f6d253900$export$b336c2702c498be5)(x);
    if (x instanceof (0, $54e5ac5d13ec125e$export$598b1075f1324aa)) {
        if (x.isRational()) x = x.coeff;
    }
    if (x.isEqualTo(0)) return new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(90, {
        domain: "all"
    });
    if (x instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) {
        if (x.abs().isEqualTo(half)) return x.isGreaterThan(0) ? new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(60, {
            domain: "all"
        }) : new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(120, {
            domain: "all"
        });
        else if (x.abs().isEqualTo(1)) return x.isGreaterThan(0) ? new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(0, {
            domain: "all"
        }) : new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(180, {
            domain: "all"
        });
    } else {
        if (x.abs().isEqualTo(new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(2, half))) return x.coeff.isGreaterThan(0) ? new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(45, {
            domain: "all"
        }) : new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(135, {
            domain: "all"
        });
        else if (x.abs().isEqualTo(new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(3, half))) return x.coeff.isGreaterThan(0) ? new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(30, {
            domain: "all"
        }) : new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(150, {
            domain: "all"
        });
    }
    throw new Error(`${x} acos function only valid for special ratios`);
}
function $49c7af4e0a088319$export$628dc4eed22b0fbd(x) {
    const third = new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 3);
    if (typeof x === "number") x = new (0, $f182971f6d253900$export$b336c2702c498be5)(x);
    if (x instanceof (0, $54e5ac5d13ec125e$export$598b1075f1324aa)) {
        if (x.isRational()) x = x.coeff;
    }
    if (x.isEqualTo(0)) return new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(0, {
        domain: "all"
    });
    if (x instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) {
        if (x.abs().isEqualTo(1)) return x.isGreaterThan(0) ? new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(45, {
            domain: "all"
        }) : new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(-45, {
            domain: "all"
        });
    } else {
        if (x.abs().isEqualTo(new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(3))) return x.coeff.isGreaterThan(0) ? new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(60, {
            domain: "all"
        }) : new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(-60, {
            domain: "all"
        });
        else if (x.abs().isEqualTo(new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(3, third))) return x.coeff.isGreaterThan(0) ? new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(30, {
            domain: "all"
        }) : new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(-30, {
            domain: "all"
        });
    }
    throw new Error(`${x} atan function only valid for special ratios`);
}




class $ef162516d86aafc0$export$8ec1e3e38d2026e1 extends (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131) {
    /**
	 * Creates a new ComplexExp instance
	 *
	 * @param theta type number will be interpreted as in degrees, type Fraction will be interpreted as k in k pi
	 */ constructor(r, theta = 0){
        r = (0, $23160e13dd404e1b$export$d991e3d99172da5e)(r);
        if (r.valueOf() < 0) throw new Error(`negative modulus ${r} provided`);
        if (!(theta instanceof (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf))) theta = new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(theta);
        if (theta.isEqualTo(0)) super(r.coeff, new (0, $7811ac8504c01765$export$bacc3050bcb5570)(r.radicand.valueOf()));
        else {
            const argumentTerm = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(1).times(theta).times("i");
            super(r.coeff, new (0, $7811ac8504c01765$export$bacc3050bcb5570)(r.radicand.valueOf()), `\\mathrm{e}^{${argumentTerm}}`);
        }
        if (r.coeff.isLessThan(0)) throw new Error(`r ${r} must be non-negative`);
        this.mod = r.clone();
        this.arg = theta.clone();
    }
    /**
	 * negative of this complex number
	 */ negative() {
        return new $ef162516d86aafc0$export$8ec1e3e38d2026e1(this.mod, this.arg.plus(new (0, $f182971f6d253900$export$b336c2702c498be5)(1))); // multiplies by e^i pi
    }
    /**
	 * complex number multiplication
	 */ times(z) {
        if (z instanceof $ef162516d86aafc0$export$8ec1e3e38d2026e1) return new $ef162516d86aafc0$export$8ec1e3e38d2026e1(this.mod.times(z.mod), this.arg.plus(z.arg));
        return typeof z === "number" && z > 0 || z instanceof (0, $f182971f6d253900$export$b336c2702c498be5) && z.isGreaterThan(0) ? new $ef162516d86aafc0$export$8ec1e3e38d2026e1(this.mod.times(z), this.arg) : typeof z === "number" ? new $ef162516d86aafc0$export$8ec1e3e38d2026e1(this.mod.times(Math.abs(z)), this.arg.plus((0, $f182971f6d253900$export$b336c2702c498be5).ONE)) : new $ef162516d86aafc0$export$8ec1e3e38d2026e1(this.mod.times(z.abs()), this.arg.plus((0, $f182971f6d253900$export$b336c2702c498be5).ONE));
    }
    /**
	 * complex conjugation
	 */ conjugate() {
        return new $ef162516d86aafc0$export$8ec1e3e38d2026e1(this.mod, this.arg.negative());
    }
    reciprocal() {
        if (this.mod.isEqualTo(0)) throw new Error("division by zero");
        return new $ef162516d86aafc0$export$8ec1e3e38d2026e1(this.mod.reciprocal(), this.arg.negative());
    }
    /**
	 * complex division
	 */ divide(z) {
        if (typeof z === "number") return this.times(new (0, $f182971f6d253900$export$b336c2702c498be5)(1, z));
        return this.times(z.reciprocal());
    }
    /**
	 * complex exponentiation
	 */ pow(n) {
        return new $ef162516d86aafc0$export$8ec1e3e38d2026e1(this.mod.pow(n), this.arg.times(n));
    }
    /**
	 * z^2
	 */ square() {
        return this.pow(2);
    }
    /**
	 * returns the polar form r (cos theta + i sin theta)
	 */ toPolarString(wrap = false) {
        if (wrap) {
            const trigoString = this.arg.k.isLessThan(0) ? `\\cos ( ${this.arg} ) + \\mathrm{i} \\sin ( ${this.arg} )` : `\\cos ${this.arg} + \\mathrm{i} \\sin ${this.arg}`;
            return this.mod.isEqualTo(1) ? trigoString : `${this.mod} ( ${trigoString} )`;
        } else {
            const trigoString1 = this.arg.k.isLessThan(0) ? `\\cos \\left( ${this.arg} \\right) + \\mathrm{i} \\sin \\left( ${this.arg} \\right)` : `\\cos ${this.arg} + \\mathrm{i} \\sin ${this.arg}`;
            return this.mod.isEqualTo(1) ? trigoString1 : `${this.mod} \\left( ${trigoString1} \\right)`;
        }
    }
    clone() {
        return new $ef162516d86aafc0$export$8ec1e3e38d2026e1(this.mod, this.arg);
    }
    /**
	 * returns the standard form r e^(i theta)
	 */ static FORM(r = "r", theta = "\\theta") {
        return theta === "\\theta" ? `${r} \\mathrm{e}^{\\mathrm{i}${theta}}` : `${r} \\mathrm{e}^{${theta}\\mathrm{i}}`;
    }
    /**
	 * returns the standard form r e^(i theta)
	 */ static POLAR_FORM(r = "r", theta = "\\theta") {
        return r === "" ? `\\cos ${theta} + \\mathrm{i} \\sin ${theta}` : `${r} (\\cos ${theta} + \\mathrm{i} \\sin ${theta})`;
    }
}




class $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd extends (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83) {
    /**
	 * Creates a new Complex instance
	 */ constructor(real, imag = 0){
        real = real instanceof (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83) ? real.clone() : new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(real);
        imag = imag instanceof (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83) ? imag.clone() : new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(imag);
        super(...real.terms, ...imag.times("i").terms);
        this.real = real;
        this.imag = imag;
    }
    /**
	 * adds two complex numbers
	 */ plus(z) {
        if (z instanceof $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd || z instanceof (0, $64bd69b91b40e616$export$50ceb3fb9926e63e)) return new $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd(this.real.plus(z.real), this.imag.plus(z.imag));
        return new $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd(this.real.plus(z), this.imag);
    }
    /**
	 * negative of this complex number
	 */ negative() {
        return new $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd(this.real.negative(), this.imag.negative());
    }
    /**
	 * complex number subtraction
	 */ minus(z) {
        if (typeof z === "number") return this.plus(new $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd(-z, 0));
        return this.plus(z.negative());
    }
    /**
	 * complex number multiplication
	 */ times(z) {
        if (z instanceof $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd || z instanceof (0, $64bd69b91b40e616$export$50ceb3fb9926e63e)) return new $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd(this.real.times(z.real).minus(this.imag.times(z.imag)), this.real.times(z.imag).plus(this.imag.times(z.real)));
        return new $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd(this.real.times(z), this.imag.times(z));
    }
    /**
	 * complex conjugation
	 */ conjugate() {
        return new $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd(this.real, this.imag.negative());
    }
    /**
	 * r^2 = |z|^2
	 */ rSquared() {
        return this.times(this.conjugate()).real.clone();
    }
    /**
	 * z^n
	 */ pow(n) {
        if (!Number.isInteger(n) || n < 0) throw new Error(`invalid exponent ${n}: only non-negative integers supported`);
        let result = new $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd(1, 0);
        for(let i = 0; i < n; i++)result = result.times(this);
        return result;
    }
    /**
	 * z^2
	 */ square() {
        return this.times(this);
    }
    clone() {
        return new $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd(this.real, this.imag);
    }
}




function $33a4a772a9ca6821$export$385a43e29b3b9359(z) {
    return new (0, $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd)((0, $65bb0db3d74bc6f6$export$50d414a77b60d802)(z.arg).times(z.mod), (0, $65bb0db3d74bc6f6$export$5de3937cb4b592ed)(z.arg).times(z.mod));
}



function $3eadf436325c9066$export$83e9e1fae2f9176f(z, options) {
    const { variable: variable  } = {
        variable: "z",
        ...options
    };
    return new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        1,
        z.real.times(-2),
        z.rSquared()
    ], {
        variable: variable
    });
}



function $ea253d1c47015c81$export$6770779326e7368f(z, poly) {
    return poly.coeffs.reduce((sum, coeff, i)=>{
        return sum.plus(z.pow(i).times(coeff));
    }, new (0, $64bd69b91b40e616$export$50ceb3fb9926e63e)(0, 0));
}







function $b8d38a0842666bbd$export$1e51c46d43f261f5(poly) {
    if (!(poly instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72))) poly = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)(poly);
    if (poly.degree !== 2) throw new Error(`${poly} is not a quadratic polynomial`);
    let [c, b, a] = poly.coeffs;
    if (a.isLessThan(0)) {
        a = a.negative();
        b = b.negative();
        c = c.negative();
    }
    const discriminant = b.square().minus(a.times(c).times(4));
    if (discriminant.valueOf() >= 0) {
        // real roots
        const [root1, root2] = (0, $48fbc849e2253d56$export$6211688467daceda)(poly);
        return [
            new (0, $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd)(root1, 0),
            new (0, $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd)(root2, 0)
        ];
    }
    const sqrt = new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(discriminant.abs());
    const real = b.negative().divide(2).divide(a);
    if (sqrt.isRational()) {
        const imag = sqrt.coeff.divide(2).divide(a);
        return [
            new (0, $64bd69b91b40e616$export$50ceb3fb9926e63e)(real, imag.negative()),
            new (0, $64bd69b91b40e616$export$50ceb3fb9926e63e)(real, imag)
        ];
    }
    // irrational answers
    const imag1 = sqrt.divide(2).divide(a).abs();
    return [
        new (0, $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd)(real, imag1.negative()),
        new (0, $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd)(real, imag1)
    ];
}



function $dfa855c0a08c4823$export$f39d44152120106c(poly, divisor, carryOver) {
    carryOver = carryOver || new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        0
    ], {
        ascending: poly.ascending,
        variable: poly.variable
    });
    if (divisor.degree === 0) throw new Error(`Divisor ${divisor} must have degree > 0`);
    if (poly.degree < divisor.degree) return {
        quotient: carryOver,
        remainder: poly
    };
    const a = poly.coeffs[poly.coeffs.length - 1];
    const b = divisor.coeffs[divisor.coeffs.length - 1];
    const ax = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        a
    ], {
        degree: poly.degree,
        variable: poly.variable
    });
    return $dfa855c0a08c4823$export$f39d44152120106c(poly.minus(divisor.divide(b).times(a).times(new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        1
    ], {
        degree: poly.degree - divisor.degree
    }))), divisor, carryOver.plus(new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        a.divide(b)
    ], {
        degree: poly.degree - divisor.degree,
        variable: poly.variable
    })));
}



function $2c58cbc00422bb1b$export$45db2fc2f15997e7(options) {
    const { m: m , pt: pt , pt2: pt2  } = options;
    if (m !== undefined) {
        const mFrac = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(m);
        const c = mFrac.times(pt[0]).negative().plus(pt[1]); // y = mx + c; c = y-mx
        return new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            mFrac,
            c
        ]);
    }
    if (pt2 !== undefined) {
        const x2 = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(pt2[0]);
        const y2 = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(pt2[1]);
        const [x1, y1] = pt;
        if (x2.isEqualTo(x1)) throw new Error(`x coordinates are the same ${x1}: vertical lines are not supported`);
        const m1 = x2.minus(x1).reciprocal().times(y2.minus(y1)); // m = (y2-y1)/(x2-x1)
        const c1 = m1.times(x1).negative().plus(y1);
        return new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            m1,
            c1
        ]);
    }
    throw new Error(`either gradient m or second point pt2 must be provided.`);
}



function $d80405e3bbe3bd33$export$4a22edb671297d9b(poly, x) {
    let surd = new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(x.radicand, 0);
    let num = new (0, $f182971f6d253900$export$b336c2702c498be5)(0);
    poly.coeffs.forEach((coeff, i)=>{
        const term = x.pow(i).times(coeff);
        if (term.isRational()) num = num.plus(term.coeff);
        else surd = surd.plus(term);
    });
    return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(surd, num);
}




class $143c6632afa73a82$export$7e4481e23b2eabc5 {
    /**
	 * Creates a new Rational class
	 * @param options defaults to `{ poles: [] }` Poles are automatically determined for degree at most 2.
	 */ constructor(num, den = 1, options){
        // identify unknown
        let unknown = "x";
        if (num instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)) {
            if (den instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)) {
                if (num.variable !== den.variable) console.warn(`different unknowns detected for numerator and denominator. Will use numerator's ${num.variable}`);
            }
            unknown = num.variable;
        } else if (den instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)) unknown = den.variable;
        // change to Polynomials
        if (typeof num === "number" || num instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) num = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            num
        ], {
            variable: unknown
        });
        if (typeof den === "number" || den instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) den = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            den
        ], {
            variable: unknown
        });
        const poles = $143c6632afa73a82$var$assignPoles(den, options?.poles);
        // check for common factors
        let newPoles = poles.map((x)=>x);
        poles.forEach((x)=>{
            const numerator = num;
            if (numerator.subIn(x).isEqualTo(0)) {
                const denominator = den;
                ({ quotient: num  } = (0, $dfa855c0a08c4823$export$f39d44152120106c)(numerator, new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
                    1,
                    x.negative()
                ], {
                    variable: unknown
                })));
                ({ quotient: den  } = (0, $dfa855c0a08c4823$export$f39d44152120106c)(denominator, new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
                    1,
                    x.negative()
                ], {
                    variable: unknown
                })));
                newPoles = newPoles.filter((y)=>!y.isEqualTo(x));
            }
        });
        this.num = num.clone();
        this.den = den.clone();
        this.poles = poles;
    }
    /** Addition */ plus(rational2) {
        if (typeof rational2 === "number" || rational2 instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) rational2 = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            rational2
        ], {
            variable: this.num.variable
        });
        if (rational2 instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)) return new $143c6632afa73a82$export$7e4481e23b2eabc5(this.num.plus(rational2.times(this.den)), this.den, {
            poles: this.poles
        });
        let commonDivisor = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            1
        ], {
            variable: this.num.variable
        });
        let sharesCommonDivisor = false;
        const f = rational2.den;
        this.poles.forEach((x)=>{
            if (f.subIn(x).isEqualTo(0)) {
                commonDivisor = commonDivisor.times(new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
                    1,
                    x.negative()
                ], {
                    variable: this.num.variable
                }));
                sharesCommonDivisor = true;
            }
        });
        if (sharesCommonDivisor) {
            const { quotient: multiple1  } = (0, $dfa855c0a08c4823$export$f39d44152120106c)(rational2.den, commonDivisor);
            const { quotient: multiple2  } = (0, $dfa855c0a08c4823$export$f39d44152120106c)(this.den, commonDivisor);
            const den = this.den.times(multiple1);
            return new $143c6632afa73a82$export$7e4481e23b2eabc5(this.num.times(multiple1).plus(rational2.num.times(multiple2)), den, {
                poles: [
                    ...this.poles,
                    ...rational2.poles
                ]
            });
        } else return new $143c6632afa73a82$export$7e4481e23b2eabc5(this.num.times(rational2.den).plus(rational2.num.times(this.den)), this.den.times(rational2.den), {
            poles: [
                ...this.poles,
                ...rational2.poles
            ]
        });
    }
    negative() {
        return new $143c6632afa73a82$export$7e4481e23b2eabc5(this.num.negative(), this.den, {
            poles: this.poles
        });
    }
    /** subtraction */ minus(rational2) {
        if (typeof rational2 === "number" || rational2 instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) rational2 = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            rational2
        ], {
            variable: this.num.variable
        });
        return this.plus(rational2.negative());
    }
    /** multiplication */ times(rational2) {
        if (typeof rational2 === "number" || rational2 instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) rational2 = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            rational2
        ], {
            variable: this.num.variable
        });
        if (rational2 instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)) rational2 = new $143c6632afa73a82$export$7e4481e23b2eabc5(rational2);
        return new $143c6632afa73a82$export$7e4481e23b2eabc5(this.num.times(rational2.num), this.den.times(rational2.den), {
            poles: [
                ...this.poles,
                ...rational2.poles
            ]
        });
    }
    reciprocal() {
        return new $143c6632afa73a82$export$7e4481e23b2eabc5(this.den, this.num);
    }
    /** division */ divide(rational2) {
        if (typeof rational2 === "number" || rational2 instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) rational2 = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            rational2
        ], {
            variable: this.num.variable
        });
        if (rational2 instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)) rational2 = new $143c6632afa73a82$export$7e4481e23b2eabc5(rational2);
        return this.times(rational2.reciprocal());
    }
    /** subs in a fraction/integer */ subIn(x) {
        return this.num.subIn(x).divide(this.den.subIn(x));
    }
    subInNumber(x) {
        return this.num.subInNumber(x) / this.den.subInNumber(x);
    }
    differentiate() {
        const num = this.num.differentiate().times(this.den).minus(this.den.differentiate().times(this.num));
        const den = this.den.square();
        return new $143c6632afa73a82$export$7e4481e23b2eabc5(num, den, {
            poles: this.poles
        });
    }
    replaceXWith(x) {
        return new $143c6632afa73a82$export$7e4481e23b2eabc5(this.num.replaceXWith(x), this.den.replaceXWith(x));
    }
    /**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the terms
	 */ toString() {
        if (this.den.degree === 0) {
            const f = this.num.divide(this.den.coeffs[0]);
            return `${f}`;
        } else return `\\frac{ ${this.num} }{ ${this.den} }`;
    }
}
function $143c6632afa73a82$var$assignPoles(den, providedPoles) {
    if (den.degree === 0) return [];
    else if (den.degree === 1) return [
        (0, $48fbc849e2253d56$export$9f593307716ffb7)(den)
    ];
    else if (den.degree === 2) {
        const roots = (0, $48fbc849e2253d56$export$425de9c92a3be3b1)(den);
        if (roots[2] === "frac") return [
            roots[0],
            roots[1]
        ];
    } else // degree 3 and above
    if (providedPoles) {
        const poles = [];
        const f = den;
        // check if poles are valid
        providedPoles.forEach((x)=>{
            if (f.subIn(x).isEqualTo(0)) poles.push((0, $2aab13bad14c4123$export$98fc78f39c2afd39)(x));
            else throw new Error(`Provided pole ${x} is incorrect for denominator ${f}`);
        });
        return poles;
    }
    return [];
}




function $14439be136ee9734$export$27e2d2491cfae64(lhs, rhs = 0, options) {
    const values = [];
    const intervals = [];
    let combinedAnswer;
    // set up inequality
    let rational = lhs.minus(rhs);
    const x = rational.num.variable;
    const equality = options?.equality ?? false;
    let lessThan = options?.lessThan ?? true;
    if (rational.num.coeffs[rational.num.coeffs.length - 1].times(rational.den.coeffs[rational.den.coeffs.length - 1]).isLessThan(0)) {
        rational = rational.negative();
        lessThan = !lessThan;
    }
    // zeros
    if (rational.num.degree === 1) values.push((0, $48fbc849e2253d56$export$9f593307716ffb7)(rational.num));
    else if (rational.num.degree === 2) {
        const roots = (0, $48fbc849e2253d56$export$425de9c92a3be3b1)(rational.num);
        if (roots[0] instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) values.push(roots[0], roots[1]);
    } else if (rational.num.degree > 2) throw new Error(`numerator of degree more than 2 not supported ${rational.num}`);
    // poles
    values.push(...rational.poles);
    // sort critical values
    values.sort((a, b)=>a.minus(b).valueOf());
    if (values.length === 1) {
        let sign;
        if (equality && !rational.den.subIn(values[0]).isEqualTo(0)) sign = lessThan ? "\\leq" : "\\geq";
        else sign = lessThan ? "<" : ">";
        intervals.push(`${x} ${sign} ${values[0]}`);
        combinedAnswer = `${intervals[0]}.`;
    } else if (values.length === 2) {
        if (lessThan) {
            const sign1 = !equality || rational.den.subIn(values[0]).isEqualTo(0) ? "<" : "\\leq";
            const sign2 = !equality || rational.den.subIn(values[1]).isEqualTo(0) ? "<" : "\\leq";
            intervals.push(`${values[0]} ${sign1} ${x} ${sign2} ${values[1]}`);
            combinedAnswer = `${intervals[0]}.`;
        } else {
            const sign11 = !equality || rational.den.subIn(values[0]).isEqualTo(0) ? "<" : "\\leq";
            const sign21 = !equality || rational.den.subIn(values[1]).isEqualTo(0) ? ">" : "\\geq";
            intervals.push(`${x} ${sign11} ${values[0]}`, `${x} ${sign21} ${values[1]}`);
            combinedAnswer = `{${intervals[0]}} \allowbreak \\textrm{ or } {${intervals[1]}.}`;
        }
    } else if (values.length === 3) {
        if (lessThan) {
            const sign12 = !equality || rational.den.subIn(values[0]).isEqualTo(0) ? "<" : "\\leq";
            const sign22 = !equality || rational.den.subIn(values[1]).isEqualTo(0) ? "<" : "\\leq";
            const sign3 = !equality || rational.den.subIn(values[2]).isEqualTo(0) ? "<" : "\\leq";
            intervals.push(`${x} ${sign12} ${values[0]}`, `${values[1]} ${sign22} ${x} ${sign3} ${values[2]}`);
            combinedAnswer = `{${intervals[0]}} \\allowbreak \\textrm{ or } {${intervals[1]}.}`;
        } else {
            const sign13 = !equality || rational.den.subIn(values[0]).isEqualTo(0) ? "<" : "\\leq";
            const sign23 = !equality || rational.den.subIn(values[1]).isEqualTo(0) ? "<" : "\\leq";
            const sign31 = !equality || rational.den.subIn(values[2]).isEqualTo(0) ? ">" : "\\geq";
            intervals.push(`${values[0]} ${sign13} ${x} ${sign23} ${values[1]}`, `${x} ${sign31} ${values[2]}`);
            combinedAnswer = `{${intervals[0]}} \\allowbreak \\textrm{ or } {${intervals[1]}.}`;
        }
    } else if (values.length === 4) {
        if (lessThan) {
            const sign14 = !equality || rational.den.subIn(values[0]).isEqualTo(0) ? "<" : "\\leq";
            const sign24 = !equality || rational.den.subIn(values[1]).isEqualTo(0) ? "<" : "\\leq";
            const sign32 = !equality || rational.den.subIn(values[2]).isEqualTo(0) ? "<" : "\\leq";
            const sign4 = !equality || rational.den.subIn(values[3]).isEqualTo(0) ? "<" : "\\leq";
            intervals.push(`${values[0]} ${sign14} ${x} ${sign24} ${values[1]}`, `${values[2]} ${sign32} ${x} ${sign4} ${values[3]}`);
            combinedAnswer = `{${intervals[0]}} \\allowbreak \\textrm{ or } {${intervals[1]}.}`;
        } else {
            const sign15 = !equality || rational.den.subIn(values[0]).isEqualTo(0) ? "<" : "\\leq";
            const sign25 = !equality || rational.den.subIn(values[1]).isEqualTo(0) ? "<" : "\\leq";
            const sign33 = !equality || rational.den.subIn(values[2]).isEqualTo(0) ? "<" : "\\leq";
            const sign41 = !equality || rational.den.subIn(values[3]).isEqualTo(0) ? ">" : "\\geq";
            intervals.push(`${x} ${sign15} ${values[0]}`, `${values[1]} ${sign25} ${x} ${sign33} ${values[2]}`, `${x} ${sign41} ${values[3]}`);
            combinedAnswer = `{${intervals[0]},} \\; \\allowbreak {${intervals[1]}} \\allowbreak \\textrm{ or } {${intervals[2]}.}`;
        }
    } else throw new Error(`we currently do not support this inequality with critical values ${values}`);
    return {
        combinedAnswer: combinedAnswer,
        intervals: intervals,
        values: values
    };
}





function $33c55aca4da8bb39$export$35d677e0ea3a9a33(denominators, options) {
    // make denominators Array
    let unknown;
    if (!Array.isArray(denominators)) {
        if (denominators.degree === 1) denominators = [
            denominators
        ];
        else if (denominators.degree === 2) {
            const [linear1, linear2] = (0, $48fbc849e2253d56$export$a683619a138832d8)(denominators);
            denominators = [
                linear1,
                linear2
            ];
        } else throw new Error(`only linear or quadratic denominators are supported. ${denominators} received.`);
    }
    unknown = denominators[0].variable;
    // make numerators Array
    const { numerators: numeratorsProvided  } = {
        numerators: 1,
        ...options
    };
    let numerators;
    if (Array.isArray(numeratorsProvided)) numerators = numeratorsProvided.map((x)=>$33c55aca4da8bb39$var$toPolynomial(x));
    else numerators = [
        $33c55aca4da8bb39$var$toPolynomial(numeratorsProvided)
    ];
    // throws is not proper
    if (numerators.length >= denominators.length) throw new Error(`partial fractions failure: improper fraction detected`);
    // iterate over denominator
    return denominators.map((x, i)=>{
        const denArray = denominators;
        const root = (0, $48fbc849e2253d56$export$9f593307716ffb7)(x);
        const remainingDenominators = denArray.filter((_, j)=>i !== j);
        const den = remainingDenominators.reduce((prev, curr)=>prev.times(curr.subIn(root)), new (0, $f182971f6d253900$export$b336c2702c498be5)(1));
        const num = numerators.reduce((prev, curr)=>prev.times(curr.subIn(root)), new (0, $f182971f6d253900$export$b336c2702c498be5)(1));
        const A = num.divide(den);
        return new (0, $143c6632afa73a82$export$7e4481e23b2eabc5)(A.num, x.times(A.den));
    });
}
function $33c55aca4da8bb39$var$toPolynomial(x, unknown = "x") {
    if (typeof x === "number") x = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        x
    ], {
        variable: unknown
    });
    else if (x instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) x = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        x.den,
        -x.num
    ], {
        variable: unknown
    });
    return x;
}



class $8a850c2ced0979bb$export$9b2581285fd93ff9 extends (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83) {
    /**
	 * Creates a new Polynomial instance
	 * @param coeffs array of coefficients. if a number/fraction is provided, will create the polynomial "kx".
	 * @param options defaults to `{ascending: false, degree: coeffs.length-1, variable: 'x'}`
	 */ constructor(coeffs, options){
        if (!Array.isArray(coeffs)) coeffs = options?.ascending ? [
            0,
            coeffs
        ] : [
            coeffs,
            0
        ];
        const { variable: variable , ascending: ascending , degree: degree  } = {
            ascending: false,
            degree: coeffs.length - 1,
            variable: "x",
            ...options
        };
        if (degree < 0 || degree < coeffs.length - 1) throw new RangeError("degree must be greater than coefficients.length-1");
        // reverse coefficient array if descending order
        if (!ascending) coeffs = [
            ...coeffs
        ].reverse();
        // add extra zeros to start from constant term
        if (degree > coeffs.length - 1) {
            const extraCoeffLength = degree - coeffs.length + 1;
            coeffs = [
                ...$8a850c2ced0979bb$var$createZeroArray(extraCoeffLength),
                ...coeffs
            ];
        }
        // convert to Fraction type
        let coeffsFrac = coeffs.map($8a850c2ced0979bb$var$toExpression);
        // remove unnecessary terms (leading coefficients should be non-zero, unless it is a constant polynomial)
        while(`${coeffsFrac[coeffsFrac.length - 1]}` === "0" && coeffsFrac.length > 1)coeffsFrac.pop();
        // generate unknown terms
        const polynomialTerms = coeffsFrac.map((coeff, n)=>{
            return coeff.times(new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(variable, n));
        });
        // descending order typesetting if necessary;
        if (!ascending) polynomialTerms.reverse();
        const polynomialExpressions = [
            ...polynomialTerms
        ];
        let terms = [];
        polynomialExpressions.forEach((e)=>{
            terms.push(...e.terms);
        });
        super(...terms);
        this.coeffs = coeffsFrac;
        this.degree = coeffsFrac.length - 1;
        this.variable = variable;
        this.ascending = ascending;
    }
    /** add two polynomials
	 *
	 * fraction/numbers will be converted a "constant polynomial", while a string will be converted to a polynomial term with coefficient 1
	 */ plus(p2) {
        const p2x = $8a850c2ced0979bb$var$toXPolynomial(p2);
        const [higherPoly, lowerPoly] = this.degree >= p2x.degree ? [
            this,
            p2x
        ] : [
            p2x,
            this
        ];
        const newCoeffs = higherPoly.coeffs.map((thisCoeff, i)=>{
            if (lowerPoly.coeffs[i] === undefined) return thisCoeff;
            else return thisCoeff.plus(lowerPoly.coeffs[i]);
        });
        if (!this.ascending) newCoeffs.reverse();
        return new $8a850c2ced0979bb$export$9b2581285fd93ff9(newCoeffs, {
            variable: this.variable,
            ascending: this.ascending
        });
    }
    /** multiplies two polynomials */ times(p2) {
        const p2x = $8a850c2ced0979bb$var$toXPolynomial(p2);
        const degree = this.degree + p2x.degree;
        const coeffs = $8a850c2ced0979bb$var$createZeroArray(degree + 1);
        for(let i = 0; i < this.coeffs.length; i++)for(let j = 0; j < p2x.coeffs.length; j++)coeffs[i + j] = coeffs[i + j].plus(this.coeffs[i].times(p2x.coeffs[j]));
        if (!this.ascending) coeffs.reverse();
        return new $8a850c2ced0979bb$export$9b2581285fd93ff9(coeffs, {
            ascending: this.ascending,
            degree: degree,
            variable: this.variable
        });
    }
    /** negative of this polynomial */ negative() {
        return this.times(-1);
    }
    /**
	 * divide by a *scalar*
	 */ divide(p2) {
        p2 = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(p2);
        return this.times(p2.reciprocal());
    }
    /** subtracts this by p2 */ minus(p2) {
        p2 = $8a850c2ced0979bb$var$toXPolynomial(p2);
        return this.plus(p2.times(-1));
    }
    /**
	 * exponentiation
	 * @returns this polynomial taken to a power of `n`
	 */ pow(n) {
        if (!(Number.isInteger(n) && n >= 0)) throw new RangeError(`only non-negative integers allowed for n (${n} received)`);
        let newPoly = new $8a850c2ced0979bb$export$9b2581285fd93ff9([
            1
        ], {
            variable: this.variable,
            ascending: this.ascending
        });
        for(let i = 0; i < n; i++)newPoly = newPoly.times(this);
        return newPoly;
    }
    /**
	 * replace x with a new polynomial
	 * @param x if string, replaces the unknown
	 */ replaceXWith(x) {
        const xPoly = typeof x === "string" ? new $8a850c2ced0979bb$export$9b2581285fd93ff9([
            1,
            0
        ], {
            variable: x
        }) : $8a850c2ced0979bb$var$toXPolynomial(x);
        let poly = new $8a850c2ced0979bb$export$9b2581285fd93ff9([
            0
        ], {
            ascending: this.ascending,
            variable: this.variable
        });
        this.coeffs.forEach((coeff, i)=>{
            poly = poly.plus(xPoly.pow(i).times(coeff));
        });
        return poly;
    }
    /**
	 * square
	 *
	 * @returns the square of this polynomial
	 *  */ square() {
        return this.pow(2);
    }
    /**
	 * @returns an ascending polynomial only up until degree n
	 */ concatenate(n) {
        const coeffs = this.coeffs.slice(0, n + 1);
        return new $8a850c2ced0979bb$export$9b2581285fd93ff9(coeffs, {
            ascending: this.ascending,
            variable: this.variable
        });
    }
    /**
	 * changes ascending/behavior of polynomial
	 *
	 * @param ascending sets ascending behavior. By default, this
	 * option is set to toggle current ascending/descending behavior
	 *
	 * @returns a reference to this polynomial instance
	 *
	 * WARNING: mutates current instance
	 */ changeAscending(ascending = !this.ascending) {
        if (this.ascending === ascending) return this;
        this.terms.reverse();
        this.ascending = ascending;
        return this;
    }
    /** derivative of the polynomial */ differentiate() {
        if (this.degree === 0) return new $8a850c2ced0979bb$export$9b2581285fd93ff9([
            0
        ]);
        const newCoeffs = this.coeffs.map((coeff, i)=>coeff.times(i)).slice(1);
        const newPoly = new $8a850c2ced0979bb$export$9b2581285fd93ff9(newCoeffs, {
            ascending: true,
            variable: this.variable
        });
        return this.ascending ? newPoly : newPoly.changeAscending();
    }
    ///** integral of the polynomial
    // * @param options `{c, x1, y1}` where we can put in the integration constant c (defaults to 0),
    // * or a point on the curve (x1, y1).
    // */
    //integrate(options?: { c?: number | Fraction; x1?: number | Fraction; y1?: number | Fraction }): xPolynomial {
    //	if (this.degree === 0) {
    //		return new xPolynomial([0]);
    //	}
    //	const newCoeffs = [0, ...this.coeffs.map((coeff, i) => coeff.divide(i + 1))];
    //	const newPoly = new Polynomial(newCoeffs, { ascending: true, variable: this.variable });
    //	const { x1, y1 } = {
    //		...options,
    //	};
    //	let c = options?.c ?? 0;
    //	if (x1 !== undefined && y1 !== undefined) {
    //		c = newPoly.subIn(x1).negative().plus(y1);
    //	}
    //	const polyWithC = newPoly.plus(c);
    //	return this.ascending ? polyWithC : polyWithC.changeAscending();
    //}
    /** checks if two polynomials are equal: i.e., coefficient array is the same and same unknown */ isEqualTo(poly2) {
        if (this.variable === poly2.variable) {
            if (this.coeffs.length === poly2.coeffs.length) {
                let valid = true;
                this.coeffs.forEach((coeff, i)=>{
                    if (!(`${coeff}` === `${poly2.coeffs[i]}`)) valid = false;
                });
                return valid;
            }
        }
        return false;
    }
    /** clones this polynomial */ clone() {
        const coeffs = [
            ...this.coeffs
        ];
        if (!this.ascending) // coeffs in ascending by default
        coeffs.reverse();
        return new $8a850c2ced0979bb$export$9b2581285fd93ff9(coeffs, {
            ascending: this.ascending,
            degree: this.degree,
            variable: this.variable
        });
    }
}
function $8a850c2ced0979bb$var$createZeroArray(n) {
    let zeroArray = [];
    for(let i = 0; i < n; i++)zeroArray.push(new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(0));
    return zeroArray;
}
function $8a850c2ced0979bb$var$toXPolynomial(p2) {
    if (p2 instanceof $8a850c2ced0979bb$export$9b2581285fd93ff9) return p2;
    if (p2 instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)) {
        const newXPoly = new $8a850c2ced0979bb$export$9b2581285fd93ff9(p2.coeffs, {
            ascending: true,
            variable: p2.variable
        });
        return p2.ascending ? newXPoly : newXPoly.changeAscending();
    }
    return new $8a850c2ced0979bb$export$9b2581285fd93ff9([
        p2
    ]);
}
function $8a850c2ced0979bb$var$toExpression(x) {
    if (x instanceof (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)) return x;
    return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(x);
}





class $6dff6b02e459a6ca$export$ea4e6706f9009a22 {
    /**
	 * Creates a new PowerFn class
	 * @param options defaults to `{ fx: "x", coeff: 1 }`
	 */ constructor(n, options){
        let { fx: fx , coeff: coeff  } = {
            fx: "x",
            coeff: 1,
            ...options
        };
        if (typeof fx === "string") fx = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            1,
            0
        ], {
            variable: fx
        });
        else if (fx instanceof (0, $8622b8d7bfb82666$export$d155811788b32995)) fx = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            fx.coeff,
            0
        ], {
            variable: fx.variable
        });
        this.fx = fx;
        this.coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
        this.n = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(n);
    }
    /**
	 * differentiates this expression using chain rule
	 * @return `{ string, power, fPrime }` where string is an attempted string representation of the derivative,
	 * power is the PowerFn n ( f(x) )^(n-1) and fPrime is f'(x)
	 */ differentiate() {
        const fPrime = this.fx.differentiate();
        const fPrimeTwo = this.fx.differentiate();
        let coeff = fPrime instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72) || fPrime instanceof $6dff6b02e459a6ca$export$328720fb6bbe5787 ? this.coeff.times(this.n) : this.coeff.times(this.n).times(fPrime.coeff);
        if (!(fPrimeTwo instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72) || fPrimeTwo instanceof $6dff6b02e459a6ca$export$328720fb6bbe5787)) fPrimeTwo.coeff = new (0, $f182971f6d253900$export$b336c2702c498be5)(1);
        let power = new $6dff6b02e459a6ca$export$ea4e6706f9009a22(this.n.minus(1), {
            fx: this.fx,
            coeff: this.coeff.times(this.n)
        });
        if (fPrime instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72) && fPrime.degree === 0) {
            coeff = coeff.times(fPrime.coeffs[0]);
            power = power.times(fPrime.coeffs[0]);
        }
        const term = `${fPrimeTwo} ${new $6dff6b02e459a6ca$export$ea4e6706f9009a22(this.n.minus(1), {
            fx: this.fx
        })}`;
        const string = `${new (0, $e86e55fd775d0f9a$export$921da06a0f908654)(coeff, term)}`;
        return {
            power: power,
            fPrime: fPrime,
            string: string
        };
    }
    /**
	 * integration of this expression, using the f'(x) ( f(x) )^n formula
	 * for non-linear fx, we assume f'(x) is present
	 */ integrate(options) {
        const { modulus: modulus  } = {
            modulus: true,
            ...options
        };
        const divisor = this.fx instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72) && this.fx.degree === 1 ? this.fx.coeffs[1] : 1;
        if (this.n.isEqualTo(-1)) {
            if (!(this.fx instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72))) // TODO: other forms
            throw new Error(`Only polynomials of degree 1 supported for inner integrand ${this.fx}`);
            return new $6dff6b02e459a6ca$export$3575e8fc3e2771d4({
                fx: this.fx,
                coeff: this.coeff.divide(divisor),
                modulus: modulus
            });
        } else return new $6dff6b02e459a6ca$export$ea4e6706f9009a22(this.n.plus(1), {
            fx: this.fx,
            coeff: this.coeff.divide(this.n.plus(1)).divide(divisor)
        });
    }
    times(x) {
        return new $6dff6b02e459a6ca$export$ea4e6706f9009a22(this.n, {
            fx: this.fx,
            coeff: this.coeff.times(x)
        });
    }
    divide(x) {
        return new $6dff6b02e459a6ca$export$ea4e6706f9009a22(this.n, {
            fx: this.fx,
            coeff: this.coeff.divide(x)
        });
    }
    removeCoeff() {
        return new $6dff6b02e459a6ca$export$ea4e6706f9009a22(this.n, {
            fx: this.fx
        });
    }
    /** sub in: only works for polynomial inner function
	 * and integral n at the moment
	 * also works for square roots if the value substituted in can be square-rooted
	 */ subIn(x) {
        if (!(this.fx instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72))) throw new Error(`PowerFn.subIn() only works for polynomial inner function`);
        if (this.n.isInteger()) {
            if (this.n.isGreaterThan(0)) return this.coeff.times(this.fx.subIn(x).pow(this.n.num));
            else return this.coeff.divide(this.fx.subIn(x).pow(this.n.abs().num));
        }
        if (this.n.den === 2) {
            const sqrtX = new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(this.fx.subIn(x));
            if (sqrtX.isRational()) {
                if (this.n.isGreaterThan(0)) return this.coeff.times(sqrtX.coeff.pow(this.n.num));
                else return this.coeff.divide(sqrtX.coeff.pow(this.n.abs().num));
            }
        }
        throw new Error(`PowerFn.subIn() only works for polynomial inner function and integral n at the moment `);
    }
    /**
	 * only works for polynomial inner function at the moment
	 */ subInNumber(x) {
        if (!(this.fx instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72))) throw new Error(`PowerFn.subIn() only works for polynomial inner function`);
        return Math.pow(this.fx.subInNumber(x), this.n.valueOf()) * this.coeff.valueOf();
    }
    /**
	 * if n = k/2, then substituting a value in will return a surd.
	 * this method accomplishes that
	 */ subInToGetSurd(x) {
        if (this.n.den !== 2) throw new Error(`subInToGetSurd method only works if denominator of n is 2. ${this.n} received.`);
        if (!(this.fx instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72))) throw new Error(`PowerFn.subIn() only works for polynomial inner function`);
        const sqrtX = new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(this.fx.subIn(x));
        return sqrtX.pow(this.n.num).times(this.coeff);
    }
    /**
	 * definite integral: only works for polynomial inner function
	 * and integral n \neq -1 at the moment
	 */ definiteIntegral(lower, upper) {
        if (this.n.isEqualTo(-1)) throw new Error(`logarithmic integral not supported at the moment`);
        const integral = this.integrate();
        return integral.subIn(upper).minus(integral.subIn(lower));
    }
    /**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the terms
	 */ toString() {
        let fxN;
        if (this.n.isEqualTo(0)) fxN = "";
        else if (this.n.isEqualTo(1)) fxN = `${this.fx}`;
        else {
            const nString = `${this.n}`.length === 1 ? `${this.n}` : `{${this.n}}`;
            if (this.fx instanceof $6dff6b02e459a6ca$export$82bd074154d00de7 || this.fx instanceof $6dff6b02e459a6ca$export$8652453b9fa830f2) {
                const cos = this.fx instanceof $6dff6b02e459a6ca$export$82bd074154d00de7 ? "\\cos" : "\\sin";
                const fxString = this.fx.fx.terms.length === 1 ? `${this.fx.fx}` : `\\left( ${this.fx.fx} \\right)`;
                fxN = `${cos}^${nString} ${fxString}`;
            } else fxN = `${this.fx}`.length === 1 ? `${this.fx}^${nString}` : `\\left( ${this.fx} \\right)^${nString}`;
        }
        return `${new (0, $e86e55fd775d0f9a$export$921da06a0f908654)(this.coeff, fxN)}`;
    }
}
class $6dff6b02e459a6ca$export$8652453b9fa830f2 {
    /**
	 * Creates a new SinFn class
	 * @param options defaults to `{ fx: "x", coeff: 1 }`
	 */ constructor(options){
        let { fx: fx , coeff: coeff  } = {
            fx: "x",
            coeff: 1,
            ...options
        };
        if (typeof fx === "string") fx = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            1,
            0
        ], {
            variable: fx
        });
        else if (fx instanceof (0, $8622b8d7bfb82666$export$d155811788b32995)) fx = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            fx.coeff,
            0
        ], {
            variable: fx.variable
        });
        this.fx = fx;
        this.coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
    }
    /** differentiates this expression */ differentiate() {
        //TODO: full chain rule version
        if (this.fx.coeffs.length === 2) // linear fx
        return new $6dff6b02e459a6ca$export$82bd074154d00de7({
            fx: this.fx,
            coeff: this.coeff.times(this.fx.coeffs[1])
        });
        return new $6dff6b02e459a6ca$export$82bd074154d00de7({
            fx: this.fx,
            coeff: this.coeff
        });
    }
    /** integrates this expression */ integrate() {
        if (this.fx.coeffs.length === 2) // linear fx
        return new $6dff6b02e459a6ca$export$82bd074154d00de7({
            fx: this.fx,
            coeff: this.coeff.negative().divide(this.fx.coeffs[1])
        });
        return new $6dff6b02e459a6ca$export$82bd074154d00de7({
            fx: this.fx,
            coeff: this.coeff.negative()
        });
    }
    times(x) {
        return new $6dff6b02e459a6ca$export$8652453b9fa830f2({
            fx: this.fx,
            coeff: this.coeff.times(x)
        });
    }
    removeCoeff() {
        return new $6dff6b02e459a6ca$export$8652453b9fa830f2({
            fx: this.fx
        });
    }
    /**
	 * @returns special ratios
	 *
	 * only works for sin nx at the moment
	 */ subIn(x) {
        if (!(x instanceof (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf))) x = new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(x);
        if (this.fx.coeffs.length === 2 && this.fx.coeffs[0].isEqualTo(0)) x = x.times(this.fx.coeffs[1]);
        else throw new Error(`only works for sin(nx) at the moment ${this}`);
        return (0, $65bb0db3d74bc6f6$export$5de3937cb4b592ed)(x).times(this.coeff);
    }
    /**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the terms
	 */ toString() {
        let fxString = "";
        if (this.fx instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)) fxString = this.fx.terms.length === 1 ? `${this.fx}` : `\\left( ${this.fx} \\right)`;
        return `${new (0, $e86e55fd775d0f9a$export$921da06a0f908654)(this.coeff, `\\sin ${fxString}`)}`;
    }
}
class $6dff6b02e459a6ca$export$82bd074154d00de7 {
    /**
	 * Creates a new CosFn class
	 * @param options defaults to `{ fx: "x", coeff: 1 }`
	 */ constructor(options){
        let { fx: fx , coeff: coeff  } = {
            fx: "x",
            coeff: 1,
            ...options
        };
        if (typeof fx === "string") fx = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            1,
            0
        ], {
            variable: fx
        });
        else if (fx instanceof (0, $8622b8d7bfb82666$export$d155811788b32995)) fx = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            fx.coeff,
            0
        ], {
            variable: fx.variable
        });
        this.fx = fx;
        this.coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
    }
    /** differentiates this expression */ differentiate() {
        //TODO: full chain rule version
        if (this.fx.coeffs.length === 2) // linear fx
        return new $6dff6b02e459a6ca$export$8652453b9fa830f2({
            fx: this.fx,
            coeff: this.coeff.negative().times(this.fx.coeffs[1])
        });
        return new $6dff6b02e459a6ca$export$8652453b9fa830f2({
            fx: this.fx,
            coeff: this.coeff.negative()
        });
    }
    times(x) {
        return new $6dff6b02e459a6ca$export$82bd074154d00de7({
            fx: this.fx,
            coeff: this.coeff.times(x)
        });
    }
    /** integrates this expression */ integrate() {
        if (this.fx.coeffs.length === 2) // linear fx
        return new $6dff6b02e459a6ca$export$8652453b9fa830f2({
            fx: this.fx,
            coeff: this.coeff.divide(this.fx.coeffs[1])
        });
        return new $6dff6b02e459a6ca$export$8652453b9fa830f2({
            fx: this.fx,
            coeff: this.coeff
        });
    }
    removeCoeff() {
        return new $6dff6b02e459a6ca$export$82bd074154d00de7({
            fx: this.fx
        });
    }
    /**
	 * @returns special ratios
	 *
	 * only works for sin nx at the moment
	 */ subIn(x) {
        if (!(x instanceof (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf))) x = new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(x);
        if (this.fx.coeffs.length === 2 && this.fx.coeffs[0].isEqualTo(0)) x = x.times(this.fx.coeffs[1]);
        else throw new Error(`only works for sin(nx) at the moment ${this}`);
        return (0, $65bb0db3d74bc6f6$export$50d414a77b60d802)(x).times(this.coeff);
    }
    /**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the terms
	 */ toString() {
        let fxString = "";
        if (this.fx instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)) fxString = this.fx.terms.length === 1 ? `${this.fx}` : `\\left( ${this.fx} \\right)`;
        return `${new (0, $e86e55fd775d0f9a$export$921da06a0f908654)(this.coeff, `\\cos ${fxString}`)}`;
    }
}
class $6dff6b02e459a6ca$export$a05b5f03bbb445dc {
    /**
	 * Creates a new CosFn class
	 * @param options defaults to `{ fx: "x", coeff: 1 }`
	 */ constructor(options){
        let { fx: fx , coeff: coeff  } = {
            fx: "x",
            coeff: 1,
            ...options
        };
        if (typeof fx === "string") fx = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            1,
            0
        ], {
            variable: fx
        });
        else if (fx instanceof (0, $8622b8d7bfb82666$export$d155811788b32995)) fx = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            fx.coeff,
            0
        ], {
            variable: fx.variable
        });
        this.fx = fx;
        this.coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
    }
    /** differentiates this expression */ differentiate() {
        //TODO: full chain rule version
        if (this.fx.coeffs.length === 2) // linear fx
        return new $6dff6b02e459a6ca$export$a05b5f03bbb445dc({
            fx: this.fx,
            coeff: this.coeff.times(this.fx.coeffs[1])
        });
        return new $6dff6b02e459a6ca$export$a05b5f03bbb445dc({
            fx: this.fx,
            coeff: this.coeff
        });
    }
    /** integrates this expression */ integrate() {
        if (this.fx.coeffs.length === 2) // linear fx
        return new $6dff6b02e459a6ca$export$a05b5f03bbb445dc({
            fx: this.fx,
            coeff: this.coeff.divide(this.fx.coeffs[1])
        });
        return new $6dff6b02e459a6ca$export$a05b5f03bbb445dc({
            fx: this.fx,
            coeff: this.coeff
        });
    }
    times(x) {
        return new $6dff6b02e459a6ca$export$a05b5f03bbb445dc({
            fx: this.fx,
            coeff: this.coeff.times(x)
        });
    }
    removeCoeff() {
        return new $6dff6b02e459a6ca$export$a05b5f03bbb445dc({
            fx: this.fx
        });
    }
    /**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the terms
	 */ toString() {
        return `${new (0, $e86e55fd775d0f9a$export$921da06a0f908654)(this.coeff, `\\mathrm{e}^{${this.fx}}`)}`;
    }
}
class $6dff6b02e459a6ca$export$3575e8fc3e2771d4 {
    /**
	 * Creates a new SinFn class
	 * @param options defaults to `{ fx: "x", coeff: 1 }`
	 */ constructor(options){
        let { fx: fx , coeff: coeff , modulus: modulus  } = {
            fx: "x",
            coeff: 1,
            modulus: false,
            ...options
        };
        if (typeof fx === "string") fx = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            1,
            0
        ], {
            variable: fx
        });
        else if (fx instanceof (0, $8622b8d7bfb82666$export$d155811788b32995)) fx = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            fx.coeff,
            0
        ], {
            variable: fx.variable
        });
        this.fx = fx;
        this.coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
        this.modulus = modulus;
    }
    /** differentiates this expression */ differentiate() {
        return new $6dff6b02e459a6ca$export$328720fb6bbe5787(this.fx.differentiate().times(this.coeff), this.fx);
    }
    ///** integrates this expression */
    //integrate(): CosFn {
    //	//TODO: chain rule version
    //	return new CosFn({ fx: this.fx, coeff: this.coeff.negative() });
    //}
    /**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the terms
	 */ toString() {
        if (this.modulus) return `${new (0, $e86e55fd775d0f9a$export$921da06a0f908654)(this.coeff, `\\ln \\left| ${this.fx} \\right|`)}`;
        let fxString = `${this.fx}`;
        if (this.fx instanceof (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)) fxString = this.fx.terms.length === 1 ? `${this.fx}` : `\\left( ${this.fx} \\right)`;
        return `${new (0, $e86e55fd775d0f9a$export$921da06a0f908654)(this.coeff, `\\ln ${fxString}`)}`;
    }
}
class $6dff6b02e459a6ca$export$328720fb6bbe5787 extends (0, $143c6632afa73a82$export$7e4481e23b2eabc5) {
    constructor(num, den = 1, options){
        super(num, den, options);
    }
    /** differentiates this expression */ differentiate() {
        return new $6dff6b02e459a6ca$export$328720fb6bbe5787(this.den.times(this.num.differentiate()).minus(this.num.times(this.den.differentiate())), this.num.square(), {
            poles: this.poles
        });
    }
}



class $b21060e9d1664778$export$eb22aabd7ed82a4f extends (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83) {
    /**
	 * @param negCoeffs [a_{-1}, ... a_{-m}]
	 */ constructor(poly, negCoeffs){
        if (Array.isArray(poly)) poly = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)(poly);
        const x = poly.variable;
        const negCoeffsFrac = negCoeffs.map((x)=>(0, $2aab13bad14c4123$export$98fc78f39c2afd39)(x));
        while(negCoeffsFrac.at(-1)?.isEqualTo(0))negCoeffsFrac.pop();
        const negativeTerms = [];
        negCoeffsFrac.forEach((coeff, i)=>{
            const sign = coeff.sign();
            const xPower = i === 0 ? x : `x^{${i + 1}}`;
            const xPowerTerm = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(coeff.den, xPower);
            negativeTerms.push(new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(sign, `\\frac{${coeff.abs().num}}{${xPowerTerm}}`));
        });
        super(...poly.terms, ...negativeTerms);
        this.poly = poly;
        this.negCoeffs = negCoeffsFrac;
    }
    differentiate() {
        const newNegCoeffs = this.negCoeffs.map((a, i)=>a.times(-i - 1));
        return new $b21060e9d1664778$export$eb22aabd7ed82a4f(this.poly.differentiate(), [
            0,
            ...newNegCoeffs
        ]);
    }
    multiplyDenom() {
        const powerDen = this.negCoeffs.length;
        const poly = this.poly.times(new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            1
        ], {
            degree: powerDen
        }));
        const poly2 = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)(this.negCoeffs);
        return poly.plus(poly2);
    }
    subIn(x) {
        let result = this.poly.subIn(x);
        const xFrac = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(x);
        this.negCoeffs.forEach((a, i)=>{
            result = result.plus(a.divide(xFrac.pow(i + 1)));
        });
        return result;
    }
    subInSurd(x) {
        const surds = [];
        const polyTerms = this.poly.subInSurd(x).terms;
        //this.poly.coeffs.forEach((a, i) => {
        //	surds.push(x.pow(i).times(a));
        //});
        this.negCoeffs.forEach((a, i)=>{
            surds.push(new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(1, a).divide(x.pow(i + 1)));
        });
        return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(...polyTerms, ...surds);
    }
    /**
	 * toJSON method that allows for quick reconstruction of class instance
	 * by storing its constructor arguments
	 */ toJSON() {
        return {
            type: "laurent",
            args: [
                this.poly.clone(),
                this.negCoeffs.map((x)=>x.clone())
            ]
        };
    }
}





class $a288c1e6c388e093$export$c7d16d1250ccf8de {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    /**
	 * the derivative dydx
	 * @return `{num, den, string}`
	 */ dydx() {
        const dydt = this.y instanceof (0, $6dff6b02e459a6ca$export$ea4e6706f9009a22) ? this.y.differentiate().string : `${this.y.differentiate()}`;
        const dxdt = this.x instanceof (0, $6dff6b02e459a6ca$export$ea4e6706f9009a22) ? this.x.differentiate().string : `${this.x.differentiate()}`;
        return `\\frac{${dydt}}{${dxdt}}`;
    }
}




function $6791662b653aeece$export$368759af55f0e249(rational) {
    if (rational.num.degree > 0) throw new Error(`only constant numerators supported ${rational}`);
    if (rational.den.degree === 1) {
        // make monic to prepare for integration
        const leadingCoeff = rational.den.coeffs[1].abs();
        rational = new (0, $143c6632afa73a82$export$7e4481e23b2eabc5)(rational.num.divide(leadingCoeff), rational.den.divide(leadingCoeff));
    }
    return new (0, $6dff6b02e459a6ca$export$ea4e6706f9009a22)(-1, {
        fx: rational.den,
        coeff: rational.num.coeffs[0]
    });
}




const $c4bc1a7d63c2bbb7$export$406ca9c041e9374f = {
    /** integration of cos^2 (kx) */ cos2: (options)=>$c4bc1a7d63c2bbb7$var$doubleAngle(true, options),
    /** integration of sin^2 (kx) */ sin2: (options)=>$c4bc1a7d63c2bbb7$var$doubleAngle(false, options),
    sinSin: (A, B, options)=>$c4bc1a7d63c2bbb7$var$factor("sinSin", A, B, options),
    cosCos: (A, B, options)=>$c4bc1a7d63c2bbb7$var$factor("cosCos", A, B, options),
    sinCos: (A, B, options)=>$c4bc1a7d63c2bbb7$var$factor("sinCos", A, B, options),
    cosSin: (A, B, options)=>$c4bc1a7d63c2bbb7$var$factor("cosSin", A, B, options)
};
const $c4bc1a7d63c2bbb7$export$64b246388e083c5f = {
    /** definite integral of cos^2 (kx) */ cos2: (lower, upper, options)=>$c4bc1a7d63c2bbb7$var$doubleAngleD(true, lower, upper, options),
    /** definite integral of sin^2 (kx) */ sin2: (lower, upper, options)=>$c4bc1a7d63c2bbb7$var$doubleAngleD(false, lower, upper, options),
    sinSin: (A, B, lower, upper, options)=>$c4bc1a7d63c2bbb7$var$factorD("sinSin", A, B, lower, upper, options),
    cosCos: (A, B, lower, upper, options)=>$c4bc1a7d63c2bbb7$var$factorD("cosCos", A, B, lower, upper, options),
    sinCos: (A, B, lower, upper, options)=>$c4bc1a7d63c2bbb7$var$factorD("sinCos", A, B, lower, upper, options),
    cosSin: (A, B, lower, upper, options)=>$c4bc1a7d63c2bbb7$var$factorD("cosSin", A, B, lower, upper, options)
};
/**
 * integration of coeff cos^2 (kx)
 */ function $c4bc1a7d63c2bbb7$var$doubleAngle(cos, options) {
    let { k: k , coeff: coeff , variable: variable  } = {
        k: 1,
        coeff: 1,
        variable: "x",
        ...options
    };
    k = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(k);
    coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
    const xOver2 = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2), variable).times(coeff);
    const twoKX = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(2, k, variable);
    const sineTwoKX = `\\sin ${twoKX}`;
    const sineTerm = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(k.reciprocal().divide(4).times(coeff), sineTwoKX);
    // x/2 - 1/4k sin (2kx)
    return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(xOver2, cos ? sineTerm : sineTerm.times(-1));
}
/**
 * definite integration of coeff cos^2 (kx)
 */ function $c4bc1a7d63c2bbb7$var$doubleAngleD(cos, lower, upper, options) {
    let { k: k , coeff: coeff , variable: variable  } = {
        k: 1,
        coeff: 1,
        variable: "x",
        ...options
    };
    k = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(k);
    coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
    lower = lower instanceof (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf) ? lower : new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(lower, {
        domain: "all"
    });
    upper = upper instanceof (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf) ? upper : new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(upper, {
        domain: "all"
    });
    const xOver2 = upper.minus(lower).divide(2);
    const sineTerm1 = (0, $65bb0db3d74bc6f6$export$5de3937cb4b592ed)(upper.times(2).times(k)).divide(4).divide(k).times(coeff);
    const sineTerm2 = (0, $65bb0db3d74bc6f6$export$5de3937cb4b592ed)(lower.times(2).times(k)).divide(4).divide(k).times(coeff);
    // x/2 - 1/4k sin (2kx)
    return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(xOver2, cos ? sineTerm1 : sineTerm1.times(-1), cos ? sineTerm2.times(-1) : sineTerm2);
}
function $c4bc1a7d63c2bbb7$var$factor(mode, A, B, options) {
    A = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(A);
    B = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(B);
    const { variable: variable , coeff: coeffNum  } = {
        variable: "x",
        coeff: 1,
        ...options
    };
    const coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeffNum);
    const P = A.plus(B);
    const Q = A.minus(B);
    const Px = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(P, variable);
    const Qx = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(Q, variable);
    let firstTerm, secondTerm;
    if (mode === "sinSin") {
        // sin A sin B = 1/2 ( -cos(A+B) + cos(A-B) )
        // integration gives
        // -sin(A+B)/2(A+B) + sin(A-B)/2(A-B)
        firstTerm = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(-1, `\\sin ${Px}`).times(P.reciprocal()).times(new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2));
        secondTerm = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(`\\sin ${Qx}`).times(Q.reciprocal()).times(new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2));
    } else if (mode === "cosCos") {
        // cos A cos B = 1/2 ( cos(A+B) + cos(A-B) )
        // integration gives
        // sin(A+B)/2(A+B) + sin(A-B)/2(A-B)
        firstTerm = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(`\\sin ${Px}`).times(P.reciprocal()).times(new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2));
        secondTerm = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(`\\sin ${Qx}`).times(Q.reciprocal()).times(new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2));
    } else if (mode === "sinCos") {
        // sin A cos B = 1/2 ( sin(A+B) + sin(A-B) )
        // integration gives
        // -cos(A+B)/2(A+B) - cos(A-B)/2(A-B)
        firstTerm = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(-1, `\\cos ${Px}`).times(P.reciprocal()).times(new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2));
        secondTerm = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(-1, `\\cos ${Qx}`).times(Q.reciprocal()).times(new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2));
    } else if (mode === "cosSin") {
        // cos A sin B = 1/2 ( sin(A+B) - sin(A-B) )
        // integration gives
        // -cos(A+B)/2(A+B) + cos(A-B)/2(A-B)
        firstTerm = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(-1, `\\cos ${Px}`).times(P.reciprocal()).times(new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2));
        secondTerm = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(`\\cos ${Qx}`).times(Q.reciprocal()).times(new (0, $f182971f6d253900$export$b336c2702c498be5)(1, 2));
    } else throw new Error(`invalid mode`);
    return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(firstTerm, secondTerm).times(coeff);
}
function $c4bc1a7d63c2bbb7$var$factorD(mode, A, B, lower, upper, options) {
    A = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(A);
    B = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(B);
    const { coeff: coeffNum  } = {
        coeff: 1,
        ...options
    };
    const coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeffNum);
    const P = A.plus(B);
    const Q = A.minus(B);
    let firstTerm, secondTerm;
    lower = lower instanceof (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf) ? lower : new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(lower, {
        domain: "all"
    });
    upper = upper instanceof (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf) ? upper : new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(upper, {
        domain: "all"
    });
    const angle1Upper = upper.times(P);
    const angle1Lower = lower.times(P);
    const angle2Upper = upper.times(Q);
    const angle2Lower = lower.times(Q);
    if (mode === "sinSin") {
        // sin A sin B = 1/2 ( -cos(A+B) + cos(A-B) )
        // integration gives
        // -sin(A+B)/2(A+B) + sin(A-B)/2(A-B)
        const ratio1Upper = (0, $65bb0db3d74bc6f6$export$5de3937cb4b592ed)(angle1Upper);
        const term1Upper = ratio1Upper.divide(-2).divide(P);
        const ratio1Lower = (0, $65bb0db3d74bc6f6$export$5de3937cb4b592ed)(angle1Lower);
        const term1Lower = ratio1Lower.divide(-2).divide(P);
        const ratio2Upper = (0, $65bb0db3d74bc6f6$export$5de3937cb4b592ed)(angle2Upper);
        const term2Upper = ratio2Upper.divide(2).divide(Q);
        const ratio2Lower = (0, $65bb0db3d74bc6f6$export$5de3937cb4b592ed)(angle2Lower);
        const term2Lower = ratio2Lower.divide(2).divide(Q);
        return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(term1Upper, term2Upper, term1Lower.negative(), term2Lower.negative()).times(coeff);
    } else if (mode === "cosCos") {
        // cos A cos B = 1/2 ( cos(A+B) + cos(A-B) )
        // integration gives
        // sin(A+B)/2(A+B) + sin(A-B)/2(A-B)
        const ratio1Upper1 = (0, $65bb0db3d74bc6f6$export$5de3937cb4b592ed)(angle1Upper);
        const term1Upper1 = ratio1Upper1.divide(2).divide(P);
        const ratio1Lower1 = (0, $65bb0db3d74bc6f6$export$5de3937cb4b592ed)(angle1Lower);
        const term1Lower1 = ratio1Lower1.divide(2).divide(P);
        const ratio2Upper1 = (0, $65bb0db3d74bc6f6$export$5de3937cb4b592ed)(angle2Upper);
        const term2Upper1 = ratio2Upper1.divide(2).divide(Q);
        const ratio2Lower1 = (0, $65bb0db3d74bc6f6$export$5de3937cb4b592ed)(angle2Lower);
        const term2Lower1 = ratio2Lower1.divide(2).divide(Q);
        return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(term1Upper1, term2Upper1, term1Lower1.negative(), term2Lower1.negative()).times(coeff);
    } else if (mode === "sinCos") {
        // sin A cos B = 1/2 ( sin(A+B) + sin(A-B) )
        // integration gives
        // -cos(A+B)/2(A+B) - cos(A-B)/2(A-B)
        const ratio1Upper2 = (0, $65bb0db3d74bc6f6$export$50d414a77b60d802)(angle1Upper);
        const term1Upper2 = ratio1Upper2.divide(-2).divide(P);
        const ratio1Lower2 = (0, $65bb0db3d74bc6f6$export$50d414a77b60d802)(angle1Lower);
        const term1Lower2 = ratio1Lower2.divide(-2).divide(P);
        const ratio2Upper2 = (0, $65bb0db3d74bc6f6$export$50d414a77b60d802)(angle2Upper);
        const term2Upper2 = ratio2Upper2.divide(-2).divide(Q);
        const ratio2Lower2 = (0, $65bb0db3d74bc6f6$export$50d414a77b60d802)(angle2Lower);
        const term2Lower2 = ratio2Lower2.divide(-2).divide(Q);
        return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(term1Upper2, term2Upper2, term1Lower2.negative(), term2Lower2.negative()).times(coeff);
    } else if (mode === "cosSin") {
        // cos A sin B = 1/2 ( sin(A+B) - sin(A-B) )
        // integration gives
        // -cos(A+B)/2(A+B) + cos(A-B)/2(A-B)
        const ratio1Upper3 = (0, $65bb0db3d74bc6f6$export$50d414a77b60d802)(angle1Upper);
        const term1Upper3 = ratio1Upper3.divide(-2).divide(P);
        const ratio1Lower3 = (0, $65bb0db3d74bc6f6$export$50d414a77b60d802)(angle1Lower);
        const term1Lower3 = ratio1Lower3.divide(-2).divide(P);
        const ratio2Upper3 = (0, $65bb0db3d74bc6f6$export$50d414a77b60d802)(angle2Upper);
        const term2Upper3 = ratio2Upper3.divide(2).divide(Q);
        const ratio2Lower3 = (0, $65bb0db3d74bc6f6$export$50d414a77b60d802)(angle2Lower);
        const term2Lower3 = ratio2Lower3.divide(2).divide(Q);
        return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(term1Upper3, term2Upper3, term1Lower3.negative(), term2Lower3.negative()).times(coeff);
    } else throw new Error(`invalid mode`);
}





function $461aa5de5632caf8$export$620d66a0ebf15f13(quadratic, options) {
    const { a: a , completedSquare: completedSquare , c: c  } = (0, $48fbc849e2253d56$export$a4ad7037c1d4646c)(quadratic);
    const { squareRootMode: squareRootMode , initial: initial , modulus: modulus , flip: flip  } = {
        squareRootMode: false,
        modulus: true,
        flip: false,
        ...options
    };
    if (squareRootMode) return $461aa5de5632caf8$var$arcsin(completedSquare, c, {
        coeff: a
    });
    if (a.isGreaterThan(0) && c.isGreaterThan(0)) return $461aa5de5632caf8$var$arctan(completedSquare, c, {
        coeff: a
    });
    else if (a.times(c).isLessThan(0)) return $461aa5de5632caf8$var$ln(completedSquare, c, {
        coeff: a,
        initial: initial,
        modulus: modulus,
        flip: flip
    });
    else throw new Error(`1/(-x^2 - a^2) not supported at the moment. Consider trying again after factoring out -1.`);
}
/**
 * integrates 1 / ( coeff (x+b)^2 + a2 )
 * @param x represents x+b
 */ function $461aa5de5632caf8$var$arctan(x, a2, options) {
    let { coeff: coeff  } = {
        coeff: 1,
        ...options
    };
    coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
    a2 = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(a2).divide(coeff);
    const a = new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(a2);
    let xTerm;
    if (a.isEqualTo(1)) xTerm = `${x}`;
    else {
        const x0Coeff = x.coeffs[0];
        const multiple = (0, $7f2edef52699c44b$export$f686d97e407ec4ef)(a.coeff.den, x0Coeff.den);
        const aWithoutDen = a.times(multiple);
        const xWithoutDen = x.times(multiple);
        xTerm = `\\frac{${xWithoutDen}}{${aWithoutDen}}`;
    }
    const poly = x;
    return {
        toString () {
            const term = a.reciprocal().divide(coeff).times(`\\tan^{-1} \\left( ${xTerm} \\right)`);
            return `${term}`;
        },
        subIn (x) {
            const b = poly.coeffs[1];
            if (!b.isEqualTo(0)) throw new Error(`sub in only implemented for b \\neq 0 in (x+b)^2`);
            if (!a.isRational) throw new Error(`sub in only implemented for a rational in c(x+b)^2 + a2`);
            return (0, $49c7af4e0a088319$export$628dc4eed22b0fbd)((0, $23160e13dd404e1b$export$d991e3d99172da5e)(x).divide(a.coeff)).divide(a.coeff).divide(coeff);
        }
    };
}
/**
 * integrates 1 / ( coeff (x+b)^2 - a2 )
 * @param x represents x+b
 */ function $461aa5de5632caf8$var$ln(x, a2, options) {
    let { coeff: coeff , initial: initial , modulus: modulus , flip: flip  } = {
        coeff: 1,
        modulus: true,
        flip: false,
        ...options
    };
    coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
    a2 = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(a2).divide(coeff);
    const positiveCoeff = coeff.isGreaterThan(0);
    coeff = coeff.abs();
    const a = new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(a2.abs());
    const poly = x;
    return {
        toString () {
            const x0Coeff = x.coeffs[0];
            const multiple = (0, $7f2edef52699c44b$export$f686d97e407ec4ef)(a.coeff.den, x0Coeff.den);
            const aWithoutDen = a.times(multiple);
            const xWithoutDen = x.times(multiple);
            let xNum, xDen;
            if (initial) {
                if (!a.isRational()) throw new Error(`sub in only implemented for rational a in 1/(x^2 + a^2)`);
                const aCoeff = a.coeff;
                const integrationConstant = positiveCoeff ? x.subIn(initial).minus(aCoeff).divide(x.subIn(initial).plus(aCoeff)) : aCoeff.plus(x.subIn(initial)).divide(aCoeff.minus(x.subIn(initial)));
                xNum = positiveCoeff ? new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(...xWithoutDen.terms, aWithoutDen.negative()).times(integrationConstant.den) : new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(aWithoutDen, ...xWithoutDen.terms).times(integrationConstant.den);
                xDen = positiveCoeff ? new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(...xWithoutDen.terms, aWithoutDen).times(integrationConstant.num) : new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(aWithoutDen, ...xWithoutDen.negative().terms).times(integrationConstant.num);
            } else {
                xNum = positiveCoeff ? new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(...xWithoutDen.terms, aWithoutDen.negative()) : new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(aWithoutDen, ...xWithoutDen.terms);
                xDen = positiveCoeff ? new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(...xWithoutDen.terms, aWithoutDen) : new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(aWithoutDen, ...xWithoutDen.negative().terms);
            }
            const open = modulus ? `|` : `(`;
            const close = modulus ? `|` : `)`;
            if (flip) [xNum, xDen] = [
                xDen,
                xNum
            ];
            const term = a.reciprocal().divide(2).divide(coeff).times(`\\ln \\left${open} \\frac{${xNum}}{${xDen}} \\right${close}`);
            return `${term}`;
        },
        subIn (x) {
            if (!a.isRational()) throw new Error(`sub in only implemented for rational a in 1/(x^2 + a^2)`);
            const aFrac = a.coeff;
            const lnCoeff = aFrac.reciprocal().divide(2).divide(coeff);
            return positiveCoeff ? new $461aa5de5632caf8$var$LnValue(poly.subIn(x).minus(aFrac).divide(poly.subIn(x).plus(aFrac)), {
                coeff: lnCoeff
            }) : new $461aa5de5632caf8$var$LnValue(poly.subIn(x).plus(aFrac).divide(poly.subIn(x).negative().plus(aFrac)), {
                coeff: lnCoeff
            });
        },
        subInSurdCase (x) {
            const x0Coeff = poly.coeffs[0];
            const multiple = (0, $7f2edef52699c44b$export$f686d97e407ec4ef)(a.coeff.den, x0Coeff.den);
            const x1 = poly.times(multiple).subIn(x);
            const xWithoutDen = x1.times(x1.den);
            const aWithoutDen = a.times(multiple).times(x1.den);
            let xNum = positiveCoeff ? new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(xWithoutDen, aWithoutDen.negative()) : new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(aWithoutDen, xWithoutDen);
            let xDen = positiveCoeff ? new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(xWithoutDen, aWithoutDen) : new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(aWithoutDen, xWithoutDen.negative());
            const open = modulus ? `|` : `(`;
            const close = modulus ? `|` : `)`;
            if (flip) [xNum, xDen] = [
                xDen,
                xNum
            ];
            const term = a.reciprocal().divide(2).divide(coeff).times(`\\ln \\left${open} \\frac{${xNum}}{${xDen}} \\right${close}`);
            return `${term}`;
        }
    };
}
/**
 * integrates 1 / sqrt( a2 - coeff (x+b)^2 )
 * @param x represents x+b
 */ function $461aa5de5632caf8$var$arcsin(x, a2, options) {
    let { coeff: coeff  } = {
        coeff: 1,
        ...options
    };
    coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
    a2 = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(a2).divide(coeff);
    const a = new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(a2);
    let xTerm;
    if (a.isEqualTo(1)) xTerm = `${x}`;
    else {
        const x0Coeff = x.coeffs[0];
        const multiple = (0, $7f2edef52699c44b$export$f686d97e407ec4ef)(a.coeff.den, x0Coeff.den);
        const aWithoutDen = a.times(multiple);
        const xWithoutDen = x.times(multiple);
        xTerm = `\\frac{${xWithoutDen}}{${aWithoutDen}}`;
    }
    const poly = x;
    const sinCoeff = new (0, $54e5ac5d13ec125e$export$598b1075f1324aa)(coeff.reciprocal());
    return {
        toString () {
            const term = sinCoeff.times(`\\sin^{-1} \\left( ${xTerm} \\right)`);
            return `${term}`;
        },
        subIn (x) {
            const b = poly.coeffs[1];
            if (!b.isEqualTo(0)) throw new Error(`sub in only implemented for b \\neq 0 in (x+b)^2`);
            if (!sinCoeff.isRational()) throw new Error(`sub in only implemented for sqrt(c) rational in c(x+b)^2 + a2`);
            return (0, $49c7af4e0a088319$export$41726bdb1fc63f)((0, $23160e13dd404e1b$export$d991e3d99172da5e)(x).divide(a)).divide(sinCoeff.coeff);
        }
    };
}
/**
 * a ln x
 */ class $461aa5de5632caf8$var$LnValue {
    constructor(x, options){
        const { coeff: coeff  } = {
            coeff: 1,
            ...options
        };
        x = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(x);
        if (x.isAtMost(0)) throw new RangeError(`logarithm argument must be positive: ${x} received`);
        this.coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
        this.x = x;
    }
    toString() {
        if (this.x.isEqualTo(1)) return `0`;
        const term = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(this.coeff, `\\ln ${this.x}`);
        return `${term}`;
    }
    valueOf() {
        return this.coeff.valueOf() * Math.log(this.x.valueOf());
    }
}





function $6f76d9e43cd15bc1$export$57f4bcdf91190ffa(u, vPrime) {
    if (u instanceof (0, $6dff6b02e459a6ca$export$ea4e6706f9009a22)) {
        if (vPrime instanceof (0, $6dff6b02e459a6ca$export$82bd074154d00de7) || vPrime instanceof (0, $6dff6b02e459a6ca$export$8652453b9fa830f2) || vPrime instanceof (0, $6dff6b02e459a6ca$export$a05b5f03bbb445dc)) return $6f76d9e43cd15bc1$var$powerTrigo(u, vPrime);
    }
    throw new Error(`integration type not supported`);
}
function $6f76d9e43cd15bc1$var$powerTrigo(u, vPrime, firstTerms, sign = 1) {
    if (!u.n.isInteger() || u.n.isLessThan(0)) throw new Error(`power ${u.n} not supported`);
    const v = vPrime.integrate();
    if (u.n.isEqualTo(0)) {
        const vTerm = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(v.coeff, u.coeff, `${v.removeCoeff()}`);
        return firstTerms ? firstTerms.plus(vTerm.times(sign)) : new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(vTerm);
    }
    const uPrime = u.differentiate().power;
    const uvTerm = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(u.coeff, v.coeff, `${u.removeCoeff()}`, `${v.removeCoeff()}`);
    const frontTerms = firstTerms ? firstTerms.plus(uvTerm.times(sign)) : new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(uvTerm);
    return $6f76d9e43cd15bc1$var$powerTrigo(uPrime, v, frontTerms, sign * -1);
}
function $6f76d9e43cd15bc1$export$6719eade253c16c5(u, vPrime, lower, upper) {
    if (u instanceof (0, $6dff6b02e459a6ca$export$ea4e6706f9009a22)) {
        if (vPrime instanceof (0, $6dff6b02e459a6ca$export$82bd074154d00de7) || vPrime instanceof (0, $6dff6b02e459a6ca$export$8652453b9fa830f2)) return $6f76d9e43cd15bc1$var$powerTrigoD(u, vPrime, lower, upper);
        else if (vPrime instanceof (0, $6dff6b02e459a6ca$export$a05b5f03bbb445dc)) return $6f76d9e43cd15bc1$var$powerExpD(u, vPrime, lower, upper);
    }
    throw new Error(`integration type not supported`);
}
function $6f76d9e43cd15bc1$var$powerTrigoD(u, vPrime, lower, upper, firstTerms, sign = 1) {
    if (!u.n.isInteger() || u.n.isLessThan(0)) throw new Error(`power ${u.n} not supported`);
    const v = vPrime.integrate();
    const vTermLower = (v instanceof (0, $6dff6b02e459a6ca$export$82bd074154d00de7) ? (0, $65bb0db3d74bc6f6$export$50d414a77b60d802)(lower) : (0, $65bb0db3d74bc6f6$export$5de3937cb4b592ed)(lower)).times(v.coeff);
    const vTermUpper = (v instanceof (0, $6dff6b02e459a6ca$export$82bd074154d00de7) ? (0, $65bb0db3d74bc6f6$export$50d414a77b60d802)(upper) : (0, $65bb0db3d74bc6f6$export$5de3937cb4b592ed)(upper)).times(v.coeff);
    if (u.n.isEqualTo(0)) return firstTerms ? firstTerms.plus(vTermUpper.times(sign).times(u.coeff)).minus(vTermLower.times(sign).times(u.coeff)) : new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(vTermUpper, vTermLower.negative());
    const uPrime = u.differentiate().power;
    lower = new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(lower instanceof (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf) ? lower.k : lower, {
        domain: "all"
    });
    upper = new (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf)(upper instanceof (0, $5d4be2d9156d310f$export$6cdc1cb9345ffadf) ? upper.k : upper, {
        domain: "all"
    });
    const uTermLower = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(u.coeff, lower.k.pow(u.n.num), u.n.isEqualTo(1) ? `\\pi` : `\\pi^{${u.n}}`);
    const uTermUpper = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(u.coeff, upper.k.pow(u.n.num), u.n.isEqualTo(1) ? `\\pi` : `\\pi^{${u.n}}`);
    const uvTermUpper = uTermUpper.times(vTermUpper);
    const uvTermLower = uTermLower.times(vTermLower);
    const frontTerms = firstTerms ? firstTerms.plus(uvTermUpper.times(sign)).minus(uvTermLower.times(sign)) : new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(uvTermUpper, uvTermLower.negative());
    return $6f76d9e43cd15bc1$var$powerTrigoD(uPrime, v, lower, upper, frontTerms, sign * -1);
}
function $6f76d9e43cd15bc1$var$powerExpD(u, vPrime, lower, upper, firstTerms, sign = 1) {
    if (!u.n.isInteger() || u.n.isLessThan(0)) throw new Error(`power ${u.n} not supported`);
    lower = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(lower);
    upper = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(upper);
    const v = vPrime.integrate();
    const vTermUpper = upper.isEqualTo(0) ? new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(v.coeff) : new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(v.coeff, upper.isEqualTo(1) ? `\\mathrm{e}` : `\\mathrm{e}^{${upper}}`);
    const vTermLower = lower.isEqualTo(0) ? new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(v.coeff) : new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(v.coeff, lower.isEqualTo(1) ? `\\mathrm{e}` : `\\mathrm{e}^{${lower}}`);
    if (u.n.isEqualTo(0)) return firstTerms ? firstTerms.plus(vTermUpper.times(sign).times(u.coeff)).minus(vTermLower.times(sign).times(u.coeff)) : new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(vTermUpper, vTermLower.negative());
    const uPrime = u.differentiate().power;
    const uvTermUpper = vTermUpper.times(u.subIn(upper));
    const uvTermLower = vTermLower.times(u.subIn(lower));
    const frontTerms = firstTerms ? firstTerms.plus(uvTermUpper.times(sign)).minus(uvTermLower.times(sign)) : new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(uvTermUpper, uvTermLower.negative());
    return $6f76d9e43cd15bc1$var$powerExpD(uPrime, v, lower, upper, frontTerms, sign * -1);
}


const $1bbf0a677f9ca058$export$df970fd884294dfc = {
    trigo: /** trigo integrations */ $c4bc1a7d63c2bbb7$export$406ca9c041e9374f,
    byParts: /** by parts integrations */ $6f76d9e43cd15bc1$export$57f4bcdf91190ffa,
    mf26: /** integration of 1/(x^2 \\pm a^2) or 1/sqrt(x^2 \\pm a^2) */ $461aa5de5632caf8$export$620d66a0ebf15f13
};
const $1bbf0a677f9ca058$export$e36b90034991744d = {
    /** trigo integrations */ trigo: (0, $c4bc1a7d63c2bbb7$export$64b246388e083c5f),
    /** by parts integrations */ byParts: (0, $6f76d9e43cd15bc1$export$6719eade253c16c5)
};


function $38b79cedb7ce23bc$export$56bc470288536c11(f, lower, upper, intervals = 100) {
    let result = 0;
    const stepSize = (upper - lower) / intervals;
    let i;
    for(i = 0; i < intervals; i++)result += $38b79cedb7ce23bc$var$simpson_step(f, lower + i * stepSize, lower + (i + 1) * stepSize);
    return result;
}
const $38b79cedb7ce23bc$var$simpson_step = function(f, a, b) {
    return (b - a) / 8 * (f(a) + 3 * f((2 * a + b) / 3) + 3 * f((a + 2 * b) / 3) + f(b));
};


function $557e9ee971ba496a$export$100053bd28448230(f, x, precision = 5) {
    const h = Math.pow(10, -precision);
    return (f(x + h) - f(x - h)) / 2 / h;
}



function $b42e2f2c075d0fac$export$dc37ebeb5724fe8d(poly, options) {
    let variable = options?.variable ?? "t";
    if (Array.isArray(poly)) poly = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)(poly, {
        ascending: true,
        variable: variable
    });
    if (typeof poly === "number" || poly instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) poly = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
        0,
        poly
    ], {
        ascending: true,
        variable: variable
    });
    const [a, b] = poly.coeffs;
    const bt = new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)(b, {
        variable: variable
    });
    // a + b x = A exp( b t )
    // x = (A exp(bt) - a) / b
    if (options?.initial === undefined) {
        const bReciprocal = b.reciprocal();
        return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(bReciprocal, `A \\mathrm{e}^{ ${bt} }`), a.negative().divide(b));
    } else {
        const A = poly.subIn(options.initial);
        return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(A.divide(b), `\\mathrm{e}^{ ${bt} }`), a.negative().divide(b));
    }
}


const $67966bfb2f57a162$export$2fa162a495d26869 = {
    type1a: $b42e2f2c075d0fac$export$dc37ebeb5724fe8d
};




function $550b1ff9f85b2ad1$export$3969146df1258ac(jsonString) {
    const jsonObject = JSON.parse(jsonString);
    return Array.isArray(jsonObject) ? $550b1ff9f85b2ad1$var$parseArray(jsonObject) : $550b1ff9f85b2ad1$var$parseSingleItem(jsonObject);
}
function $550b1ff9f85b2ad1$var$parseArray(arr) {
    return arr.map((e)=>{
        return Array.isArray(e) ? $550b1ff9f85b2ad1$var$parseArray(e) : $550b1ff9f85b2ad1$var$parseSingleItem(e);
    });
}
function $550b1ff9f85b2ad1$var$parseSingleItem(item) {
    if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") return item;
    if ("type" in item && "args" in item && item.type in $550b1ff9f85b2ad1$var$classes) {
        const type = item.type;
        const args = item.args;
        const parsedArgs = $550b1ff9f85b2ad1$var$parseArray(args);
        return new $550b1ff9f85b2ad1$var$classes[type](...parsedArgs);
    } else return JSON.stringify(item);
}
const $550b1ff9f85b2ad1$var$classes = {
    fraction: (0, $f182971f6d253900$export$b336c2702c498be5),
    term: (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131),
    expression: (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83),
    vector: (0, $2977af7a6fa47f89$export$9b781de7bf37bf48),
    variable: (0, $8622b8d7bfb82666$export$d155811788b32995),
    imaginary: (0, $e94ebcbaae2b1672$export$fb07cc2f3f2c86fa),
    squareRoot: (0, $54e5ac5d13ec125e$export$598b1075f1324aa),
    polynomial: (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72),
    laurent: (0, $b21060e9d1664778$export$eb22aabd7ed82a4f),
    mathSymbol: (0, $3457bc831d272ab3$export$2d8ad6e0bc55950e)
};



class $b9064a0945774933$export$dbd3d3df6b63ddec {
    constructor(...args){
        this.terms = args;
    }
    simplify() {
        return new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(...this.terms);
    }
    toString() {
        if (this.terms.length === 0) return "0";
        let outputString = "";
        this.terms.forEach((term, i)=>{
            if (typeof term === "string" || typeof term === "number" || term instanceof (0, $f182971f6d253900$export$b336c2702c498be5)) term = new (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131)(term);
            if (i !== 0) outputString += term.coeff.isAtLeast(0) ? " + " : " ";
            outputString += term.toString();
        });
        return outputString;
    }
    clone() {
        const newTerms = this.terms.map((x)=>{
            if (typeof x === "string" || typeof x === "number") return x;
            else return x.clone();
        });
        return new $b9064a0945774933$export$dbd3d3df6b63ddec(...newTerms);
    }
}
class $b9064a0945774933$export$b8e74b46d0ee8560 extends (0, $8b0d087ec1c2aa1d$export$656c1e606ad06131) {
    /**
	 * Creates a new BracketedTerm
	 * representing k(ax+...+by)
	 */ constructor(coeff, innerExpression){
        if (!(innerExpression instanceof (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)) && !(innerExpression instanceof $b9064a0945774933$export$dbd3d3df6b63ddec)) innerExpression = new (0, $dde9ae70d19cc36f$export$bfe37c1342e5eb83)(innerExpression);
        coeff = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(coeff);
        const variableString = coeff.isEqualTo(1) ? `${innerExpression}` : `(${innerExpression})`;
        super(coeff, variableString);
        this.innerExpression = innerExpression.clone();
    }
    /**
	 * if innerExpression is a WorkingExpression, simplify it
	 */ simplifyInnerExpression() {
        if (this.innerExpression instanceof $b9064a0945774933$export$dbd3d3df6b63ddec) return new $b9064a0945774933$export$b8e74b46d0ee8560(this.coeff, this.innerExpression.simplify());
        return this.clone();
    }
    /**
	 * multiplies k in, returning the expanded expression
	 */ simplify() {
        const innerExpression = this.innerExpression instanceof $b9064a0945774933$export$dbd3d3df6b63ddec ? this.innerExpression.simplify() : this.innerExpression;
        return innerExpression.times(this.coeff);
    }
    clone() {
        return new $b9064a0945774933$export$b8e74b46d0ee8560(this.coeff.clone(), this.innerExpression.clone());
    }
}




function $afcc683efc7e7f5e$export$9ad0b2c418d19e59(options) {
    const { nonzero: nonzero , min: min , max: max , simplify: simplify , avoid: avoid , avoidParallel: avoidParallel , avoidPerp: avoidPerp , avoidLine: avoidLine  } = {
        nonzero: true,
        simplify: false,
        min: -5,
        max: 5,
        avoid: [],
        avoidParallel: false,
        avoidPerp: false,
        ...options
    };
    const x = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max);
    const y = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max);
    const z = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max);
    if (nonzero && x === 0 && y === 0 && z === 0) return $afcc683efc7e7f5e$export$9ad0b2c418d19e59(options);
    const vec = new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(x, y, z, {
        stretchable: simplify
    });
    // check things to avoid
    if (avoidLine !== undefined && avoidLine.contains(vec)) return $afcc683efc7e7f5e$export$9ad0b2c418d19e59(options);
    if (avoidParallel && avoidPerp) {
        if (avoid.some((v)=>v.isParallelTo(vec) || v.isPerpendicularTo(vec))) return $afcc683efc7e7f5e$export$9ad0b2c418d19e59(options);
    } else if (avoidParallel) {
        if (avoid.some((v)=>v.isParallelTo(vec))) return $afcc683efc7e7f5e$export$9ad0b2c418d19e59(options);
    } else if (avoidPerp) {
        if (avoid.some((v)=>v.isPerpendicularTo(vec))) return $afcc683efc7e7f5e$export$9ad0b2c418d19e59(options);
    } else {
        if (avoid.some((v)=>v.isEqualTo(vec))) return $afcc683efc7e7f5e$export$9ad0b2c418d19e59(options);
    }
    return new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(x, y, z, {
        stretchable: simplify
    });
}
function $afcc683efc7e7f5e$export$a4b88e5df4950513(options) {
    const a = $afcc683efc7e7f5e$export$9ad0b2c418d19e59({
        ...options,
        nonzero: false
    });
    const d = $afcc683efc7e7f5e$export$9ad0b2c418d19e59({
        ...options,
        simplify: true
    });
    return new (0, $9509415d105b6dfc$export$17d680238e50603e)(a, d, options);
}
function $afcc683efc7e7f5e$export$b9bc889a703d3052(options) {
    const { multiplesAllowed: multiplesAllowed , max: max  } = {
        multiplesAllowed: false,
        max: 13,
        ...options
    };
    const pythagoreanQuads = [
        [
            1,
            2,
            2,
            3
        ],
        [
            0,
            3,
            4,
            5
        ],
        [
            2,
            3,
            6,
            7
        ],
        [
            1,
            4,
            8,
            9
        ],
        [
            2,
            6,
            9,
            11
        ],
        [
            0,
            5,
            12,
            13
        ], 
    ];
    const choices = pythagoreanQuads.filter((arr)=>arr[3] <= max);
    if (choices.length === 0) throw new Error(`max ${max} results in no choices`);
    let choice = choices[(0, $db26e90f964c2edf$export$b141de964f0a90c1)(0, choices.length - 1)];
    if (multiplesAllowed && choice[3] * 2 <= max && (0, $682613c92f2b1815$export$26d2c8493973508f)()) choice = choice.map((e)=>e * 2);
    const components = choice.slice(0, 3);
    (0, $7034cb64c26be92d$export$448332262467e042)(components);
    const [x, y, z] = components.map((e)=>(0, $682613c92f2b1815$export$26d2c8493973508f)() ? e * -1 : e);
    return new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(x, y, z);
}
function $afcc683efc7e7f5e$export$f41d1732594dc347(options) {
    const { min: min , max: max , simplify: simplify  } = {
        min: -5,
        max: 5,
        simplify: true,
        ...options
    };
    let x1 = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max, {
        avoid: [
            0
        ]
    });
    let x2 = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max);
    let y1 = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max);
    let y2 = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max, {
        avoid: [
            0
        ]
    });
    let dot = x1 * x2 + y1 * y2;
    if (dot === 0) {
        const z1 = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max, {
            avoid: [
                0
            ]
        });
        const z2 = 0;
        const a = new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(x1, y1, z1, {
            stretchable: simplify
        });
        const b = new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(x2, y2, z2, {
            stretchable: simplify
        });
        return [
            a,
            b
        ];
    }
    let factors = (0, $d3526e173b3cb353$export$eac87df9834a7950)(Math.abs(dot));
    let eligibleFactors = factors.filter((e)=>e[0] < max && e[1] < max);
    while(eligibleFactors.length === 0){
        // ~ 27.2% using default of -5 to 5
        x1 = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max, {
            avoid: [
                0
            ]
        });
        x2 = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max);
        y1 = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max);
        y2 = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max, {
            avoid: [
                0
            ]
        });
        dot = x1 * x2 + y1 * y2;
        if (dot === 0) {
            const z11 = (0, $682613c92f2b1815$export$26d2c8493973508f)() ? 0 : (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max);
            const z21 = z11 === 0 ? (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max) : 0;
            const a1 = new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(x1, y1, z11, {
                stretchable: simplify
            });
            const b1 = new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(x2, y2, z21, {
                stretchable: simplify
            });
            return [
                a1,
                b1
            ];
        }
        factors = (0, $d3526e173b3cb353$export$eac87df9834a7950)(Math.abs(dot));
        eligibleFactors = factors.filter((e)=>e[0] < max && e[1] < max);
    }
    const factorPair = eligibleFactors[(0, $db26e90f964c2edf$export$b141de964f0a90c1)(0, eligibleFactors.length - 1)];
    if ((0, $682613c92f2b1815$export$26d2c8493973508f)()) factorPair.reverse();
    let [z12, z22] = factorPair;
    if (dot < 0) // need positive z1*z2
    {
        if ((0, $682613c92f2b1815$export$26d2c8493973508f)()) {
            z12 = -z12;
            z22 = -z22;
        }
    } else // need negative z1*z2
    if ((0, $682613c92f2b1815$export$26d2c8493973508f)()) z12 = -z12;
    else z22 = -z22;
    const a2 = new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(x1, y1, z12, {
        stretchable: simplify
    });
    const b2 = new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(x2, y2, z22, {
        stretchable: simplify
    });
    return [
        a2,
        b2
    ];
}
function $afcc683efc7e7f5e$export$a4dc2c3ce3480d9f(v, options) {
    const { min: min , max: max , simplify: simplify , avoid: avoid  } = {
        min: -5,
        max: 5,
        simplify: true,
        avoid: [],
        ...options
    };
    if (!v.z.isEqualTo(0)) {
        const x = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max, {
            avoid: [
                0
            ]
        });
        const y = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max);
        const dot = v.x.times(x).plus(v.y.times(y));
        const vec = new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(x, y, dot.negative().divide(v.z), {
            stretchable: simplify
        });
        if ($afcc683efc7e7f5e$var$maxComponent(vec).isGreaterThan(max)) return $afcc683efc7e7f5e$export$a4dc2c3ce3480d9f(v, options);
        if (avoid.length > 0 && avoid.some((e)=>e.isParallelTo(vec))) return $afcc683efc7e7f5e$export$a4dc2c3ce3480d9f(v, options);
        return vec;
    } else if (!v.y.isEqualTo(0)) {
        const x1 = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max, {
            avoid: [
                0
            ]
        });
        const z = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max);
        const dot1 = v.x.times(x1).plus(v.z.times(z));
        const vec1 = new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(x1, dot1.negative().divide(v.y), z, {
            stretchable: simplify
        });
        if ($afcc683efc7e7f5e$var$maxComponent(vec1).isGreaterThan(max)) return $afcc683efc7e7f5e$export$a4dc2c3ce3480d9f(v, options);
        if (avoid.length > 0 && avoid.some((e)=>e.isParallelTo(vec1))) return $afcc683efc7e7f5e$export$a4dc2c3ce3480d9f(v, options);
        return vec1;
    } else {
        if (v.x.isEqualTo(0)) throw new Error("cannot get perpendicular to zero vector");
        const y1 = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max, {
            avoid: [
                0
            ]
        });
        const z1 = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(min, max);
        const dot2 = v.y.times(y1).plus(v.z.times(z1));
        const vec2 = new (0, $2977af7a6fa47f89$export$9b781de7bf37bf48)(dot2.negative().divide(v.x), y1, z1, {
            stretchable: simplify
        });
        if ($afcc683efc7e7f5e$var$maxComponent(vec2).isGreaterThan(max)) return $afcc683efc7e7f5e$export$a4dc2c3ce3480d9f(v, options);
        if (avoid.length > 0 && avoid.some((e)=>e.isParallelTo(vec2))) return $afcc683efc7e7f5e$export$a4dc2c3ce3480d9f(v, options);
        return vec2;
    }
}
function $afcc683efc7e7f5e$var$maxComponent(v) {
    return v.x.abs().isAtLeast(v.y.abs()) ? v.x.abs().isAtLeast(v.z.abs()) ? v.x.abs() : v.z.abs() : v.y.abs().isAtLeast(v.z.abs()) ? v.y.abs() : v.z.abs();
}




function $a53cb253145482fa$export$3d0ff81fc46aad00(options) {
    let avoidArray = options?.avoid ?? [];
    if (!Array.isArray(avoidArray)) avoidArray = [
        avoidArray
    ];
    const fractionOptions = {
        numRange: options?.numRange ?? [
            -9,
            9
        ],
        denRange: options?.denRange ?? [
            1,
            9
        ],
        avoid: avoidArray.map((e)=>(0, $2aab13bad14c4123$export$98fc78f39c2afd39)(e))
    };
    let num = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(...fractionOptions.numRange);
    let den = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(...fractionOptions.denRange);
    let frac = new (0, $f182971f6d253900$export$b336c2702c498be5)(num, den), counter = 0;
    while(fractionOptions.avoid.some((e)=>e.isEqualTo(frac))){
        counter++;
        if (counter > 1000) throw new Error("Could not generate a random Fraction within 1000 attempts that is not in the avoid Array");
        num = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(...fractionOptions.numRange);
        den = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(...fractionOptions.denRange);
        frac = new (0, $f182971f6d253900$export$b336c2702c498be5)(num, den);
    }
    return frac;
}





function $77ace9b004ab1a6b$export$4812e460280c6ef2(arr) {
    if (arr.length === 0) throw new Error(`pick does not work with empty array.`);
    return arr[(0, $db26e90f964c2edf$export$b141de964f0a90c1)(0, arr.length - 1)];
}
function $77ace9b004ab1a6b$export$116e116edaa76351(n, arr) {
    if (!Number.isInteger(n) || n <= 0) throw new Error(`n must be a positive integer.`);
    if (arr.length < n) throw new Error(`n must be bigger than the size of the array.`);
    let arrDuplicate = [
        ...arr
    ];
    const samples = [];
    for(let i = 0; i < n; i++){
        arrDuplicate = (0, $7034cb64c26be92d$export$448332262467e042)(arrDuplicate);
        samples.push(arrDuplicate.pop());
    }
    return samples;
}






function $ee7c0f0def6b8a17$export$668d5aeb3bdcbb53(options) {
    // 2: 1/2, 3: k/3, 4: k/4, 5: k/6, 6: 0, pi
    const { allowReal: allowReal , allowImag: allowImag , avoid: avoid  } = {
        allowReal: false,
        allowImag: false,
        avoid: [],
        ...options
    };
    let den = (0, $db26e90f964c2edf$export$b141de964f0a90c1)(allowImag ? 2 : 3, allowReal ? 6 : 5);
    if (den === 6) den = 1;
    else if (den === 5) den = 6;
    if (den === 2 && (0, $682613c92f2b1815$export$26d2c8493973508f)()) // equalizes the probability of getting any angle
    return $ee7c0f0def6b8a17$export$668d5aeb3bdcbb53(options);
    let num = (0, $682613c92f2b1815$export$26d2c8493973508f)() ? 1 : den - 1;
    if ((0, $682613c92f2b1815$export$26d2c8493973508f)()) num = num * -1;
    const k = new (0, $f182971f6d253900$export$b336c2702c498be5)(num, den);
    if (avoid.some((e)=>e.isEqualTo(k))) return $ee7c0f0def6b8a17$export$668d5aeb3bdcbb53(options);
    return k;
}










class $c3bce96fa832e739$export$29ea282a6a253b4d {
    /**
	 * creates new AP instance
	 */ constructor(a, d){
        this.a = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(a);
        this.d = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(d);
    }
    /**
	 * nth term, u_n = a + (n-1)d
	 */ u(n) {
        if (!Number.isInteger(n) || n < 1) throw new Error(`Only valid for positive integers n ${n}`);
        return this.a.plus(this.d.times(n - 1));
    }
    /**
	 * nth term as a polynomial: u_n = nd + a-d
	 */ uNPoly() {
        return new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            this.d,
            this.a.minus(this.d)
        ], {
            variable: "n"
        });
    }
    /**
	 * sum of n terms, S_n = n/2 * (2a + (n-1)d)
	 */ S(n) {
        if (!Number.isInteger(n) || n < 1) throw new Error(`Only valid for positive integers n ${n}`);
        return this.a.times(n).plus(this.d.times(n - 1).times(n).divide(2));
    }
    /**
	 * sum of n terms as a polynomial: S_n = n/2 * (2a + (n-1)d)
	 */ sNPoly() {
        return new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            this.d.divide(2),
            this.a.minus(this.d.divide(2)),
            0
        ], {
            variable: "n"
        });
    }
}



class $9e5aedd0343ea528$export$a1e9daa76fd80d91 {
    /**
	 * creates new GP instance
	 */ constructor(a, r){
        this.a = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(a);
        this.r = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(r);
    }
    /**
	 * nth term, u_n = a r^(n-1)
	 */ u(n) {
        if (!Number.isInteger(n) || n < 1) throw new Error(`Only valid for positive integers n ${n}`);
        return this.a.times(this.r.pow(n - 1));
    }
    /**
	 * sum of n terms, S_n = a (1 - r^n)/(1-r)
	 */ S(n) {
        if (!Number.isInteger(n) || n < 1) throw new Error(`Only valid for positive integers n ${n}`);
        if (this.r.abs().isEqualTo(1)) return this.r.isEqualTo(1) ? this.a.times(n) : n % 2 === 0 ? (0, $f182971f6d253900$export$b336c2702c498be5).ZERO : this.a.clone();
        return this.a.times((0, $f182971f6d253900$export$b336c2702c498be5).ONE.minus(this.r.pow(n)).divide((0, $f182971f6d253900$export$b336c2702c498be5).ONE.minus(this.r)));
    }
    /**
	 * sum to infinity, S_infty = a / (1-r)
	 */ SInfty() {
        if (this.r.abs().isAtLeast(1)) throw new Error(`GP does not converge for  |r| >= 1, ${this.r}`);
        return this.a.divide((0, $f182971f6d253900$export$b336c2702c498be5).ONE.minus(this.r));
    }
    /**
	 * u_n formula to be used for floats
	 */ static u(a, r, n) {
        if (!Number.isInteger(n) || n < 1) throw new Error(`GP error: n must be positive integer, ${n} received.`);
        return a * Math.pow(r, n - 1);
    }
    /**
	 * S_n formula to be used for floats
	 */ static S(a, r, n) {
        if (!Number.isInteger(n) || n < 1) throw new Error(`GP error: n must be positive integer, ${n} received.`);
        if (r === 1) throw new Error(`GP Sum error: r must not be 1.`);
        return a * (Math.pow(r, n) - 1) / (r - 1);
    }
    /**
	 * S_infty formula to be used for floats
	 */ static SInfty(a, r) {
        if (Math.abs(r) >= 1) throw new Error(`GP S_Infty error: |r| must not be less than 1.`);
        return a / (1 - r);
    }
}



function $d3a536738dd5ed20$export$f7c483002f4c8f95(gp, k, options) {
    if (gp.r.isEqualTo(1)) throw new Error(`constant sequence not currently supported`);
    // k(1-r)/a
    const k1 = (0, $f182971f6d253900$export$b336c2702c498be5).ONE.minus(gp.r).divide(gp.a).times(k);
    const logTerm = Math.log((0, $f182971f6d253900$export$b336c2702c498be5).ONE.minus(k1).valueOf());
    const n = logTerm / Math.log(gp.r.valueOf());
    const { moreThan: moreThan  } = {
        moreThan: true,
        ...options
    };
    if (moreThan && gp.a.isGreaterThan(0) || !moreThan && gp.a.isLessThan(0)) return Math.ceil(n);
    else return Math.floor(n);
}
function $d3a536738dd5ed20$export$76d326b20dd7347(a, r, k, options) {
    if (r === 1 || r < 0) throw new Error(`solveGPSNNumber error: we don't support negative r or r===1 currently`);
    // k(1-r)/a
    const k1 = 1 + k * (r - 1) / a;
    const n = Math.log(k1) / Math.log(r);
    const { moreThan: moreThan  } = {
        moreThan: true,
        ...options
    };
    if (moreThan && a > 0 || !moreThan && a < 0) return Math.ceil(n);
    else return Math.floor(n);
}









function $9a494c1968dfe1ce$export$329ce89a99f0e343(n) {
    // factorial is mathematically undefined for negative numbers
    if (n < 0) throw new Error("factorial requires a non-negative value");
    if (Math.floor(n) !== n) throw new Error("factorial requires an integer input");
    // typically you'll expand the factorial function going down, like
    // 5! = 5 * 4 * 3 * 2 * 1. This is going in the opposite direction,
    // counting from 2 up to the number in question, and since anything
    // multiplied by 1 is itself, the loop only needs to start at 2.
    let accumulator = 1;
    for(let i = 2; i <= n; i++)// for each number up to and including the number `n`, multiply
    // the accumulator my that number.
    accumulator *= i;
    return accumulator;
}


const $73ad11dc51a1f7ef$export$7e58974f865073e0 = {
    /**
	 * binomial expansion of (1+x)^n
	 *
	 * @param degree: highest power to include in power series
	 * @param options defaults to {x: 'x'}
	 */ binomial (degree, n, options) {
        const { x: xOptions  } = {
            x: "x",
            ...options
        };
        const x = typeof xOptions === "string" ? new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            1,
            0
        ], {
            variable: xOptions
        }) : xOptions;
        n = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(n);
        const coeffs = [];
        for(let i = 0; i <= degree; i++){
            let coeff = (0, $f182971f6d253900$export$b336c2702c498be5).ONE;
            for(let j = 0; j < i; j++)coeff = coeff.times(n.minus(j)).divide(j + 1);
            coeffs.push(coeff);
        }
        return new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)(coeffs, {
            ascending: true,
            variable: x.variable
        }).replaceXWith(x);
    },
    /**
	 * power series for e^x
	 */ exp (degree, options) {
        const { x: xOptions  } = {
            x: "x",
            ...options
        };
        const x = typeof xOptions === "string" ? new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            1,
            0
        ], {
            variable: xOptions
        }) : xOptions;
        const coeffs = [];
        for(let i = 0; i <= degree; i++){
            const coeff = new (0, $f182971f6d253900$export$b336c2702c498be5)(1, (0, $9a494c1968dfe1ce$export$329ce89a99f0e343)(i));
            coeffs.push(coeff);
        }
        return new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)(coeffs, {
            ascending: true,
            variable: x.variable
        }).replaceXWith(x);
    },
    /**
	 * power series for sin(x)
	 */ sin (degree, options) {
        const { x: xOptions  } = {
            x: "x",
            ...options
        };
        const x = typeof xOptions === "string" ? new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            1,
            0
        ], {
            variable: xOptions
        }) : xOptions;
        const coeffs = [];
        for(let i = 0; i <= degree; i++){
            const coeff = i % 2 === 0 ? (0, $f182971f6d253900$export$b336c2702c498be5).ZERO : new (0, $f182971f6d253900$export$b336c2702c498be5)(1, (0, $9a494c1968dfe1ce$export$329ce89a99f0e343)(i)).times(Math.pow(-1, (i - 1) / 2));
            coeffs.push(coeff);
        }
        return new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)(coeffs, {
            ascending: true,
            variable: x.variable
        }).replaceXWith(x);
    },
    /**
	 * power series for cos(x)
	 */ cos (degree, options) {
        const { x: xOptions  } = {
            x: "x",
            ...options
        };
        const x = typeof xOptions === "string" ? new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            1,
            0
        ], {
            variable: xOptions
        }) : xOptions;
        const coeffs = [];
        for(let i = 0; i <= degree; i++){
            const coeff = i % 2 === 0 ? new (0, $f182971f6d253900$export$b336c2702c498be5)(1, (0, $9a494c1968dfe1ce$export$329ce89a99f0e343)(i)).times(Math.pow(-1, i / 2)) : (0, $f182971f6d253900$export$b336c2702c498be5).ZERO;
            coeffs.push(coeff);
        }
        return new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)(coeffs, {
            ascending: true,
            variable: x.variable
        }).replaceXWith(x);
    },
    /**
	 * power series for ln(1+x)
	 */ ln (degree, options) {
        const { x: xOptions  } = {
            x: "x",
            ...options
        };
        const x = typeof xOptions === "string" ? new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)([
            1,
            0
        ], {
            variable: xOptions
        }) : xOptions;
        const coeffs = [];
        for(let i = 0; i <= degree; i++){
            const coeff = i === 0 ? (0, $f182971f6d253900$export$b336c2702c498be5).ZERO : new (0, $f182971f6d253900$export$b336c2702c498be5)(1, i).times(Math.pow(-1, i + 1));
            coeffs.push(coeff);
        }
        return new (0, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72)(coeffs, {
            ascending: true,
            variable: x.variable
        }).replaceXWith(x);
    }
};





const $4540a742d599274a$export$29beb340147c843f = {
    /**
	 * binomial expansion of (1+x)^n
	 *
	 * @param degree: highest power to include in power series
	 * @param options defaults to {x: 'x'}
	 */ binomial (degree, n, options) {
        const { x: xOptions  } = {
            x: "x",
            ...options
        };
        const x = typeof xOptions === "string" ? new (0, $8a850c2ced0979bb$export$9b2581285fd93ff9)([
            1,
            0
        ], {
            variable: xOptions
        }) : xOptions instanceof (0, $8a850c2ced0979bb$export$9b2581285fd93ff9) ? xOptions : new (0, $8a850c2ced0979bb$export$9b2581285fd93ff9)(xOptions.coeffs, {
            ascending: true,
            variable: xOptions.variable
        }).changeAscending(xOptions.ascending);
        n = (0, $2aab13bad14c4123$export$98fc78f39c2afd39)(n);
        const coeffs = [];
        for(let i = 0; i <= degree; i++){
            let coeff = (0, $f182971f6d253900$export$b336c2702c498be5).ONE;
            for(let j = 0; j < i; j++)coeff = coeff.times(n.minus(j)).divide(j + 1);
            coeffs.push(coeff);
        }
        return new (0, $8a850c2ced0979bb$export$9b2581285fd93ff9)(coeffs, {
            ascending: true,
            variable: x.variable
        }).replaceXWith(x);
    },
    /**
	 * power series for e^x
	 */ exp (degree, options) {
        const { x: xOptions  } = {
            x: "x",
            ...options
        };
        const x = typeof xOptions === "string" ? new (0, $8a850c2ced0979bb$export$9b2581285fd93ff9)([
            1,
            0
        ], {
            variable: xOptions
        }) : xOptions instanceof (0, $8a850c2ced0979bb$export$9b2581285fd93ff9) ? xOptions : new (0, $8a850c2ced0979bb$export$9b2581285fd93ff9)(xOptions.coeffs, {
            ascending: true,
            variable: xOptions.variable
        }).changeAscending(xOptions.ascending);
        const coeffs = [];
        for(let i = 0; i <= degree; i++){
            const coeff = new (0, $f182971f6d253900$export$b336c2702c498be5)(1, (0, $9a494c1968dfe1ce$export$329ce89a99f0e343)(i));
            coeffs.push(coeff);
        }
        return new (0, $8a850c2ced0979bb$export$9b2581285fd93ff9)(coeffs, {
            ascending: true,
            variable: x.variable
        }).replaceXWith(x);
    },
    /**
	 * power series for sin(x)
	 */ sin (degree, options) {
        const { x: xOptions  } = {
            x: "x",
            ...options
        };
        const x = typeof xOptions === "string" ? new (0, $8a850c2ced0979bb$export$9b2581285fd93ff9)([
            1,
            0
        ], {
            variable: xOptions
        }) : xOptions instanceof (0, $8a850c2ced0979bb$export$9b2581285fd93ff9) ? xOptions : new (0, $8a850c2ced0979bb$export$9b2581285fd93ff9)(xOptions.coeffs, {
            ascending: true,
            variable: xOptions.variable
        }).changeAscending(xOptions.ascending);
        const coeffs = [];
        for(let i = 0; i <= degree; i++){
            const coeff = i % 2 === 0 ? (0, $f182971f6d253900$export$b336c2702c498be5).ZERO : new (0, $f182971f6d253900$export$b336c2702c498be5)(1, (0, $9a494c1968dfe1ce$export$329ce89a99f0e343)(i)).times(Math.pow(-1, (i - 1) / 2));
            coeffs.push(coeff);
        }
        return new (0, $8a850c2ced0979bb$export$9b2581285fd93ff9)(coeffs, {
            ascending: true,
            variable: x.variable
        }).replaceXWith(x);
    },
    /**
	 * power series for cos(x)
	 */ cos (degree, options) {
        const { x: xOptions  } = {
            x: "x",
            ...options
        };
        const x = typeof xOptions === "string" ? new (0, $8a850c2ced0979bb$export$9b2581285fd93ff9)([
            1,
            0
        ], {
            variable: xOptions
        }) : xOptions instanceof (0, $8a850c2ced0979bb$export$9b2581285fd93ff9) ? xOptions : new (0, $8a850c2ced0979bb$export$9b2581285fd93ff9)(xOptions.coeffs, {
            ascending: true,
            variable: xOptions.variable
        }).changeAscending(xOptions.ascending);
        const coeffs = [];
        for(let i = 0; i <= degree; i++){
            const coeff = i % 2 === 0 ? new (0, $f182971f6d253900$export$b336c2702c498be5)(1, (0, $9a494c1968dfe1ce$export$329ce89a99f0e343)(i)).times(Math.pow(-1, i / 2)) : (0, $f182971f6d253900$export$b336c2702c498be5).ZERO;
            coeffs.push(coeff);
        }
        return new (0, $8a850c2ced0979bb$export$9b2581285fd93ff9)(coeffs, {
            ascending: true,
            variable: x.variable
        }).replaceXWith(x);
    },
    /**
	 * power series for ln(1+x)
	 */ ln (degree, options) {
        const { x: xOptions  } = {
            x: "x",
            ...options
        };
        const x = typeof xOptions === "string" ? new (0, $8a850c2ced0979bb$export$9b2581285fd93ff9)([
            1,
            0
        ], {
            variable: xOptions
        }) : xOptions instanceof (0, $8a850c2ced0979bb$export$9b2581285fd93ff9) ? xOptions : new (0, $8a850c2ced0979bb$export$9b2581285fd93ff9)(xOptions.coeffs, {
            ascending: true,
            variable: xOptions.variable
        }).changeAscending(xOptions.ascending);
        const coeffs = [];
        for(let i = 0; i <= degree; i++){
            const coeff = i === 0 ? (0, $f182971f6d253900$export$b336c2702c498be5).ZERO : new (0, $f182971f6d253900$export$b336c2702c498be5)(1, i).times(Math.pow(-1, i + 1));
            coeffs.push(coeff);
        }
        return new (0, $8a850c2ced0979bb$export$9b2581285fd93ff9)(coeffs, {
            ascending: true,
            variable: x.variable
        }).replaceXWith(x);
    }
};





function $d2c8801919e9b2cd$export$86990d8264d956f2(n, r) {
    if (!(Number.isInteger(n) && n >= 0 && Number.isInteger(r) && r >= 0 && r <= n)) throw new Error(`${n}C${r} not valid`);
    if (r > n - r) r = n - r;
    let ans = 1;
    for(let i = 1; i <= r; i++)ans = ans * (n - r + i) / i;
    return ans;
}
class $d2c8801919e9b2cd$export$7fe85042b3b11ecb {
    constructor(n, r, ordered = false){
        this.n = n;
        this.r = r;
        this.ordered = ordered;
    }
    toString() {
        return `{${this.n} \\choose ${this.r}}${this.ordered ? `\\times ${this.r}!` : ""}`;
    }
    valueOf() {
        let ncr = $d2c8801919e9b2cd$export$86990d8264d956f2(this.n, this.r);
        if (this.ordered) ncr *= (0, $9a494c1968dfe1ce$export$329ce89a99f0e343)(this.r);
        return ncr;
    }
}


/**
 * binomPdf(n,p,x)
 *
 * @returns P(X=x)
 *
 */ function $5d03955b1a41171b$export$e1efa342efb6f13c(n, p, x) {
    if (Number.isInteger(n) && n > 0 && p >= 0 && p <= 1 && Number.isInteger(x) && x >= 0 && x <= n) return (0, $d2c8801919e9b2cd$export$86990d8264d956f2)(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
    throw new Error(`unexpected behavior for binomPDF ${n},${p},${x}}`);
}
/**
 * binomCdf(n,p,x)
 *
 * @returns P(X \leq x)
 *
 */ function $5d03955b1a41171b$export$ef6ce85a2992d0c9(n, p, x) {
    const epsilon = 1e-10;
    x = Math.floor(x);
    let sum = 0;
    let i = 0;
    while(i <= x && sum < 1 - epsilon){
        // second condition stops loop early to prevent possible overflow problems in nCr
        sum += $5d03955b1a41171b$export$e1efa342efb6f13c(n, p, i);
        i++;
    }
    return sum >= 1 - epsilon ? 1 : sum;
}
/**
 * binomCdfRange(n,p,x1,x2)
 *
 * @returns P(x1 \\leq X \leq x2)
 *
 */ function $5d03955b1a41171b$export$569d2434b02aaf87(n, p, lower, upper) {
    lower = Math.ceil(lower);
    upper = Math.floor(upper);
    const p2 = $5d03955b1a41171b$export$ef6ce85a2992d0c9(n, p, upper);
    const p1 = $5d03955b1a41171b$export$ef6ce85a2992d0c9(n, p, lower - 1);
    return p2 - p1;
}


function $b2daf93d135f8f8a$export$ecea24b0df794b34(x) {
    const t = 1 / (1 + 0.5 * Math.abs(x));
    const tau = t * Math.exp(-x * x + ((((((((0.17087277 * t - 0.82215223) * t + 1.48851587) * t - 1.13520398) * t + 0.27886807) * t - 0.18628806) * t + 0.09678418) * t + 0.37409196) * t + 1.00002368) * t - 1.26551223);
    if (x >= 0) return 1 - tau;
    else return tau - 1;
}


function $df1a1bc8075104a1$var$evalRational(P, Q) {
    return (x)=>{
        const num = P.reduce((prev, p, i)=>{
            return prev + p * Math.pow(x, i);
        }, 0);
        const den = Q.reduce((prev, p, i)=>{
            return prev + p * Math.pow(x, i);
        }, 0);
        return num / den;
    };
}
function $df1a1bc8075104a1$var$sqrt(x) {
    return Math.sqrt(x);
}
function $df1a1bc8075104a1$var$ln(x) {
    return Math.log(x);
}
const $df1a1bc8075104a1$var$pInf = Number.POSITIVE_INFINITY;
const $df1a1bc8075104a1$var$nInf = Number.NEGATIVE_INFINITY;
/**
 * NOTE: the code below is modified starting from the code in [math-io/math-erfinv]{https://github.com/math-io/erfinv}.
 * The code has been modified in the following ways:
 * - Typescript definitions and let/const vs var
 * - Modifying the sqrt,ln,positive infinity and negative infinity implementations by relying on the Javascript version
 * - My own custom implementation of the "evalrational" function above
 *
 * This implementation follows the original, but has been modified for JavaScript.
 */ /**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 The Compute.io Authors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 */ /**
 * NOTE: the original C++ code and copyright notice is from the [Boost library]{http://www.boost.org/doc/libs/1_48_0/boost/math/special_functions/detail/erf_inv.hpp}.
 *
 * This implementation follows the original, but has been modified for JavaScript.
 */ /**
 * (C) Copyright John Maddock 2006.
 * Use, modification and distribution are subject to the
 * Boost Software License, Version 1.0. (See accompanying file
 * LICENSE or copy at http://www.boost.org/LICENSE_1_0.txt)
 */ // NOTES //
/**
 * erfinv( x )
 *
 * Method:
 *   1. For `|x| <= 0.5`, evaluate inverse erf using the rational approximation:
 *
 *        erfinv = x(x+10)(Y+R(x))
 *
 *      where `Y` is a constant and `R(x)` is optimized for a low absolute error compared to `|Y|`. Max error `2.001849e-18`. Maximum deviation found (error term at infinite precision) `8.030e-21`.
 *
 *   2. For `0.5 > 1-|x| >= 0`, evaluate inverse erf using the rational approximation:
 *
 *        erfinv = sqrt(-2*log(1-x)) / (Y + R(1-x))
 *
 *      where `Y `is a constant, and R(q) is optimized for a low absolute error compared to `Y`. Max error `7.403372e-17`. Maximum deviation found (error term at infinite precision) `4.811e-20`.
 *
 *   3. For `1-|x| < 0.25`, we have a series of rational approximations all of the general form:
 *
 *        p = sqrt(-log(1-x))
 *
 *      Then the result is given by:
 *
 *        erfinv = p(Y+R(p-B))
 *
 *      where `Y` is a constant, `B` is the lowest value of `p` for which the approximation is valid, and `R(x-B)` is optimized for a low absolute error compared to `Y`.
 *
 *   Notes:
 *     - Almost all code will really go through the first or maybe second approximation.  After that we are dealing with very small input values.
 *
 *       If `p < 3`, max error `1.089051e-20`.
 *       If `p < 6`, max error `8.389174e-21`.
 *       If `p < 18`, max error `1.481312e-19`.
 *       If `p < 44`, max error `5.697761e-20`.
 *       If `p >= 44`, max error `1.279746e-20`.
 *
 *     - The Boost library can accommodate 80 and 128 bit long doubles. JavaScript only supports a 64 bit double (IEEE754). Accordingly, the smallest `p` (in JavaScript at the time of this writing) is `sqrt(-log(~5e-324)) = 27.284429111150214`.
 */ // Coefficients for erfinv on [0, 0.5]:
const $df1a1bc8075104a1$var$Y1 = 8.91314744949340820313e-2;
const $df1a1bc8075104a1$var$P1 = [
    -0.0005087819496582806,
    -0.008368748197417368,
    3.34806625409744615033e-2,
    -0.012692614766297404,
    -0.03656379714117627,
    2.19878681111168899165e-2,
    8.22687874676915743155e-3,
    -0.005387729650712429,
    0.0,
    0.0, 
];
const $df1a1bc8075104a1$var$Q1 = [
    1.0,
    -0.9700050433032906,
    -1.5657455823417585,
    1.56221558398423026363,
    6.62328840472002992063e-1,
    -0.7122890234154284,
    -0.05273963823400997,
    7.95283687341571680018e-2,
    -0.0023339375937419,
    8.86216390456424707504e-4, 
];
// Coefficients for erfinv for 0.5 > 1-x >= 0:
const $df1a1bc8075104a1$var$Y2 = 2.249481201171875;
const $df1a1bc8075104a1$var$P2 = [
    -0.20243350835593876,
    1.05264680699391713268e-1,
    8.37050328343119927838,
    1.76447298408374015486e1,
    -18.851064805871424,
    -44.6382324441787,
    1.7445385985570866523e1,
    2.11294655448340526258e1,
    -3.6719225470772936, 
];
const $df1a1bc8075104a1$var$Q2 = [
    1.0,
    6.24264124854247537712,
    3.9713437953343869095,
    -28.66081804998,
    -20.14326346804852,
    4.85609213108739935468e1,
    1.08268667355460159008e1,
    -22.643693341313973,
    1.72114765761200282724, 
];
// Coefficients for erfinv for sqrt( -log(1-x) ):
const $df1a1bc8075104a1$var$Y3 = 8.07220458984375e-1;
const $df1a1bc8075104a1$var$P3 = [
    -0.1311027816799519,
    -0.16379404719331705,
    1.17030156341995252019e-1,
    3.87079738972604337464e-1,
    3.37785538912035898924e-1,
    1.42869534408157156766e-1,
    2.90157910005329060432e-2,
    2.14558995388805277169e-3,
    -0.0000006794655751811263,
    2.85225331782217055858e-8,
    -0.000000000681149956853777, 
];
const $df1a1bc8075104a1$var$Q3 = [
    1.0,
    3.46625407242567245975,
    5.38168345707006855425,
    4.77846592945843778382,
    2.59301921623620271374,
    8.48854343457902036425e-1,
    1.52264338295331783612e-1,
    1.105924229346489121e-2,
    0.0,
    0.0,
    0.0, 
];
const $df1a1bc8075104a1$var$Y4 = 9.3995571136474609375e-1;
const $df1a1bc8075104a1$var$P4 = [
    -0.0350353787183178,
    -0.0022242652921344794,
    1.85573306514231072324e-2,
    9.50804701325919603619e-3,
    1.87123492819559223345e-3,
    1.57544617424960554631e-4,
    4.60469890584317994083e-6,
    -0.0000000002304047769118826,
    2.66339227425782031962e-12, 
];
const $df1a1bc8075104a1$var$Q4 = [
    1.0,
    1.3653349817554063097,
    7.62059164553623404043e-1,
    2.20091105764131249824e-1,
    3.41589143670947727934e-2,
    2.63861676657015992959e-3,
    7.64675292302794483503e-5,
    0.0,
    0.0, 
];
const $df1a1bc8075104a1$var$Y5 = 9.8362827301025390625e-1;
const $df1a1bc8075104a1$var$P5 = [
    -0.016743100507663373,
    -0.0011295143874558028,
    1.05628862152492910091e-3,
    2.09386317487588078668e-4,
    1.49624783758342370182e-5,
    4.49696789927706453732e-7,
    4.62596163522878599135e-9,
    -0.00000000000002811287356288318,
    9.9055709973310326855e-17, 
];
const $df1a1bc8075104a1$var$Q5 = [
    1.0,
    5.91429344886417493481e-1,
    1.38151865749083321638e-1,
    1.60746087093676504695e-2,
    9.64011807005165528527e-4,
    2.75335474764726041141e-5,
    2.82243172016108031869e-7,
    0.0,
    0.0, 
];
// FUNCTIONS //
// Compile functions for evaluating rational functions...
const $df1a1bc8075104a1$var$rationalFcnR2 = $df1a1bc8075104a1$var$evalRational($df1a1bc8075104a1$var$P2, $df1a1bc8075104a1$var$Q2);
const $df1a1bc8075104a1$var$rationalFcnR1 = $df1a1bc8075104a1$var$evalRational($df1a1bc8075104a1$var$P1, $df1a1bc8075104a1$var$Q1);
const $df1a1bc8075104a1$var$rationalFcnR3 = $df1a1bc8075104a1$var$evalRational($df1a1bc8075104a1$var$P3, $df1a1bc8075104a1$var$Q3);
const $df1a1bc8075104a1$var$rationalFcnR4 = $df1a1bc8075104a1$var$evalRational($df1a1bc8075104a1$var$P4, $df1a1bc8075104a1$var$Q4);
const $df1a1bc8075104a1$var$rationalFcnR5 = $df1a1bc8075104a1$var$evalRational($df1a1bc8075104a1$var$P5, $df1a1bc8075104a1$var$Q5);
function $df1a1bc8075104a1$export$8af60fd3a5f2724f(x) {
    let sign;
    let ax; // absolute value of x
    let qs;
    let q;
    let g;
    let r;
    // Special case: NaN
    if (x !== x) return NaN;
    // Special case: 1
    if (x === 1) return $df1a1bc8075104a1$var$pInf;
    // Special case: -1
    if (x === -1) return $df1a1bc8075104a1$var$nInf;
    // Special case: +-0
    if (x === 0) return x;
    // Special case: |x| > 1 (range error)
    if (x > 1 || x < -1) throw new RangeError("invalid input argument. Input argument must be on the interval `[-1,1]`. Value: `" + x + "`.");
    // Argument reduction (reduce to interval [0,1]). If `x` is negative, we can safely negate the value, taking advantage of the error function being an odd function; i.e., `erf(-x) = -erf(x)`.
    if (x < 0) {
        sign = -1;
        ax = -x;
    } else {
        sign = 1.0;
        ax = x;
    }
    q = 1.0 - ax;
    // |x| <= 0.5
    if (ax <= 0.5) {
        g = ax * (ax + 10.0);
        r = $df1a1bc8075104a1$var$rationalFcnR1(ax);
        return sign * (g * $df1a1bc8075104a1$var$Y1 + g * r);
    }
    // 1-|x| >= 0.25
    if (q >= 0.25) {
        g = $df1a1bc8075104a1$var$sqrt(-2 * $df1a1bc8075104a1$var$ln(q));
        q -= 0.25;
        r = $df1a1bc8075104a1$var$rationalFcnR2(q);
        return sign * (g / ($df1a1bc8075104a1$var$Y2 + r));
    }
    q = $df1a1bc8075104a1$var$sqrt(-$df1a1bc8075104a1$var$ln(q));
    // q < 3
    if (q < 3) {
        qs = q - 1.125;
        r = $df1a1bc8075104a1$var$rationalFcnR3(qs);
        return sign * ($df1a1bc8075104a1$var$Y3 * q + r * q);
    }
    // q < 6
    if (q < 6) {
        qs = q - 3.0;
        r = $df1a1bc8075104a1$var$rationalFcnR4(qs);
        return sign * ($df1a1bc8075104a1$var$Y4 * q + r * q);
    }
    // q < 18
    qs = q - 6.0;
    r = $df1a1bc8075104a1$var$rationalFcnR5(qs);
    return sign * ($df1a1bc8075104a1$var$Y5 * q + r * q);
} // end FUNCTION erfinv()


function $2db93514bdadbd7a$export$bfbef6ee4f06400d(mu, sigma, limits) {
    const defaultLimits = {
        lower: -Number.MAX_VALUE,
        upper: Number.MAX_VALUE
    };
    const { lower: lower , upper: upper  } = {
        ...defaultLimits,
        ...limits
    };
    const z1 = $2db93514bdadbd7a$var$z(lower, mu, sigma);
    const z2 = $2db93514bdadbd7a$var$z(upper, mu, sigma);
    return ((0, $b2daf93d135f8f8a$export$ecea24b0df794b34)(z2 / Math.SQRT2) - (0, $b2daf93d135f8f8a$export$ecea24b0df794b34)(z1 / Math.SQRT2)) / 2;
}
function $2db93514bdadbd7a$export$bca1101486e51326(p, mu = 0, sigma = 1, mode = "left") {
    if (mode === "right" || mode === "r") p = 1 - p;
    else if (mode === "center" || mode === "c") p = p + (1 - p) / 2;
    //const z = (2 * p - 1 > 0.5) ? probit(p) : Math.SQRT2 * inverseErrorFunction(2 * p - 1);
    const z = (0, $df1a1bc8075104a1$export$8af60fd3a5f2724f)(2 * p - 1) * Math.SQRT2;
    return z * sigma + mu;
}
function $2db93514bdadbd7a$export$45660887eb1494aa(mu, sigma, xBar, n, tail = "left") {
    if (tail === "left" || tail === "l") return $2db93514bdadbd7a$export$bfbef6ee4f06400d(mu, sigma / Math.sqrt(n), {
        upper: xBar
    });
    else if (tail === "right" || tail === "r") return $2db93514bdadbd7a$export$bfbef6ee4f06400d(mu, sigma / Math.sqrt(n), {
        lower: xBar
    });
    else {
        // tail === 'two'/'center'
        const halfP = $2db93514bdadbd7a$export$bfbef6ee4f06400d(mu, sigma / Math.sqrt(n), xBar <= mu ? {
            upper: xBar
        } : {
            lower: xBar
        });
        return 2 * halfP;
    }
}
function $2db93514bdadbd7a$var$z(x, mu, sigma) {
    return (x - mu) / sigma;
}



class $efad64e67f0e4120$export$90749bc64b569dd0 {
    ////
    // constructor
    ////
    /**
	 * Creates a new normal r.v. instance
	 *
	 * @param mean population mean mu
	 * @param variance population variance sigma^2
	 * @param options default to {name: 'X', sdMode: false} where sdMode indicate sd instead of
	 * variance is provided
	 *
	 */ constructor(mean, variance = 1, options){
        const { name: name , sdMode: sdMode  } = {
            name: "X",
            sdMode: false,
            ...options
        };
        this.mean = mean;
        if (variance < 0) throw new RangeError("variance must be non-negative");
        this.variance = sdMode ? variance * variance : variance;
        this.sd = sdMode ? variance : Math.sqrt(variance);
        this.sdMode = sdMode;
        this.name = name;
    }
    /**
	 * adds two independently distributed normal r.v.
	 *
	 */ plus(Y, options) {
        if (typeof Y === "number") Y = new $efad64e67f0e4120$export$90749bc64b569dd0(Y, 0);
        const { name: name  } = {
            name: `${this.name}+${Y.name}`,
            ...options
        };
        return new $efad64e67f0e4120$export$90749bc64b569dd0(this.mean + Y.mean, this.variance + Y.variance, {
            name: name
        });
    }
    /**
	 * multiplies by a scalar, nX ~ (n mu, n^2 sigma^2)
	 *
	 */ times(n, options) {
        const { name: name  } = {
            name: `${n}${this.name}`,
            ...options
        };
        return new $efad64e67f0e4120$export$90749bc64b569dd0(this.mean * n, this.variance * n * n, {
            name: name
        });
    }
    /**
	 * divides by a scalar, 1/n X ~ (mu/n, sigma^2/n^2)
	 *
	 */ divide(n, options) {
        if (n === 0) throw new RangeError("cannot divide by 0");
        const { name: name  } = {
            name: `\\frac{1}{${n}} ${this.name}`,
            ...options
        };
        return this.times(1 / n, {
            name: name
        });
    }
    /**
	 * subtracts independently distributed normal r.v., this - Y
	 *
	 */ minus(Y, options) {
        if (typeof Y === "number") Y = new $efad64e67f0e4120$export$90749bc64b569dd0(Y, 0);
        const { name: name  } = {
            name: `${this.name}-${Y.name}`,
            ...options
        };
        return this.plus(Y.times(-1), {
            name: name
        });
    }
    /**
	 * sum X1 + ... + Xn ~ N(n mu, n sigma^2)
	 */ sum(n, options) {
        const { name: name  } = {
            name: `${this.name}_1 + \\cdots + ${this.name}_{${n}}`,
            ...options
        };
        return new $efad64e67f0e4120$export$90749bc64b569dd0(this.mean * n, this.variance * n, {
            name: name
        });
    }
    /**
	 * sample mean XBar ~ N (mu, sigma^2 / n)
	 */ bar(n) {
        return new $efad64e67f0e4120$export$90749bc64b569dd0(this.mean, this.variance / n);
    }
    //// probability methods
    /**
	 * less than
	 *
	 * @returns P(X < x)
	 */ lessThan(x) {
        return (0, $2db93514bdadbd7a$export$bfbef6ee4f06400d)(this.mean, Math.sqrt(this.variance), {
            upper: x
        });
    }
    /**
	 * more than
	 *
	 * @returns P(X > x)
	 */ moreThan(x) {
        return (0, $2db93514bdadbd7a$export$bfbef6ee4f06400d)(this.mean, Math.sqrt(this.variance), {
            lower: x
        });
    }
    /**
	 * between
	 *
	 * @returns P(x1 < X < x2)
	 */ between(x1, x2) {
        return (0, $2db93514bdadbd7a$export$bfbef6ee4f06400d)(this.mean, Math.sqrt(this.variance), {
            lower: x1,
            upper: x2
        });
    }
    /**
	 * invNorm
	 *
	 * @mode defaults to 'left' for left tail, accepts 'right' or 'center'
	 *
	 * @return x such that P(X < x) = p
	 */ invNorm(p, mode = "left") {
        return (0, $2db93514bdadbd7a$export$bca1101486e51326)(p, this.mean, Math.sqrt(this.variance), mode);
    }
    /**
	 * toString: returns `X ~ N(mu, sigma^2)`
	 *
	 * @param name symbol representing the r.v. (default `X`)
	 */ toString() {
        const mean = `${this.mean}`.length > 5 ? this.mean.toPrecision(5) : this.mean;
        let variance;
        if (this.sdMode) variance = `${this.sd}^2`;
        else variance = `${this.variance}`.length > 5 ? this.variance.toPrecision(5) : this.variance;
        return `${this.name} \\sim N( ${mean},${variance} )`;
    }
}




class $3283e1cfefba0167$export$2b25f2235b84eac0 {
    constructor(xData, yData, options){
        this.xData = xData;
        this.yData = yData;
        this.x = options?.x || "x";
        this.y = options?.y || "y";
    }
    xBar() {
        return $3283e1cfefba0167$var$sumX(this.xData) / this.xData.length;
    }
    yBar() {
        return $3283e1cfefba0167$var$sumX(this.yData) / this.yData.length;
    }
    r() {
        return $3283e1cfefba0167$var$sXY(this.xData, this.yData) / Math.sqrt($3283e1cfefba0167$var$sXX(this.xData) * $3283e1cfefba0167$var$sXX(this.yData));
    }
    r2() {
        return Math.pow(this.r(), 2);
    }
    /**
	 * @returns [a, b] such that y = a + bx
	 */ yOnX() {
        const b = $3283e1cfefba0167$var$sXY(this.xData, this.yData) / $3283e1cfefba0167$var$sXX(this.xData);
        const a = this.yBar() - b * this.xBar();
        return [
            a,
            b
        ];
    }
    yOnXAt(x) {
        const [a, b] = this.yOnX();
        return a + b * x;
    }
    /**
	 * @returns [a, b] such that x = a + by
	 */ xOnY() {
        const b = $3283e1cfefba0167$var$sXY(this.xData, this.yData) / $3283e1cfefba0167$var$sXX(this.yData);
        const a = this.xBar() - b * this.yBar();
        return [
            a,
            b
        ];
    }
    toString(precision = 3, options) {
        const dpMode = options?.dpMode || false;
        const [a, b] = this.yOnX();
        const aString = dpMode ? a.toFixed(precision) : a.toPrecision(precision);
        const sign = b > 0 ? "+" : "";
        const bString = dpMode ? b.toFixed(precision) : b.toPrecision(precision);
        return `${this.y} = ${aString}${sign}${bString}${this.x}`;
    }
    linearize(functions) {
        const { xFn: xFn , yFn: yFn , x: x , y: y  } = {
            xFn: (x1)=>x1,
            yFn: (y1)=>y1,
            x: this.x,
            y: this.y,
            ...functions
        };
        let xFnFinal;
        let yFnFinal;
        if (typeof xFn === "string") {
            if (xFn === "ln") xFnFinal = $3283e1cfefba0167$var$ln;
            else if (xFn === "reciprocal") xFnFinal = $3283e1cfefba0167$var$reciprocal;
            else if (xFn === "square") xFnFinal = $3283e1cfefba0167$var$square;
            else throw new Error(`Invalid function name ${xFn}`);
        } else xFnFinal = xFn;
        if (typeof yFn === "string") {
            if (yFn === "ln") yFnFinal = $3283e1cfefba0167$var$ln;
            else if (yFn === "reciprocal") yFnFinal = $3283e1cfefba0167$var$reciprocal;
            else if (yFn === "square") yFnFinal = $3283e1cfefba0167$var$square;
            else throw new Error(`Invalid function name ${xFn}`);
        } else yFnFinal = yFn;
        const xData = this.xData.map(xFnFinal);
        const yData = this.yData.map(yFnFinal);
        return new $3283e1cfefba0167$export$2b25f2235b84eac0(xData, yData, {
            x: x,
            y: y
        });
    }
}
const $3283e1cfefba0167$var$sumX = (xData)=>xData.reduce((a, b)=>a + b, 0);
const $3283e1cfefba0167$var$sumX2 = (xData)=>xData.reduce((a, b)=>a + b * b, 0);
const $3283e1cfefba0167$var$sumXY = (xData, yData)=>xData.reduce((a, b, i)=>a + b * yData[i], 0);
const $3283e1cfefba0167$var$sXX = (xData)=>$3283e1cfefba0167$var$sumX2(xData) - $3283e1cfefba0167$var$sumX(xData) * $3283e1cfefba0167$var$sumX(xData) / xData.length;
const $3283e1cfefba0167$var$sXY = (xData, yData)=>$3283e1cfefba0167$var$sumXY(xData, yData) - $3283e1cfefba0167$var$sumX(xData) * $3283e1cfefba0167$var$sumX(yData) / xData.length;
function $3283e1cfefba0167$var$ln(x) {
    return Math.log(x);
}
function $3283e1cfefba0167$var$reciprocal(x) {
    return 1 / x;
}
function $3283e1cfefba0167$var$square(x) {
    return x * x;
}






export {$f182971f6d253900$export$b336c2702c498be5 as Fraction, $54e5ac5d13ec125e$export$598b1075f1324aa as SquareRoot, $54e5ac5d13ec125e$export$dc386df03dfad113 as NthRoot, $8622b8d7bfb82666$export$d155811788b32995 as VariableTerm, $e94ebcbaae2b1672$export$fb07cc2f3f2c86fa as Imaginary, $e86e55fd775d0f9a$export$921da06a0f908654 as BasicTerm, $8b0d087ec1c2aa1d$export$656c1e606ad06131 as Term, $dde9ae70d19cc36f$export$bfe37c1342e5eb83 as Expression, $1d2ed8d2c70a3abb$export$d705d4e10ac18d72 as Polynomial, $7f2edef52699c44b$export$f81847884871263e as gcd, $7f2edef52699c44b$export$f686d97e407ec4ef as lcm, $725cf8b52ea54301$export$6f6f5910ffbc7e59 as factorize, $2aab13bad14c4123$export$98fc78f39c2afd39 as numberToFraction, $23160e13dd404e1b$export$d991e3d99172da5e as numberToSquareRoot, $3457bc831d272ab3$export$2d8ad6e0bc55950e as MathSymbol, $60b13a6be04206e3$export$d5439f8590acfb59 as ImaginarySymbol, $7811ac8504c01765$export$bacc3050bcb5570 as Surd, $7811ac8504c01765$export$37c5252633151bef as RootSymbol, $2977af7a6fa47f89$export$9b781de7bf37bf48 as Vector, $9509415d105b6dfc$export$17d680238e50603e as Line, $9ab39ccab2ef035d$export$7ff5ac152ef991b0 as Plane, $d97f7b9f00f9bb44$export$ff5a3dd162f29e3e as xVector, $be658d927af77459$export$68b43f2f2a2907ee as uVector, $be658d927af77459$export$d1a3e7b57dcfb542 as uxVector, $be658d927af77459$export$e077d131706461e7 as uVectorExpression, $be658d927af77459$export$2d2dd6ec9a9522a as uxVectorExpression, $db26e90f964c2edf$export$b141de964f0a90c1 as getRandomInt, $db26e90f964c2edf$export$a3851e63db0c2294 as getRandomInts, $afcc683efc7e7f5e$export$9ad0b2c418d19e59 as getRandomVec, $afcc683efc7e7f5e$export$b9bc889a703d3052 as getNiceVec, $afcc683efc7e7f5e$export$f41d1732594dc347 as getRandomPerps, $afcc683efc7e7f5e$export$a4dc2c3ce3480d9f as getRandomPerp, $afcc683efc7e7f5e$export$a4b88e5df4950513 as getRandomLine, $a53cb253145482fa$export$3d0ff81fc46aad00 as getRandomFrac, $7034cb64c26be92d$export$448332262467e042 as shuffle, $682613c92f2b1815$export$26d2c8493973508f as heads, $ee7c0f0def6b8a17$export$668d5aeb3bdcbb53 as getRandomAngle, $77ace9b004ab1a6b$export$4812e460280c6ef2 as sample, $77ace9b004ab1a6b$export$116e116edaa76351 as sampleN, $550b1ff9f85b2ad1$export$3969146df1258ac as JSONParse, $d3526e173b3cb353$export$eac87df9834a7950 as factorPairs, $b9064a0945774933$export$dbd3d3df6b63ddec as UnsimplifiedExpression, $b9064a0945774933$export$b8e74b46d0ee8560 as BracketedTerm, $2a2c23e72cfc5cd7$export$f48087c7d2ddb546 as expToPoly, $48fbc849e2253d56$export$71f83fa4be52eb7e as simplifyPoly, $48fbc849e2253d56$export$a683619a138832d8 as factorizeQuadratic, $48fbc849e2253d56$export$5f287bb962e326a2 as factorizeCubic, $48fbc849e2253d56$export$425de9c92a3be3b1 as solveQuadratic, $48fbc849e2253d56$export$6211688467daceda as solveQuadraticSurd, $b8d38a0842666bbd$export$1e51c46d43f261f5 as solveQuadraticComplex, $48fbc849e2253d56$export$9f593307716ffb7 as solveLinear, $48fbc849e2253d56$export$573c77f136f7960 as shiftPoly, $48fbc849e2253d56$export$c786780ad3272010 as completeSquare, $dfa855c0a08c4823$export$f39d44152120106c as longDivide, $2c58cbc00422bb1b$export$45db2fc2f15997e7 as linear, $d80405e3bbe3bd33$export$4a22edb671297d9b as subSurdInPoly, $195096b30d4dc5c6$export$89645a02957ec204 as cramers, $195096b30d4dc5c6$export$496373a15df62289 as cramersFrac, $d2837f1711b34bdd$export$e6674eb1322665bd as determinantFrac, $e693f601f4c1602d$export$c03efc561d3f8db4 as bisection, $64bd69b91b40e616$export$50ceb3fb9926e63e as Complex, $ef162516d86aafc0$export$8ec1e3e38d2026e1 as ComplexExp, $6c6ab726fcfdf2fe$export$e184bcf651eb3bbd as xComplex, $33a4a772a9ca6821$export$385a43e29b3b9359 as expToCartesian, $3eadf436325c9066$export$83e9e1fae2f9176f as complexToQuadratic, $ea253d1c47015c81$export$6770779326e7368f as subComplexIntoPoly, $5d4be2d9156d310f$export$6cdc1cb9345ffadf as Angle, $65bb0db3d74bc6f6$export$5de3937cb4b592ed as sin, $65bb0db3d74bc6f6$export$50d414a77b60d802 as cos, $65bb0db3d74bc6f6$export$fcdd3b0b3246a325 as tan, $49c7af4e0a088319$export$41726bdb1fc63f as asin, $49c7af4e0a088319$export$fd6306be3fde5b04 as acos, $49c7af4e0a088319$export$628dc4eed22b0fbd as atan, $c3bce96fa832e739$export$29ea282a6a253b4d as AP, $9e5aedd0343ea528$export$a1e9daa76fd80d91 as GP, $d3a536738dd5ed20$export$f7c483002f4c8f95 as solveGpSN, $d3a536738dd5ed20$export$76d326b20dd7347 as solveGpSNNumber, $143c6632afa73a82$export$7e4481e23b2eabc5 as Rational, $14439be136ee9734$export$27e2d2491cfae64 as solveRational, $33c55aca4da8bb39$export$35d677e0ea3a9a33 as partialFractions, $8a850c2ced0979bb$export$9b2581285fd93ff9 as xPolynomial, $6dff6b02e459a6ca$export$ea4e6706f9009a22 as PowerFn, $6dff6b02e459a6ca$export$8652453b9fa830f2 as SinFn, $6dff6b02e459a6ca$export$82bd074154d00de7 as CosFn, $6dff6b02e459a6ca$export$a05b5f03bbb445dc as ExpFn, $6dff6b02e459a6ca$export$3575e8fc3e2771d4 as LnFn, $6dff6b02e459a6ca$export$328720fb6bbe5787 as RationalFn, $b21060e9d1664778$export$eb22aabd7ed82a4f as Laurent, $a288c1e6c388e093$export$c7d16d1250ccf8de as Parametric, $1bbf0a677f9ca058$export$df970fd884294dfc as integrate, $1bbf0a677f9ca058$export$e36b90034991744d as definiteIntegral, $6791662b653aeece$export$368759af55f0e249 as rationalToPowerFn, $38b79cedb7ce23bc$export$56bc470288536c11 as simpsons, $557e9ee971ba496a$export$100053bd28448230 as finiteDifference, $67966bfb2f57a162$export$2fa162a495d26869 as de, $73ad11dc51a1f7ef$export$7e58974f865073e0 as Maclaurin, $4540a742d599274a$export$29beb340147c843f as xMaclaurin, $5d03955b1a41171b$export$e1efa342efb6f13c as binomPdf, $5d03955b1a41171b$export$ef6ce85a2992d0c9 as binomCdf, $5d03955b1a41171b$export$569d2434b02aaf87 as binomCdfRange, $2db93514bdadbd7a$export$bfbef6ee4f06400d as normCdf, $2db93514bdadbd7a$export$bca1101486e51326 as invNorm, $2db93514bdadbd7a$export$45660887eb1494aa as zTest, $9a494c1968dfe1ce$export$329ce89a99f0e343 as factorial, $efad64e67f0e4120$export$90749bc64b569dd0 as Normal, $d2c8801919e9b2cd$export$86990d8264d956f2 as nCr, $d2c8801919e9b2cd$export$7fe85042b3b11ecb as NCR, $3283e1cfefba0167$export$2b25f2235b84eac0 as Regression};
//# sourceMappingURL=index.mjs.map
