import {
  calculate_exunits_ceil_cost,
  LinearFee,
  min_fee,
  min_ref_script_fee,
} from "../../src/fee";
import {
  BigNum,
  ExUnits,
  ExUnitPrices,
  UnitInterval,
  Transaction,
} from "../../src/generated";

function new_unit_interval(num: number, den: number): UnitInterval {
  return UnitInterval.new(
    BigNum.from_str(num.toString()),
    BigNum.from_str(den.toString()),
  );
}

describe("min_ref_script_fee Tests", () => {
  test("min_ref_script_fee_test", () => {
    const cost = new_unit_interval(1, 2);
    const totalSize = 500;
    const minFee = min_ref_script_fee(totalSize, cost);
    expect(minFee.to_str()).toBe("250");
  });

  test("min_ref_script_fee_test_fail", () => {
    const cost = new_unit_interval(1, 0);
    const totalSize = 500;
    expect(() => {
      min_ref_script_fee(totalSize, cost);
    }).toThrow("Division by zero");
  });

  test("min_ref_script_fee_zero_size_test", () => {
    const result = min_ref_script_fee(0, new_unit_interval(1, 1000));
    expect(result.to_str()).toBe("0");
  });

  test("min_ref_script_fee_small_size_test", () => {
    const result = min_ref_script_fee(1000, new_unit_interval(1, 1000));
    expect(result.to_str()).toBe("1");
  });

  test("min_ref_script_fee_exactly_one_tier_test", () => {
    const result = min_ref_script_fee(25600, new_unit_interval(1, 1000));
    expect(result.to_str()).toBe("25");
  });

  test("min_ref_script_fee_multiple_full_tiers_test", () => {
    const result = min_ref_script_fee(25600 * 2, new_unit_interval(1, 1000));
    expect(result.to_str()).toBe("56");
  });

  test("min_ref_script_fee_partial_tier_test", () => {
    const result = min_ref_script_fee(30000, new_unit_interval(1, 1000));
    expect(result.to_str()).toBe("30");
  });

  test("min_ref_script_fee_large_size_test", () => {
    const result = min_ref_script_fee(1000000, new_unit_interval(1, 1000));
    expect(result.to_str()).toBe("158607");
  });

  test("min_ref_script_fee_different_cost_per_byte_test", () => {
    const result = min_ref_script_fee(50000, new_unit_interval(5, 1000));
    expect(result.to_str()).toBe("274");
  });

  test("min_ref_script_fee_one_cost_per_byte_test", () => {
    const result = min_ref_script_fee(10000, new_unit_interval(1, 1));
    expect(result.to_str()).toBe("10000");
  });

  test("min_ref_script_fee_zero_cost_per_byte_test", () => {
    const result = min_ref_script_fee(10000, new_unit_interval(0, 1));
    expect(result.to_str()).toBe("0");
  });

  test("test_multiple_tiers", () => {
    const testCases = [
      { size: 25600, expected: "25" }, // Exactly 1 tier
      { size: 25601, expected: "25" }, // 1 full tier + 1 byte (at 1.2x price)
      { size: 51200, expected: "56" }, // Exactly 2 tiers
      { size: 76800, expected: "93" }, // Exactly 3 tiers
      { size: 80000, expected: "98" }, // 3 full tiers + partial tier
      { size: 100000, expected: "133" }, // 3 full tiers + larger partial tier
      { size: 128000, expected: "190" }, // Exactly 5 tiers
      { size: 179200, expected: "330" }, // 7 full tiers
    ];

    testCases.forEach(({ size, expected }) => {
      const result = min_ref_script_fee(size, new_unit_interval(1, 1000));
      expect(result.to_str()).toBe(expected);
    });
  });
});

function _calculateExUnitsCeilCost(
  mem: number,
  step: number,
  memPrice: { fst: number; snd: number },
  stepPrice: { fst: number; snd: number },
): String {
  return calculate_exunits_ceil_cost(
    ExUnits.new(BigNum._from_number(mem), BigNum._from_number(step)),
    ExUnitPrices.new(
      UnitInterval.new(
        BigNum._from_number(memPrice.fst),
        BigNum._from_number(memPrice.snd),
      ),
      UnitInterval.new(
        BigNum._from_number(stepPrice.fst),
        BigNum._from_number(stepPrice.snd),
      ),
    ),
  ).to_str();
}

describe("calculate_ex_units_ceil_cost (min_script_fee)", () => {
  test("Test case 1", () => {
    // 10 * (2/1) + 20 * (3/1) = 10 * 2 + 20 * 3 = 20 + 60
    const result = _calculateExUnitsCeilCost(
      10,
      20,
      { fst: 2, snd: 1 },
      { fst: 3, snd: 1 },
    );
    expect(result).toBe("80");
  });

  test("Test case 2", () => {
    // 22 * (12/6) + 33 * (33/11) = 22 * 2 + 33 * 3 = 44 + 99 = 143
    const result = _calculateExUnitsCeilCost(
      22,
      33,
      { fst: 12, snd: 6 },
      { fst: 33, snd: 11 },
    );
    expect(result).toBe("143");
  });

  test("Test case 3", () => {
    // 10 * (5/7) + 20 * (9/13) = 50/7 + 180/13 = 650/91 + 1260/91 = 1910/91 = ceil(20.98) = 21
    const result = _calculateExUnitsCeilCost(
      10,
      20,
      { fst: 5, snd: 7 },
      { fst: 9, snd: 13 },
    );
    expect(result).toBe("21");
  });

  test("Test case 4", () => {
    // 22 * (7/5) + 33 * (13/9) = 154/5 + 429/9 = 1386/45 + 2145/45 = 3531/45 = ceil(78.46) = 79
    const result = _calculateExUnitsCeilCost(
      22,
      33,
      { fst: 7, snd: 5 },
      { fst: 13, snd: 9 },
    );
    expect(result).toBe("79");
  });
});


describe('min_fee', () => {
  test('min_fee calculates correct minimum fee for a given transaction', () => {
    const tx = Transaction.from_hex(
      "84a400d90102818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182581d611c616f1acb460668a9b2f123c80372c2adad3583b9c6cd2b1deeed1c01021a00016f32030aa100d9010281825820f9aa3fccb7fe539e471188ccc9ee65514c5961c070b06ca185962484a4813bee58406d68d8b7b2ee54f1f46b64e3f61a14f840be2ec125c858ec917f634a1eb898a51660654839226016a2588d39920e6dfe1b66d917027f198b5eb887d20f4ac805f5f6");

    const constant = BigNum._from_number(500);
    const coefficient = BigNum._from_number(2);
    const linearFee = LinearFee.new(constant, coefficient);

    const fee = min_fee(tx, linearFee);

    expect(fee.to_str()).toBe("97502");
  });
});
