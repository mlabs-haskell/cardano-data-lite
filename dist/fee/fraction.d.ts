import { BigInt } from "../generated";
export type Fraction = {
    numerator: BigInt;
    denominator: BigInt;
};
export declare function add_fractions(f1: Fraction, f2: Fraction): Fraction;
export declare function sub_fractions(f1: Fraction, f2: Fraction): Fraction;
export declare function mul_fractions(f1: Fraction, f2: Fraction): Fraction;
export declare function div_fractions(f1: Fraction, f2: Fraction): Fraction;
export declare function pow_fraction(fraction: Fraction, exponent: number): Fraction;
export declare function ceil_division(f: Fraction): BigInt;
export declare function is_fraction_negative(f: Fraction): Boolean;
export declare function is_fraction_negative_or_zero(f: Fraction): Boolean;
export declare function fraction_zero(): Fraction;
export declare function fraction_one(): Fraction;
export declare function toBigIntFloor(f: Fraction): BigInt;
