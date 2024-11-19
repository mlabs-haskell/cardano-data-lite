// minRefScriptFee.test.ts

import { Address } from "../../src/address";
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
  TransactionHash,
  TransactionInput,
  TransactionOutput,
  Value,
  TransactionBody,
  TransactionInputs,
  TransactionOutputs,
  PrivateKey,
  Vkeywitness,
  TransactionWitnessSet,
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

// TODO: fix implementation
describe('min_fee', () => {
  test('Simple transaction', () => {
    // Create the transaction input
    const txHash = TransactionHash.from_hex('3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7');
    const txInput = TransactionInput.new(txHash, 0);

    // Create the transaction output
    const addressBytes = Buffer.from('611c616f1acb460668a9b2f123c80372c2adad3583b9c6cd2b1deeed1c', 'hex');
    const address = Address.from_bytes(addressBytes);
    const amount = new Value(BigNum.from_str('1'), undefined);
    const txOutput = TransactionOutput.new(address, amount);

    // Create transaction body
    let inputs = TransactionInputs.new();
    inputs.add(txInput);

    let outputs = TransactionOutputs.new();
    outputs.add(txOutput);

    const fee = BigNum.from_str('94002');
    const ttl = 10;
    let txBody = TransactionBody.new(inputs, outputs, fee, ttl);

    // Create witness set
    const txHashForWitness = txBody.hash();

    const privateKeyBytes = Buffer.from('c660e50315d76a53d80732efda7630cae8885dfb85c46378684b3c6103e1284a', 'hex');
    const privateKey = PrivateKey.from_normal_bytes(privateKeyBytes);

    const vkeyWitness = Vkeywitness.new(privateKey, txHashForWitness);

    const witnesses = TransactionWitnessSet.new();

    witnesses.set_vkeys([vkeyWitness]);

    // Create transaction
    const tx = new Transaction(txBody, witnesses, true, undefined);

    // Calculate minFee
    const linearFee = LinearFee.new(BigNum.from_str('500'), BigNum.from_str('2'));
    const calculatedFee = min_fee(tx, linearFee);

    // Assert that calculated fee matches expected value
    expect(calculatedFee.to_str()).toBe('97502');
  });
});
