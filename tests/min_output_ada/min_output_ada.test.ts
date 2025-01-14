import { jest } from '@jest/globals'

import { Address } from "../../src/address";
import {
  BigNum,
  DataCost,
  TransactionOutput,
  Value,
} from "../../src/generated";

import { min_ada_for_output } from '../../src/min_ada_calculator'

describe('min_ada_for_output', () => {
  test('min_ada_for_output calculates minimum ADA required for output', () => {

    const output_hex = "825839001fd57d18565e3a17cd194f190d349c2b7309eaf70f3f3bf884b0eadacc339a35f9e0fe039cf510c761d4dd29040c48e9657fdac7e9c01d948200a1581c73ea4ed5086293a03911c1db66cacc48acc965f4402e9df981961ae3a15820ebefb5788e8713c844dfd32b2e91de1e309fefffd555f827cc9ee16401020304187b";
    const output = TransactionOutput.from_hex(output_hex);
    expect(output.to_hex()).toBe(output_hex);

    const dataCost = DataCost.new(BigNum.from_str("4310"));

    const min_ada = min_ada_for_output(output, dataCost);

    expect(min_ada.to_str()).toBe("1267140");
  });

  test('min_ada_for_output calculates correct minimum ADA for output', () => {

    const output_hex = "82583900c05e80bdcf267e7fe7bf4a867afe54a65a3605b32aae830ed07f8e1ccc339a35f9e0fe039cf510c761d4dd29040c48e9657fdac7e9c01d9482190107a1581c00000000000000000000000000000000000000000000000000000000a1440001020318f0";
    const output = TransactionOutput.from_hex(output_hex);
    expect(output.to_hex()).toBe(output_hex);

    const dataCost = DataCost.new(BigNum.one());
    const min_coin_for_dirty_change = min_ada_for_output(output, dataCost);

    expect(min_coin_for_dirty_change.to_str()).toBe("263");
    expect(output.as_pre_babbage_transaction_output().amount().coin().to_str()).toBe(min_coin_for_dirty_change.to_str());
  });

})

