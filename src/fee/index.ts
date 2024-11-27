import {
  BigNum,
  BigInt,
  ExUnitPrices,
  ExUnits,
  Transaction,
  UnitInterval,
} from "../generated";

import {
  add_fractions,
  ceil_division,
  div_fractions,
  Fraction,
  fraction_one,
  fraction_zero,
  is_fraction_negative_or_zero,
  mul_fractions,
  pow_fraction,
  sub_fractions,
  toBigIntFloor,
} from "./fraction";

export class LinearFee {
  private _constant: BigNum;
  private _coefficient: BigNum;

  constructor(constant: BigNum, coefficient: BigNum) {
    this._constant = constant;
    this._coefficient = coefficient;
  }

  static new(constant: BigNum, coefficient: BigNum) {
    return new LinearFee(constant, coefficient);
  }

  constant(): BigNum {
    return this._constant.clone([]);
  }

  coefficient(): BigNum {
    return this._coefficient.clone([]);
  }
}

function min_fee_for_size(size: number, linearFee: LinearFee): BigNum {
  const s1 = BigNum._from_number(size).checked_mul(linearFee.coefficient())
  return s1.checked_add(linearFee.constant());
}

export function min_fee(tx: Transaction, linearFee: LinearFee): BigNum {
  return min_fee_for_size(tx.to_bytes().length, linearFee);
}

// Helper function to multiply a UnitInterval by a BigNum
function multiply_unit_interval_by_bignum(
  unitInterval: UnitInterval,
  bigNum: BigNum,
): Fraction {
  const numerator = unitInterval.numerator().checked_mul(bigNum);
  const denominator = unitInterval.denominator().clone([]);
  return {
    numerator: BigInt.from_str(numerator.to_str())
    , denominator: BigInt.from_str(denominator.to_str())
  };
}

export function calculate_exunits_ceil_cost(
  exUnits: ExUnits,
  exUnitPrices: ExUnitPrices,
): BigInt {
  const memPrice: UnitInterval = exUnitPrices.mem_price();
  const stepsPrice: UnitInterval = exUnitPrices.step_price();

  const memRatio = multiply_unit_interval_by_bignum(memPrice, exUnits.mem());
  const stepsRatio = multiply_unit_interval_by_bignum(
    stepsPrice,
    exUnits.steps(),
  );
  const totalCostFraction = add_fractions(memRatio, stepsRatio);

  return ceil_division(totalCostFraction);
}

export function min_script_fee(
  tx: Transaction,
  exUnitPrices: ExUnitPrices,
): BigInt {
  const redeemers = tx.witness_set().redeemers();
  if (redeemers) {
    const totalExUnits = redeemers.total_ex_units();
    return calculate_exunits_ceil_cost(totalExUnits, exUnitPrices);
  }
  return BigInt.zero();
}


function tier_ref_script_fee(
  multiplier: Fraction,
  sizeIncrement: number,
  baseFee: Fraction,
  totalSize: number,
): BigInt {

  if (is_fraction_negative_or_zero(multiplier) || sizeIncrement === 0) {
    throw new Error("Size increment  and multiplier must be positive");
  }
  const fullTiers = Math.floor(totalSize / sizeIncrement);
  const partialTierSize = totalSize % sizeIncrement;
  const tierPrice = mul_fractions(baseFee, {
    numerator: BigInt.from_str(sizeIncrement.toString()),
    denominator: BigInt.one(),
  });
  let acc: Fraction = fraction_zero();

  if (fullTiers > 0) {
    const multiplierPowFullTiers = pow_fraction(multiplier, fullTiers);

    const progressionEnumerator = sub_fractions(fraction_one(), multiplierPowFullTiers);
    const progressionDenominator = sub_fractions(fraction_one(), multiplier);

    const tierProgressionSum = div_fractions(
      progressionEnumerator,
      progressionDenominator,
    );

    const tierPriceTimesProgressionSum = mul_fractions(
      tierPrice,
      tierProgressionSum,
    );
    acc = add_fractions(acc, tierPriceTimesProgressionSum);
  }

  // Add the partial tier
  if (partialTierSize > 0) {
    const multiplierPowFullTiers = pow_fraction(multiplier, fullTiers);

    const lastTierPrice = mul_fractions(baseFee, multiplierPowFullTiers);

    const partialTierFee = mul_fractions(lastTierPrice, {
      numerator: BigInt.from_str(partialTierSize.toString()),
      denominator: BigInt.one(),
    });

    acc = add_fractions(acc, partialTierFee);
  }

  return toBigIntFloor(acc);
}

export function min_ref_script_fee(
  totalRefScriptsSize: number,
  refScriptBigNumsPerByte: UnitInterval,
): BigInt {
  const multiplier: Fraction = {
    numerator: new BigInt(12n),
    denominator: new BigInt(10n),
  }; // 1.2
  const sizeIncrement = 25_600; // 25KiB

  const refMultiplier: Fraction = {
    numerator: BigInt.from_str(refScriptBigNumsPerByte.numerator().to_str()),
    denominator: BigInt.from_str(refScriptBigNumsPerByte.denominator().to_str()),
  };
  return tier_ref_script_fee(
    multiplier,
    sizeIncrement,
    refMultiplier,
    totalRefScriptsSize,
  );
}
