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

    /* tslint:disable-next-line */
    const address = new Address(undefined);
    const coin = BigNum.from_str('1000000'); // 1 ADA in lovelace
    const value = Value.new(coin);
    const output = TransactionOutput.new(address, value);

    jest.spyOn(output, 'clone').mockReturnValue(output);
    jest.spyOn(output, 'to_bytes').mockReturnValue(new Uint8Array(100));

    const dataCost = new DataCost(BigNum._from_number(34482));

    const minAda = min_ada_for_output(output, dataCost);

    const expectedMinAda = BigNum._from_number(100)
      .checked_add(BigNum._from_number(160))
      .checked_mul(dataCost.coins_per_byte());

    expect(minAda.to_str()).toBe(expectedMinAda.to_str());
  });
})
