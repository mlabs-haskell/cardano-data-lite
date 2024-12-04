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
  const runMinFeeTest = (tx_hex: string, expectedFee: string) => {
    const tx = Transaction.from_hex(tx_hex);

    expect(tx.to_hex()).toBe(tx_hex);

    const constant = BigNum._from_number(500);
    const coefficient = BigNum._from_number(2);
    const linearFee = LinearFee.new(constant, coefficient);

    const fee = min_fee(tx, linearFee);

    expect(fee.to_str()).toBe(expectedFee);
  };

  test('min_fee calculates correct minimum fee for a given transaction', () => {
    runMinFeeTest(
      "84a400d90102818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182581d611c616f1acb460668a9b2f123c80372c2adad3583b9c6cd2b1deeed1c01021a00016f32030aa100d9010281825820f9aa3fccb7fe539e471188ccc9ee65514c5961c070b06ca185962484a4813bee58406d68d8b7b2ee54f1f46b64e3f61a14f840be2ec125c858ec917f634a1eb898a51660654839226016a2588d39920e6dfe1b66d917027f198b5eb887d20f4ac805f5f6"
      , "97502"
    );
  });

  test('min_fee calculates correct minimum fee for a given transaction', () => {
    runMinFeeTest(
      "84a400d90102818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182581d611c616f1acb460668a9b2f123c80372c2adad3583b9c6cd2b1deeed1c01021a0001b582030aa102d9010281845820473811afd4d939b337c9be1a2ceeb2cb2c75108bddf224c5c21c51592a7b204a58408b4ca7a71340bc6441f0e390122d53aba154b7e2b432ec2927ed8db7395d3d9347989aa1fca4823c991c1ef309570a0bbdf62155e3dba376fae9827cb465f5055820c8b95d0d35fe75a70f9f5633a3e2439b2994b9e2bc851c49e9f91d1a5dcbb1a341a0f5f6"
      , "115502"
    );
  });

  test('min_fee calculates correct minimum fee for a given transaction with multiple utxos', () => {
    runMinFeeTest(
      "84a400d90102828258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7182a82582082839f8200d81858248258203b40265111d8bb3c3c608d95b3a0bf83461ace3207018282581d611c616f1acb460668a9b2f123c80372c2adad3583b9c6cd2b1deeed1c19012182581d61bcd18fcffa797c16c007014e2b8553b8b9b1e94c507688726243d6111a3420989c021a0002ccce031903e7a100d9010282825820f9aa3fccb7fe539e471188ccc9ee65514c5961c070b06ca185962484a4813bee584082eea9c7848c1136ebcb5fd5774d8dfc330c63b7f44b56a5cc5008887d3923df8785ebab92c230114099cf9b79a6c6c57ead026fa495d526731cc00caa3407088258206872b0a874acfe1cace12b20ea348559a7ecc912f2fc7f674f43481df973d92c5840f8861b68b3f966b6b63cbd3f7abf18efa18620aee9e730dea75d2d1cb0668988486f852f7743f6b5cc841c62d11440073706b52b408c0d776a411e2a0dd0da0af5f6"
      , "187002"
    );
  });

  test('min_fee calculates correct minimum fee for a given transaction with stake pool registration certificate', () => {
    runMinFeeTest(
      "84a500d90102818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182581d611c616f1acb460668a9b2f123c80372c2adad3583b9c6cd2b1deeed1c01021a00040f12030a04d90102818a03581c1c13374874c68016df54b1339b6cacdd801098431e7659b24928efc15820bd0000f498ccacdc917c28274cba51c415f3f21931ff41ca8dc1197499f8e1241a000f42401a000f4240d81e82031864581de151df9ba1b74a1c9608a487e114184556801e927d31d96425cb80af70d9010281581c51df9ba1b74a1c9608a487e114184556801e927d31d96425cb80af7080f6a100d9010283825820f9aa3fccb7fe539e471188ccc9ee65514c5961c070b06ca185962484a4813bee584081e223791960a07f401c378dce048ea658a155510ae6541c6cb692ed41ee45b40b913d1428a94af145885639f8acf99549f7b29af1e34997b9cb8ad05fe6e50a825820b24c040e65994bd5b0621a060166d32d356ef4be3cc1f848426a4cf38688708958401a246b6a4d63e83bd4904ac3b787797ba54238aab8e733b75b5ab2e465c46fce67e4403169a53239e7036f87f0518ec4414a10e45a1aa1788322d2777f59c30182582054d1a9c5ad69586ceeb839c438400c376c0bd34825fb4c17cc2f58c54e1437f35840ea9518346e8515aea6c16e7076a1d0a637582f736c0b65abd1f4adccd8920f2da699e8602029cc608da2ba46b6a6e61f41166b12ae17c922114c040facd90b07f5f6"
      , "275502"
    );
  });


  test('min_fee calculates correct minimum fee for a given transaction with withdraw reward', () => {
    runMinFeeTest(
      "84a500d90102818258203b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b700018182581d611c616f1acb460668a9b2f123c80372c2adad3583b9c6cd2b1deeed1c01021a00027ac6030a05a1581de151df9ba1b74a1c9608a487e114184556801e927d31d96425cb80af70190539a100d9010282825820f9aa3fccb7fe539e471188ccc9ee65514c5961c070b06ca185962484a4813bee58406dda4d88a17c7b888d15eb29f0871e85f3c50e1ea4efcc0d7781f4db0ae11dd418abae42f7f62637cc54d21887ccb60dc3ccae545e7a25c7c553b3a91e9e6d0082582054d1a9c5ad69586ceeb839c438400c376c0bd34825fb4c17cc2f58c54e1437f35840a24b4863189d5872fdb98529bbe6feae375031162786bda1244d73c54adafea0ace2f087f23a794af4f232651ba66071246ab5bc1e1b0b9a39044d0531eeac0ef5f6"
      , "166002"
    );
  });

});
