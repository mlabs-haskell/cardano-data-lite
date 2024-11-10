// Helper functions to perform arithmetic on fractions

import { BigNum } from "../generated";

export type Fraction = {
  numerator: BigNum;
  denominator: BigNum;
};

export function add_fractions(f1: Fraction, f2: Fraction): Fraction {
  const numerator1 = f1.numerator.checked_mul(f2.denominator);
  const numerator2 = f2.numerator.checked_mul(f1.denominator);
  const numerator = numerator1.checked_add(numerator2);
  const denominator = f1.denominator.checked_mul(f2.denominator);
  return { numerator, denominator };
}

export function sub_fractions(f1: Fraction, f2: Fraction): Fraction {
  if (f1.numerator.is_zero()) {
    return f2;
  }

  if (f2.numerator.is_zero()) {
    return f1;
  }

  const numerator1 = f1.numerator.checked_mul(f2.denominator);
  const numerator2 = f2.numerator.checked_mul(f1.denominator);

  const numerator = numerator1.checked_sub(numerator2);
  const denominator = f1.denominator.checked_mul(f2.denominator);

  return { numerator, denominator };
}

export function mul_fractions(f1: Fraction, f2: Fraction): Fraction {
  const numerator = f1.numerator.checked_mul(f2.numerator);
  const denominator = f1.denominator.checked_mul(f2.denominator);
  return { numerator, denominator };
}

export function div_fractions(f1: Fraction, f2: Fraction): Fraction {
  if (f2.numerator.is_zero()) {
    throw new Error("Division by zero");
  }
  const numerator = f1.numerator.checked_mul(f2.denominator);
  const denominator = f1.denominator.checked_mul(f2.numerator);
  return { numerator, denominator };
}

export function pow_fraction(fraction: Fraction, exponent: number): Fraction {
  let resultNumerator = BigNum.one();
  let resultDenominator = BigNum.one();
  let baseNumerator = fraction.numerator;
  let baseDenominator = fraction.denominator;
  let exp = exponent;
  while (exp > 0) {
    if (exp % 2 === 1) {
      resultNumerator = resultNumerator.checked_mul(baseNumerator);
      resultDenominator = resultDenominator.checked_mul(baseDenominator);
    }
    exp = Math.floor(exp / 2);
    if (exp > 0) {
      baseNumerator = baseNumerator.checked_mul(baseNumerator);
      baseDenominator = baseDenominator.checked_mul(baseDenominator);
    }
  }
  return { numerator: resultNumerator, denominator: resultDenominator };
}

// Helper function to perform ceiling division of numerator/denominator
// It uses the underlying BigNum implementation of `div_floor` and changes to a ceiling division.
export function ceil_division(f: Fraction): BigNum {
  // Step 1: Perform floor division to get the quotient
  const quotient = f.numerator.div_floor(f.denominator);

  // Step 2: Calculate the product of denominator and quotient
  const product = f.denominator.checked_mul(quotient);

  // Step 3: Calculate the remainder by subtracting the product from the numerator
  const remainder = f.numerator.checked_sub(product);

  // Step 4: Check if remainder is zero
  if (remainder.is_zero()) {
    return quotient;
  } else {
    // If there is a remainder, increment the quotient by one
    return quotient.checked_add(BigNum.one());
  }
}

export function is_fraction_negative(f: Fraction): Boolean {
  const isNumNegative = f.numerator.compare(BigNum.zero());
  const isDenNegative = f.denominator.compare(BigNum.zero());
  return isNumNegative !== isDenNegative;
}

export function is_fraction_negative_or_zero(f: Fraction): Boolean {
  return f.numerator.compare(BigNum.zero()) < 0 || is_fraction_negative(f);
}

export function fraction_zero(): Fraction {
  return {
    numerator: BigNum.zero(),
    denominator: BigNum.one(),
  };
}

export function fraction_one(): Fraction {
  return {
    numerator: BigNum.one(),
    denominator: BigNum.one(),
  };
}

export function toBigNumFloor(f: Fraction): BigNum {
  const num = f.numerator;
  const denum = f.denominator;

  if (denum.is_zero()) {
    throw new Error("Division by zero");
  }

  return num.div_floor(denum);
}
