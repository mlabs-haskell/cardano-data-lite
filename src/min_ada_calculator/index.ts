/*
 * This module provides functionality to calculate the minimum amount of ADA (lovelace)
 * required for a transaction output.
 *
 * The primary export is the `minAdaForOutput` function, which computes the minimum ADA needed
 * for a given `TransactionOutput` and `DataCost`.
 *
 * Adapated from https://github.com/Emurgo/cardano-serialization-lib/blob/master/rust/src/utils.rs#L726
 */

import { BigNum, DataCost, TransactionOutput, TransactionOutputKind, Value } from "../generated";

class MinOutputAdaCalculator {
  output: TransactionOutput;
  data_cost: DataCost;

  constructor(output: TransactionOutput, data_cost: DataCost) {
    this.output = output.clone([]);
    this.data_cost = data_cost.clone([]);
  }

  static new(output: TransactionOutput, data_cost: DataCost): MinOutputAdaCalculator {
    return new MinOutputAdaCalculator(output, data_cost);
  }

  calculate_ada(): BigNum {
    let output = this.output.clone([]);

    const isPreBabbage = output.kind() === TransactionOutputKind.PreBabbageTransactionOutput;

    const processOutput = (output_s: any): BigNum => {

      for (let i = 0; i < 3; i++) {

        const required_coin = MinOutputAdaCalculator.calc_required_coin(output, this.data_cost);

        if (output_s.amount().coin().less_than(required_coin)) {
          let value = output_s.amount().clone([]);
          value.set_coin(required_coin);
          output_s.set_amount(value);
        } else {
          return required_coin;
        }

        output = isPreBabbage
          ? TransactionOutput.new_pre_babbage_transaction_output(output_s)
          : TransactionOutput.new_post_alonzo_transaction_output(output_s);
      }

      let value = output_s.amount().clone([]);
      value.set_coin(BigNum.new(BigNum._maxU64()));
      output_s.set_amount(value);

      return MinOutputAdaCalculator.calc_required_coin(
        isPreBabbage
          ? TransactionOutput.new_pre_babbage_transaction_output(output_s)
          : TransactionOutput.new_post_alonzo_transaction_output(output_s),
        this.data_cost
      );
    };

    if (isPreBabbage) {
      return processOutput(output.as_pre_babbage_transaction_output());
    } else {
      return processOutput(output.as_post_alonzo_transaction_output());
    }
  }

  static calc_size_cost(data_cost: DataCost, size: number): BigNum {
    return new BigNum(BigInt(size))
      .checked_add(new BigNum(BigInt(160)))
      .checked_mul(data_cost.coins_per_byte());
  }

  static calc_required_coin(output: TransactionOutput, data_cost: DataCost): BigNum {
    return MinOutputAdaCalculator.calc_size_cost(data_cost, output.to_bytes().length);
  }
}

/**
 * Calculates the minimal amount of ada for the output for case when the amount is included to the output
 *
 *
 * @param output - The transaction output for which to calculate the minimum ADA.
 * @param data_cost - The data cost parameters, including coins per byte.
 * @returns The minimum ADA required as a `BigNum`.
 */
export function min_ada_for_output(output: TransactionOutput, data_cost: DataCost): BigNum {
  return MinOutputAdaCalculator.new(output, data_cost).calculate_ada();
}
