// Helper functions to perform arithmetic on fractions
import { BigInt } from "../generated.js";
export function add_fractions(f1, f2) {
    const numerator1 = f1.numerator.mul(f2.denominator);
    const numerator2 = f2.numerator.mul(f1.denominator);
    const numerator = numerator1.add(numerator2);
    const denominator = f1.denominator.mul(f2.denominator);
    return { numerator, denominator };
}
export function sub_fractions(f1, f2) {
    if (f1.numerator.is_zero()) {
        return f2;
    }
    if (f2.numerator.is_zero()) {
        return f1;
    }
    const numerator1 = f1.numerator.mul(f2.denominator);
    const numerator2 = f2.numerator.mul(f1.denominator);
    const numerator = numerator1.sub(numerator2);
    const denominator = f1.denominator.mul(f2.denominator);
    return { numerator, denominator };
}
export function mul_fractions(f1, f2) {
    const numerator = f1.numerator.mul(f2.numerator);
    const denominator = f1.denominator.mul(f2.denominator);
    return { numerator, denominator };
}
export function div_fractions(f1, f2) {
    if (f2.numerator.is_zero()) {
        throw new Error("Division by zero");
    }
    const numerator = f1.numerator.mul(f2.denominator);
    const denominator = f1.denominator.mul(f2.numerator);
    return { numerator, denominator };
}
export function pow_fraction(fraction, exponent) {
    let resultNumerator = BigInt.one();
    let resultDenominator = BigInt.one();
    let baseNumerator = fraction.numerator;
    let baseDenominator = fraction.denominator;
    let exp = exponent;
    while (exp > 0) {
        if (exp % 2 === 1) {
            resultNumerator = resultNumerator.mul(baseNumerator);
            resultDenominator = resultDenominator.mul(baseDenominator);
        }
        exp = Math.floor(exp / 2);
        if (exp > 0) {
            baseNumerator = baseNumerator.mul(baseNumerator);
            baseDenominator = baseDenominator.mul(baseDenominator);
        }
    }
    return { numerator: resultNumerator, denominator: resultDenominator };
}
// Helper function to perform ceiling division of numerator/denominator
// It uses the underlying BigInt implementation of `div_floor` and changes to a ceiling division.
export function ceil_division(f) {
    // Step 1: Perform floor division to get the quotient
    const quotient = f.numerator.div_floor(f.denominator);
    // Step 2: Calculate the product of denominator and quotient
    const product = f.denominator.mul(quotient);
    // Step 3: Calculate the remainder by subtracting the product from the numerator
    const remainder = f.numerator.sub(product);
    // Step 4: Check if remainder is zero
    if (remainder.is_zero()) {
        return quotient;
    }
    else {
        // If there is a remainder, increment the quotient by one
        return quotient.add(BigInt.one());
    }
}
export function is_fraction_negative(f) {
    const isNumNegative = f.numerator === BigInt.zero();
    const isDenNegative = f.denominator === BigInt.zero();
    return isNumNegative !== isDenNegative;
}
export function is_fraction_negative_or_zero(f) {
    return f.numerator === BigInt.zero() || is_fraction_negative(f);
}
export function fraction_zero() {
    return {
        numerator: BigInt.zero(),
        denominator: BigInt.one(),
    };
}
export function fraction_one() {
    return {
        numerator: BigInt.one(),
        denominator: BigInt.one(),
    };
}
export function toBigIntFloor(f) {
    const num = f.numerator;
    const denum = f.denominator;
    if (denum.is_zero()) {
        throw new Error("Division by zero");
    }
    return num.div_floor(denum);
}
